/**
 * Test: Quiz Page
 * PRD Section 1.1: 5-Question Mood-Mapping Quiz
 * - Load random questions from API
 * - Auto-advance after selection
 * - Back navigation
 * - Loading states
 * - Get recommendations after step 5
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

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
  Loader2: (props: any) => React.createElement("svg", { ...props, "data-testid": "loader" }),
}));

// Mock quizStore
const mockReset = jest.fn();
const mockSetQuestions = jest.fn();
const mockSetAnswer = jest.fn();
const mockNextStep = jest.fn();
const mockPrevStep = jest.fn();
const mockSetLoading = jest.fn();
const mockSetRecommendations = jest.fn();
const mockAddMoodTag = jest.fn();

let mockStoreState = {
  currentStep: 1,
  answers: {},
  questions: [] as any[],
  isLoading: true,
  setQuestions: mockSetQuestions,
  setAnswer: mockSetAnswer,
  nextStep: mockNextStep,
  prevStep: mockPrevStep,
  setLoading: mockSetLoading,
  setRecommendations: mockSetRecommendations,
  addMoodTag: mockAddMoodTag,
  reset: mockReset,
};

jest.mock("@/store/quizStore", () => ({
  useQuizStore: () => mockStoreState,
}));

// Mock fetch
global.fetch = jest.fn();

// Import after mocks
import QuizPage from "@/app/quiz/page";

describe("QuizPage - PRD 1.1: Quiz Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStoreState = {
      currentStep: 1,
      answers: {},
      questions: [],
      isLoading: true,
      setQuestions: mockSetQuestions,
      setAnswer: mockSetAnswer,
      nextStep: mockNextStep,
      prevStep: mockPrevStep,
      setLoading: mockSetLoading,
      setRecommendations: mockSetRecommendations,
      addMoodTag: mockAddMoodTag,
      reset: mockReset,
    };
  });

  it("should show loading state while fetching questions", () => {
    render(<QuizPage />);
    expect(screen.getByText("Đang chuẩn bị câu hỏi...")).toBeInTheDocument();
  });

  it("should call reset on mount for fresh session", () => {
    render(<QuizPage />);
    expect(mockReset).toHaveBeenCalled();
  });

  it("should fetch questions from /api/quiz on mount", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({
        questions: [
          {
            id: "q1",
            stepNumber: 1,
            themeId: "os",
            questionText: "Tình trạng pin?",
            answers: [
              { label: "Cần sạc", value: "A", logicMapping: "base-tra-den" },
              { label: "Bình ổn", value: "B", logicMapping: "base-oolong" },
              { label: "Full", value: "C", logicMapping: "base-nuoc-dua" },
            ],
          },
        ],
      }),
    });

    render(<QuizPage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/quiz");
    });
  });

  it("should show recommendation loading state after step 5", () => {
    mockStoreState.currentStep = 6;
    mockStoreState.isLoading = true;
    mockStoreState.questions = [{ id: "q1", stepNumber: 6, themeId: "os", questionText: "", answers: [] }];

    render(<QuizPage />);
    expect(screen.getByText("Đang pha chế công thức...")).toBeInTheDocument();
    expect(screen.getByText("Vũ trụ đang mix ly nước cho bạn")).toBeInTheDocument();
  });
});
