import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

// GET /api/analytics - Real dashboard analytics from DB
export async function GET() {
  try {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const [
      totalOrders,
      todayOrders,
      revenueResult,
      cardCounts,
      orderItemsWithModules,
      inventoryModules,
      totalCustomers,
      customersWithDob,
    ] = await Promise.all([
      prisma.order.count({ where: { status: "COMPLETED" } }),
      prisma.order.count({
        where: { status: "COMPLETED", createdAt: { gte: startOfToday } },
      }),
      prisma.order.aggregate({
        where: { status: "COMPLETED" },
        _sum: { totalPrice: true },
      }),
      prisma.order.groupBy({
        by: ["cardChosen"],
        where: { status: "COMPLETED", cardChosen: { not: null } },
        _count: { cardChosen: true },
      }),
      prisma.orderItem.findMany({
        include: {
          baseModule: { select: { nameVi: true, category: true } },
          flavorModule: { select: { nameVi: true, category: true } },
          functionModule: { select: { nameVi: true, category: true } },
          textureModule: { select: { nameVi: true, category: true } },
        },
        take: 500,
      }),
      prisma.module.findMany({ orderBy: { category: "asc" } }),
      prisma.customer.count(),
      prisma.customer.count({ where: { dob: { not: null } } }),
    ]);

    // Card preference breakdown
    const cardPreference = cardCounts.map((c) => ({
      card:
        c.cardChosen === "PERFECT_MATCH"
          ? "Perfect Match"
          : c.cardChosen === "PLOT_TWIST"
          ? "Plot Twist"
          : "Safe Trend",
      count: c._count.cardChosen,
    }));

    // Module usage from order items
    const moduleUsageMap = new Map<
      string,
      { name: string; category: string; count: number }
    >();
    for (const item of orderItemsWithModules) {
      for (const mod of [
        item.baseModule,
        item.flavorModule,
        item.functionModule,
        item.textureModule,
      ]) {
        const key = mod.nameVi;
        const existing = moduleUsageMap.get(key);
        if (existing) {
          existing.count++;
        } else {
          moduleUsageMap.set(key, {
            name: mod.nameVi,
            category: mod.category,
            count: 1,
          });
        }
      }
    }
    const moduleUsage = Array.from(moduleUsageMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);

    // Inventory status with percent remaining
    const inventoryStatus = inventoryModules.map((m) => ({
      id: m.id,
      name: m.nameVi,
      category: m.category,
      stock: m.stockQuantity,
      unit: m.unit,
      alertThreshold: m.alertThreshold,
      isActive: m.isActive,
      percentRemaining: Math.min(
        100,
        Math.round((m.stockQuantity / (m.alertThreshold * 10)) * 100)
      ),
    }));

    return NextResponse.json({
      totalOrders,
      todayOrders,
      totalRevenue: revenueResult._sum.totalPrice ?? 0,
      cardPreference,
      moduleUsage,
      inventoryStatus,
      moodDistribution: [],
      totalCustomers,
      customersWithDob,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
