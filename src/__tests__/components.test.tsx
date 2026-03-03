import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...domProps } = props;
      return <div {...domProps}>{children}</div>;
    },
    button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...domProps } = props;
      return <button {...domProps}>{children}</button>;
    },
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Sparkles: () => <span data-testid="icon-sparkles" />,
  Shuffle: () => <span data-testid="icon-shuffle" />,
  Shield: () => <span data-testid="icon-shield" />,
  X: () => <span data-testid="icon-x" />,
}));

import ProgressBar from "@/components/quiz/ProgressBar";
import QuestionCard from "@/components/quiz/QuestionCard";
import DrinkCard from "@/components/results/DrinkCard";
import ProfilePopup from "@/components/results/ProfilePopup";
import type { DrinkCombo } from "@/types";

// ============ ProgressBar Tests ============
describe("ProgressBar", () => {
  it("renders step dots for total steps", () => {
    const { container } = render(<ProgressBar current={2} total={5} />);
    const dots = container.querySelectorAll("[class*='rounded-full']");
    // There should be dots representing steps (the outer bar is also rounded-full)
    expect(dots.length).toBeGreaterThanOrEqual(5);
  });

  it("renders with current step highlighted", () => {
    const { container } = render(<ProgressBar current={3} total={5} />);
    // The component should render without error
    expect(container.firstChild).toBeTruthy();
  });

  it("renders progress bar structure correctly", () => {
    const { container } = render(<ProgressBar current={3} total={5} />);
    // Progress bar should have the outer track and inner fill
    const track = container.querySelector(".h-1.bg-white\\/20");
    expect(track).toBeTruthy();
    const fill = track?.querySelector(".h-full.bg-white");
    expect(fill).toBeTruthy();
  });
});

// ============ QuestionCard Tests ============
describe("QuestionCard", () => {
  const defaultProps = {
    stepNumber: 1,
    questionText: "Bạn thích hệ điều hành nào nhất?",
    answers: [
      { label: "Windows — ổn định, quen thuộc", value: "A" as const, logicMapping: "base-tra-den" },
      { label: "macOS — tinh tế, mượt mà", value: "B" as const, logicMapping: "base-oolong" },
      { label: "Linux — tự do, phá cách", value: "C" as const, logicMapping: "base-nuoc-dua" },
    ],
    onAnswer: vi.fn(),
  };

  it("renders question text", () => {
    render(<QuestionCard {...defaultProps} />);
    expect(screen.getByText(defaultProps.questionText)).toBeInTheDocument();
  });

  it("renders all 3 answer options", () => {
    render(<QuestionCard {...defaultProps} />);
    expect(screen.getByText("Windows — ổn định, quen thuộc")).toBeInTheDocument();
    expect(screen.getByText("macOS — tinh tế, mượt mà")).toBeInTheDocument();
    expect(screen.getByText("Linux — tự do, phá cách")).toBeInTheDocument();
  });

  it("renders step indicator", () => {
    render(<QuestionCard {...defaultProps} />);
    expect(screen.getByText(/Bước 1\/5/)).toBeInTheDocument();
    expect(screen.getByText(/Năng Lượng/)).toBeInTheDocument();
  });

  it("calls onAnswer when an option is clicked", () => {
    const onAnswer = vi.fn();
    render(<QuestionCard {...defaultProps} onAnswer={onAnswer} />);

    fireEvent.click(screen.getByText("Windows — ổn định, quen thuộc"));
    expect(onAnswer).toHaveBeenCalledWith("A");
  });

  it("calls onAnswer with correct value for each option", () => {
    const onAnswer = vi.fn();
    render(<QuestionCard {...defaultProps} onAnswer={onAnswer} />);

    fireEvent.click(screen.getByText("macOS — tinh tế, mượt mà"));
    expect(onAnswer).toHaveBeenCalledWith("B");

    fireEvent.click(screen.getByText("Linux — tự do, phá cách"));
    expect(onAnswer).toHaveBeenCalledWith("C");
  });

  it("highlights selected answer", () => {
    render(<QuestionCard {...defaultProps} selectedAnswer="B" />);
    // The selected button should have different styling (bg-white)
    const buttons = screen.getAllByRole("button");
    const selectedButton = buttons.find((b) => b.textContent?.includes("macOS"));
    expect(selectedButton?.className).toContain("bg-white");
  });

  it("renders different step labels for different steps", () => {
    render(<QuestionCard {...defaultProps} stepNumber={3} />);
    expect(screen.getByText(/Bước 3\/5/)).toBeInTheDocument();
    expect(screen.getByText(/Chức Năng/)).toBeInTheDocument();
  });

  it("renders answer value badges (A, B, C)", () => {
    render(<QuestionCard {...defaultProps} />);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
  });
});

// ============ DrinkCard Tests ============
describe("DrinkCard", () => {
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
    recipe: [{ action: "Chuẩn bị", ingredient: "Trà Đen", amount: "200ml" }],
  };

  it("renders drink Vietnamese name", () => {
    render(
      <DrinkCard drink={mockDrink} cardType="PERFECT_MATCH" isActive={true} onSelect={vi.fn()} />
    );
    expect(screen.getByText("Trà Đen Yuzu Mochi Tỏa Sáng")).toBeInTheDocument();
  });

  it("renders drink English name", () => {
    render(
      <DrinkCard drink={mockDrink} cardType="PERFECT_MATCH" isActive={true} onSelect={vi.fn()} />
    );
    expect(screen.getByText("Black Tea Yuzu Mochi")).toBeInTheDocument();
  });

  it("renders ingredient details", () => {
    render(
      <DrinkCard drink={mockDrink} cardType="PERFECT_MATCH" isActive={true} onSelect={vi.fn()} />
    );
    expect(screen.getByText("Trà Đen")).toBeInTheDocument();
    expect(screen.getByText("Yuzu")).toBeInTheDocument();
    expect(screen.getByText("Collagen")).toBeInTheDocument();
    expect(screen.getByText("Mochi")).toBeInTheDocument();
  });

  it("shows correct card title for PERFECT_MATCH", () => {
    render(
      <DrinkCard drink={mockDrink} cardType="PERFECT_MATCH" isActive={true} onSelect={vi.fn()} />
    );
    expect(screen.getByText("The Perfect Match")).toBeInTheDocument();
  });

  it("shows correct card title for PLOT_TWIST", () => {
    render(
      <DrinkCard drink={mockDrink} cardType="PLOT_TWIST" isActive={true} onSelect={vi.fn()} />
    );
    expect(screen.getByText("The Plot Twist")).toBeInTheDocument();
  });

  it("shows correct card title for SAFE_TREND", () => {
    render(
      <DrinkCard drink={mockDrink} cardType="SAFE_TREND" isActive={true} onSelect={vi.fn()} />
    );
    expect(screen.getByText("The Safe Trend")).toBeInTheDocument();
  });

  it("calls onSelect when button clicked", () => {
    const onSelect = vi.fn();
    render(
      <DrinkCard drink={mockDrink} cardType="PERFECT_MATCH" isActive={true} onSelect={onSelect} />
    );
    fireEvent.click(screen.getByText("Chọn Ly Này"));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("displays price 45.000đ", () => {
    render(
      <DrinkCard drink={mockDrink} cardType="PERFECT_MATCH" isActive={true} onSelect={vi.fn()} />
    );
    expect(screen.getByText("45.000đ")).toBeInTheDocument();
  });

  it("displays category labels in Vietnamese", () => {
    render(
      <DrinkCard drink={mockDrink} cardType="PERFECT_MATCH" isActive={true} onSelect={vi.fn()} />
    );
    expect(screen.getByText("Cốt nền")).toBeInTheDocument();
    expect(screen.getByText("Hương vị")).toBeInTheDocument();
    expect(screen.getByText("Chức năng")).toBeInTheDocument();
    expect(screen.getByText("Kết cấu")).toBeInTheDocument();
  });
});

// ============ ProfilePopup Tests ============
describe("ProfilePopup", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    onSkip: vi.fn(),
  };

  it("renders when isOpen is true", () => {
    render(<ProfilePopup {...defaultProps} />);
    expect(screen.getByText(/Vũ trụ đã ghi nhận/)).toBeInTheDocument();
  });

  it("does NOT render when isOpen is false", () => {
    render(<ProfilePopup {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(/Vũ trụ đã ghi nhận/)).not.toBeInTheDocument();
  });

  it("renders name input field", () => {
    render(<ProfilePopup {...defaultProps} />);
    expect(screen.getByPlaceholderText(/Minh/)).toBeInTheDocument();
  });

  it("renders DOB input field", () => {
    render(<ProfilePopup {...defaultProps} />);
    expect(screen.getByText("Ngày sinh (cho quà sinh nhật)")).toBeInTheDocument();
  });

  it("calls onSubmit with form data when submit button clicked", () => {
    const onSubmit = vi.fn();
    render(<ProfilePopup {...defaultProps} onSubmit={onSubmit} />);

    const nameInput = screen.getByPlaceholderText(/Minh/);
    fireEvent.change(nameInput, { target: { value: "Bé Mochi" } });

    fireEvent.click(screen.getByText("Lưu thông tin"));
    expect(onSubmit).toHaveBeenCalledWith({
      name: "Bé Mochi",
      dob: undefined,
    });
  });

  it("calls onSkip when skip button clicked", () => {
    const onSkip = vi.fn();
    render(<ProfilePopup {...defaultProps} onSkip={onSkip} />);

    fireEvent.click(screen.getByText("Bỏ qua / Lần sau nhé"));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it("calls onSubmit with undefined name when field is empty", () => {
    const onSubmit = vi.fn();
    render(<ProfilePopup {...defaultProps} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByText("Lưu thông tin"));
    expect(onSubmit).toHaveBeenCalledWith({
      name: undefined,
      dob: undefined,
    });
  });

  it("renders heading and description text", () => {
    render(<ProfilePopup {...defaultProps} />);
    expect(screen.getByText(/quà bí mật cho sinh nhật/)).toBeInTheDocument();
  });
});
