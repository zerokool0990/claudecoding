"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfilePopupProps {
  isOpen: boolean;
  onSave: (name: string, dob: string) => void;
  onSkip: () => void;
}

export default function ProfilePopup({
  isOpen,
  onSave,
  onSkip,
}: ProfilePopupProps) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  const handleSave = () => {
    onSave(name, dob);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onSkip}
          />

          {/* Bottom sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#fef9f0] rounded-t-3xl p-6 pb-safe"
          >
            {/* Handle bar */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

            {/* Emoji */}
            <p className="text-4xl text-center mb-3">🔮</p>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Vũ trụ đã ghi nhận &apos;vibe&apos; của bạn!
            </h3>

            {/* Subtitle */}
            <p className="text-sm text-gray-400 text-center leading-relaxed mb-6">
              Để mình nhớ tên bạn cho lần sau gọi món chỉ trong 1 chạm, và
              chuẩn bị quà bí mật cho sinh nhật bạn, cho mình xin thông tin
              nhé!
            </p>

            {/* Form */}
            <div className="space-y-3 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1.5 block">
                  Tên / Biệt danh
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Minh, Bé Mochi, ..."
                  className="w-full rounded-2xl border-2 border-gray-100 focus:border-[#8b5cf6] focus:outline-none p-4 text-gray-800 bg-white transition-colors placeholder:text-gray-300"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1.5 block">
                  Ngày sinh (cho quà sinh nhật)
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full rounded-2xl border-2 border-gray-100 focus:border-[#8b5cf6] focus:outline-none p-4 text-gray-800 bg-white transition-colors"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSave}
                className="w-full py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] shadow-md"
              >
                Lưu thông tin
              </motion.button>

              <button
                onClick={onSkip}
                className="w-full py-2 text-gray-400 text-sm text-center hover:text-gray-500 transition-colors"
              >
                Bỏ qua / Lần sau nhé
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
