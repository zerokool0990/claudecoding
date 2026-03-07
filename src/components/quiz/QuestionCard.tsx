"use client";

import { motion } from "framer-motion";
import type { QuestionData, AnswerValue } from "@/types";

interface QuestionCardProps {
  question: QuestionData;
  currentStep: number; // 1-5
  selectedAnswer: AnswerValue | null;
  onAnswer: (answer: AnswerValue) => void;
}

const STEP_CONFIG = [
  {
    label: "Năng Lượng",
    emoji: "⚡",
    bg: "#ede9fe",
    text: "#8b5cf6",
    fill: "#8b5cf6",
  },
  {
    label: "Hương Vị",
    emoji: "🍓",
    bg: "#ffe4e6",
    text: "#f43f5e",
    fill: "#f43f5e",
  },
  {
    label: "Chức Năng",
    emoji: "💫",
    bg: "#d1fae5",
    text: "#10b981",
    fill: "#10b981",
  },
  {
    label: "Cấu Trúc",
    emoji: "🫧",
    bg: "#e0f2fe",
    text: "#0ea5e9",
    fill: "#0ea5e9",
  },
  {
    label: "Mạo Hiểm",
    emoji: "🎲",
    bg: "#fef3c7",
    text: "#f59e0b",
    fill: "#f59e0b",
  },
] as const;

export default function QuestionCard({
  question,
  currentStep,
  selectedAnswer,
  onAnswer,
}: QuestionCardProps) {
  const stepIndex = currentStep - 1;
  const config = STEP_CONFIG[stepIndex];

  return (
    <motion.div
      key={currentStep}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="
        w-full bg-white
        rounded-t-3xl md:rounded-3xl
        flex flex-col
        px-5 pt-6 pb-10
        md:px-8 md:pt-8 md:pb-12
        min-h-[calc(100vh-80px)] md:min-h-0
        md:shadow-[0_8px_40px_rgba(0,0,0,0.08)]
      "
    >
      {/* Step badge pill */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mb-5 md:mb-7 flex"
      >
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold"
          style={{ backgroundColor: config.bg, color: config.text }}
        >
          <span className="text-sm md:text-base">{config.emoji}</span>
          <span>Bước {currentStep} — {config.label}</span>
        </span>
      </motion.div>

      {/* Question text */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.35 }}
        className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-gray-800 leading-snug mb-8 md:mb-10"
      >
        {question.questionText}
      </motion.h2>

      {/* Answer buttons */}
      <div className="flex flex-col gap-3 md:gap-4 w-full">
        {question.answers.map((answer, idx) => {
          const isSelected = selectedAnswer === answer.value;

          return (
            <motion.button
              key={answer.value}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + idx * 0.08, duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onAnswer(answer.value)}
              className="w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-colors duration-200 flex items-center gap-3 md:gap-4"
              style={
                isSelected
                  ? {
                      backgroundColor: config.bg,
                      borderColor: config.fill,
                      color: config.text,
                    }
                  : {
                      backgroundColor: "#ffffff",
                      borderColor: "#f3f4f6",
                      color: "#374151",
                    }
              }
            >
              {/* Letter badge */}
              <span
                className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-sm md:text-base font-bold shrink-0"
                style={
                  isSelected
                    ? { backgroundColor: config.fill, color: "#ffffff" }
                    : { backgroundColor: "#f3f4f6", color: "#9ca3af" }
                }
              >
                {answer.value}
              </span>

              {/* Answer text */}
              <span className="text-base md:text-lg font-medium leading-snug">
                {answer.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
