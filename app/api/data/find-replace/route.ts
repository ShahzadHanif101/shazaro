import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type ReplaceRequest = {
  filename: string;
  find: string;
  replace: string;
  field?: string;
  mode?: "preview" | "apply";
};

type MatchPreview = {
  index: number;
  field: string;
  before: string;
  after: string;
};

const ALLOWED_FILES = [
  "channels.json",
  "categories.json",
  "banquet.json",
  "iptv-users.json",
];

const ALLOWED_FIELDS = [
  "streamUrl",
  "name",
  "logoUrl",
  "categoryId",
];

function replaceInValue(
  value: JsonValue,
  find: string,
  replace: string
): { value: JsonValue; changed: boolean } {
  if (typeof value === "string") {
    if (!value.includes(find)) {
      return {
        value,
        changed: false,
      };
    }

    return {
      value: value.split(find).join(replace),
      changed: true,
    };
  }

  if (Array.isArray(value)) {
    let changed = false;

    const result = value.map((item) => {
      const replaced = replaceInValue(
        item,
        find,
        replace
      );

      if (replaced.changed) {
        changed = true;
      }

      return replaced.value;
    });

    return {
      value: result,
      changed,
    };
  }

  if (value !== null && typeof value === "object") {
    let changed = false;

    const result: {
      [key: string]: JsonValue;
    } = {};

    for (const [key, item] of Object.entries(value)) {
      const replaced = replaceInValue(
        item,
        find,
        replace
      );

      if (replaced.changed) {
        changed = true;
      }

      result[key] = replaced.value;
    }

    return {
      value: result,
      changed,
    };
  }

  return {
    value,
    changed: false,
  };
}

function replaceInField(
  data: JsonValue,
  field: string,
  find: string,
  replace: string
): {
  data: JsonValue;
  matches: MatchPreview[];
} {
  const matches: MatchPreview[] = [];

  if (!Array.isArray(data)) {
    return {
      data,
      matches,
    };
  }

  const result = data.map((item, index) => {
    if (
      item === null ||
      typeof item !== "object" ||
      Array.isArray(item)
    ) {
      return item;
    }

    const record = item as {
      [key: string]: JsonValue;
    };

    const currentValue = record[field];

    if (typeof currentValue !== "string") {
      return item;
    }

    if (!currentValue.includes(find)) {
      return item;
    }

    const newValue = currentValue
      .split(find)
      .join(replace);

    matches.push({
      index,
      field,
      before: currentValue,
      after: newValue,
    });

    return {
      ...record,
      [field]: newValue,
    };
  });

  return {
    data: result,
    matches,
  };
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as ReplaceRequest;

    const {
      filename,
      find,
      replace,
      field,
      mode = "preview",
    } = body;

    // =====================================================
    // VALIDATE FILE
    // =====================================================

    if (!filename || !ALLOWED_FILES.includes(filename)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or unsupported JSON file.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // VALIDATE FIND VALUE
    // =====================================================

    if (!find) {
      return NextResponse.json(
        {
          success: false,
          error: "Find value cannot be empty.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // VALIDATE MODE
    // =====================================================

    if (
      mode !== "preview" &&
      mode !== "apply"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid operation mode.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // READ DATA
    // =====================================================

    const data =
      await readData<JsonValue>(filename);

    // =====================================================
    // FIELD-SPECIFIC REPLACEMENT
    // =====================================================

    if (field && field !== "all") {
      if (!ALLOWED_FIELDS.includes(field)) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid search field.",
          },
          { status: 400 }
        );
      }

      const result =
        replaceInField(
          data,
          field,
          find,
          replace
        );

      // ===================================================
      // PREVIEW
      // ===================================================

      if (mode === "preview") {
        return NextResponse.json({
          success: true,
          mode: "preview",
          filename,
          field,
          matchCount: result.matches.length,
          matches: result.matches,
        });
      }

      // ===================================================
      // APPLY
      // ===================================================

      if (result.matches.length === 0) {
        return NextResponse.json({
          success: true,
          mode: "apply",
          filename,
          field,
          matchCount: 0,
          message: "No matching values found.",
        });
      }

      await writeData(
        filename,
        result.data
      );

      return NextResponse.json({
        success: true,
        mode: "apply",
        filename,
        field,
        matchCount: result.matches.length,
        message:
          "Changes applied successfully.",
        matches: result.matches,
      });
    }

    // =====================================================
    // ALL STRING VALUES
    // =====================================================

    const result =
      replaceInValue(
        data,
        find,
        replace
      );

    // =====================================================
    // PREVIEW
    // =====================================================

    if (mode === "preview") {
      return NextResponse.json({
        success: true,
        mode: "preview",
        filename,
        field: "all",
        changed: result.changed,
        message:
          result.changed
            ? "Matching values were found."
            : "No matching values found.",
      });
    }

    // =====================================================
    // APPLY
    // =====================================================

    if (!result.changed) {
      return NextResponse.json({
        success: true,
        mode: "apply",
        filename,
        field: "all",
        matchCount: 0,
        message: "No matching values found.",
      });
    }

    await writeData(
      filename,
      result.value
    );

    return NextResponse.json({
      success: true,
      mode: "apply",
      filename,
      field: "all",
      message:
        "Changes applied successfully.",
    });
  } catch (error) {
    console.error(
      "[Find & Replace API]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}