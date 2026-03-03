import { NextRequest, NextResponse } from "next/server";
import { MODULES } from "@/lib/data/static-data";

// GET /api/modules - Get all modules with stock info
export async function GET() {
  try {
    const modules = [...MODULES].sort((a, b) => {
      const catCmp = a.category.localeCompare(b.category);
      return catCmp !== 0 ? catCmp : a.name.localeCompare(b.name);
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
// Note: Write operations are not supported on serverless (read-only demo)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { moduleId } = body as { moduleId: string };

    const mod = MODULES.find((m) => m.id === moduleId);
    if (!mod) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    return NextResponse.json(mod);
  } catch (error) {
    console.error("Module update error:", error);
    return NextResponse.json(
      { error: "Failed to update module" },
      { status: 500 }
    );
  }
}
