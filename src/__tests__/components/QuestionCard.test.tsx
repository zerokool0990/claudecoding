/**
 * Test: QuestionCard Component
 * PRD Section 1.1: 5-Question Quiz with themed gradients
 * UI: Each step has a unique gradient background, 3 answer options (A/B/C)
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QuestionCard from "@/components/quiz/QuestionCard";

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

const defaultProps = {
  stepNumber: 1,
  questionText: "Tình trạng pin của giao diện bạn hôm nay thế nào?",
  answers: [
    { label: "Đang thở oxy cần sạc gấp", value: "A" as const, logicMapping: "base-tra-den" },
    { label: "50% bình ổn", value: "B" as const, logicMapping: "base-oolong" },
    { label: "100% sẵn sàng quẩy đục nước", value: "C" as const, logicMapping: "base-nuoc-dua" },
  ],
  onAnswer: jest.fn(),
};

describe("QuestionCard - PRD 1.1", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the question text", () => {
    render(<QuestionCard {...defaultProps} />);
    expect(screen.getByText("Tình trạng pin của giao diện bạn hôm nay thế nào?")).toBeInTheDocument();
  });

  it("should display step indicator 'Bước X/5'", () => {
    render(<QuestionCard {...defaultProps} />);
    expect(screen.getByText(/Bước 1\/5/)).toBeInTheDocument();
  });

  it("should display step label 'Năng Lượng' for step 1", () => {
    render(<QuestionCard {...defaultProps} />);
    expect(screen.getByText(/Năng Lượng/)).toBeInTheDocument();
  });

  it("should render all 3 answer options (A, B, C)", () => {
    render(<QuestionCard {...defaultProps} />);
    expect(screen.getByText("Đang thở oxy cần sạc gấp")).toBeInTheDocument();
    expect(screen.getByText("50% bình ổn")).toBeInTheDocument();
    expect(screen.getByText("100% sẵn sàng quẩy đục nước")).toBeInTheDocument();
  });

  it("should display answer value labels (A, B, C)", () => {
    render(<QuestionCard {...defaultProps} />);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
  });

  it("should call onAnswer when clicking an answer", () => {
    render(<QuestionCard {...defaultProps} />);
    fireEvent.click(screen.getByText("50% bình ổn"));
    expect(defaultProps.onAnswer).toHaveBeenCalledWith("B");
  });

  it("should call onAnswer with 'A' for first option", () => {
    render(<QuestionCard {...defaultProps} />);
    fireEvent.click(screen.getByText("Đang thở oxy cần sạc gấp"));
    expect(defaultProps.onAnswer).toHaveBeenCalledWith("A");
  });

  it("should call onAnswer with 'C' for third option", () => {
    render(<QuestionCard {...defaultProps} />);
    fireEvent.click(screen.getByText("100% sẵn sàng quẩy đục nước"));
    expect(defaultProps.onAnswer).toHaveBeenCalledWith("C");
  });

  it("should highlight selected answer", () => {
    render(<QuestionCard {...defaultProps} selectedAnswer="B" />);
    // The selected button should have white bg (bg-white)
    const buttons = screen.getAllByRole("button");
    // Button with "B" should be highlighted
    expect(buttons[1].className).toContain("bg-white");
  });

  it("should render step 2 with label 'Hương Vị'", () => {
    render(
      <QuestionCard
        {...defaultProps}
        stepNumber={2}
        questionText="Nếu hôm nay diện một outfit, bạn sẽ chọn style nào?"
        answers={[
          { label: "Dark Academia trầm mặc", value: "A", logicMapping: "flavor-vanilla" },
          { label: "Y2K rực rỡ chói lọi", value: "B", logicMapping: "flavor-yuzu" },
          { label: "Cottagecore trong trẻo", value: "C", logicMapping: "flavor-vai" },
        ]}
      />
    );
    expect(screen.getByText(/Hương Vị/)).toBeInTheDocument();
  });

  it("should render step 3 with label 'Chức Năng'", () => {
    render(<QuestionCard {...defaultProps} stepNumber={3} />);
    expect(screen.getByText(/Chức Năng/)).toBeInTheDocument();
  });

  it("should render step 4 with label 'Xúc Giác'", () => {
    render(<QuestionCard {...defaultProps} stepNumber={4} />);
    expect(screen.getByText(/Xúc Giác/)).toBeInTheDocument();
  });

  it("should render step 5 with label 'Mạo Hiểm'", () => {
    render(<QuestionCard {...defaultProps} stepNumber={5} />);
    expect(screen.getByText(/Mạo Hiểm/)).toBeInTheDocument();
  });
});
