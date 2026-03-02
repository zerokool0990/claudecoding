"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-white/20">
        <motion.div
          className="h-full bg-white rounded-r-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-center gap-2 mt-3">
        {Array.from({ length: total }, (_, i) => (
          <motion.div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i < current
                ? "bg-white"
                : i === current
                ? "bg-white/80 scale-125"
                : "bg-white/30"
            }`}
            animate={i === current ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  );
}
