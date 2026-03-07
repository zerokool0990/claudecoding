"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number; // 1-5
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

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const stepIndex = currentStep - 1;
  const config = STEP_CONFIG[stepIndex];
  const progressPercent = (currentStep / 5) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#fef9f0]/90 backdrop-blur-sm">
      <div className="px-4 pt-3 pb-3 max-w-2xl mx-auto">
        {/* Step counter label */}
        <div className="flex items-center justify-between mb-2">
          <motion.span
            key={currentStep}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xs md:text-sm font-semibold"
            style={{ color: config.fill }}
          >
            Bước {currentStep}/5 — {config.emoji} {config.label}
          </motion.span>
        </div>

        {/* Progress bar track */}
        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mb-2">
          <motion.div
            className="h-full rounded-full progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ backgroundColor: config.fill }}
          />
        </div>

        {/* Step dots */}
        <div className="flex justify-between px-0.5">
          {STEP_CONFIG.map((step, i) => {
            const dotStep = i + 1;
            const isCompleted = dotStep < currentStep;
            const isCurrent = dotStep === currentStep;

            return (
              <div key={i} className="flex items-center justify-center">
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: step.fill }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 5L4 7L8 3"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                ) : isCurrent ? (
                  <div className="relative flex items-center justify-center">
                    {/* Pulse ring */}
                    <motion.div
                      className="absolute w-5 h-5 rounded-full"
                      style={{ backgroundColor: step.fill, opacity: 0.25 }}
                      animate={{ scale: [1, 1.7, 1], opacity: [0.25, 0, 0.25] }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      initial={{ scale: 0.6 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="w-5 h-5 rounded-full bg-white border-2"
                      style={{ borderColor: step.fill }}
                    />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gray-200" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
