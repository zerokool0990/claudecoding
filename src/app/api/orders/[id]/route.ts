import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { deductInventory } from "@/lib/inventory/deduction";
import type { DrinkCombo, ModuleData } from "@/types";

// PATCH /api/orders/:id - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body as { status: string };

    const validStatuses = ["PENDING", "PREPARING", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
      include: {
        items: {
          include: {
            baseModule: true,
            flavorModule: true,
            functionModule: true,
            textureModule: true,
          },
        },
      },
    });

    let inventoryAlerts: string[] = [];

    // Trigger inventory deduction only on COMPLETED to handle cancellations cleanly
    if (status === "COMPLETED" && order.items.length > 0) {
      const item = order.items[0];

      const toModuleData = (m: {
        id: string;
        category: string;
        name: string;
        nameVi: string;
        stockQuantity: number;
        unit: string;
        deductionRate: number;
        alertThreshold: number;
        isActive: boolean;
      }): ModuleData => ({
        id: m.id,
        category: m.category as ModuleData["category"],
        name: m.name,
        nameVi: m.nameVi,
        stockQuantity: m.stockQuantity,
        unit: m.unit,
        deductionRate: m.deductionRate,
        alertThreshold: m.alertThreshold,
        isActive: m.isActive,
      });

      const drinkCombo: DrinkCombo = {
        base: toModuleData(item.baseModule),
        flavor: toModuleData(item.flavorModule),
        function: toModuleData(item.functionModule),
        texture: toModuleData(item.textureModule),
        generatedName: item.generatedName,
        generatedNameVi: item.generatedNameVi,
        recipe: JSON.parse(item.recipe || "[]"),
      };

      const result = await deductInventory(drinkCombo);
      inventoryAlerts = result.alerts;
    }

    return NextResponse.json({
      id: order.id,
      status: order.status,
      updatedAt: order.updatedAt.toISOString(),
      inventoryAlerts,
    });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
