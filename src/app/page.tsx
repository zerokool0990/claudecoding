"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, BarChart3, Coffee } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen gradient-brand flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-72 h-72 rounded-full bg-white/10 -top-20 -left-20"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-white/5 -bottom-32 -right-32"
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-48 h-48 rounded-full bg-white/10 top-1/3 right-10"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="text-center z-10 max-w-md mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo */}
        <motion.div
          className="mb-8"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-24 h-24 mx-auto bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <span className="text-5xl">🧋</span>
          </div>
        </motion.div>

        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
          AI Drink
        </h1>
        <p className="text-white/80 text-lg mb-2">Đồ Uống Cá Nhân Hóa</p>
        <p className="text-white/60 text-sm mb-10 leading-relaxed">
          Trả lời 5 câu hỏi vui, khám phá ly nước
          <br />
          được tạo riêng cho tâm trạng của bạn
        </p>

        {/* Main CTA */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-3 bg-white text-purple-700 font-bold text-lg px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
          >
            <Sparkles className="w-5 h-5" />
            Bắt Đầu Khám Phá
          </Link>
        </motion.div>

        {/* Sub links */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 text-sm transition-colors bg-white/10 px-4 py-2 rounded-xl"
          >
            <BarChart3 className="w-4 h-4" />
            Admin Dashboard
          </Link>
          <Link
            href="/pos"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 text-sm transition-colors bg-white/10 px-4 py-2 rounded-xl"
          >
            <Coffee className="w-4 h-4" />
            Barista POS
          </Link>
        </div>
      </motion.div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full">
          <path
            fill="rgba(255,255,255,0.1)"
            d="M0,60 C360,120 720,0 1440,60 L1440,120 L0,120 Z"
          />
        </svg>
      </div>
    </main>
  );
}
