import React from "react";

export const Loading: React.FC = () => {
  // ایجاد آرایه‌ای برای تولید قطرات باران تصادفی
  const drops = Array.from({ length: 20 });

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-slate-50 overflow-hidden" role="status" aria-label="در حال بارگذاری">
      {/* استایل‌های انیمیشن داخلی */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-100vh); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .rain-drop {
          position: absolute;
          top: -20px;
          width: 2px;
          height: 60px;
          background: linear-gradient(to bottom, transparent, #007acc);
          animation: fall linear infinite;
        }
      `}</style>

      {/* پس‌زمینه بارانی */}
      <div className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {drops.map((_, i) => (
          <div
            key={`drop-${i}`}
            className="rain-drop"
            style={{
              left: `${(i * 17) % 100}%`,
              animationDuration: `${0.5 + (i % 4) * 0.5}s`,
              animationDelay: `${(i % 5) * 0.4}s`,
              opacity: 0.3 + (i % 3) * 0.2,
            }}
          />
        ))}
      </div>

      {/* محتوای مرکزی */}
      <div className="z-10 flex flex-col items-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 max-w-md mx-4">
        {/* آیکون متحرک ابر و باران */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[#007acc] rounded-full opacity-20 animate-ping"></div>
          <div className="relative bg-white p-4 rounded-full shadow-md border border-slate-100">
            <svg
              className="w-12 h-12 text-[#007acc]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                className="animate-bounce"
                style={{ animationDelay: "0.1s" }}
                d="M11 19l-2 3"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                className="animate-bounce"
                style={{ animationDelay: "0.2s" }}
                d="M16 19l-2 3"
              />
            </svg>
          </div>
        </div>

        {/* متن و شعار */}
        <div className="text-center space-y-3">
          <h3 className="text-lg font-bold text-slate-800">
            لطفاً منتظر بمانید <span className="inline-flex animate-pulse">...</span>
          </h3>
          <p className="text-[#007acc] text-base font-medium leading-relaxed px-4 border-t border-slate-100 pt-3 mt-2">
            باران که می‌بارد، تو در راهی...
          </p>
        </div>

        {/* نوار پیشرفت پایین */}
        <div className="w-full h-1 bg-slate-100 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-[#007acc] animate-[progress_2s_ease-in-out_infinite] w-1/2 rounded-full origin-left"></div>
        </div>
      </div>

      {/* استایل انیمیشن نوار پیشرفت */}
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
