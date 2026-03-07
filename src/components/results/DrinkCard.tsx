"use client";

import { motion } from "framer-motion";
import { Sparkles, Shuffle, Shield } from "lucide-react";
import type { DrinkCombo, CardType } from "@/types";

interface DrinkCardProps {
  drink: DrinkCombo;
  cardType: CardType;
  isActive: boolean;
  onSelect: () => void;
}

const CARD_CONFIG = {
  PERFECT_MATCH: {
    label: "👑 Đồng Điệu Hoàn Hảo",
    icon: Sparkles,
    gradient: "from-[#8b5cf6] to-[#ec4899]",
    badgeBg: "#ede9fe",
    badgeText: "#8b5cf6",
    shadowClass: "shadow-lavender",
  },
  PLOT_TWIST: {
    label: "🎲 Cú Lật Bất Ngờ",
    icon: Shuffle,
    gradient: "from-[#fda4af] to-[#fb7185]",
    badgeBg: "#ffe4e6",
    badgeText: "#f43f5e",
    shadowClass: "shadow-peach",
  },
  SAFE_TREND: {
    label: "⭐ Lựa Chọn An Toàn",
    icon: Shield,
    gradient: "from-[#6ee7b7] to-[#34d399]",
    badgeBg: "#d1fae5",
    badgeText: "#10b981",
    shadowClass: "shadow-mint",
  },
} as const;

const INGREDIENT_CATEGORIES = [
  { key: "base" as const, emoji: "☕", label: "Cốt Nền" },
  { key: "flavor" as const, emoji: "🍓", label: "Hương Vị" },
  { key: "function" as const, emoji: "💫", label: "Chức Năng" },
  { key: "texture" as const, emoji: "🫧", label: "Cấu Trúc" },
] as const;

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
      className={`relative w-full transition-all duration-300 ${
        isActive ? "scale-100 opacity-100" : "scale-90 opacity-50"
      }`}
      whileHover={isActive ? { y: -4 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div
        className={`bg-white rounded-3xl overflow-hidden border border-gray-100 ${config.shadowClass} shadow-lg`}
      >
        {/* Top gradient strip */}
        <div
          className={`bg-gradient-to-r ${config.gradient} flex items-center justify-between px-4 md:px-5`}
          style={{ height: 64 }}
        >
          {/* Badge pill */}
          <span
            className="px-3 py-1 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap"
            style={{ backgroundColor: config.badgeBg, color: config.badgeText }}
          >
            {config.label}
          </span>

          {/* Icon */}
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white/90 flex-shrink-0" />
        </div>

        {/* Body */}
        <div className="p-5 md:p-6">
          {/* Drink name */}
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-0.5">
            {drink.generatedNameVi}
          </h3>
          <p className="text-sm text-gray-400 mb-4">{drink.generatedName}</p>

          {/* Divider */}
          <hr className="border-gray-100 mb-3" />

          {/* Ingredient rows */}
          <div className="mb-4">
            {INGREDIENT_CATEGORIES.map((cat, idx) => (
              <div
                key={cat.key}
                className={`flex items-center gap-2 py-2 md:py-2.5 ${
                  idx < INGREDIENT_CATEGORIES.length - 1
                    ? "border-b border-gray-50"
                    : ""
                }`}
              >
                <span className="text-base leading-none">{cat.emoji}</span>
                <span className="text-xs md:text-sm text-gray-400 min-w-[72px] md:min-w-[80px]">
                  {cat.label}
                </span>
                <span className="text-gray-300 text-xs">|</span>
                <span className="text-sm md:text-base font-medium text-gray-700">
                  {drink[cat.key].nameVi}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom row: price + size + CTA */}
          <div className="flex items-center gap-3 mt-2">
            {/* Price badge */}
            <span
              className="px-3 py-1.5 rounded-2xl text-sm font-bold whitespace-nowrap"
              style={{ backgroundColor: config.badgeBg, color: config.badgeText }}
            >
              45.000đ
            </span>

            {/* Size badge */}
            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
              500ml
            </span>

            {/* CTA button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={onSelect}
              className={`flex-1 py-2.5 md:py-3 rounded-2xl text-white text-sm md:text-base font-semibold bg-gradient-to-r ${config.gradient} shadow-sm`}
            >
              Chọn Ly Này
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
