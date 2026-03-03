/**
 * Test: DrinkCard Component
 * PRD Section 1.2: 3-Card Result Display
 * - Card 1: "The Perfect Match" (Đồng điệu hoàn hảo) - 100% logic match
 * - Card 2: "The Plot Twist" (Cú lật bất ngờ) - Random flavor swap
 * - Card 3: "The Safe Trend" (Lựa chọn an toàn) - Best-seller
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DrinkCard from "@/components/results/DrinkCard";
import type { DrinkCombo, ModuleData } from "@/types";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }: any, ref: any) =>
      React.createElement("div", { ...props, ref }, children)
    ),
    button: React.forwardRef(({ children, ...props }: any, ref: any) =>
      React.createElement("button", { ...props, ref }, children)
    ),
  },
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Sparkles: (props: any) => React.createElement("svg", { ...props, "data-testid": "sparkles-icon" }),
  Shuffle: (props: any) => React.createElement("svg", { ...props, "data-testid": "shuffle-icon" }),
  Shield: (props: any) => React.createElement("svg", { ...props, "data-testid": "shield-icon" }),
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

const mockDrink: DrinkCombo = {
  base: mockModule({ id: "base-tra-den", nameVi: "Trà Đen" }),
  flavor: mockModule({ id: "flavor-vanilla", category: "FLAVOR", nameVi: "Syrup Vanilla" }),
  function: mockModule({ id: "func-theanine", category: "FUNCTION", nameVi: "L-Theanine tĩnh tâm" }),
  texture: mockModule({ id: "texture-milk-foam", category: "TEXTURE", nameVi: "Milk Foam muối biển" }),
  generatedName: "Black Tea Vanilla Milk Foam",
  generatedNameVi: "Trà Đen Vanilla Cream Trầm Lắng",
  recipe: [],
};

describe("DrinkCard - PRD 1.2: 3 Card Types", () => {
  const onSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Card 1: Perfect Match", () => {
    it("should display 'The Perfect Match' title", () => {
      render(<DrinkCard drink={mockDrink} cardType="PERFECT_MATCH" isActive={true} onSelect={onSelect} />);
      expect(screen.getByText("The Perfect Match")).toBeInTheDocument();
    });

    it("should display Vietnamese subtitle 'Đồng điệu hoàn hảo'", () => {
      render(<DrinkCard drink={mockDrink} cardType="PERFECT_MATCH" isActive={true} onSelect={onSelect} />);
      expect(screen.getByText("Đồng điệu hoàn hảo")).toBeInTheDocument();
    });

    it("should show '100% Match' badge", () => {
      render(<DrinkCard drink={mockDrink} cardType="PERFECT_MATCH" isActive={true} onSelect={onSelect} />);
      expect(screen.getByText(/100% Match/)).toBeInTheDocument();
    });
  });

  describe("Card 2: Plot Twist", () => {
    it("should display 'The Plot Twist' title", () => {
      render(<DrinkCard drink={mockDrink} cardType="PLOT_TWIST" isActive={true} onSelect={onSelect} />);
      expect(screen.getByText("The Plot Twist")).toBeInTheDocument();
    });

    it("should display Vietnamese subtitle 'Cú lật bất ngờ'", () => {
      render(<DrinkCard drink={mockDrink} cardType="PLOT_TWIST" isActive={true} onSelect={onSelect} />);
      expect(screen.getByText("Cú lật bất ngờ")).toBeInTheDocument();
    });

    it("should show 'Surprise' badge", () => {
      render(<DrinkCard drink={mockDrink} cardType="PLOT_TWIST" isActive={true} onSelect={onSelect} />);
      expect(screen.getByText(/Surprise/)).toBeInTheDocument();
    });
  });

  describe("Card 3: Safe Trend", () => {
    it("should display 'The Safe Trend' title", () => {
      render(<DrinkCard drink={mockDrink} cardType="SAFE_TREND" isActive={true} onSelect={onSelect} />);
      expect(screen.getByText("The Safe Trend")).toBeInTheDocument();
    });

    it("should display Vietnamese subtitle 'Lựa chọn an toàn'", () => {
      render(<DrinkCard drink={mockDrink} cardType="SAFE_TREND" isActive={true} onSelect={onSelect} />);
      expect(screen.getByText("Lựa chọn an toàn")).toBeInTheDocument();
    });

    it("should show 'Best Seller' badge", () => {
      render(<DrinkCard drink={mockDrink} cardType="SAFE_TREND" isActive={true} onSelect={onSelect} />);
      expect(screen.getByText(/Best Seller/)).toBeInTheDocument();
    });
  });

  describe("Drink information display", () => {
    it("should display Vietnamese drink name", () => {
      render(<DrinkCard drink={mockDrink} cardType="PERFECT_MATCH" isActive={true} onSelect={onSelect} />);
      expect(screen.getByText("Trà Đen Vanilla Cream Trầm Lắng")).toBeInTheDocument();
    });

    it("should display English drink name", () => {
      render(<DrinkCard drink={mockDrink} cardType="PERFECT_MATCH" isActive={true} onSelect={onSelect} />);
      expect(screen.getByText("Black Tea Vanilla Milk Foam")).toBeInTheDocument();
    });

    it("should display 4 module ingredients (PRD 2.1)", () => {
      render(<DrinkCard drink={mockDrink} cardType="PERFECT_MATCH" isActive={true} onSelect={onSelect} />);
      // Base
      expect(screen.getByText("Trà Đen")).toBeInTheDocument();
      expect(screen.getByText("Cốt nền")).toBeInTheDocument();
      // Flavor
      expect(screen.getByText("Syrup Vanilla")).toBeInTheDocument();
      expect(screen.getByText("Hương vị")).toBeInTheDocument();
      // Function
      expect(screen.getByText("L-Theanine tĩnh tâm")).toBeInTheDocument();
      expect(screen.getByText("Chức năng")).toBeInTheDocument();
      // Texture
      expect(screen.getByText("Milk Foam muối biển")).toBeInTheDocument();
      expect(screen.getByText("Kết cấu")).toBeInTheDocument();
    });

    it("should display price 45.000đ", () => {
      render(<DrinkCard drink={mockDrink} cardType="PERFECT_MATCH" isActive={true} onSelect={onSelect} />);
      expect(screen.getByText("45.000đ")).toBeInTheDocument();
    });

    it("should display volume 500ml", () => {
      render(<DrinkCard drink={mockDrink} cardType="PERFECT_MATCH" isActive={true} onSelect={onSelect} />);
      expect(screen.getByText("500ml")).toBeInTheDocument();
    });

    it("should have 'Chọn Ly Này' button", () => {
      render(<DrinkCard drink={mockDrink} cardType="PERFECT_MATCH" isActive={true} onSelect={onSelect} />);
      expect(screen.getByText("Chọn Ly Này")).toBeInTheDocument();
    });

    it("should call onSelect when 'Chọn Ly Này' is clicked", () => {
      render(<DrinkCard drink={mockDrink} cardType="PERFECT_MATCH" isActive={true} onSelect={onSelect} />);
      fireEvent.click(screen.getByText("Chọn Ly Này"));
      expect(onSelect).toHaveBeenCalledTimes(1);
    });
  });
});
