"use client";

import { motion } from "framer-motion";
import type { DrinkCombo, CardType } from "@/types";
import { Sparkles, Shuffle, Shield } from "lucide-react";

interface DrinkCardProps {
  drink: DrinkCombo;
  cardType: CardType;
  isActive: boolean;
  onSelect: () => void;
}

const CARD_CONFIG = {
  PERFECT_MATCH: {
    title: "The Perfect Match",
    subtitle: "Đồng điệu hoàn hảo",
    icon: Sparkles,
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "from-violet-50 to-purple-50",
    borderColor: "border-violet-200",
    badge: "👑 100% Match",
  },
  PLOT_TWIST: {
    title: "The Plot Twist",
    subtitle: "Cú lật bất ngờ",
    icon: Shuffle,
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-50 to-orange-50",
    borderColor: "border-amber-200",
    badge: "🎲 Surprise",
  },
  SAFE_TREND: {
    title: "The Safe Trend",
    subtitle: "Lựa chọn an toàn",
    icon: Shield,
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
    borderColor: "border-emerald-200",
    badge: "⭐ Best Seller",
  },
};

export default function DrinkCard({
  drink,
  cardType,
  isActive,
  onSelect,
}: DrinkCardProps) {
  const config = CARD_CONFIG[cardType];
  const Icon = config.icon;

  return (
    <motion.div
      className={`w-full max-w-sm mx-auto swipe-card ${
        isActive ? "scale-100 opacity-100" : "scale-90 opacity-50"
      } transition-all duration-300`}
      whileHover={isActive ? { scale: 1.02 } : {}}
      whileTap={isActive ? { scale: 0.98 } : {}}
    >
      <div
        className={`bg-white rounded-3xl shadow-xl overflow-hidden border ${config.borderColor}`}
      >
        {/* Header */}
        <div
          className={`bg-gradient-to-r ${config.gradient} p-6 text-white relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">
                {config.title}
              </span>
            </div>
            <p className="text-xs opacity-70">{config.subtitle}</p>
          </div>
          <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
            {config.badge}
          </div>
        </div>

        {/* Drink Name */}
        <div className={`bg-gradient-to-b ${config.bgGradient} px-6 py-5`}>
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            {drink.generatedNameVi}
          </h3>
          <p className="text-sm text-gray-500">{drink.generatedName}</p>
        </div>

        {/* Ingredients */}
        <div className="px-6 py-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-sm">
              🫖
            </span>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Cốt nền
              </p>
              <p className="text-sm font-medium text-gray-700">
                {drink.base.nameVi}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-sm">
              🍋
            </span>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Hương vị
              </p>
              <p className="text-sm font-medium text-gray-700">
                {drink.flavor.nameVi}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-sm">
              💊
            </span>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Chức năng
              </p>
              <p className="text-sm font-medium text-gray-700">
                {drink.function.nameVi}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm">
              🧊
            </span>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Kết cấu
              </p>
              <p className="text-sm font-medium text-gray-700">
                {drink.texture.nameVi}
              </p>
            </div>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="px-6 pb-6 pt-2">
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-gray-800">45.000đ</span>
            <span className="text-sm text-gray-400">500ml</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSelect}
            className={`w-full py-4 rounded-2xl text-white font-semibold text-base bg-gradient-to-r ${config.gradient} shadow-lg`}
          >
            Chọn Ly Này
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
