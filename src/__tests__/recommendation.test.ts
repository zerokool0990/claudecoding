import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Prisma before importing the engine
vi.mock("@/lib/db/prisma", () => ({
  default: {
    module: { findMany: vi.fn() },
    exclusionRule: { findMany: vi.fn() },
    orderItem: { findFirst: vi.fn() },
  },
}));

import prisma from "@/lib/db/prisma";
import { getRecommendations } from "@/lib/recommendation/engine";
import type { QuizAnswers } from "@/types";

// Helper to create mock modules
function createModule(
  id: string,
  category: string,
  name: string,
  nameVi: string,
  stock = 5000
) {
  return {
    id,
    category,
    name,
    nameVi,
    stockQuantity: stock,
    unit: category === "BASE" ? "ml" : "g",
    deductionRate: category === "BASE" ? 200 : 30,
    alertThreshold: 500,
    costPerUnit: 10,
    isActive: true,
  };
}

const ALL_MODULES = [
  createModule("base-tra-den", "BASE", "Premium Black Tea", "Trà Đen"),
  createModule("base-oolong", "BASE", "Taiwan Oolong", "Oolong"),
  createModule("base-nuoc-dua", "BASE", "Fresh Coconut Water", "Nước Dừa"),
  createModule("flavor-vanilla", "FLAVOR", "Natural Vanilla Syrup", "Vanilla"),
  createModule("flavor-yuzu", "FLAVOR", "Yuzu Juice", "Yuzu"),
  createModule("flavor-vai", "FLAVOR", "Lychee Puree", "Vải"),
  createModule("func-collagen", "FUNCTION", "Collagen Peptides", "Collagen"),
  createModule("func-theanine", "FUNCTION", "L-Theanine Extract", "L-Theanine"),
  createModule("func-electrolyte", "FUNCTION", "Electrolyte Mix", "Electrolyte"),
  createModule("texture-mochi", "TEXTURE", "Mini Mochi Balls", "Mochi"),
  createModule("texture-milk-foam", "TEXTURE", "Sea Salt Milk Foam", "Milk Foam"),
  createModule("texture-sparkling", "TEXTURE", "Sparkling Water", "Sparkling"),
];

const EXCLUSION_RULES = [
  { module1Id: "base-nuoc-dua", module2Id: "texture-milk-foam" },
  { module1Id: "base-nuoc-dua", module2Id: "flavor-vanilla" },
  { module1Id: "texture-sparkling", module2Id: "texture-milk-foam" },
];

describe("Recommendation Engine", () => {
  beforeEach(() => {
    vi.mocked(prisma.module.findMany).mockResolvedValue(ALL_MODULES as never);
    vi.mocked(prisma.exclusionRule.findMany).mockResolvedValue(EXCLUSION_RULES as never);
    vi.mocked(prisma.orderItem.findFirst).mockResolvedValue(null as never);
  });

  it("returns 3 cards: perfectMatch, plotTwist, safeTrend", async () => {
    const answers: QuizAnswers = {
      step1: "A", // Black Tea
      step2: "B", // Yuzu
      step3: "A", // Collagen
      step4: "A", // Mochi
      step5: "A",
    };

    const result = await getRecommendations(answers);

    expect(result).toHaveProperty("perfectMatch");
    expect(result).toHaveProperty("plotTwist");
    expect(result).toHaveProperty("safeTrend");
  });

  it("perfectMatch maps answers correctly to modules", async () => {
    const answers: QuizAnswers = {
      step1: "A", // Black Tea
      step2: "B", // Yuzu
      step3: "A", // Collagen
      step4: "A", // Mochi
      step5: "A",
    };

    const result = await getRecommendations(answers);

    expect(result.perfectMatch.base.id).toBe("base-tra-den");
    expect(result.perfectMatch.flavor.id).toBe("flavor-yuzu");
    expect(result.perfectMatch.function.id).toBe("func-collagen");
    expect(result.perfectMatch.texture.id).toBe("texture-mochi");
  });

  it("plotTwist uses a different flavor than perfectMatch", async () => {
    const answers: QuizAnswers = {
      step1: "A",
      step2: "B", // Yuzu
      step3: "A",
      step4: "A",
      step5: "A",
    };

    const result = await getRecommendations(answers);

    expect(result.plotTwist.flavor.id).not.toBe(result.perfectMatch.flavor.id);
    // Same base
    expect(result.plotTwist.base.id).toBe(result.perfectMatch.base.id);
  });

  it("safeTrend defaults to Vanilla + Milk Foam + L-Theanine bestseller", async () => {
    const answers: QuizAnswers = {
      step1: "A", // Black Tea
      step2: "B", // Yuzu
      step3: "A", // Collagen
      step4: "A", // Mochi
      step5: "A",
    };

    const result = await getRecommendations(answers);

    // Safe trend should use Vanilla, L-Theanine, Milk Foam as bestseller
    expect(result.safeTrend.flavor.id).toBe("flavor-vanilla");
    expect(result.safeTrend.function.id).toBe("func-theanine");
    expect(result.safeTrend.texture.id).toBe("texture-milk-foam");
  });

  it("handles exclusion rules - Coconut + Milk Foam is excluded", async () => {
    const answers: QuizAnswers = {
      step1: "C", // Coconut Water
      step2: "B", // Yuzu
      step3: "A", // Collagen
      step4: "B", // Milk Foam - should be excluded with Coconut
      step5: "A",
    };

    const result = await getRecommendations(answers);

    // Should NOT have both Coconut + Milk Foam in perfectMatch
    const hasCoconut = result.perfectMatch.base.id === "base-nuoc-dua";
    const hasMilkFoam = result.perfectMatch.texture.id === "texture-milk-foam";
    expect(hasCoconut && hasMilkFoam).toBe(false);
  });

  it("handles exclusion rules - Coconut + Vanilla is excluded", async () => {
    const answers: QuizAnswers = {
      step1: "C", // Coconut
      step2: "A", // Vanilla - should be excluded with Coconut
      step3: "A",
      step4: "A", // Mochi (ok)
      step5: "A",
    };

    const result = await getRecommendations(answers);

    const hasCoconut = result.perfectMatch.base.id === "base-nuoc-dua";
    const hasVanilla = result.perfectMatch.flavor.id === "flavor-vanilla";
    expect(hasCoconut && hasVanilla).toBe(false);
  });

  it("falls back to alternative module when stock is insufficient", async () => {
    const modulesLowStock = ALL_MODULES.map((m) =>
      m.id === "base-tra-den" ? { ...m, stockQuantity: 0 } : m
    );
    vi.mocked(prisma.module.findMany).mockResolvedValue(modulesLowStock as never);

    const answers: QuizAnswers = {
      step1: "A", // Black Tea (out of stock)
      step2: "B",
      step3: "A",
      step4: "A",
      step5: "A",
    };

    const result = await getRecommendations(answers);

    // Should fall back to another base that has stock
    expect(result.perfectMatch.base.id).not.toBe("base-tra-den");
    expect(result.perfectMatch.base.stockQuantity).toBeGreaterThan(0);
  });

  it("generates correct Vietnamese drink name", async () => {
    const answers: QuizAnswers = {
      step1: "A", // Black Tea
      step2: "B", // Yuzu
      step3: "A", // Collagen
      step4: "A", // Mochi
      step5: "A",
    };

    const result = await getRecommendations(answers);

    expect(result.perfectMatch.generatedNameVi).toContain("Trà Đen Yuzu");
    expect(result.perfectMatch.generatedNameVi).toContain("Mochi");
    expect(result.perfectMatch.generatedNameVi).toContain("Tỏa Sáng");
  });

  it("generates recipe with correct steps", async () => {
    const answers: QuizAnswers = {
      step1: "A",
      step2: "B", // Yuzu (fruit - should add acid step)
      step3: "A",
      step4: "A",
      step5: "A",
    };

    const result = await getRecommendations(answers);
    const recipe = result.perfectMatch.recipe;

    expect(recipe.length).toBeGreaterThanOrEqual(5);
    expect(recipe[0].action).toBe("Chuẩn bị");
    // Yuzu is a fruit so should include acid balancing step
    const hasAcidStep = recipe.some((r) => r.action === "Cân bằng acid");
    expect(hasAcidStep).toBe(true);
  });

  it("recipe does NOT include acid step for non-fruit flavors", async () => {
    const answers: QuizAnswers = {
      step1: "A",
      step2: "A", // Vanilla (not a fruit)
      step3: "A",
      step4: "A",
      step5: "A",
    };

    const result = await getRecommendations(answers);
    const recipe = result.perfectMatch.recipe;

    const hasAcidStep = recipe.some((r) => r.action === "Cân bằng acid");
    expect(hasAcidStep).toBe(false);
  });

  it("all cards contain complete DrinkCombo structure", async () => {
    const answers: QuizAnswers = {
      step1: "A",
      step2: "B",
      step3: "A",
      step4: "A",
      step5: "A",
    };

    const result = await getRecommendations(answers);

    for (const card of [result.perfectMatch, result.plotTwist, result.safeTrend]) {
      expect(card.base).toBeDefined();
      expect(card.flavor).toBeDefined();
      expect(card.function).toBeDefined();
      expect(card.texture).toBeDefined();
      expect(card.generatedName).toBeTruthy();
      expect(card.generatedNameVi).toBeTruthy();
      expect(card.recipe).toBeInstanceOf(Array);
      expect(card.recipe.length).toBeGreaterThan(0);
    }
  });

  it("returning customer gets last order as safeTrend", async () => {
    const lastOrderMock = {
      baseModule: ALL_MODULES.find((m) => m.id === "base-oolong"),
      flavorModule: ALL_MODULES.find((m) => m.id === "flavor-vai"),
      functionModule: ALL_MODULES.find((m) => m.id === "func-theanine"),
      textureModule: ALL_MODULES.find((m) => m.id === "texture-mochi"),
    };
    vi.mocked(prisma.orderItem.findFirst).mockResolvedValue(lastOrderMock as never);

    const answers: QuizAnswers = {
      step1: "A",
      step2: "B",
      step3: "A",
      step4: "A",
      step5: "A",
    };

    const result = await getRecommendations(answers, "customer-123");

    expect(result.safeTrend.base.id).toBe("base-oolong");
    expect(result.safeTrend.flavor.id).toBe("flavor-vai");
    expect(result.safeTrend.generatedNameVi).toContain("Món quen của bạn");
  });

  it("maps all answer combinations (A/B/C) for steps 1-4", async () => {
    const testCases: [string, string, string, string, string][] = [
      ["A", "A", "A", "A", "base-tra-den"],
      ["B", "A", "A", "A", "base-oolong"],
      ["C", "A", "A", "A", "base-nuoc-dua"],
    ];

    for (const [step1, , , , expectedBase] of testCases) {
      const answers: QuizAnswers = {
        step1: step1 as "A" | "B" | "C",
        step2: "B",
        step3: "A",
        step4: "A",
        step5: "A",
      };
      // Reset exclusion to avoid interference
      vi.mocked(prisma.exclusionRule.findMany).mockResolvedValue([] as never);
      const result = await getRecommendations(answers);
      expect(result.perfectMatch.base.id).toBe(expectedBase);
    }
  });
});
