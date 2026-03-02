export type ModuleCategory = "BASE" | "FLAVOR" | "FUNCTION" | "TEXTURE";

export type OrderStatus = "PENDING" | "PREPARING" | "COMPLETED" | "CANCELLED";

export type CardType = "PERFECT_MATCH" | "PLOT_TWIST" | "SAFE_TREND";

export type AnswerValue = "A" | "B" | "C";

export interface QuestionAnswer {
  label: string;
  value: AnswerValue;
  logicMapping: string; // module name reference
}

export interface QuestionData {
  id: string;
  stepNumber: number;
  themeId: string;
  questionText: string;
  answers: QuestionAnswer[];
}

export interface ModuleData {
  id: string;
  category: ModuleCategory;
  name: string;
  nameVi: string;
  stockQuantity: number;
  unit: string;
  deductionRate: number;
  alertThreshold: number;
  isActive: boolean;
}

export interface DrinkCombo {
  base: ModuleData;
  flavor: ModuleData;
  function: ModuleData;
  texture: ModuleData;
  generatedName: string;
  generatedNameVi: string;
  recipe: RecipeStep[];
}

export interface RecipeStep {
  action: string;
  ingredient: string;
  amount: string;
}

export interface QuizAnswers {
  step1: AnswerValue; // Base Layer
  step2: AnswerValue; // Flavor Core
  step3: AnswerValue; // Functional Add-in
  step4: AnswerValue; // Texture/Topping
  step5: AnswerValue; // Risk Tolerance
}

export interface RecommendationResult {
  perfectMatch: DrinkCombo;
  plotTwist: DrinkCombo;
  safeTrend: DrinkCombo;
}

export interface MoodTag {
  step: number;
  answer: AnswerValue;
  theme: string;
  label: string;
}

export interface OrderCreatePayload {
  customerId?: string;
  cardChosen: CardType;
  drink: DrinkCombo;
  moodTags: MoodTag[];
}

export interface CustomerProfile {
  id: string;
  name?: string;
  dob?: string;
  zodiacSign?: string;
}

export interface AnalyticsData {
  totalOrders: number;
  todayOrders: number;
  moodDistribution: { mood: string; count: number }[];
  cardPreference: { card: string; count: number }[];
  topCombos: { name: string; count: number }[];
  moduleUsage: { name: string; category: string; count: number }[];
  revenueByDay: { date: string; revenue: number }[];
}
