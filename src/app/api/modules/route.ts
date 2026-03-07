import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { importInventory } from "@/lib/inventory/deduction";

// GET /api/modules - Get all modules with live stock info from DB
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

// PATCH /api/modules - Import stock for a module
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { moduleId, quantity, note } = body as {
      moduleId: string;
      quantity: number;
      note?: string;
    };

    if (!moduleId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "moduleId and positive quantity are required" },
        { status: 400 }
      );
    }

    const mod = await prisma.module.findUnique({ where: { id: moduleId } });
    if (!mod) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    const success = await importInventory(moduleId, quantity, note);
    if (!success) {
      return NextResponse.json(
        { error: "Import failed" },
        { status: 500 }
      );
    }

    const updated = await prisma.module.findUnique({ where: { id: moduleId } });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Module update error:", error);
    return NextResponse.json(
      { error: "Failed to update module" },
      { status: 500 }
    );
  }
}
