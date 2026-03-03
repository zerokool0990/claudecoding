/**
 * Test: Results Page
 * PRD Section 1.2: 3-Card Carousel Display
 * - Display 3 drink cards (swipeable)
 * - ProfilePopup after card selection
 * - Order placement
 * - Success confirmation screen
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import type { ModuleData, DrinkCombo, RecommendationResult } from "@/types";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

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
  AnimatePresence: ({ children }: any) => children,
}));

// Mock lucide-react
jest.mock("lucide-react", () => ({
  ArrowLeft: (props: any) => React.createElement("svg", { ...props, "data-testid": "arrow-left" }),
  ChevronLeft: (props: any) => React.createElement("svg", { ...props, "data-testid": "chevron-left" }),
  ChevronRight: (props: any) => React.createElement("svg", { ...props, "data-testid": "chevron-right" }),
  Check: (props: any) => React.createElement("svg", { ...props, "data-testid": "check-icon" }),
  Loader2: (props: any) => React.createElement("svg", { ...props, "data-testid": "loader" }),
  Sparkles: (props: any) => React.createElement("svg", { ...props, "data-testid": "sparkles-icon" }),
  Shuffle: (props: any) => React.createElement("svg", { ...props, "data-testid": "shuffle-icon" }),
  Shield: (props: any) => React.createElement("svg", { ...props, "data-testid": "shield-icon" }),
  X: (props: any) => React.createElement("svg", { ...props, "data-testid": "x-icon" }),
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

function mockDrinkCombo(overrides: Partial<DrinkCombo> = {}): DrinkCombo {
  return {
    base: mockModule({ id: "base-tra-den" }),
    flavor: mockModule({ id: "flavor-vanilla", category: "FLAVOR", nameVi: "Syrup Vanilla" }),
    function: mockModule({ id: "func-theanine", category: "FUNCTION", nameVi: "L-Theanine" }),
    texture: mockModule({ id: "texture-milk-foam", category: "TEXTURE", nameVi: "Milk Foam" }),
    generatedName: "Black Tea Vanilla Foam",
    generatedNameVi: "Trà Đen Vanilla Cream",
    recipe: [],
    ...overrides,
  };
}

const mockRecommendations: RecommendationResult = {
  perfectMatch: mockDrinkCombo({ generatedNameVi: "Trà Đen Vanilla Cream Trầm Lắng" }),
  plotTwist: mockDrinkCombo({ generatedNameVi: "Trà Đen Yuzu Cream Twist" }),
  safeTrend: mockDrinkCombo({ generatedNameVi: "Trà Đen Best Seller" }),
};

// Store mock
const mockSelectCard = jest.fn();
const mockSetCustomerId = jest.fn();
let mockStoreState: any = {
  recommendations: mockRecommendations,
  moodTags: [],
  selectCard: mockSelectCard,
  setCustomerId: mockSetCustomerId,
};

jest.mock("@/store/quizStore", () => ({
  useQuizStore: () => mockStoreState,
}));

global.fetch = jest.fn();

import ResultsPage from "@/app/results/page";

describe("ResultsPage - PRD 1.2: Result Display", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStoreState = {
      recommendations: mockRecommendations,
      moodTags: [],
      selectCard: mockSelectCard,
      setCustomerId: mockSetCustomerId,
    };
  });

  describe("No recommendations state", () => {
    it("should show fallback when no recommendations", () => {
      mockStoreState.recommendations = null;
      render(<ResultsPage />);
      expect(screen.getByText("Chưa có kết quả. Hãy thử lại.")).toBeInTheDocument();
    });

    it("should have 'Quay lại Quiz' button when no recommendations", () => {
      mockStoreState.recommendations = null;
      render(<ResultsPage />);
      expect(screen.getByText("Quay lại Quiz")).toBeInTheDocument();
    });
  });

  describe("3-Card Carousel (PRD 1.2)", () => {
    it("should display header 'Đồ Uống Của Bạn'", () => {
      render(<ResultsPage />);
      expect(screen.getByText("Đồ Uống Của Bạn")).toBeInTheDocument();
    });

    it("should display swipe instruction 'Vuốt để xem 3 lựa chọn'", () => {
      render(<ResultsPage />);
      expect(screen.getByText("Vuốt để xem 3 lựa chọn")).toBeInTheDocument();
    });

    it("should display 3 card labels: Perfect Match, Plot Twist, Safe Trend", () => {
      render(<ResultsPage />);
      expect(screen.getByText("Perfect Match")).toBeInTheDocument();
      expect(screen.getByText("Plot Twist")).toBeInTheDocument();
      expect(screen.getByText("Safe Trend")).toBeInTheDocument();
    });

    it("should display 3 navigation dots", () => {
      const { container } = render(<ResultsPage />);
      const dots = container.querySelectorAll(".rounded-full.h-2");
      expect(dots).toHaveLength(3);
    });

    it("should show first card (Perfect Match) by default", () => {
      render(<ResultsPage />);
      expect(screen.getByText("Trà Đen Vanilla Cream Trầm Lắng")).toBeInTheDocument();
    });

    it("should navigate to next card when clicking label", () => {
      render(<ResultsPage />);
      fireEvent.click(screen.getByText("Plot Twist"));
      expect(screen.getByText("Trà Đen Yuzu Cream Twist")).toBeInTheDocument();
    });
  });

  describe("ProfilePopup integration (PRD 1.3)", () => {
    it("should show profile popup after selecting a drink", () => {
      render(<ResultsPage />);
      fireEvent.click(screen.getByText("Chọn Ly Này"));
      expect(screen.getByText(/Vũ trụ đã ghi nhận/)).toBeInTheDocument();
    });

    it("should have skip option in profile popup", () => {
      render(<ResultsPage />);
      fireEvent.click(screen.getByText("Chọn Ly Này"));
      expect(screen.getByText("Bỏ qua / Lần sau nhé")).toBeInTheDocument();
    });
  });
});
