import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/utils/zodiac", () => ({
  isBirthdayMonth: vi.fn().mockReturnValue(false),
  getZodiacSign: vi.fn().mockReturnValue("Aries"),
}));

// ============= Helper to create mock request =============
function createRequest(
  url: string,
  options?: { method?: string; body?: unknown }
) {
  const { method = "GET", body } = options || {};
  return {
    method,
    nextUrl: new URL(url, "http://localhost:3000"),
    json: body ? () => Promise.resolve(body) : undefined,
  };
}

// ============= Quiz API Tests =============
describe("Quiz API - GET /api/quiz", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 5 questions (one per step)", async () => {
    const { GET } = await import("@/app/api/quiz/route");
    const req = createRequest("http://localhost:3000/api/quiz");
    const response = await GET(req as never);
    const data = await response.json();

    expect(data.questions).toHaveLength(5);
    expect(data.themeId).toBeTruthy();
  });

  it("should parse answers JSON string", async () => {
    const { GET } = await import("@/app/api/quiz/route");
    const req = createRequest("http://localhost:3000/api/quiz");
    const response = await GET(req as never);
    const data = await response.json();

    // Answers should be parsed objects, not strings
    expect(Array.isArray(data.questions[0].answers)).toBe(true);
    expect(data.questions[0].answers[0]).toHaveProperty("label");
    expect(data.questions[0].answers[0]).toHaveProperty("value");
  });

  it("each question has correct structure", async () => {
    const { GET } = await import("@/app/api/quiz/route");
    const req = createRequest("http://localhost:3000/api/quiz");
    const response = await GET(req as never);
    const data = await response.json();

    for (const q of data.questions) {
      expect(q).toHaveProperty("id");
      expect(q).toHaveProperty("stepNumber");
      expect(q).toHaveProperty("themeId");
      expect(q).toHaveProperty("questionText");
      expect(q).toHaveProperty("answers");
    }
  });
});

// ============= Recommend API Tests =============
describe("Recommend API - POST /api/quiz/recommend", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when answers are incomplete", async () => {
    const { POST } = await import("@/app/api/quiz/recommend/route");
    const req = createRequest("http://localhost:3000/api/quiz/recommend", {
      method: "POST",
      body: { answers: { step1: "A", step2: "B" } }, // missing step3-5
    });

    const response = await POST(req as never);
    expect(response.status).toBe(400);
  });

  it("returns 400 when answers object is empty", async () => {
    const { POST } = await import("@/app/api/quiz/recommend/route");
    const req = createRequest("http://localhost:3000/api/quiz/recommend", {
      method: "POST",
      body: { answers: {} },
    });

    const response = await POST(req as never);
    expect(response.status).toBe(400);
  });

  it("accepts complete answers and returns recommendations", async () => {
    const { POST } = await import("@/app/api/quiz/recommend/route");
    const req = createRequest("http://localhost:3000/api/quiz/recommend", {
      method: "POST",
      body: {
        answers: { step1: "A", step2: "B", step3: "A", step4: "B", step5: "C" },
      },
    });

    const response = await POST(req as never);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("perfectMatch");
    expect(data).toHaveProperty("plotTwist");
    expect(data).toHaveProperty("safeTrend");
  });
});

// ============= Orders API Tests =============
describe("Orders API - POST /api/orders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates order with correct total price (39000 + 6000 = 45000)", async () => {
    const { POST } = await import("@/app/api/orders/route");
    const req = createRequest("http://localhost:3000/api/orders", {
      method: "POST",
      body: {
        cardChosen: "PERFECT_MATCH",
        drink: {
          base: { id: "base-tra-den" },
          flavor: { id: "flavor-yuzu" },
          function: { id: "func-collagen" },
          texture: { id: "texture-mochi" },
          generatedName: "Test Drink",
          generatedNameVi: "Đồ uống test",
          recipe: [],
        },
        moodTags: [],
      },
    });

    const response = await POST(req as never);
    const data = await response.json();

    expect(data.order.totalPrice).toBe(45000);
  });

  it("creates order with PENDING status", async () => {
    const { POST } = await import("@/app/api/orders/route");
    const req = createRequest("http://localhost:3000/api/orders", {
      method: "POST",
      body: {
        cardChosen: "PERFECT_MATCH",
        drink: {
          base: { id: "b" },
          flavor: { id: "f" },
          function: { id: "fn" },
          texture: { id: "t" },
          generatedName: "Test",
          generatedNameVi: "Test",
          recipe: [],
        },
        moodTags: [],
      },
    });

    const response = await POST(req as never);
    const data = await response.json();

    expect(data.order.status).toBe("PENDING");
  });
});

// ============= Orders PATCH API Tests =============
describe("Orders API - PATCH /api/orders/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects invalid status values", async () => {
    const { PATCH } = await import("@/app/api/orders/[id]/route");
    const req = createRequest("http://localhost:3000/api/orders/123", {
      method: "PATCH",
      body: { status: "INVALID_STATUS" },
    });

    const response = await PATCH(req as never, { params: { id: "123" } });
    expect(response.status).toBe(400);
  });

  it("accepts valid status PREPARING", async () => {
    const { PATCH } = await import("@/app/api/orders/[id]/route");
    const req = createRequest("http://localhost:3000/api/orders/123", {
      method: "PATCH",
      body: { status: "PREPARING" },
    });

    const response = await PATCH(req as never, { params: { id: "123" } });
    expect(response.status).toBe(200);
  });

  it("accepts valid status COMPLETED", async () => {
    const { PATCH } = await import("@/app/api/orders/[id]/route");
    const req = createRequest("http://localhost:3000/api/orders/123", {
      method: "PATCH",
      body: { status: "COMPLETED" },
    });

    const response = await PATCH(req as never, { params: { id: "123" } });
    const data = await response.json();
    expect(data.status).toBe("COMPLETED");
  });

  it("accepts valid status CANCELLED", async () => {
    const { PATCH } = await import("@/app/api/orders/[id]/route");
    const req = createRequest("http://localhost:3000/api/orders/123", {
      method: "PATCH",
      body: { status: "CANCELLED" },
    });

    const response = await PATCH(req as never, { params: { id: "123" } });
    expect(response.status).toBe(200);
  });
});

// ============= Customers API Tests =============
describe("Customers API - POST /api/customers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates customer with name only", async () => {
    const { POST } = await import("@/app/api/customers/route");
    const req = createRequest("http://localhost:3000/api/customers", {
      method: "POST",
      body: { name: "Bé Mochi" },
    });

    const response = await POST(req as never);
    const data = await response.json();
    expect(data.name).toBe("Bé Mochi");
  });

  it("creates customer with name and DOB, auto-calculates zodiac", async () => {
    const { POST } = await import("@/app/api/customers/route");
    const req = createRequest("http://localhost:3000/api/customers", {
      method: "POST",
      body: { name: "Minh", dob: "1995-04-15" },
    });

    const response = await POST(req as never);
    const data = await response.json();

    expect(data.name).toBe("Minh");
    expect(data.zodiacSign).toBe("Aries");
  });

  it("creates anonymous customer (no name, no dob)", async () => {
    const { POST } = await import("@/app/api/customers/route");
    const req = createRequest("http://localhost:3000/api/customers", {
      method: "POST",
      body: {},
    });

    const response = await POST(req as never);
    const data = await response.json();
    expect(data.name).toBeNull();
    expect(data.dob).toBeNull();
  });
});

// ============= Modules API Tests =============
describe("Modules API - GET /api/modules", () => {
  it("returns list of modules ordered by category", async () => {
    const { GET } = await import("@/app/api/modules/route");
    const response = await GET();
    const data = await response.json();

    expect(data.length).toBe(12);
    // Check ordering: BASE comes before FLAVOR
    const firstBase = data.findIndex((m: { category: string }) => m.category === "BASE");
    const firstFlavor = data.findIndex((m: { category: string }) => m.category === "FLAVOR");
    expect(firstBase).toBeLessThan(firstFlavor);
  });
});

describe("Modules API - PATCH /api/modules", () => {
  it("returns module data for valid moduleId", async () => {
    const { PATCH } = await import("@/app/api/modules/route");
    const req = createRequest("http://localhost:3000/api/modules", {
      method: "PATCH",
      body: { moduleId: "base-tra-den", quantity: 1000, note: "Nhập thêm" },
    });

    const response = await PATCH(req as never);
    const data = await response.json();

    expect(data.id).toBe("base-tra-den");
  });

  it("returns 404 for unknown moduleId", async () => {
    const { PATCH } = await import("@/app/api/modules/route");
    const req = createRequest("http://localhost:3000/api/modules", {
      method: "PATCH",
      body: { moduleId: "nonexistent", quantity: 1000 },
    });

    const response = await PATCH(req as never);
    expect(response.status).toBe(404);
  });
});

// ============= Analytics API Tests =============
describe("Analytics API - GET /api/analytics", () => {
  it("returns comprehensive analytics data", async () => {
    const { GET } = await import("@/app/api/analytics/route");
    const response = await GET();
    const data = await response.json();

    expect(data).toHaveProperty("totalOrders");
    expect(data).toHaveProperty("todayOrders");
    expect(data).toHaveProperty("totalRevenue");
    expect(data).toHaveProperty("cardPreference");
    expect(data).toHaveProperty("moduleUsage");
    expect(data).toHaveProperty("inventoryStatus");
    expect(data).toHaveProperty("moodDistribution");
    expect(data).toHaveProperty("totalCustomers");
  });

  it("returns correct card preference distribution", async () => {
    const { GET } = await import("@/app/api/analytics/route");
    const response = await GET();
    const data = await response.json();

    const perfectMatch = data.cardPreference.find(
      (c: { card: string }) => c.card === "Perfect Match"
    );
    expect(perfectMatch).toBeDefined();
    expect(perfectMatch.count).toBeGreaterThan(0);
  });

  it("returns inventory status for all modules", async () => {
    const { GET } = await import("@/app/api/analytics/route");
    const response = await GET();
    const data = await response.json();

    expect(data.inventoryStatus.length).toBe(12);
  });
});
