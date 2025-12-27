import React from "react";
import { GameState } from "./types";

interface SidebarProps {
  gameState: GameState;
}

// همان پالت رنگی برای پیش‌نمایش قطعه بعدی
const QAJAR_PALETTE: Record<string, string> = {
  cyan: "#008F8C",
  blue: "#1A4D7D",
  orange: "#CCA43B",
  yellow: "#E8D7AE",
  green: "#7C9D8E",
  purple: "#A50340",
  red: "#D90452",
  default: "#CCA43B",
};

const Sidebar: React.FC<SidebarProps> = ({ gameState }) => {
  const { score, level, lines, nextPiece } = gameState;
  const nextColor = nextPiece.color.startsWith("#")
    ? nextPiece.color
    : QAJAR_PALETTE[nextPiece.color] || nextPiece.color;

  return (
    <div className="flex flex-col h-full text-[#FDFBF7]" dir="rtl">
      {/* Metrics Panel - طرح کتیبه */}
      <div className="space-y-4 p-2">
        {/* Score */}
        <div className="flex flex-col items-center border-b border-[#CCA43B]/30 pb-2">
          <span className="text-[10px] text-[#CCA43B] font-bold tracking-wider mb-1">امتیاز کل</span>
          <span
            className="text-lg font-bold text-[#D90452] drop-shadow-sm tabular-nums"
            style={{ fontFamily: "Vazirmatn, sans-serif" }}
          >
            {score.toLocaleString("fa-IR")}
          </span>
        </div>

        {/* Level & Lines */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col items-center bg-[#102E4A]/50 rounded p-1 border border-[#1A4D7D]">
            <span className="text-[9px] text-[#7C9D8E]">سطح</span>
            <span className="text-sm font-bold text-[#E8D7AE] tabular-nums">
              {level.toLocaleString("fa-IR")}
            </span>
          </div>
          <div className="flex flex-col items-center bg-[#102E4A]/50 rounded p-1 border border-[#1A4D7D]">
            <span className="text-[9px] text-[#7C9D8E]">خطوط</span>
            <span className="text-sm font-bold text-[#E8D7AE] tabular-nums">
              {lines.toLocaleString("fa-IR")}
            </span>
          </div>
        </div>
      </div>

      {/* Next Preview - طاقچه کوچک */}
      <div className="mt-auto mb-2">
        <span className="text-[9px] text-[#CCA43B] block text-center mb-2 opacity-80">قطعه بعدی</span>
        <div className="relative flex items-center justify-center p-3 bg-[#0a1f33] rounded-lg border-2 border-[#CCA43B] shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
          {/* تزیین بالای طاقچه */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#CCA43B] rounded-full"></div>

          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, 0.6rem)`,
              gridTemplateRows: `repeat(${nextPiece.shape.length}, 0.6rem)`,
            }}
          >
            {nextPiece.shape.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{
                    backgroundColor: cell !== 0 ? nextColor : "transparent",
                    boxShadow: cell !== 0 ? `0 0 4px ${nextColor}` : "none",
                    border: cell !== 0 ? "1px solid rgba(255,255,255,0.3)" : "none",
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
