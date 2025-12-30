import { useState } from "react";
import * as LucideIcons from "lucide-react";

// پالت رنگ‌های از پیش تعریف شده (Tailwind gradients)
const GRADIENT_PRESETS = [
  // Blues
  { name: "Blue Ocean", from: "#3b82f6", to: "#06b6d4", gradient: "from-blue-500 to-cyan-500" },
  { name: "Deep Blue", from: "#1e40af", to: "#0891b2", gradient: "from-blue-800 to-cyan-600" },
  { name: "Sky", from: "#0ea5e9", to: "#22d3ee", gradient: "from-sky-500 to-cyan-400" },

  // Greens
  { name: "Forest", from: "#059669", to: "#10b981", gradient: "from-emerald-600 to-green-500" },
  { name: "Lime Fresh", from: "#84cc16", to: "#22c55e", gradient: "from-lime-500 to-green-500" },
  { name: "Teal", from: "#14b8a6", to: "#06b6d4", gradient: "from-teal-500 to-cyan-500" },

  // Purples & Pinks
  { name: "Purple Dream", from: "#9333ea", to: "#ec4899", gradient: "from-purple-600 to-pink-500" },
  { name: "Violet", from: "#7c3aed", to: "#a855f7", gradient: "from-violet-600 to-purple-500" },
  { name: "Fuchsia", from: "#c026d3", to: "#ec4899", gradient: "from-fuchsia-600 to-pink-500" },

  // Warm Colors
  { name: "Sunset", from: "#f97316", to: "#ef4444", gradient: "from-orange-500 to-red-500" },
  { name: "Fire", from: "#dc2626", to: "#f97316", gradient: "from-red-600 to-orange-500" },
  { name: "Golden", from: "#f59e0b", to: "#eab308", gradient: "from-amber-500 to-yellow-500" },

  // Neutrals & Special
  { name: "Slate", from: "#475569", to: "#64748b", gradient: "from-slate-600 to-slate-500" },
  { name: "Rose Gold", from: "#be185d", to: "#f43f5e", gradient: "from-pink-700 to-rose-500" },
  { name: "Indigo Navy", from: "#4338ca", to: "#6366f1", gradient: "from-indigo-700 to-indigo-500" },

  // Brand Colors
  { name: "Brand Primary", from: "#007acc", to: "#005fa3", gradient: "from-[#007acc] to-[#005fa3]" },
];

const ColorPicker = ({ value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [customFromColor, setCustomFromColor] = useState("#3b82f6");
  const [customToColor, setCustomToColor] = useState("#06b6d4");

  const handlePresetSelect = (preset) => {
    onChange(preset.gradient);
    setShowPicker(false);
  };

  const handleCustomGradient = () => {
    const customGradient = `from-[${customFromColor}] to-[${customToColor}]`;
    onChange(customGradient);
    setShowPicker(false);
  };

  // پیدا کردن پیش‌نمایش رنگ فعلی
  const currentPreset = GRADIENT_PRESETS.find((p) => p.gradient === value);

  return (
    <div className="relative">
      <label className="block text-[11px] font-medium text-slate-700 mb-1">استایل رنگی</label>

      {/* Preview Button */}
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="w-full h-9 px-3 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc] outline-none text-[12px] transition-all flex items-center justify-between"
      >
        <span className="text-slate-600">
          {currentPreset ? currentPreset.name : value || "انتخاب کنید..."}
        </span>
        <div className="flex items-center gap-2">
          {value && (
            <div className={`w-16 h-5 rounded border border-slate-200 bg-gradient-to-r ${value}`}></div>
          )}
          <LucideIcons.ChevronDown size={14} className="text-slate-400" />
        </div>
      </button>

      {/* Picker Dropdown */}
      {showPicker && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-xl overflow-hidden">
          {/* Presets */}
          <div className="p-3 max-h-[300px] overflow-y-auto">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              رنگ‌های پیشنهادی
            </p>
            <div className="grid grid-cols-2 gap-2">
              {GRADIENT_PRESETS.map((preset) => (
                <button
                  key={preset.gradient}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={`
                    flex items-center gap-2 p-2 rounded border transition-all hover:scale-[1.02]
                    ${
                      value === preset.gradient
                        ? "border-[#007acc] bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }
                  `}
                >
                  <div className={`w-8 h-8 rounded bg-gradient-to-r ${preset.gradient} flex-shrink-0`}></div>
                  <span className="text-[11px] font-medium text-slate-700 truncate">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Gradient */}
          <div className="border-t border-slate-200 p-3 bg-slate-50">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              رنگ دلخواه
            </p>
            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <label className="block text-[9px] text-slate-600 mb-1">از:</label>
                <input
                  type="color"
                  value={customFromColor}
                  onChange={(e) => setCustomFromColor(e.target.value)}
                  className="w-full h-8 rounded border border-slate-300 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[9px] text-slate-600 mb-1">تا:</label>
                <input
                  type="color"
                  value={customToColor}
                  onChange={(e) => setCustomToColor(e.target.value)}
                  className="w-full h-8 rounded border border-slate-300 cursor-pointer"
                />
              </div>
            </div>
            <div
              className="h-6 w-full rounded border border-slate-200 mb-2"
              style={{
                background: `linear-gradient(to right, ${customFromColor}, ${customToColor})`,
              }}
            ></div>
            <button
              type="button"
              onClick={handleCustomGradient}
              className="w-full h-7 bg-[#007acc] text-white rounded text-[11px] font-medium hover:bg-[#0062a3] transition-colors"
            >
              اعمال رنگ دلخواه
            </button>
          </div>

          {/* Close Button */}
          <div className="border-t border-slate-200 p-2 bg-white">
            <button
              type="button"
              onClick={() => setShowPicker(false)}
              className="w-full h-7 bg-white border border-slate-300 text-slate-700 rounded text-[11px] font-medium hover:bg-slate-50 transition-colors"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
