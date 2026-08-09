import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";
import type { Category } from "@/lib/types";

const FILE_NAME = "categories.json";

export async function GET() {
  try {
    const categories = await readData<Category[]>(FILE_NAME);

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to read categories:", error);

    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const categories = await readData<Category[]>(FILE_NAME);

    const newCategory: Category = {
      id:
        categories.length > 0
          ? Math.max(...categories.map((category) => category.id)) + 1
          : 1,

      name: body.name,
      enabled: body.enabled ?? true,
      createdAt: new Date().toISOString(),
    };

    categories.push(newCategory);

    await writeData(FILE_NAME, categories);

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Failed to create category:", error);

    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}