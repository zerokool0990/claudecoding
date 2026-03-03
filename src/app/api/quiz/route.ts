import { NextRequest, NextResponse } from "next/server";
import { QUESTIONS } from "@/lib/data/static-data";

// GET /api/quiz - Get random questions for a quiz session
export async function GET(request: NextRequest) {
  try {
    const customerId = request.nextUrl.searchParams.get("customerId");

    // Determine preferred theme
    let preferredTheme: string | null = null;

    if (customerId) {
      // On serverless, skip customer lookup (birthday theme is a nice-to-have)
      preferredTheme = null;
    }

    // Group questions by step
    const byStep: Record<number, typeof QUESTIONS> = {};
    for (const q of QUESTIONS) {
      if (!byStep[q.stepNumber]) byStep[q.stepNumber] = [];
      byStep[q.stepNumber].push(q);
    }

    // Pick one random question per step
    const selectedQuestions = [];
    for (let step = 1; step <= 5; step++) {
      const stepQuestions = byStep[step] || [];
      if (stepQuestions.length === 0) continue;

      let selected;
      if (preferredTheme) {
        selected = stepQuestions.find((q) => q.themeId === preferredTheme);
      }
      if (!selected) {
        selected = stepQuestions[Math.floor(Math.random() * stepQuestions.length)];
      }

      selectedQuestions.push({
        id: selected.id,
        stepNumber: selected.stepNumber,
        themeId: selected.themeId,
        questionText: selected.questionText,
        answers: JSON.parse(selected.answers),
      });
    }

    return NextResponse.json({
      questions: selectedQuestions,
      themeId: selectedQuestions[0]?.themeId || "random",
    });
  } catch (error) {
    console.error("Quiz API error:", error);
    return NextResponse.json(
      { error: "Failed to load quiz" },
      { status: 500 }
    );
  }
}
