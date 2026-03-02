import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getZodiacSign } from "@/lib/utils/zodiac";

// POST /api/customers - Create or update customer profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, dob } = body as { name?: string; dob?: string };

    const dobDate = dob ? new Date(dob) : undefined;
    const zodiacSign = dobDate ? getZodiacSign(dobDate) : undefined;

    const customer = await prisma.customer.create({
      data: {
        name: name || null,
        dob: dobDate || null,
        zodiacSign: zodiacSign || null,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Customer API error:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}

// GET /api/customers - List customers
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: { _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Customers GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
