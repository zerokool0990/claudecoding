/**
 * Test: ProfilePopup Component
 * PRD Section 1.3: Optional Profiling & Value Exchange
 * - Pop-up/Bottom Sheet xuất hiện nhẹ nhàng
 * - Nút "Bỏ qua / Lần sau nhé" thật rõ ràng
 * - Trường nhập: Tên/Biệt danh (optional) & Ngày sinh (optional)
 * - Copywriting: "Vũ trụ đã ghi nhận 'vibe' của bạn..."
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProfilePopup from "@/components/results/ProfilePopup";

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
  X: (props: any) => React.createElement("svg", { ...props, "data-testid": "x-icon" }),
}));

describe("ProfilePopup - PRD 1.3: Optional Profiling", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    onSkip: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render when isOpen is false", () => {
    render(<ProfilePopup {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(/Vũ trụ đã ghi nhận/)).not.toBeInTheDocument();
  });

  it("should render when isOpen is true", () => {
    render(<ProfilePopup {...defaultProps} />);
    expect(screen.getByText(/Vũ trụ đã ghi nhận/)).toBeInTheDocument();
  });

  describe("PRD 1.3 Copywriting", () => {
    it("should display the cosmic theme header 🔮", () => {
      render(<ProfilePopup {...defaultProps} />);
      expect(screen.getByText("🔮")).toBeInTheDocument();
    });

    it("should display main message matching PRD copywriting", () => {
      render(<ProfilePopup {...defaultProps} />);
      // PRD: "Vũ trụ đã ghi nhận 'vibe' của bạn hôm nay 🔮..."
      expect(screen.getByText(/Vũ trụ đã ghi nhận/)).toBeInTheDocument();
    });

    it("should mention birthday gift motivation", () => {
      render(<ProfilePopup {...defaultProps} />);
      expect(screen.getByText(/quà bí mật cho sinh nhật/)).toBeInTheDocument();
    });
  });

  describe("PRD 1.3 Form Fields", () => {
    it("should have Tên/Biệt danh input field (optional)", () => {
      render(<ProfilePopup {...defaultProps} />);
      expect(screen.getByText("Tên / Biệt danh")).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/VD: Minh/)).toBeInTheDocument();
    });

    it("should have Ngày sinh input field (optional)", () => {
      render(<ProfilePopup {...defaultProps} />);
      expect(screen.getByText(/Ngày sinh/)).toBeInTheDocument();
    });

    it("should allow typing name", () => {
      render(<ProfilePopup {...defaultProps} />);
      const nameInput = screen.getByPlaceholderText(/VD: Minh/) as HTMLInputElement;
      fireEvent.change(nameInput, { target: { value: "Bé Mochi" } });
      expect(nameInput.value).toBe("Bé Mochi");
    });

    it("should allow setting date of birth", () => {
      const { container } = render(<ProfilePopup {...defaultProps} />);
      const dateInputs = container.querySelectorAll('input[type="date"]');
      expect(dateInputs.length).toBeGreaterThan(0);
    });
  });

  describe("PRD 1.3: Non-intrusive UX", () => {
    it("should have 'Lưu thông tin' submit button", () => {
      render(<ProfilePopup {...defaultProps} />);
      expect(screen.getByText("Lưu thông tin")).toBeInTheDocument();
    });

    it("should have clear 'Bỏ qua / Lần sau nhé' skip button", () => {
      render(<ProfilePopup {...defaultProps} />);
      expect(screen.getByText("Bỏ qua / Lần sau nhé")).toBeInTheDocument();
    });

    it("should call onSkip when skip button is clicked", () => {
      render(<ProfilePopup {...defaultProps} />);
      fireEvent.click(screen.getByText("Bỏ qua / Lần sau nhé"));
      expect(defaultProps.onSkip).toHaveBeenCalledTimes(1);
    });

    it("should call onSubmit with form data when submit button clicked", () => {
      render(<ProfilePopup {...defaultProps} />);
      const nameInput = screen.getByPlaceholderText(/VD: Minh/);
      fireEvent.change(nameInput, { target: { value: "Minh" } });
      fireEvent.click(screen.getByText("Lưu thông tin"));
      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        name: "Minh",
        dob: undefined,
      });
    });

    it("should call onSubmit with undefined name when empty", () => {
      render(<ProfilePopup {...defaultProps} />);
      fireEvent.click(screen.getByText("Lưu thông tin"));
      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        name: undefined,
        dob: undefined,
      });
    });

    it("should have close (X) button", () => {
      render(<ProfilePopup {...defaultProps} />);
      expect(screen.getByTestId("x-icon")).toBeInTheDocument();
    });

    it("should call onClose when close button clicked", () => {
      render(<ProfilePopup {...defaultProps} />);
      const closeButton = screen.getByTestId("x-icon").closest("button");
      if (closeButton) {
        fireEvent.click(closeButton);
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
      }
    });
  });
});
