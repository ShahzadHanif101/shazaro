import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";
import type { Banquet } from "@/lib/types";

const FILE_NAME = "banquet.json";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const banquetId = Number(id);

    const body = await request.json();

    const banquets = await readData<Banquet[]>(FILE_NAME);

    const index = banquets.findIndex(
      (banquet) => banquet.id === banquetId
    );

    if (index === -1) {
      return NextResponse.json(
        { error: "Banquet not found" },
        { status: 404 }
      );
    }

    const existing = banquets[index];

    const updatedBanquet: Banquet = {
      ...existing,
      name: body.name ?? existing.name,
      description:
        body.description ?? existing.description,
      access: body.access ?? existing.access,
      enabled:
        body.enabled ?? existing.enabled,

      ...(body.access === "selected"
        ? {
            allowedCategories: Array.isArray(
              body.allowedCategories
            )
              ? body.allowedCategories.map(Number)
              : [],
          }
        : {
            allowedCategories: undefined,
          }),
    };

    banquets[index] = updatedBanquet;

    await writeData(FILE_NAME, banquets);

    return NextResponse.json(updatedBanquet);
  } catch (error) {
    console.error("Failed to update banquet:", error);

    return NextResponse.json(
      { error: "Failed to update banquet" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const banquetId = Number(id);

    const banquets = await readData<Banquet[]>(FILE_NAME);

    const index = banquets.findIndex(
      (banquet) => banquet.id === banquetId
    );

    if (index === -1) {
      return NextResponse.json(
        { error: "Banquet not found" },
        { status: 404 }
      );
    }

    const deletedBanquet = banquets[index];

    banquets.splice(index, 1);

    await writeData(FILE_NAME, banquets);

    return NextResponse.json({
      success: true,
      banquet: deletedBanquet,
    });
  } catch (error) {
    console.error("Failed to delete banquet:", error);

    return NextResponse.json(
      { error: "Failed to delete banquet" },
      { status: 500 }
    );
  }
}