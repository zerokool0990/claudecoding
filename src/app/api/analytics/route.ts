import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

// GET /api/analytics - Dashboard analytics data
export async function GET() {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Total orders
    const totalOrders = await prisma.order.count({
      where: { status: "COMPLETED" },
    });

    // Today's orders
    const todayOrders = await prisma.order.count({
      where: {
        status: "COMPLETED",
        createdAt: { gte: todayStart },
      },
    });

    // Total revenue
    const revenueResult = await prisma.order.aggregate({
      where: { status: "COMPLETED" },
      _sum: { totalPrice: true },
    });

    // Card preference distribution
    const allOrders = await prisma.order.findMany({
      where: { status: "COMPLETED", cardChosen: { not: null } },
      select: { cardChosen: true },
    });

    const cardCounts: Record<string, number> = {};
    for (const o of allOrders) {
      if (o.cardChosen) {
        cardCounts[o.cardChosen] = (cardCounts[o.cardChosen] || 0) + 1;
      }
    }

    const cardPreference = Object.entries(cardCounts).map(([card, count]) => ({
      card:
        card === "PERFECT_MATCH"
          ? "Perfect Match"
          : card === "PLOT_TWIST"
          ? "Plot Twist"
          : "Safe Trend",
      count,
    }));

    // Module usage from order items
    const orderItems = await prisma.orderItem.findMany({
      include: {
        baseModule: true,
        flavorModule: true,
        functionModule: true,
        textureModule: true,
      },
    });

    const moduleUsage: Record<string, { name: string; category: string; count: number }> = {};
    for (const item of orderItems) {
      for (const mod of [item.baseModule, item.flavorModule, item.functionModule, item.textureModule]) {
        if (!moduleUsage[mod.id]) {
          moduleUsage[mod.id] = { name: mod.nameVi, category: mod.category, count: 0 };
        }
        moduleUsage[mod.id].count++;
      }
    }

    // Inventory status
    const modules = await prisma.module.findMany({
      orderBy: { category: "asc" },
    });

    const inventoryStatus = modules.map((m) => ({
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

    // Mood distribution from moodTags
    const moodOrders = await prisma.order.findMany({
      where: { moodTags: { not: null } },
      select: { moodTags: true },
    });

    const moodCounts: Record<string, number> = {
      "Cần năng lượng (A1)": 0,
      "Cân bằng (B1)": 0,
      "Tràn đầy (C1)": 0,
    };
    for (const o of moodOrders) {
      if (o.moodTags) {
        try {
          const tags = JSON.parse(o.moodTags);
          const step1 = tags.find((t: { step: number }) => t.step === 1);
          if (step1) {
            if (step1.answer === "A") moodCounts["Cần năng lượng (A1)"]++;
            else if (step1.answer === "B") moodCounts["Cân bằng (B1)"]++;
            else moodCounts["Tràn đầy (C1)"]++;
          }
        } catch {
          // skip malformed tags
        }
      }
    }

    const moodDistribution = Object.entries(moodCounts).map(([mood, count]) => ({
      mood,
      count,
    }));

    // Customer stats
    const totalCustomers = await prisma.customer.count();
    const customersWithDob = await prisma.customer.count({
      where: { dob: { not: null } },
    });

    return NextResponse.json({
      totalOrders,
      todayOrders,
      totalRevenue: revenueResult._sum.totalPrice || 0,
      cardPreference,
      moduleUsage: Object.values(moduleUsage).sort((a, b) => b.count - a.count),
      inventoryStatus,
      moodDistribution,
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
