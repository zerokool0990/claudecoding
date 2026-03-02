"use client";

import { motion } from "framer-motion";
import type { AnswerValue } from "@/types";

interface QuestionCardProps {
  stepNumber: number;
  questionText: string;
  answers: { label: string; value: AnswerValue; logicMapping: string }[];
  selectedAnswer?: AnswerValue;
  onAnswer: (value: AnswerValue) => void;
}

const STEP_GRADIENTS = [
  "from-violet-500 to-purple-600",
  "from-pink-500 to-rose-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-blue-500 to-indigo-600",
];

const STEP_BG_GRADIENTS = [
  "from-violet-600 via-purple-600 to-indigo-700",
  "from-pink-600 via-rose-500 to-red-600",
  "from-amber-500 via-orange-500 to-red-500",
  "from-emerald-500 via-teal-500 to-cyan-600",
  "from-blue-600 via-indigo-600 to-violet-700",
];

const STEP_LABELS = [
  "Năng Lượng",
  "Hương Vị",
  "Chức Năng",
  "Xúc Giác",
  "Mạo Hiểm",
];

export default function QuestionCard({
  stepNumber,
  questionText,
  answers,
  selectedAnswer,
  onAnswer,
}: QuestionCardProps) {
  const gradientIndex = stepNumber - 1;

  return (
    <motion.div
      key={stepNumber}
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`min-h-screen bg-gradient-to-br ${STEP_BG_GRADIENTS[gradientIndex]} flex flex-col items-center justify-center p-6`}
    >
      {/* Step indicator */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-white/60 text-sm font-medium uppercase tracking-widest">
          Bước {stepNumber}/5 — {STEP_LABELS[gradientIndex]}
        </span>
      </motion.div>

      {/* Question */}
      <motion.div
        className="max-w-md mx-auto text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug">
          {questionText}
        </h2>
      </motion.div>

      {/* Answer options */}
      <div className="w-full max-w-md space-y-3">
        {answers.map((answer, idx) => (
          <motion.button
            key={answer.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + idx * 0.1 }}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAnswer(answer.value)}
            className={`w-full text-left p-5 rounded-2xl transition-all duration-200 ${
              selectedAnswer === answer.value
                ? `bg-white text-gray-800 shadow-xl shadow-black/20`
                : `bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm border border-white/20`
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  selectedAnswer === answer.value
                    ? `bg-gradient-to-br ${STEP_GRADIENTS[gradientIndex]} text-white`
                    : "bg-white/20 text-white"
                }`}
              >
                {answer.value}
              </span>
              <span className="text-base font-medium leading-snug">
                {answer.label}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
