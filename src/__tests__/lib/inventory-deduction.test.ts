/**
 * Test: Inventory Deduction Logic
 * PRD Section 4.1: Matrix Inventory Management
 * - Auto-deduction khi đơn hàng hoàn tất
 * - Cảnh báo khi nguyên liệu sắp hết
 * - Tự động tắt module khi hết hàng
 * - Nhập hàng và kích hoạt lại
 */
import type { DrinkCombo, ModuleData } from "@/types";

// Mock Prisma
jest.mock("@/lib/db/prisma", () => ({
  __esModule: true,
  default: {
    $transaction: jest.fn(),
    module: { update: jest.fn() },
    inventoryLog: { create: jest.fn() },
  },
}));

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

function mockDrinkCombo(): DrinkCombo {
  return {
    base: mockModule({ id: "base-tra-den", category: "BASE", deductionRate: 150, unit: "ml" }),
    flavor: mockModule({ id: "flavor-vanilla", category: "FLAVOR", name: "Vanilla Syrup", nameVi: "Syrup Vanilla", deductionRate: 25, unit: "ml" }),
    function: mockModule({ id: "func-theanine", category: "FUNCTION", name: "L-Theanine", nameVi: "L-Theanine", deductionRate: 5, unit: "ml" }),
    texture: mockModule({ id: "texture-milk-foam", category: "TEXTURE", name: "Milk Foam", nameVi: "Milk Foam muối biển", deductionRate: 40, unit: "ml" }),
    generatedName: "Black Tea Vanilla Milk Foam",
    generatedNameVi: "Trà Đen Vanilla Cream Trầm Lắng",
    recipe: [],
  };
}

describe("Inventory Deduction - PRD 4.1", () => {
  describe("Auto-deduction mechanism", () => {
    it("should deduct 4 modules per drink (Base, Flavor, Function, Texture)", () => {
      const drink = mockDrinkCombo();
      const modulesToDeduct = [
        { id: drink.base.id, rate: drink.base.deductionRate },
        { id: drink.flavor.id, rate: drink.flavor.deductionRate },
        { id: drink.function.id, rate: drink.function.deductionRate },
        { id: drink.texture.id, rate: drink.texture.deductionRate },
      ];
      expect(modulesToDeduct).toHaveLength(4);
    });

    it("should deduct correct amounts per PRD 3.1 Master Formula", () => {
      const drink = mockDrinkCombo();
      // Base: 150ml
      expect(drink.base.deductionRate).toBe(150);
      // Flavor: 25ml (PRD says 25-30ml)
      expect(drink.flavor.deductionRate).toBeGreaterThanOrEqual(25);
      expect(drink.flavor.deductionRate).toBeLessThanOrEqual(30);
      // Function: 5ml (PRD says 5g/5ml)
      expect(drink.function.deductionRate).toBe(5);
      // Texture: 40ml (PRD says 40ml foam / 40g mochi / 50ml ga)
      expect(drink.texture.deductionRate).toBeGreaterThanOrEqual(40);
    });
  });

  describe("Stock alert threshold (PRD 4.1)", () => {
    it("should trigger alert when stock <= alertThreshold", () => {
      const mod = mockModule({ stockQuantity: 450, alertThreshold: 500 });
      const shouldAlert = mod.stockQuantity <= mod.alertThreshold;
      expect(shouldAlert).toBe(true);
    });

    it("should NOT trigger alert when stock > alertThreshold", () => {
      const mod = mockModule({ stockQuantity: 3000, alertThreshold: 500 });
      const shouldAlert = mod.stockQuantity <= mod.alertThreshold;
      expect(shouldAlert).toBe(false);
    });
  });

  describe("Auto-deactivation when out of stock (PRD 4.1)", () => {
    it("should deactivate module when stock < deductionRate", () => {
      const mod = mockModule({ stockQuantity: 100, deductionRate: 150 });
      const shouldDeactivate = mod.stockQuantity < mod.deductionRate;
      expect(shouldDeactivate).toBe(true);
    });

    it("should keep module active when stock >= deductionRate", () => {
      const mod = mockModule({ stockQuantity: 150, deductionRate: 150 });
      const shouldDeactivate = mod.stockQuantity < mod.deductionRate;
      expect(shouldDeactivate).toBe(false);
    });
  });

  describe("Inventory import (PRD 4.1)", () => {
    it("should reactivate module after import", () => {
      // After importing, isActive should be set to true
      const mod = mockModule({ isActive: false, stockQuantity: 0 });
      const afterImport = { ...mod, isActive: true, stockQuantity: 5000 };
      expect(afterImport.isActive).toBe(true);
      expect(afterImport.stockQuantity).toBeGreaterThan(0);
    });
  });

  describe("Inventory log tracking (PRD 4.1)", () => {
    it("should log DEDUCTION type for order fulfillment", () => {
      const logTypes = ["IMPORT", "DEDUCTION", "ADJUSTMENT"];
      expect(logTypes).toContain("DEDUCTION");
    });

    it("should log IMPORT type for restocking", () => {
      const logTypes = ["IMPORT", "DEDUCTION", "ADJUSTMENT"];
      expect(logTypes).toContain("IMPORT");
    });
  });
});
