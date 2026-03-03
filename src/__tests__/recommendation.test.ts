import { describe, it, expect } from "vitest";

import { getRecommendations } from "@/lib/recommendation/engine";
import type { QuizAnswers } from "@/types";

describe("Recommendation Engine", () => {
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

  it("maps all answer combinations (A/B/C) for steps 1-4", async () => {
    const testCases: [string, string][] = [
      ["A", "base-tra-den"],
      ["B", "base-oolong"],
      ["C", "base-nuoc-dua"],
    ];

    for (const [step1, expectedBase] of testCases) {
      const answers: QuizAnswers = {
        step1: step1 as "A" | "B" | "C",
        step2: "B",
        step3: "A",
        step4: "A",
        step5: "A",
      };
      const result = await getRecommendations(answers);
      expect(result.perfectMatch.base.id).toBe(expectedBase);
    }
  });
});
