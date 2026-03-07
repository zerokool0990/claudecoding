"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuizStore } from "@/store/quizStore";
import DrinkCard from "@/components/results/DrinkCard";
import ProfilePopup from "@/components/results/ProfilePopup";
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from "lucide-react";
import type { CardType, DrinkCombo } from "@/types";

const CARD_LABELS: { type: CardType; label: string; activeBg: string; activeText: string }[] = [
  { type: "PERFECT_MATCH", label: "Perfect Match", activeBg: "#ede9fe", activeText: "#8b5cf6" },
  { type: "PLOT_TWIST",    label: "Plot Twist",    activeBg: "#ffe4e6", activeText: "#f43f5e" },
  { type: "SAFE_TREND",    label: "Safe Trend",    activeBg: "#d1fae5", activeText: "#10b981" },
];

export default function ResultsPage() {
  const router = useRouter();
  const { recommendations, moodTags, selectCard, setCustomerId } = useQuizStore();

  const [activeIndex, setActiveIndex]           = useState(0);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [orderPlaced, setOrderPlaced]           = useState(false);
  const [isSubmitting, setIsSubmitting]         = useState(false);
  const [orderId, setOrderId]                   = useState<string | null>(null);
  const [pendingCard, setPendingCard]           = useState<{
    type: CardType;
    drink: DrinkCombo;
  } | null>(null);

  // No recommendations yet — redirect prompt
  if (!recommendations) {
    return (
      <div className="min-h-screen bg-[#fef9f0] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-600 mb-5 font-medium">Chưa có kết quả. Hãy thử lại.</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/quiz")}
            className="px-6 py-3 rounded-2xl bg-white shadow-soft text-[#8b5cf6] font-semibold hover:shadow-md transition-all"
          >
            Quay lại Quiz
          </motion.button>
        </div>
      </div>
    );
  }

  const cards: { type: CardType; drink: DrinkCombo }[] = [
    { type: "PERFECT_MATCH", drink: recommendations.perfectMatch },
    { type: "PLOT_TWIST",    drink: recommendations.plotTwist    },
    { type: "SAFE_TREND",    drink: recommendations.safeTrend    },
  ];

  const handleSelect = (type: CardType, drink: DrinkCombo) => {
    selectCard(type, drink);
    setPendingCard({ type, drink });
    setShowProfilePopup(true);
  };

  const placeOrder = async (customerId?: string) => {
    if (!pendingCard) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          cardChosen: pendingCard.type,
          drink: pendingCard.drink,
          moodTags,
        }),
      });
      const data = await res.json();
      setOrderId(data.order?.id || null);
      setOrderPlaced(true);
    } catch (error) {
      console.error("Order failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ProfilePopup calls onSave(name, dob) — bridge to API shape
  const handleProfileSave = useCallback(async (name: string, dob: string) => {
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dob }),
      });
      const customer = await res.json();
      setCustomerId(customer.id);
      setShowProfilePopup(false);
      await placeOrder(customer.id);
    } catch (error) {
      console.error("Customer creation failed:", error);
      setShowProfilePopup(false);
      await placeOrder();
    }
  }, [pendingCard, moodTags]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleProfileSkip = useCallback(async () => {
    setShowProfilePopup(false);
    await placeOrder();
  }, [pendingCard, moodTags]); // eslint-disable-line react-hooks/exhaustive-deps

  // Order confirmation screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#fef9f0] flex items-center justify-center px-6">
        <motion.div
          className="text-center w-full max-w-sm"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {/* Success icon */}
          <motion.div
            className="w-24 h-24 bg-[#d1fae5] rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
          >
            <CheckCircle className="w-12 h-12 text-[#10b981]" />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-2xl font-display font-bold text-gray-900 mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            Đơn hàng của bạn đã được ghi nhận!
          </motion.h1>

          {/* Drink name */}
          {pendingCard && (
            <motion.p
              className="text-gray-500 text-sm mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              {pendingCard.drink.generatedNameVi}
            </motion.p>
          )}

          <motion.p
            className="text-gray-400 text-xs mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Đơn đã được gửi đến Barista
          </motion.p>

          {/* Order ID card */}
          <motion.div
            className="bg-white rounded-3xl border border-gray-100 shadow-soft p-5 mb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <p className="text-gray-400 text-xs mb-1.5">Mã đơn hàng</p>
            <p className="text-gray-800 text-2xl font-mono font-bold tracking-widest">
              #{orderId ? orderId.substring(0, 8).toUpperCase() : "---"}
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/quiz")}
              className="w-full py-3.5 rounded-2xl text-white font-semibold gradient-lavender shadow-lavender"
            >
              Đặt lại
            </motion.button>

            <button
              onClick={() => router.push("/")}
              className="w-full py-2 text-gray-400 text-sm hover:text-gray-500 transition-colors"
            >
              Trang chủ
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fef9f0] pb-8">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/quiz")}
            className="flex items-center justify-center w-9 h-9 rounded-2xl bg-white shadow-soft text-gray-500 hover:text-gray-700 hover:shadow-md transition-all shrink-0"
            aria-label="Quay lại"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 leading-tight">
              Đây là những gợi ý cho bạn! 🎉
            </h1>
            <p className="text-sm md:text-base text-gray-400 mt-0.5">
              <span className="lg:hidden">Vuốt để khám phá · Nhấn để chọn</span>
              <span className="hidden lg:inline">Chọn một ly phù hợp với vibe của bạn</span>
            </p>
          </div>
        </div>

        {/* Dot indicators — mobile/tablet only */}
        <div className="flex justify-center gap-2 mb-5 lg:hidden">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="transition-all duration-300 h-2 rounded-full"
              style={{
                width: i === activeIndex ? 28 : 8,
                backgroundColor: i === activeIndex ? "#8b5cf6" : "#d1d5db",
              }}
              aria-label={`Xem thẻ ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── Mobile/tablet: Carousel ── */}
      <div className="px-4 max-w-lg mx-auto lg:hidden">
        <div className="relative">
          {/* Left arrow */}
          {activeIndex > 0 && (
            <motion.button
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveIndex(activeIndex - 1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-30 w-9 h-9 rounded-2xl bg-white shadow-soft flex items-center justify-center text-gray-500 hover:text-gray-700 hover:shadow-md transition-all"
              aria-label="Thẻ trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
          )}

          {/* Right arrow */}
          {activeIndex < cards.length - 1 && (
            <motion.button
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveIndex(activeIndex + 1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-30 w-9 h-9 rounded-2xl bg-white shadow-soft flex items-center justify-center text-gray-500 hover:text-gray-700 hover:shadow-md transition-all"
              aria-label="Thẻ tiếp theo"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
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

        {/* Card label pill buttons */}
        <div className="flex justify-center gap-2 mt-5">
          {CARD_LABELS.map(({ type, label, activeBg, activeText }, i) => {
            const isActive = i === activeIndex;
            return (
              <motion.button
                key={type}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveIndex(i)}
                className="px-3 py-1.5 rounded-2xl text-xs font-semibold border transition-all duration-200"
                style={
                  isActive
                    ? { backgroundColor: activeBg, color: activeText, borderColor: "transparent" }
                    : { backgroundColor: "#ffffff", color: "#9ca3af", borderColor: "#f3f4f6" }
                }
              >
                {label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Desktop: 3-column grid ── */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6 px-6 max-w-5xl mx-auto">
        {cards.map(({ type, drink }, i) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 280, damping: 24 }}
          >
            <DrinkCard
              drink={drink}
              cardType={type}
              isActive={true}
              onSelect={() => handleSelect(type, drink)}
            />
          </motion.div>
        ))}
      </div>

      {/* Loading overlay — while submitting order */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#fef9f0]/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-white rounded-3xl border border-gray-100 shadow-soft px-10 py-8 text-center">
              <Loader2 className="w-8 h-8 text-[#8b5cf6] animate-spin mx-auto mb-3" />
              <p className="text-gray-600 font-medium text-sm">Đang đặt hàng...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile popup — bottom sheet */}
      <ProfilePopup
        isOpen={showProfilePopup}
        onSave={handleProfileSave}
        onSkip={handleProfileSkip}
      />
    </div>
  );
}
