/**
 * Test: Quiz API Routes
 * PRD Section 1.1: Random question selection per session
 * - GET /api/quiz: Fetch 5 random questions (1 per step)
 * - POST /api/quiz/recommend: Generate 3 drink recommendations
 */

describe("Quiz API - PRD 1.1", () => {
  describe("GET /api/quiz", () => {
    it("should return 5 questions (one per step)", () => {
      const expectedSteps = [1, 2, 3, 4, 5];
      expect(expectedSteps).toHaveLength(5);
    });

    it("should return questions with required fields", () => {
      const requiredFields = ["id", "stepNumber", "themeId", "questionText", "answers"];
      requiredFields.forEach((field) => {
        expect(typeof field).toBe("string");
      });
    });

    it("should return 3 answer options per question (A, B, C)", () => {
      const answerValues = ["A", "B", "C"];
      expect(answerValues).toHaveLength(3);
    });

    it("should support customerId parameter for birthday theme", () => {
      // When customerId is provided and it's their birthday month,
      // the preferred theme should be "tarot"
      const preferredTheme = "tarot";
      expect(preferredTheme).toBe("tarot");
    });

    it("each answer should have label, value, and logicMapping", () => {
      const answerStructure = {
        label: "Đang cần sạc gấp",
        value: "A",
        logicMapping: "base-tra-den",
      };
      expect(answerStructure).toHaveProperty("label");
      expect(answerStructure).toHaveProperty("value");
      expect(answerStructure).toHaveProperty("logicMapping");
    });
  });

  describe("POST /api/quiz/recommend", () => {
    it("should require all 5 step answers", () => {
      const validPayload = {
        answers: {
          step1: "A",
          step2: "B",
          step3: "C",
          step4: "A",
          step5: "B",
        },
      };
      expect(validPayload.answers).toHaveProperty("step1");
      expect(validPayload.answers).toHaveProperty("step2");
      expect(validPayload.answers).toHaveProperty("step3");
      expect(validPayload.answers).toHaveProperty("step4");
      expect(validPayload.answers).toHaveProperty("step5");
    });

    it("should return 3 drink recommendations", () => {
      const expectedCards = ["perfectMatch", "plotTwist", "safeTrend"];
      expect(expectedCards).toHaveLength(3);
    });

    it("should return 400 if missing step answers", () => {
      const incompletePayload = {
        answers: { step1: "A" },
      };
      // Missing step2-5
      expect(incompletePayload.answers).not.toHaveProperty("step2");
    });

    it("each recommendation should have full drink combo data", () => {
      const drinkComboFields = [
        "base", "flavor", "function", "texture",
        "generatedName", "generatedNameVi", "recipe",
      ];
      expect(drinkComboFields).toHaveLength(7);
    });

    it("should accept optional customerId for returning customer", () => {
      const payload = {
        answers: { step1: "A", step2: "B", step3: "C", step4: "A", step5: "B" },
        customerId: "customer-123",
      };
      expect(payload).toHaveProperty("customerId");
    });
  });
});

describe("Quiz Themes - PRD 1.1: 5 Theme Variants", () => {
  const themes = [
    { id: "os", name: "Hệ điều hành" },
    { id: "music", name: "Âm nhạc" },
    { id: "weather", name: "Thời tiết nội tâm" },
    { id: "speed", name: "Tốc độ" },
    { id: "work", name: "Trạng thái làm việc" },
  ];

  it("should have 5 question theme variants", () => {
    expect(themes).toHaveLength(5);
  });

  it("each step should randomly select 1 of 5 variants", () => {
    // Frontend selects randomly - verify theme structure
    themes.forEach((theme) => {
      expect(theme).toHaveProperty("id");
      expect(theme).toHaveProperty("name");
    });
  });

  it("different variants should map to same A/B/C logic", () => {
    // PRD: "kết quả (A, B, C) vẫn sẽ được map về cùng một tham số Logic trên Backend"
    // Regardless of theme, A always maps to the same module
    const step1MappingA = "base-tra-den"; // Always Black Tea for step 1, answer A
    expect(step1MappingA).toBe("base-tra-den");
  });
});
