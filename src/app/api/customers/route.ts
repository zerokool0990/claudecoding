import { NextRequest, NextResponse } from "next/server";
import { getZodiacSign } from "@/lib/utils/zodiac";
import { v4 as uuidv4 } from "uuid";

// POST /api/customers - Create customer profile (demo mode on serverless)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, dob } = body as { name?: string; dob?: string };

    const dobDate = dob ? new Date(dob) : undefined;
    const zodiacSign = dobDate ? getZodiacSign(dobDate) : undefined;

    // Return simulated customer (no persistent storage on serverless)
    const customer = {
      id: uuidv4(),
      name: name || null,
      dob: dobDate?.toISOString() || null,
      zodiacSign: zodiacSign || null,
      savedPreferences: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

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
    return NextResponse.json([]);
  } catch (error) {
    console.error("Customers GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
