import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { deductInventory } from "@/lib/inventory/deduction";
import type { OrderCreatePayload } from "@/types";

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OrderCreatePayload;
    const { customerId, cardChosen, drink, moodTags } = body;

    // Calculate price (base price + modifiers)
    const basePrice = 39000;
    const funcSurcharge = 6000;
    const totalPrice = basePrice + funcSurcharge;

    // Create order with transaction
    const order = await prisma.order.create({
      data: {
        customerId: customerId || null,
        totalPrice,
        status: "PENDING",
        cardChosen,
        moodTags: JSON.stringify(moodTags),
        items: {
          create: {
            generatedName: drink.generatedName,
            generatedNameVi: drink.generatedNameVi,
            baseModuleId: drink.base.id,
            flavorModuleId: drink.flavor.id,
            functionModuleId: drink.function.id,
            textureModuleId: drink.texture.id,
            recipe: JSON.stringify(drink.recipe),
          },
        },
      },
      include: { items: true },
    });

    // Deduct inventory
    const { success, alerts } = await deductInventory(drink);

    return NextResponse.json({
      order,
      inventoryAlerts: alerts,
      deductionSuccess: success,
    });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// GET /api/orders - Get orders (for POS / Admin)
export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get("status");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "50");

    const where = status ? { status } : {};

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            baseModule: true,
            flavorModule: true,
            functionModule: true,
            textureModule: true,
          },
        },
        customer: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
