"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuizStore } from "@/store/quizStore";
import DrinkCard from "@/components/results/DrinkCard";
import ProfilePopup from "@/components/results/ProfilePopup";
import { ArrowLeft, ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import type { CardType, DrinkCombo } from "@/types";

export default function ResultsPage() {
  const router = useRouter();
  const { recommendations, moodTags, selectCard, setCustomerId } =
    useQuizStore();

  const [activeIndex, setActiveIndex] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingCard, setPendingCard] = useState<{
    type: CardType;
    drink: DrinkCombo;
  } | null>(null);

  if (!recommendations) {
    return (
      <div className="min-h-screen gradient-brand flex items-center justify-center">
        <div className="text-center text-white">
          <p className="mb-4">Chưa có kết quả. Hãy thử lại.</p>
          <button
            onClick={() => router.push("/quiz")}
            className="px-6 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition"
          >
            Quay lại Quiz
          </button>
        </div>
      </div>
    );
  }

  const cards: { type: CardType; drink: DrinkCombo }[] = [
    { type: "PERFECT_MATCH", drink: recommendations.perfectMatch },
    { type: "PLOT_TWIST", drink: recommendations.plotTwist },
    { type: "SAFE_TREND", drink: recommendations.safeTrend },
  ];

  const handleSelect = (type: CardType, drink: DrinkCombo) => {
    selectCard(type, drink);
    setPendingCard({ type, drink });
    setShowProfile(true);
  };

  const placeOrder = async (customerId?: string) => {
    if (!pendingCard) return;
    setIsSubmitting(true);

    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          cardChosen: pendingCard.type,
          drink: pendingCard.drink,
          moodTags,
        }),
      });
      setOrderPlaced(true);
    } catch (error) {
      console.error("Order failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileSubmit = async (data: {
    name?: string;
    dob?: string;
  }) => {
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const customer = await res.json();
      setCustomerId(customer.id);
      setShowProfile(false);
      await placeOrder(customer.id);
    } catch (error) {
      console.error("Customer creation failed:", error);
      setShowProfile(false);
      await placeOrder();
    }
  };

  const handleSkipProfile = async () => {
    setShowProfile(false);
    await placeOrder();
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center p-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <motion.div
            className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Check className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-3xl font-bold text-white mb-3">
            Đặt Hàng Thành Công!
          </h1>
          <p className="text-white/80 mb-2">
            {pendingCard?.drink.generatedNameVi}
          </p>
          <p className="text-white/60 text-sm mb-8">
            Đơn hàng đã được gửi đến Barista
          </p>

          <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm max-w-sm mx-auto mb-8">
            <p className="text-white/70 text-sm mb-2">Mã đơn hàng</p>
            <p className="text-white text-2xl font-mono font-bold">
              #{Math.random().toString(36).substring(2, 8).toUpperCase()}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="px-8 py-4 bg-white text-teal-700 font-semibold rounded-2xl shadow-lg"
          >
            Về Trang Chủ
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push("/quiz")}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-800">
              Đồ Uống Của Bạn
            </h1>
            <p className="text-xs text-gray-400">
              Vuốt để xem 3 lựa chọn
            </p>
          </div>

          <div className="w-10" />
        </div>
      </div>

      {/* Card carousel */}
      <div className="px-4 py-8 max-w-lg mx-auto">
        {/* Card navigation dots */}
        <div className="flex justify-center gap-2 mb-6">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === activeIndex
                  ? "w-8 bg-purple-500"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Cards */}
        <div className="relative">
          {/* Navigation arrows */}
          {activeIndex > 0 && (
            <button
              onClick={() => setActiveIndex(activeIndex - 1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-30 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {activeIndex < cards.length - 1 && (
            <button
              onClick={() => setActiveIndex(activeIndex + 1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-30 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <DrinkCard
                drink={cards[activeIndex].drink}
                cardType={cards[activeIndex].type}
                isActive={true}
                onSelect={() =>
                  handleSelect(cards[activeIndex].type, cards[activeIndex].drink)
                }
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Card labels */}
        <div className="flex justify-center gap-4 mt-6 text-xs text-gray-400">
          {["Perfect Match", "Plot Twist", "Safe Trend"].map((label, i) => (
            <button
              key={label}
              onClick={() => setActiveIndex(i)}
              className={`transition-colors ${
                i === activeIndex
                  ? "text-purple-600 font-medium"
                  : "hover:text-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-3" />
            <p className="text-gray-600">Đang đặt hàng...</p>
          </div>
        </div>
      )}

      {/* Profile popup */}
      <ProfilePopup
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        onSubmit={handleProfileSubmit}
        onSkip={handleSkipProfile}
      />
    </div>
  );
}
