import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getZodiacSign } from "@/lib/utils/zodiac";

// POST /api/customers - Create customer profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, dob } = body as { name?: string; dob?: string };

    const dobDate = dob ? new Date(dob) : null;
    const zodiacSign = dobDate ? getZodiacSign(dobDate) : null;

    const customer = await prisma.customer.create({
      data: {
        name: name || null,
        dob: dobDate,
        zodiacSign,
      },
    });

    return NextResponse.json({
      ...customer,
      dob: customer.dob?.toISOString() || null,
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Customer API error:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}

// GET /api/customers - List customers with order counts
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { orders: true } },
      },
    });

    return NextResponse.json(
      customers.map((c) => ({
        ...c,
        dob: c.dob?.toISOString() || null,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      }))
    );
  } catch (error) {
    console.error("Customers GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
