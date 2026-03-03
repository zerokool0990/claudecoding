import { NextRequest, NextResponse } from "next/server";

// PATCH /api/orders/:id - Update order status (demo mode on serverless)
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

    return NextResponse.json({ id: params.id, status, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
