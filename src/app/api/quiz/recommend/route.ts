import { NextRequest, NextResponse } from "next/server";
import { getRecommendations } from "@/lib/recommendation/engine";
import type { QuizAnswers } from "@/types";

// POST /api/quiz/recommend - Get drink recommendations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers, customerId } = body as {
      answers: QuizAnswers;
      customerId?: string;
    };

    if (!answers?.step1 || !answers?.step2 || !answers?.step3 || !answers?.step4 || !answers?.step5) {
      return NextResponse.json(
        { error: "All 5 answers are required" },
        { status: 400 }
      );
    }

    const recommendations = await getRecommendations(answers, customerId);

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Recommend API error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
