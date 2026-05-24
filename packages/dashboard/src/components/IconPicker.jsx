import { useState, useMemo } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import * as LucideIcons from "lucide-react";

// لیست آیکون‌های محبوب برای نشان‌ها
const POPULAR_ICONS = [
  "Trophy", "Award", "Medal", "Star", "Crown", "Zap", "Target", "Heart",
  "ThumbsUp", "Sparkles", "Flame", "Gem", "BadgeCheck", "Shield", "Sword",
  "Rocket", "Gift", "PartyPopper", "Cherry", "Clover", "Sun", "Moon",
  "Mountain", "Leaf", "TreePine", "Flower", "Footprints", "HandHeart",
];

const IconPicker = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  // فیلتر آیکون‌ها بر اساس جستجو
  const filteredIcons = useMemo(() => {
    if (!search) return POPULAR_ICONS;

    const searchLower = search.toLowerCase();
    return POPULAR_ICONS.filter(icon =>
      icon.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const handleSelect = (iconName) => {
    onChange(iconName);
    setIsOpen(false);
    setSearch("");
  };

  // دریافت آیکون انتخاب شده
  const SelectedIcon = value && LucideIcons[value] ? LucideIcons[value] : null;

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-slate-700 mb-1">
        آیکون نشان <span className="text-red-500">*</span>
      </label>

      {/* دکمه انتخاب آیکون */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all text-left flex items-center gap-2 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
            : "border-slate-300 focus:border-[#007acc] focus:ring-[#007acc]"
        }`}
      >
        {SelectedIcon ? (
          <>
            <SelectedIcon className="w-5 h-5 text-slate-700" />
            <span className="text-slate-700">{value}</span>
          </>
        ) : (
          <span className="text-slate-400">انتخاب آیکون...</span>
        )}
      </button>

      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}

      <p className="text-xs text-slate-500 mt-1">
        آیکون نشان از مجموعه Lucide Icons
      </p>

      {/* مودال انتخاب آیکون */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-2xl max-h-[80vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-800">انتخاب آیکون</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-slate-200">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="جستجوی آیکون..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]"
                    autoFocus
                  />
                </div>
              </div>

              {/* Icons Grid */}
              <div className="flex-1 overflow-y-auto p-4">
                {filteredIcons.length > 0 ? (
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                    {filteredIcons.map((iconName) => {
                      const Icon = LucideIcons[iconName];
                      if (!Icon) return null;

                      const isSelected = value === iconName;

                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => handleSelect(iconName)}
                          className={`p-3 rounded-md border-2 transition-all hover:scale-110 ${
                            isSelected
                              ? "border-[#007acc] bg-[#007acc]/10"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                          title={iconName}
                        >
                          <Icon className={`w-6 h-6 ${
                            isSelected ? "text-[#007acc]" : "text-slate-600"
                          }`} />
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <MagnifyingGlassIcon className="w-12 h-12 mb-2" />
                    <p className="text-sm">آیکونی یافت نشد</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xs text-slate-500">
                  {filteredIcons.length} آیکون
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#007acc] rounded hover:bg-[#005a9e] transition-colors"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IconPicker;
