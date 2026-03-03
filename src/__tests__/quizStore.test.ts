import { describe, it, expect, beforeEach } from "vitest";
import { useQuizStore } from "@/store/quizStore";
import type { DrinkCombo, RecommendationResult } from "@/types";

const mockDrink: DrinkCombo = {
  base: {
    id: "base-tra-den",
    category: "BASE",
    name: "Premium Black Tea",
    nameVi: "Trà Đen",
    stockQuantity: 5000,
    unit: "ml",
    deductionRate: 200,
    alertThreshold: 1000,
    isActive: true,
  },
  flavor: {
    id: "flavor-yuzu",
    category: "FLAVOR",
    name: "Yuzu Juice",
    nameVi: "Yuzu",
    stockQuantity: 3000,
    unit: "ml",
    deductionRate: 30,
    alertThreshold: 500,
    isActive: true,
  },
  function: {
    id: "func-collagen",
    category: "FUNCTION",
    name: "Collagen Peptides",
    nameVi: "Collagen",
    stockQuantity: 1000,
    unit: "g",
    deductionRate: 5,
    alertThreshold: 200,
    isActive: true,
  },
  texture: {
    id: "texture-mochi",
    category: "TEXTURE",
    name: "Mini Mochi Balls",
    nameVi: "Mochi",
    stockQuantity: 2000,
    unit: "g",
    deductionRate: 30,
    alertThreshold: 500,
    isActive: true,
  },
  generatedName: "Black Tea Yuzu Mochi",
  generatedNameVi: "Trà Đen Yuzu Mochi Tỏa Sáng",
  recipe: [],
};

describe("useQuizStore", () => {
  beforeEach(() => {
    useQuizStore.getState().reset();
  });

  it("initializes with correct default state", () => {
    const state = useQuizStore.getState();
    expect(state.currentStep).toBe(1);
    expect(state.answers).toEqual({});
    expect(state.questions).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.recommendations).toBeNull();
    expect(state.selectedCard).toBeNull();
    expect(state.selectedDrink).toBeNull();
    expect(state.moodTags).toEqual([]);
    expect(state.customerId).toBeNull();
  });

  it("setAnswer stores answer for a step", () => {
    useQuizStore.getState().setAnswer(1, "A");
    expect(useQuizStore.getState().answers[1]).toBe("A");

    useQuizStore.getState().setAnswer(2, "C");
    expect(useQuizStore.getState().answers[2]).toBe("C");
    // Previous answer preserved
    expect(useQuizStore.getState().answers[1]).toBe("A");
  });

  it("nextStep increments currentStep", () => {
    expect(useQuizStore.getState().currentStep).toBe(1);
    useQuizStore.getState().nextStep();
    expect(useQuizStore.getState().currentStep).toBe(2);
    useQuizStore.getState().nextStep();
    expect(useQuizStore.getState().currentStep).toBe(3);
  });

  it("prevStep decrements currentStep but not below 1", () => {
    useQuizStore.getState().nextStep();
    useQuizStore.getState().nextStep();
    expect(useQuizStore.getState().currentStep).toBe(3);

    useQuizStore.getState().prevStep();
    expect(useQuizStore.getState().currentStep).toBe(2);

    useQuizStore.getState().prevStep();
    expect(useQuizStore.getState().currentStep).toBe(1);

    // Should not go below 1
    useQuizStore.getState().prevStep();
    expect(useQuizStore.getState().currentStep).toBe(1);
  });

  it("setQuestions stores questions", () => {
    const questions = [
      {
        id: "q1",
        stepNumber: 1,
        themeId: "os",
        questionText: "Test?",
        answers: [
          { label: "A", value: "A" as const, logicMapping: "base-tra-den" },
        ],
      },
    ];
    useQuizStore.getState().setQuestions(questions);
    expect(useQuizStore.getState().questions).toEqual(questions);
  });

  it("setRecommendations stores recommendations", () => {
    const recs: RecommendationResult = {
      perfectMatch: mockDrink,
      plotTwist: mockDrink,
      safeTrend: mockDrink,
    };
    useQuizStore.getState().setRecommendations(recs);
    expect(useQuizStore.getState().recommendations).toEqual(recs);
  });

  it("selectCard stores both card type and drink", () => {
    useQuizStore.getState().selectCard("PERFECT_MATCH", mockDrink);
    expect(useQuizStore.getState().selectedCard).toBe("PERFECT_MATCH");
    expect(useQuizStore.getState().selectedDrink).toEqual(mockDrink);
  });

  it("setCustomerId stores customer ID", () => {
    useQuizStore.getState().setCustomerId("cust-123");
    expect(useQuizStore.getState().customerId).toBe("cust-123");
  });

  it("setLoading toggles loading state", () => {
    useQuizStore.getState().setLoading(true);
    expect(useQuizStore.getState().isLoading).toBe(true);
    useQuizStore.getState().setLoading(false);
    expect(useQuizStore.getState().isLoading).toBe(false);
  });

  it("addMoodTag accumulates mood tags", () => {
    useQuizStore
      .getState()
      .addMoodTag({ step: 1, answer: "A", theme: "os", label: "Windows" });
    useQuizStore
      .getState()
      .addMoodTag({ step: 2, answer: "B", theme: "music", label: "Jazz" });

    const tags = useQuizStore.getState().moodTags;
    expect(tags).toHaveLength(2);
    expect(tags[0].step).toBe(1);
    expect(tags[1].step).toBe(2);
  });

  it("reset clears quiz state but keeps customerId and questions", () => {
    useQuizStore.getState().setAnswer(1, "A");
    useQuizStore.getState().nextStep();
    useQuizStore.getState().selectCard("PERFECT_MATCH", mockDrink);
    useQuizStore
      .getState()
      .addMoodTag({ step: 1, answer: "A", theme: "os", label: "Windows" });
    useQuizStore.getState().setCustomerId("cust-123");

    useQuizStore.getState().reset();

    const state = useQuizStore.getState();
    expect(state.currentStep).toBe(1);
    expect(state.answers).toEqual({});
    expect(state.recommendations).toBeNull();
    expect(state.selectedCard).toBeNull();
    expect(state.selectedDrink).toBeNull();
    expect(state.moodTags).toEqual([]);
    expect(state.isLoading).toBe(false);
    // customerId is NOT cleared by reset
    expect(state.customerId).toBe("cust-123");
  });

  it("setThemeId stores theme ID", () => {
    useQuizStore.getState().setThemeId("tarot");
    expect(useQuizStore.getState().themeId).toBe("tarot");
  });

  it("allows overwriting answer for the same step", () => {
    useQuizStore.getState().setAnswer(1, "A");
    expect(useQuizStore.getState().answers[1]).toBe("A");

    useQuizStore.getState().setAnswer(1, "C");
    expect(useQuizStore.getState().answers[1]).toBe("C");
  });
});
