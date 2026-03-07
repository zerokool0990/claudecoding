"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useQuizStore } from "@/store/quizStore";
import QuestionCard from "@/components/quiz/QuestionCard";
import ProgressBar from "@/components/quiz/ProgressBar";
import { ChevronLeft, Loader2 } from "lucide-react";
import type { AnswerValue } from "@/types";

export default function QuizPage() {
  const router = useRouter();
  const {
    currentStep,
    answers,
    questions,
    isLoading,
    setQuestions,
    setAnswer,
    nextStep,
    prevStep,
    setLoading,
    setRecommendations,
    addMoodTag,
    reset,
  } = useQuizStore();

  // Load questions on mount
  useEffect(() => {
    reset();
    loadQuestions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/quiz");
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data.questions)) {
        setQuestions(data.questions);
      } else {
        console.error("Invalid questions data:", data);
      }
    } catch (error) {
      console.error("Failed to load questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = useCallback(
    async (value: AnswerValue) => {
      setAnswer(currentStep, value);

      const currentQuestion = questions?.find(
        (q) => q.stepNumber === currentStep
      );
      if (currentQuestion) {
        const selectedAnswer = currentQuestion.answers.find(
          (a) => a.value === value
        );
        addMoodTag({
          step: currentStep,
          answer: value,
          theme: currentQuestion.themeId,
          label: selectedAnswer?.label || "",
        });
      }

      // Auto-advance after a short delay
      setTimeout(async () => {
        if (currentStep < 5) {
          nextStep();
        } else {
          // All questions answered - get recommendations
          setLoading(true);
          try {
            const finalAnswers: Record<number, AnswerValue> = {
              ...answers,
              [currentStep]: value,
            };
            const quizAnswers = {
              step1: finalAnswers[1],
              step2: finalAnswers[2],
              step3: finalAnswers[3],
              step4: finalAnswers[4],
              step5: finalAnswers[5] || value,
            };

            const res = await fetch("/api/quiz/recommend", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ answers: quizAnswers }),
            });
            const recs = await res.json();
            setRecommendations(recs);
            router.push("/results");
          } catch (error) {
            console.error("Failed to get recommendations:", error);
          } finally {
            setLoading(false);
          }
        }
      }, 400);
    },
    [currentStep, questions, answers, nextStep, setAnswer, addMoodTag, setLoading, setRecommendations, router]
  );

  const currentQuestion = questions?.find((q) => q.stepNumber === currentStep);

  // Loading screen — questions not yet fetched
  if (isLoading && (!questions || questions.length === 0)) {
    return (
      <div className="min-h-screen bg-[#fef9f0] flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Loader2 className="w-10 h-10 text-[#8b5cf6] animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-medium">Đang tải câu hỏi...</p>
        </motion.div>
      </div>
    );
  }

  // Generating recommendations overlay — after step 5 answered
  if (isLoading && currentStep >= 5) {
    return (
      <div className="min-h-screen bg-[#fef9f0] flex items-center justify-center">
        <motion.div
          className="text-center px-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 bg-[#ede9fe] rounded-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-9 h-9 text-[#8b5cf6]" />
          </motion.div>

          <motion.p
            className="text-gray-800 text-lg font-display font-bold mb-2"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            Đang pha chế công thức riêng cho bạn... 🔮
          </motion.p>

          <p className="text-gray-400 text-sm">Vũ trụ đang mix ly nước hoàn hảo</p>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-[#fef9f0] relative">
      {/* Progress bar — fixed top */}
      <ProgressBar currentStep={currentStep} />

      {/* Desktop: centered content area with top padding for ProgressBar */}
      <div className="pt-[80px] md:pt-[90px] md:px-6 md:pb-12 md:flex md:justify-center">
        <div className="w-full max-w-2xl relative">

          {/* Back button */}
          {currentStep > 1 && (
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute -top-10 left-4 md:left-0 z-40 flex items-center justify-center w-9 h-9 rounded-2xl bg-white shadow-soft text-gray-500 hover:text-gray-700 hover:shadow-md transition-all"
              onClick={prevStep}
              aria-label="Quay lại"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
          )}

          {/* Question card with enter/exit animation */}
          <AnimatePresence mode="wait">
            <QuestionCard
              key={currentStep}
              question={currentQuestion}
              currentStep={currentStep}
              selectedAnswer={answers[currentStep] ?? null}
              onAnswer={handleAnswer}
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
