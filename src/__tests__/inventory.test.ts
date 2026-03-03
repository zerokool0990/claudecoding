import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Prisma
const mockTransaction = vi.fn();
vi.mock("@/lib/db/prisma", () => ({
  default: {
    $transaction: (fn: (tx: unknown) => Promise<void>) => mockTransaction(fn),
  },
}));

import { deductInventory, importInventory } from "@/lib/inventory/deduction";
import type { DrinkCombo } from "@/types";

function createDrinkCombo(overrides: Partial<DrinkCombo> = {}): DrinkCombo {
  return {
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
    ...overrides,
  };
}

describe("deductInventory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns success when transaction completes", async () => {
    mockTransaction.mockImplementation(async (fn) => {
      const tx = {
        module: {
          update: vi.fn().mockResolvedValue({
            stockQuantity: 4800,
            alertThreshold: 1000,
            unit: "ml",
          }),
        },
        inventoryLog: {
          create: vi.fn().mockResolvedValue({}),
        },
      };
      await fn(tx);
    });

    const drink = createDrinkCombo();
    const result = await deductInventory(drink);

    expect(result.success).toBe(true);
  });

  it("deducts all 4 modules in a transaction", async () => {
    const updateCalls: string[] = [];
    const logCalls: string[] = [];

    mockTransaction.mockImplementation(async (fn) => {
      const tx = {
        module: {
          update: vi.fn().mockImplementation(({ where }) => {
            updateCalls.push(where.id);
            return Promise.resolve({
              stockQuantity: 4000,
              alertThreshold: 1000,
              unit: "ml",
            });
          }),
        },
        inventoryLog: {
          create: vi.fn().mockImplementation(({ data }) => {
            logCalls.push(data.moduleId);
            return Promise.resolve({});
          }),
        },
      };
      await fn(tx);
    });

    const drink = createDrinkCombo();
    await deductInventory(drink);

    expect(updateCalls).toContain("base-tra-den");
    expect(updateCalls).toContain("flavor-yuzu");
    expect(updateCalls).toContain("func-collagen");
    expect(updateCalls).toContain("texture-mochi");
    expect(updateCalls).toHaveLength(4);

    // Inventory logs created for each module
    expect(logCalls).toHaveLength(4);
  });

  it("returns alert when stock falls below threshold", async () => {
    mockTransaction.mockImplementation(async (fn) => {
      const tx = {
        module: {
          update: vi.fn().mockResolvedValue({
            stockQuantity: 800, // Below alertThreshold of 1000
            alertThreshold: 1000,
            unit: "ml",
          }),
        },
        inventoryLog: {
          create: vi.fn().mockResolvedValue({}),
        },
      };
      await fn(tx);
    });

    const drink = createDrinkCombo();
    const result = await deductInventory(drink);

    expect(result.success).toBe(true);
    expect(result.alerts.length).toBeGreaterThan(0);
    expect(result.alerts.some((a) => a.includes("ngưỡng cảnh báo"))).toBe(true);
  });

  it("deactivates module and alerts when stock is critically low", async () => {
    const deactivateCalls: string[] = [];

    mockTransaction.mockImplementation(async (fn) => {
      const tx = {
        module: {
          update: vi.fn().mockImplementation(({ where, data }) => {
            if (data.isActive === false) {
              deactivateCalls.push(where.id);
            }
            return Promise.resolve({
              stockQuantity: 10, // Below deductionRate of 200
              alertThreshold: 1000,
              unit: "ml",
            });
          }),
        },
        inventoryLog: {
          create: vi.fn().mockResolvedValue({}),
        },
      };
      await fn(tx);
    });

    const drink = createDrinkCombo();
    const result = await deductInventory(drink);

    expect(result.success).toBe(true);
    expect(result.alerts.some((a) => a.includes("ĐÃ HẾT HÀNG"))).toBe(true);
  });

  it("returns failure when transaction throws", async () => {
    mockTransaction.mockRejectedValue(new Error("DB Error"));

    const drink = createDrinkCombo();
    const result = await deductInventory(drink);

    expect(result.success).toBe(false);
    expect(result.alerts).toContain("Lỗi hệ thống khi trừ kho");
  });

  it("logs deductions with correct DEDUCTION type and negative quantity", async () => {
    const logData: { type: string; quantity: number }[] = [];

    mockTransaction.mockImplementation(async (fn) => {
      const tx = {
        module: {
          update: vi.fn().mockResolvedValue({
            stockQuantity: 4800,
            alertThreshold: 1000,
            unit: "ml",
          }),
        },
        inventoryLog: {
          create: vi.fn().mockImplementation(({ data }) => {
            logData.push({ type: data.type, quantity: data.quantity });
            return Promise.resolve({});
          }),
        },
      };
      await fn(tx);
    });

    const drink = createDrinkCombo();
    await deductInventory(drink);

    for (const log of logData) {
      expect(log.type).toBe("DEDUCTION");
      expect(log.quantity).toBeLessThan(0);
    }
  });
});

describe("importInventory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns true on successful import", async () => {
    mockTransaction.mockImplementation(async (fn) => {
      const tx = {
        module: {
          update: vi.fn().mockResolvedValue({}),
        },
        inventoryLog: {
          create: vi.fn().mockResolvedValue({}),
        },
      };
      await fn(tx);
    });

    const result = await importInventory("base-tra-den", 1000, "Nhập thêm");
    expect(result).toBe(true);
  });

  it("increments stock and reactivates module", async () => {
    let updateData: Record<string, unknown> = {};

    mockTransaction.mockImplementation(async (fn) => {
      const tx = {
        module: {
          update: vi.fn().mockImplementation(({ data }) => {
            updateData = data;
            return Promise.resolve({});
          }),
        },
        inventoryLog: {
          create: vi.fn().mockResolvedValue({}),
        },
      };
      await fn(tx);
    });

    await importInventory("base-tra-den", 500);

    expect(updateData).toHaveProperty("isActive", true);
    expect(updateData).toHaveProperty("stockQuantity");
  });

  it("returns false when transaction fails", async () => {
    mockTransaction.mockRejectedValue(new Error("DB Error"));

    const result = await importInventory("base-tra-den", 1000);
    expect(result).toBe(false);
  });

  it("creates IMPORT type inventory log", async () => {
    let logType = "";

    mockTransaction.mockImplementation(async (fn) => {
      const tx = {
        module: {
          update: vi.fn().mockResolvedValue({}),
        },
        inventoryLog: {
          create: vi.fn().mockImplementation(({ data }) => {
            logType = data.type;
            return Promise.resolve({});
          }),
        },
      };
      await fn(tx);
    });

    await importInventory("base-tra-den", 500, "Test import");
    expect(logType).toBe("IMPORT");
  });

  it("uses default note when none provided", async () => {
    let logNote = "";

    mockTransaction.mockImplementation(async (fn) => {
      const tx = {
        module: {
          update: vi.fn().mockResolvedValue({}),
        },
        inventoryLog: {
          create: vi.fn().mockImplementation(({ data }) => {
            logNote = data.note;
            return Promise.resolve({});
          }),
        },
      };
      await fn(tx);
    });

    await importInventory("base-tra-den", 500);
    expect(logNote).toBe("Nhập hàng");
  });
});
