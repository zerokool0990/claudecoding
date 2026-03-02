"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useQuizStore } from "@/store/quizStore";
import QuestionCard from "@/components/quiz/QuestionCard";
import ProgressBar from "@/components/quiz/ProgressBar";
import { ArrowLeft, Loader2 } from "lucide-react";
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
      const data = await res.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error("Failed to load questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = useCallback(
    async (value: AnswerValue) => {
      setAnswer(currentStep, value);

      const currentQuestion = questions.find(
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

  const currentQuestion = questions.find((q) => q.stepNumber === currentStep);

  if (isLoading && questions.length === 0) {
    return (
      <div className="min-h-screen gradient-brand flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="w-10 h-10 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/80">Đang chuẩn bị câu hỏi...</p>
        </motion.div>
      </div>
    );
  }

  if (isLoading && currentStep > 5) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <span className="text-4xl">🧪</span>
          </motion.div>
          <p className="text-white text-xl font-semibold mb-2">
            Đang pha chế công thức...
          </p>
          <p className="text-white/60">Vũ trụ đang mix ly nước cho bạn</p>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="relative">
      <ProgressBar current={currentStep} total={5} />

      {/* Back button */}
      {currentStep > 1 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-8 left-4 z-50 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          onClick={prevStep}
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        <QuestionCard
          key={currentStep}
          stepNumber={currentQuestion.stepNumber}
          questionText={currentQuestion.questionText}
          answers={currentQuestion.answers}
          selectedAnswer={answers[currentStep]}
          onAnswer={handleAnswer}
        />
      </AnimatePresence>
    </div>
  );
}
