import { create } from "zustand";
import type { AnswerValue, QuestionData, DrinkCombo, RecommendationResult, MoodTag, CardType } from "@/types";

interface QuizState {
  // Quiz state
  currentStep: number;
  answers: Record<number, AnswerValue>;
  questions: QuestionData[];
  themeId: string;
  isLoading: boolean;

  // Results
  recommendations: RecommendationResult | null;
  selectedCard: CardType | null;
  selectedDrink: DrinkCombo | null;
  moodTags: MoodTag[];

  // Customer
  customerId: string | null;

  // Actions
  setQuestions: (questions: QuestionData[]) => void;
  setThemeId: (themeId: string) => void;
  setAnswer: (step: number, answer: AnswerValue) => void;
  nextStep: () => void;
  prevStep: () => void;
  setRecommendations: (recs: RecommendationResult) => void;
  selectCard: (card: CardType, drink: DrinkCombo) => void;
  setCustomerId: (id: string) => void;
  setLoading: (loading: boolean) => void;
  addMoodTag: (tag: MoodTag) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  currentStep: 1,
  answers: {},
  questions: [],
  themeId: "",
  isLoading: false,
  recommendations: null,
  selectedCard: null,
  selectedDrink: null,
  moodTags: [],
  customerId: null,

  setQuestions: (questions) => set({ questions }),
  setThemeId: (themeId) => set({ themeId }),
  setAnswer: (step, answer) =>
    set((state) => ({
      answers: { ...state.answers, [step]: answer },
    })),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(1, state.currentStep - 1),
    })),
  setRecommendations: (recs) => set({ recommendations: recs }),
  selectCard: (card, drink) => set({ selectedCard: card, selectedDrink: drink }),
  setCustomerId: (id) => set({ customerId: id }),
  setLoading: (loading) => set({ isLoading: loading }),
  addMoodTag: (tag) =>
    set((state) => ({ moodTags: [...state.moodTags, tag] })),
  reset: () =>
    set({
      currentStep: 1,
      answers: {},
      questions: [],
      recommendations: null,
      selectedCard: null,
      selectedDrink: null,
      moodTags: [],
      isLoading: false,
    }),
}));
