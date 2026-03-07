import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import type { OrderCreatePayload } from "@/types";

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OrderCreatePayload;
    const { customerId, cardChosen, drink, moodTags } = body;

    const basePrice = 39000;
    const funcSurcharge = 6000;
    const totalPrice = basePrice + funcSurcharge;

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          customerId: customerId || null,
          totalPrice,
          status: "PENDING",
          cardChosen,
          moodTags: JSON.stringify(moodTags),
        },
      });

      await tx.orderItem.create({
        data: {
          orderId: newOrder.id,
          generatedName: drink.generatedName,
          generatedNameVi: drink.generatedNameVi,
          baseModuleId: drink.base.id,
          flavorModuleId: drink.flavor.id,
          functionModuleId: drink.function.id,
          textureModuleId: drink.texture.id,
          recipe: JSON.stringify(drink.recipe),
        },
      });

      return newOrder;
    });

    return NextResponse.json({
      order: {
        ...order,
        moodTags: order.moodTags,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        items: [
          {
            generatedName: drink.generatedName,
            generatedNameVi: drink.generatedNameVi,
            baseModuleId: drink.base.id,
            flavorModuleId: drink.flavor.id,
            functionModuleId: drink.function.id,
            textureModuleId: drink.texture.id,
            recipe: JSON.stringify(drink.recipe),
          },
        ],
      },
      inventoryAlerts: [],
      deductionSuccess: true,
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
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            baseModule: true,
            flavorModule: true,
            functionModule: true,
            textureModule: true,
          },
        },
        customer: {
          select: { id: true, name: true },
        },
      },
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
