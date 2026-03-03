import { NextResponse } from "next/server";
import { MODULES } from "@/lib/data/static-data";

// GET /api/analytics - Dashboard analytics data (demo data for serverless)
export async function GET() {
  try {
    const inventoryStatus = [...MODULES]
      .sort((a, b) => a.category.localeCompare(b.category))
      .map((m) => ({
        id: m.id,
        name: m.nameVi,
        category: m.category,
        stock: m.stockQuantity,
        unit: m.unit,
        alertThreshold: m.alertThreshold,
        isActive: m.isActive,
        percentRemaining: Math.round(
          (m.stockQuantity / (m.stockQuantity + m.alertThreshold * 2)) * 100
        ),
      }));

    // Sample analytics data for demo
    return NextResponse.json({
      totalOrders: 5,
      todayOrders: 0,
      totalRevenue: 245000,
      cardPreference: [
        { card: "Perfect Match", count: 3 },
        { card: "Plot Twist", count: 1 },
        { card: "Safe Trend", count: 1 },
      ],
      moduleUsage: [
        { name: "Trà Đen", category: "BASE", count: 3 },
        { name: "Syrup Vanilla Tự Nhiên", category: "FLAVOR", count: 2 },
        { name: "Chiết Xuất L-Theanine", category: "FUNCTION", count: 2 },
        { name: "Milk Foam Muối Biển", category: "TEXTURE", count: 2 },
      ],
      inventoryStatus,
      moodDistribution: [
        { mood: "Cần năng lượng (A1)", count: 2 },
        { mood: "Cân bằng (B1)", count: 2 },
        { mood: "Tràn đầy (C1)", count: 1 },
      ],
      totalCustomers: 0,
      customersWithDob: 0,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
