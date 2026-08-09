import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";
import type { Banquet } from "@/lib/types";

const FILE_NAME = "banquet.json";

export async function GET() {
  try {
    const banquets = await readData<Banquet[]>(FILE_NAME);

    return NextResponse.json(banquets);
  } catch (error) {
    console.error("Failed to read banquets:", error);

    return NextResponse.json(
      { error: "Failed to load banquets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const banquets = await readData<Banquet[]>(FILE_NAME);

    const newBanquet: Banquet = {
      id:
        banquets.length > 0
          ? Math.max(...banquets.map((banquet) => banquet.id)) + 1
          : 1,

      name: body.name,
      description: body.description ?? "",
      access: body.access,

      ...(body.access === "selected"
        ? {
            allowedCategories: Array.isArray(body.allowedCategories)
              ? body.allowedCategories.map(Number)
              : [],
          }
        : {}),

      enabled: body.enabled ?? true,
      createdAt: new Date().toISOString(),
    };

    banquets.push(newBanquet);

    await writeData(FILE_NAME, banquets);

    return NextResponse.json(newBanquet, { status: 201 });
  } catch (error) {
    console.error("Failed to create banquet:", error);

    return NextResponse.json(
      { error: "Failed to create banquet" },
      { status: 500 }
    );
  }
}