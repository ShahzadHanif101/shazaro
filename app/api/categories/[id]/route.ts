import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";
import type { Category } from "@/lib/types";

const FILE_NAME = "categories.json";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const categoryId = Number(id);

    const body = await request.json();

    const categories = await readData<Category[]>(FILE_NAME);

    const index = categories.findIndex(
      (category) => category.id === categoryId
    );

    if (index === -1) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const updatedCategory: Category = {
      ...categories[index],
      name: body.name ?? categories[index].name,
      enabled:
        body.enabled ?? categories[index].enabled,
    };

    categories[index] = updatedCategory;

    await writeData(FILE_NAME, categories);

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Failed to update category:", error);

    return NextResponse.json(
      { error: "Failed to update category" },
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
    const categoryId = Number(id);

    const categories = await readData<Category[]>(FILE_NAME);

    const index = categories.findIndex(
      (category) => category.id === categoryId
    );

    if (index === -1) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const deletedCategory = categories[index];

    categories.splice(index, 1);

    await writeData(FILE_NAME, categories);

    return NextResponse.json({
      success: true,
      category: deletedCategory,
    });
  } catch (error) {
    console.error("Failed to delete category:", error);

    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}