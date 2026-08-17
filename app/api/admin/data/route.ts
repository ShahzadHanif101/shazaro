import { NextResponse } from "next/server";
import { readData } from "@/lib/data";

const ALLOWED_FILES = [
  "channels.json",
  "categories.json",
  "banquet.json",
  "iptv-users.json",
] as const;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("file");

    if (
      !filename ||
      !ALLOWED_FILES.includes(
        filename as (typeof ALLOWED_FILES)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Invalid data file" },
        { status: 400 }
      );
    }

    const data = await readData<unknown>(filename);

    return NextResponse.json({
      filename,
      data,
    });
  } catch (error) {
    console.error("Failed to read data file:", error);

    return NextResponse.json(
      { error: "Failed to read data file" },
      { status: 500 }
    );
  }
}