"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name?: string; dob?: string }) => void;
  onSkip: () => void;
}

export default function ProfilePopup({
  isOpen,
  onClose,
  onSubmit,
  onSkip,
}: ProfilePopupProps) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  const handleSubmit = () => {
    onSubmit({
      name: name || undefined,
      dob: dob || undefined,
    });
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
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 pb-10 max-w-lg mx-auto"
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-200"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="text-center mb-6">
              <span className="text-4xl mb-3 block">🔮</span>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Vũ trụ đã ghi nhận &apos;vibe&apos; của bạn!
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Để mình nhớ tên bạn cho lần sau gọi món chỉ trong 1 chạm, và
                chuẩn bị quà bí mật cho sinh nhật bạn, cho mình xin thông tin
                nhé!
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Tên / Biệt danh
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Minh, Bé Mochi, ..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-gray-800"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Ngày sinh (cho quà sinh nhật)
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-gray-800"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-lg"
              >
                Lưu thông tin
              </motion.button>

              <button
                onClick={onSkip}
                className="w-full py-3 text-gray-400 text-sm hover:text-gray-600 transition-colors"
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
