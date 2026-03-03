import { describe, it, expect, vi, beforeEach } from "vitest";

// ============= Mock Prisma =============
const mockPrisma = {
  question: { findMany: vi.fn() },
  customer: {
    findUnique: vi.fn(),
    create: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
  },
  order: {
    create: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
    aggregate: vi.fn(),
  },
  orderItem: { findMany: vi.fn() },
  module: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
  exclusionRule: { findMany: vi.fn() },
};

vi.mock("@/lib/db/prisma", () => ({
  default: mockPrisma,
}));

vi.mock("@/lib/utils/zodiac", () => ({
  isBirthdayMonth: vi.fn().mockReturnValue(false),
  getZodiacSign: vi.fn().mockReturnValue("Aries"),
}));

vi.mock("@/lib/recommendation/engine", () => ({
  getRecommendations: vi.fn().mockResolvedValue({
    perfectMatch: { base: {}, flavor: {}, function: {}, texture: {} },
    plotTwist: { base: {}, flavor: {}, function: {}, texture: {} },
    safeTrend: { base: {}, flavor: {}, function: {}, texture: {} },
  }),
}));

vi.mock("@/lib/inventory/deduction", () => ({
  deductInventory: vi.fn().mockResolvedValue({ success: true, alerts: [] }),
  importInventory: vi.fn().mockResolvedValue(true),
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
    const mockQuestions = [
      { id: "q1", stepNumber: 1, themeId: "os", questionText: "Q1?", answers: '[]' },
      { id: "q2", stepNumber: 2, themeId: "os", questionText: "Q2?", answers: '[]' },
      { id: "q3", stepNumber: 3, themeId: "os", questionText: "Q3?", answers: '[]' },
      { id: "q4", stepNumber: 4, themeId: "os", questionText: "Q4?", answers: '[]' },
      { id: "q5", stepNumber: 5, themeId: "os", questionText: "Q5?", answers: '[]' },
    ];
    mockPrisma.question.findMany.mockResolvedValue(mockQuestions);

    const { GET } = await import("@/app/api/quiz/route");
    const req = createRequest("http://localhost:3000/api/quiz");
    const response = await GET(req as never);
    const data = await response.json();

    expect(data.questions).toHaveLength(5);
    expect(data.themeId).toBe("os");
  });

  it("should parse answers JSON string", async () => {
    const mockQuestions = [
      {
        id: "q1",
        stepNumber: 1,
        themeId: "os",
        questionText: "Q1?",
        answers: JSON.stringify([
          { label: "Option A", value: "A", logicMapping: "base-tra-den" },
        ]),
      },
    ];
    mockPrisma.question.findMany.mockResolvedValue(mockQuestions);

    const { GET } = await import("@/app/api/quiz/route");
    const req = createRequest("http://localhost:3000/api/quiz");
    const response = await GET(req as never);
    const data = await response.json();

    expect(data.questions[0].answers).toEqual([
      { label: "Option A", value: "A", logicMapping: "base-tra-den" },
    ]);
  });

  it("should handle empty question database gracefully", async () => {
    mockPrisma.question.findMany.mockResolvedValue([]);

    const { GET } = await import("@/app/api/quiz/route");
    const req = createRequest("http://localhost:3000/api/quiz");
    const response = await GET(req as never);
    const data = await response.json();

    expect(data.questions).toHaveLength(0);
    expect(data.themeId).toBe("random");
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
  });
});

// ============= Orders API Tests =============
describe("Orders API - POST /api/orders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates order with correct total price (39000 + 6000 = 45000)", async () => {
    mockPrisma.order.create.mockResolvedValue({
      id: "order-1",
      totalPrice: 45000,
      status: "PENDING",
      items: [],
    });

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
    expect(mockPrisma.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          totalPrice: 45000,
          status: "PENDING",
        }),
      })
    );
  });

  it("creates order with PENDING status", async () => {
    mockPrisma.order.create.mockResolvedValue({
      id: "order-1",
      status: "PENDING",
      totalPrice: 45000,
      items: [],
    });

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

    await POST(req as never);

    expect(mockPrisma.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "PENDING" }),
      })
    );
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
    mockPrisma.order.update.mockResolvedValue({
      id: "123",
      status: "PREPARING",
      items: [],
    });

    const { PATCH } = await import("@/app/api/orders/[id]/route");
    const req = createRequest("http://localhost:3000/api/orders/123", {
      method: "PATCH",
      body: { status: "PREPARING" },
    });

    const response = await PATCH(req as never, { params: { id: "123" } });
    expect(response.status).toBe(200);
  });

  it("accepts valid status COMPLETED", async () => {
    mockPrisma.order.update.mockResolvedValue({
      id: "123",
      status: "COMPLETED",
      items: [],
    });

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
    mockPrisma.order.update.mockResolvedValue({
      id: "123",
      status: "CANCELLED",
      items: [],
    });

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
    mockPrisma.customer.create.mockResolvedValue({
      id: "cust-1",
      name: "Bé Mochi",
      dob: null,
      zodiacSign: null,
    });

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
    mockPrisma.customer.create.mockResolvedValue({
      id: "cust-2",
      name: "Minh",
      dob: "1995-04-15",
      zodiacSign: "Aries",
    });

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
    mockPrisma.customer.create.mockResolvedValue({
      id: "cust-3",
      name: null,
      dob: null,
      zodiacSign: null,
    });

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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns list of modules ordered by category", async () => {
    const mockModules = [
      { id: "base-tra-den", category: "BASE", name: "Black Tea", stockQuantity: 5000 },
      { id: "flavor-yuzu", category: "FLAVOR", name: "Yuzu", stockQuantity: 3000 },
    ];
    mockPrisma.module.findMany.mockResolvedValue(mockModules);

    const { GET } = await import("@/app/api/modules/route");
    const response = await GET();
    const data = await response.json();

    expect(data).toHaveLength(2);
    expect(mockPrisma.module.findMany).toHaveBeenCalledWith({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
  });
});

describe("Modules API - PATCH /api/modules", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("imports inventory and returns updated module", async () => {
    const { importInventory } = await import("@/lib/inventory/deduction");
    vi.mocked(importInventory).mockResolvedValue(true);

    mockPrisma.module.findUnique.mockResolvedValue({
      id: "base-tra-den",
      stockQuantity: 6000,
    });

    const { PATCH } = await import("@/app/api/modules/route");
    const req = createRequest("http://localhost:3000/api/modules", {
      method: "PATCH",
      body: { moduleId: "base-tra-den", quantity: 1000, note: "Nhập thêm" },
    });

    const response = await PATCH(req as never);
    const data = await response.json();

    expect(data.id).toBe("base-tra-den");
    expect(data.stockQuantity).toBe(6000);
  });

  it("returns 500 when import fails", async () => {
    const { importInventory } = await import("@/lib/inventory/deduction");
    vi.mocked(importInventory).mockResolvedValue(false);

    const { PATCH } = await import("@/app/api/modules/route");
    const req = createRequest("http://localhost:3000/api/modules", {
      method: "PATCH",
      body: { moduleId: "base-tra-den", quantity: 1000 },
    });

    const response = await PATCH(req as never);
    expect(response.status).toBe(500);
  });
});

// ============= Analytics API Tests =============
describe("Analytics API - GET /api/analytics", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockPrisma.order.count.mockResolvedValue(10);
    mockPrisma.order.aggregate.mockResolvedValue({ _sum: { totalPrice: 450000 } });
    mockPrisma.order.findMany.mockResolvedValue([
      { cardChosen: "PERFECT_MATCH" },
      { cardChosen: "PERFECT_MATCH" },
      { cardChosen: "PLOT_TWIST" },
    ]);
    mockPrisma.orderItem.findMany.mockResolvedValue([]);
    mockPrisma.module.findMany.mockResolvedValue([]);
    mockPrisma.customer.count.mockResolvedValue(5);
  });

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

  it("calculates total revenue correctly", async () => {
    const { GET } = await import("@/app/api/analytics/route");
    const response = await GET();
    const data = await response.json();

    expect(data.totalRevenue).toBe(450000);
  });

  it("returns 0 revenue when no completed orders", async () => {
    mockPrisma.order.aggregate.mockResolvedValue({ _sum: { totalPrice: null } });

    const { GET } = await import("@/app/api/analytics/route");
    const response = await GET();
    const data = await response.json();

    expect(data.totalRevenue).toBe(0);
  });

  it("calculates card preference distribution", async () => {
    const { GET } = await import("@/app/api/analytics/route");
    const response = await GET();
    const data = await response.json();

    const perfectMatch = data.cardPreference.find(
      (c: { card: string }) => c.card === "Perfect Match"
    );
    expect(perfectMatch?.count).toBe(2);

    const plotTwist = data.cardPreference.find(
      (c: { card: string }) => c.card === "Plot Twist"
    );
    expect(plotTwist?.count).toBe(1);
  });
});
