import { NextRequest, NextResponse } from "next/server";
import type { OrderCreatePayload } from "@/types";
import { v4 as uuidv4 } from "uuid";

// POST /api/orders - Create a new order (demo mode on serverless)
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OrderCreatePayload;
    const { customerId, cardChosen, drink, moodTags } = body;

    const basePrice = 39000;
    const funcSurcharge = 6000;
    const totalPrice = basePrice + funcSurcharge;

    // Return a simulated order response (no persistent storage on serverless)
    const order = {
      id: uuidv4(),
      customerId: customerId || null,
      totalPrice,
      status: "PENDING",
      cardChosen,
      moodTags: JSON.stringify(moodTags),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [
        {
          id: uuidv4(),
          generatedName: drink.generatedName,
          generatedNameVi: drink.generatedNameVi,
          baseModuleId: drink.base.id,
          flavorModuleId: drink.flavor.id,
          functionModuleId: drink.function.id,
          textureModuleId: drink.texture.id,
          recipe: JSON.stringify(drink.recipe),
        },
      ],
    };

    return NextResponse.json({
      order,
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
    return NextResponse.json([]);
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
