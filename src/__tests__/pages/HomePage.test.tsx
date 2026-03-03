/**
 * Test: Home Page
 * PRD: Landing page with gamification branding
 * UI: Gradient background, CTA to start quiz, admin/POS links
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

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

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href, ...props }: any) =>
    React.createElement("a", { href, ...props }, children);
});

// Mock lucide-react
jest.mock("lucide-react", () => ({
  Sparkles: (props: any) => React.createElement("svg", { ...props, "data-testid": "sparkles-icon" }),
  BarChart3: (props: any) => React.createElement("svg", { ...props, "data-testid": "barchart-icon" }),
  Coffee: (props: any) => React.createElement("svg", { ...props, "data-testid": "coffee-icon" }),
}));

describe("HomePage - Landing Page", () => {
  it("should render the app name 'AI Drink'", () => {
    render(<HomePage />);
    expect(screen.getByText("AI Drink")).toBeInTheDocument();
  });

  it("should display tagline 'Đồ Uống Cá Nhân Hóa'", () => {
    render(<HomePage />);
    expect(screen.getByText("Đồ Uống Cá Nhân Hóa")).toBeInTheDocument();
  });

  it("should display description about 5 questions", () => {
    render(<HomePage />);
    expect(screen.getByText(/5 câu hỏi vui/)).toBeInTheDocument();
  });

  it("should have 'Bắt Đầu Khám Phá' CTA button linking to /quiz", () => {
    render(<HomePage />);
    const cta = screen.getByText("Bắt Đầu Khám Phá");
    expect(cta).toBeInTheDocument();
    const link = cta.closest("a");
    expect(link?.getAttribute("href")).toBe("/quiz");
  });

  it("should have Admin Dashboard link to /admin", () => {
    render(<HomePage />);
    const adminLink = screen.getByText("Admin Dashboard").closest("a");
    expect(adminLink?.getAttribute("href")).toBe("/admin");
  });

  it("should have Barista POS link to /pos", () => {
    render(<HomePage />);
    const posLink = screen.getByText("Barista POS").closest("a");
    expect(posLink?.getAttribute("href")).toBe("/pos");
  });

  it("should display the drink emoji logo 🧋", () => {
    render(<HomePage />);
    expect(screen.getByText("🧋")).toBeInTheDocument();
  });
});
