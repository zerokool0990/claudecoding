import Link from "next/link";
import { Coffee } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fef9f0] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Floating decorative blobs */}
      <div
        className="absolute top-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full bg-[#ede9fe] blur-3xl opacity-70 animate-float"
        aria-hidden="true"
      />
      <div
        className="absolute top-[-40px] right-[-80px] w-[200px] h-[200px] rounded-full bg-[#ffe4e6] blur-2xl opacity-70 animate-float-slow"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-60px] left-[-40px] w-[250px] h-[250px] rounded-full bg-[#d1fae5] blur-3xl opacity-60 animate-float-medium"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-30px] right-[-60px] w-[300px] h-[300px] rounded-full bg-[#e0f2fe] blur-3xl opacity-70 animate-float-slow"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-[5%] w-[150px] h-[150px] rounded-full bg-[#ede9fe] blur-2xl opacity-50 animate-float-medium"
        aria-hidden="true"
      />

      {/* Floating drink emojis */}
      <span
        className="absolute top-[12%] right-[8%] text-3xl animate-float select-none pointer-events-none"
        aria-hidden="true"
      >
        🧋
      </span>
      <span
        className="absolute top-[22%] left-[6%] text-2xl animate-float-slow select-none pointer-events-none"
        aria-hidden="true"
      >
        🍵
      </span>
      <span
        className="absolute bottom-[18%] right-[10%] text-2xl animate-float-medium select-none pointer-events-none"
        aria-hidden="true"
      >
        ☕
      </span>
      <span
        className="absolute bottom-[25%] left-[8%] text-3xl animate-float select-none pointer-events-none"
        aria-hidden="true"
      >
        🫖
      </span>

      {/* Centered content */}
      <div className="relative z-10 w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto px-6 flex flex-col items-center text-center gap-6">
        {/* Logo area */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-3xl bg-[#ede9fe] flex items-center justify-center shadow-lavender">
            <Coffee size={48} className="text-[#8b5cf6] md:w-14 md:h-14" />
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-gray-900 leading-tight tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8b5cf6] to-[#ec4899]">
              AI
            </span>{" "}
            Drink
          </h1>

          <p className="text-gray-400 text-sm md:text-base font-medium tracking-wide uppercase">
            Đồ Uống Cá Nhân Hóa
          </p>
        </div>

        {/* Tagline */}
        <p className="text-gray-500 text-sm md:text-base lg:text-lg leading-relaxed text-center">
          Trả lời 5 câu hỏi — nhận 3 gợi ý đồ uống hoàn toàn riêng cho bạn 🔮
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2">
          <span className="text-xs md:text-sm font-semibold text-[#8b5cf6] bg-[#ede9fe] rounded-full px-3 py-1 md:px-4 md:py-1.5">
            ✨ 5 câu hỏi
          </span>
          <span className="text-xs md:text-sm font-semibold text-[#8b5cf6] bg-[#ede9fe] rounded-full px-3 py-1 md:px-4 md:py-1.5">
            🎯 3 gợi ý
          </span>
          <span className="text-xs md:text-sm font-semibold text-[#8b5cf6] bg-[#ede9fe] rounded-full px-3 py-1 md:px-4 md:py-1.5">
            ⚡ 30 giây
          </span>
        </div>

        {/* Main CTA */}
        <Link
          href="/quiz"
          className="bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white rounded-2xl py-4 md:py-5 px-8 md:px-12 font-semibold text-lg md:text-xl w-full text-center shadow-lavender hover:opacity-90 transition-opacity"
        >
          Khám Phá Vibe Của Bạn →
        </Link>

        {/* Staff access — small inconspicuous link */}
        <p className="text-gray-300 text-xs pt-1">
          Nhân viên?{" "}
          <Link href="/admin" className="underline hover:text-gray-500 transition-colors">
            Đăng nhập hệ thống
          </Link>
        </p>
      </div>
    </main>
  );
}
