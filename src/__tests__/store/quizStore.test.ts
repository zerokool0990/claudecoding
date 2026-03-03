/**
 * Test: Quiz Store (Zustand)
 * PRD Section 1: Full quiz flow state management
 * - 5 bước câu hỏi, chuyển tiếp tự động
 * - Lưu câu trả lời, mood tags
 * - 3 thẻ kết quả (Perfect Match, Plot Twist, Safe Trend)
 * - Reset cho phiên mới
 */
import { useQuizStore } from "@/store/quizStore";
import type { QuestionData, RecommendationResult, DrinkCombo, ModuleData } from "@/types";

// Helper: create a mock module
function mockModule(overrides: Partial<ModuleData> = {}): ModuleData {
  return {
    id: "base-tra-den",
    category: "BASE",
    name: "Black Tea",
    nameVi: "Trà Đen",
    stockQuantity: 5000,
    unit: "ml",
    deductionRate: 150,
    alertThreshold: 500,
    isActive: true,
    ...overrides,
  };
}

// Helper: create a mock drink combo
function mockDrinkCombo(overrides: Partial<DrinkCombo> = {}): DrinkCombo {
  return {
    base: mockModule({ id: "base-tra-den", category: "BASE" }),
    flavor: mockModule({ id: "flavor-vanilla", category: "FLAVOR", name: "Vanilla Syrup", nameVi: "Syrup Vanilla" }),
    function: mockModule({ id: "func-theanine", category: "FUNCTION", name: "L-Theanine", nameVi: "L-Theanine" }),
    texture: mockModule({ id: "texture-milk-foam", category: "TEXTURE", name: "Milk Foam", nameVi: "Milk Foam" }),
    generatedName: "Black Tea Vanilla Milk Foam",
    generatedNameVi: "Trà Đen Vanilla Cream Trầm Lắng",
    recipe: [
      { action: "Chuẩn bị", ingredient: "Trà Đen", amount: "150ml" },
      { action: "Thêm", ingredient: "Syrup Vanilla", amount: "25ml" },
    ],
    ...overrides,
  };
}

describe("quizStore", () => {
  beforeEach(() => {
    // Reset store before each test
    useQuizStore.getState().reset();
  });

  describe("Initial state", () => {
    it("should start at step 1", () => {
      expect(useQuizStore.getState().currentStep).toBe(1);
    });

    it("should have empty answers", () => {
      expect(useQuizStore.getState().answers).toEqual({});
    });

    it("should have empty questions", () => {
      expect(useQuizStore.getState().questions).toEqual([]);
    });

    it("should not be loading", () => {
      expect(useQuizStore.getState().isLoading).toBe(false);
    });

    it("should have null recommendations", () => {
      expect(useQuizStore.getState().recommendations).toBeNull();
    });

    it("should have null selectedCard", () => {
      expect(useQuizStore.getState().selectedCard).toBeNull();
    });

    it("should have empty moodTags", () => {
      expect(useQuizStore.getState().moodTags).toEqual([]);
    });

    it("should have null customerId", () => {
      expect(useQuizStore.getState().customerId).toBeNull();
    });
  });

  describe("setQuestions - PRD 1.1: Load 5 random questions", () => {
    it("should store questions from API", () => {
      const questions: QuestionData[] = [
        {
          id: "q1",
          stepNumber: 1,
          themeId: "os",
          questionText: "Tình trạng pin?",
          answers: [
            { label: "Đang cần sạc gấp", value: "A", logicMapping: "base-tra-den" },
            { label: "50% bình ổn", value: "B", logicMapping: "base-oolong" },
            { label: "100% sẵn sàng", value: "C", logicMapping: "base-nuoc-dua" },
          ],
        },
      ];
      useQuizStore.getState().setQuestions(questions);
      expect(useQuizStore.getState().questions).toEqual(questions);
    });
  });

  describe("setAnswer - PRD 1.1: Record quiz answers (A/B/C)", () => {
    it("should save answer for a specific step", () => {
      useQuizStore.getState().setAnswer(1, "A");
      expect(useQuizStore.getState().answers[1]).toBe("A");
    });

    it("should save answers for all 5 steps", () => {
      useQuizStore.getState().setAnswer(1, "A");
      useQuizStore.getState().setAnswer(2, "B");
      useQuizStore.getState().setAnswer(3, "C");
      useQuizStore.getState().setAnswer(4, "A");
      useQuizStore.getState().setAnswer(5, "B");

      const { answers } = useQuizStore.getState();
      expect(answers[1]).toBe("A");
      expect(answers[2]).toBe("B");
      expect(answers[3]).toBe("C");
      expect(answers[4]).toBe("A");
      expect(answers[5]).toBe("B");
    });

    it("should overwrite previous answer for same step", () => {
      useQuizStore.getState().setAnswer(1, "A");
      useQuizStore.getState().setAnswer(1, "C");
      expect(useQuizStore.getState().answers[1]).toBe("C");
    });
  });

  describe("nextStep / prevStep - PRD 1.1: 5-step quiz navigation", () => {
    it("should advance from step 1 to step 2", () => {
      useQuizStore.getState().nextStep();
      expect(useQuizStore.getState().currentStep).toBe(2);
    });

    it("should advance through all 5 steps", () => {
      for (let i = 0; i < 4; i++) {
        useQuizStore.getState().nextStep();
      }
      expect(useQuizStore.getState().currentStep).toBe(5);
    });

    it("should go back from step 3 to step 2", () => {
      useQuizStore.getState().nextStep(); // step 2
      useQuizStore.getState().nextStep(); // step 3
      useQuizStore.getState().prevStep(); // step 2
      expect(useQuizStore.getState().currentStep).toBe(2);
    });

    it("should not go below step 1", () => {
      useQuizStore.getState().prevStep();
      expect(useQuizStore.getState().currentStep).toBe(1);
    });
  });

  describe("addMoodTag - PRD 4.2: Mood tracking for analytics", () => {
    it("should add mood tags for each answer", () => {
      useQuizStore.getState().addMoodTag({
        step: 1,
        answer: "A",
        theme: "os",
        label: "Đang cần sạc gấp",
      });
      useQuizStore.getState().addMoodTag({
        step: 2,
        answer: "B",
        theme: "color",
        label: "Vàng rực nắng",
      });

      const { moodTags } = useQuizStore.getState();
      expect(moodTags).toHaveLength(2);
      expect(moodTags[0].step).toBe(1);
      expect(moodTags[1].step).toBe(2);
    });
  });

  describe("setRecommendations - PRD 1.2: 3 drink cards", () => {
    it("should store recommendation result with 3 cards", () => {
      const recs: RecommendationResult = {
        perfectMatch: mockDrinkCombo(),
        plotTwist: mockDrinkCombo({ generatedNameVi: "Trà Đen Yuzu Cream" }),
        safeTrend: mockDrinkCombo({ generatedNameVi: "Trà Đen Vanilla Best Seller" }),
      };
      useQuizStore.getState().setRecommendations(recs);
      expect(useQuizStore.getState().recommendations).toEqual(recs);
    });
  });

  describe("selectCard - PRD 1.2: Choose 1 of 3 cards", () => {
    it("should store selected card type and drink", () => {
      const drink = mockDrinkCombo();
      useQuizStore.getState().selectCard("PERFECT_MATCH", drink);

      expect(useQuizStore.getState().selectedCard).toBe("PERFECT_MATCH");
      expect(useQuizStore.getState().selectedDrink).toEqual(drink);
    });

    it("should allow selecting PLOT_TWIST card", () => {
      const drink = mockDrinkCombo();
      useQuizStore.getState().selectCard("PLOT_TWIST", drink);
      expect(useQuizStore.getState().selectedCard).toBe("PLOT_TWIST");
    });

    it("should allow selecting SAFE_TREND card", () => {
      const drink = mockDrinkCombo();
      useQuizStore.getState().selectCard("SAFE_TREND", drink);
      expect(useQuizStore.getState().selectedCard).toBe("SAFE_TREND");
    });
  });

  describe("setCustomerId - PRD 1.3: Customer profiling", () => {
    it("should store customer ID after profile creation", () => {
      useQuizStore.getState().setCustomerId("customer-123");
      expect(useQuizStore.getState().customerId).toBe("customer-123");
    });
  });

  describe("setLoading", () => {
    it("should toggle loading state", () => {
      useQuizStore.getState().setLoading(true);
      expect(useQuizStore.getState().isLoading).toBe(true);
      useQuizStore.getState().setLoading(false);
      expect(useQuizStore.getState().isLoading).toBe(false);
    });
  });

  describe("reset - New session", () => {
    it("should reset all quiz state for a new session", () => {
      // Fill state
      useQuizStore.getState().setAnswer(1, "A");
      useQuizStore.getState().nextStep();
      useQuizStore.getState().addMoodTag({ step: 1, answer: "A", theme: "os", label: "test" });
      useQuizStore.getState().setRecommendations({
        perfectMatch: mockDrinkCombo(),
        plotTwist: mockDrinkCombo(),
        safeTrend: mockDrinkCombo(),
      });
      useQuizStore.getState().selectCard("PERFECT_MATCH", mockDrinkCombo());

      // Reset
      useQuizStore.getState().reset();

      const state = useQuizStore.getState();
      expect(state.currentStep).toBe(1);
      expect(state.answers).toEqual({});
      expect(state.recommendations).toBeNull();
      expect(state.selectedCard).toBeNull();
      expect(state.selectedDrink).toBeNull();
      expect(state.moodTags).toEqual([]);
      expect(state.isLoading).toBe(false);
    });

    it("should preserve questions and customerId after reset", () => {
      useQuizStore.getState().setCustomerId("cust-1");
      useQuizStore.getState().reset();
      // customerId is NOT reset (by design)
      expect(useQuizStore.getState().customerId).toBe("cust-1");
    });
  });
});
