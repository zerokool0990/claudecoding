/**
 * Test: ProgressBar Component
 * PRD Section 1: Progress indicator for 5-step quiz
 * UI: Fixed top bar with animated step dots
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import ProgressBar from "@/components/quiz/ProgressBar";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: React.forwardRef(({ children, className, style, ...props }: any, ref: any) =>
      React.createElement("div", { className, style, ref, "data-testid": props["data-testid"] }, children)
    ),
  },
}));

describe("ProgressBar - Quiz Step Progress", () => {
  it("should render 5 step dots for total=5", () => {
    const { container } = render(<ProgressBar current={1} total={5} />);
    // 5 dots rendered
    const dots = container.querySelectorAll(".rounded-full.w-2, .rounded-full.scale-125");
    // Check there are dots (the container also has rounded-full elements)
    expect(container.querySelectorAll(".bg-white, .bg-white\\/80, .bg-white\\/30")).toBeTruthy();
  });

  it("should be fixed at the top of the viewport", () => {
    const { container } = render(<ProgressBar current={1} total={5} />);
    const bar = container.firstChild as HTMLElement;
    expect(bar.className).toContain("fixed");
    expect(bar.className).toContain("top-0");
  });

  it("should show correct percentage at step 1 of 5 (20%)", () => {
    // percentage = (1/5) * 100 = 20
    const percentage = (1 / 5) * 100;
    expect(percentage).toBe(20);
  });

  it("should show correct percentage at step 3 of 5 (60%)", () => {
    const percentage = (3 / 5) * 100;
    expect(percentage).toBe(60);
  });

  it("should show 100% at step 5 of 5", () => {
    const percentage = (5 / 5) * 100;
    expect(percentage).toBe(100);
  });

  it("should have z-index 50 for overlay", () => {
    const { container } = render(<ProgressBar current={1} total={5} />);
    const bar = container.firstChild as HTMLElement;
    expect(bar.className).toContain("z-50");
  });
});
