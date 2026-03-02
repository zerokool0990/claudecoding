import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { importInventory } from "@/lib/inventory/deduction";

// GET /api/modules - Get all modules with stock info
export async function GET() {
  try {
    const modules = await prisma.module.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(modules);
  } catch (error) {
    console.error("Modules GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch modules" },
      { status: 500 }
    );
  }
}

// PATCH /api/modules - Update module stock (import)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { moduleId, quantity, note } = body as {
      moduleId: string;
      quantity: number;
      note?: string;
    };

    const success = await importInventory(moduleId, quantity, note);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to import inventory" },
        { status: 500 }
      );
    }

    const updated = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Module update error:", error);
    return NextResponse.json(
      { error: "Failed to update module" },
      { status: 500 }
    );
  }
}
