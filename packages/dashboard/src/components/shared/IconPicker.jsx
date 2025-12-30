import { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";

// لیست محبوب‌ترین آیکون‌های lucide-react
const POPULAR_ICONS = [
  "Heart", "Star", "Award", "Target", "Zap", "Lightbulb", "Rocket", "Trophy",
  "Book", "BookOpen", "GraduationCap", "School", "Users", "User", "UserCheck", "UserPlus",
  "Home", "Building", "Building2", "Factory", "Globe", "Map", "MapPin", "Landmark",
  "Briefcase", "Package", "ShoppingBag", "ShoppingCart", "DollarSign", "TrendingUp", "BarChart", "PieChart",
  "Heart", "Activity", "Stethoscope", "Pill", "Syringe", "Microscope", "Flask", "Dna",
  "Leaf", "Trees", "TreePine", "Flower", "Sprout", "Sun", "CloudRain", "Droplets",
  "Smartphone", "Laptop", "Monitor", "Tablet", "Headphones", "Camera", "Video", "Wifi",
  "Code", "Database", "Server", "HardDrive", "Cpu", "Binary", "Terminal", "GitBranch",
  "Palette", "Brush", "Image", "Film", "Music", "Mic", "Speaker", "Radio",
  "Wrench", "Settings", "Hammer", "Scissors", "Ruler", "Pen", "PenTool", "Paintbrush",
  "MessageCircle", "Mail", "Phone", "Send", "Share2", "Bell", "AlertCircle", "Info",
  "CheckCircle", "XCircle", "Plus", "Minus", "Edit", "Trash2", "Save", "Download",
];

const IconPicker = ({ value, onChange, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // فیلتر آیکون‌ها بر اساس جستجو
  const filteredIcons = useMemo(() => {
    let icons = POPULAR_ICONS;

    if (searchQuery) {
      icons = icons.filter((iconName) =>
        iconName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return icons;
  }, [searchQuery]);

  const handleIconSelect = (iconName) => {
    onChange(iconName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-300 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-800">انتخاب آیکون</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <LucideIcons.X size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <LucideIcons.Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی آیکون... (مثلاً Heart، Star، User)"
              className="w-full h-9 pr-10 pl-3 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc] outline-none text-[12px] transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Icons Grid */}
        <div className="p-4 max-h-[400px] overflow-y-auto">
          {filteredIcons.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <LucideIcons.Search size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">آیکونی یافت نشد</p>
            </div>
          ) : (
            <div className="grid grid-cols-8 gap-2">
              {filteredIcons.map((iconName) => {
                const IconComponent = LucideIcons[iconName];
                if (!IconComponent) return null;

                const isSelected = value === iconName;

                return (
                  <button
                    key={iconName}
                    onClick={() => handleIconSelect(iconName)}
                    className={`
                      aspect-square flex flex-col items-center justify-center gap-1
                      rounded-md border transition-all hover:scale-105
                      ${
                        isSelected
                          ? "bg-[#007acc] text-white border-[#007acc] shadow-md"
                          : "bg-white text-slate-600 border-slate-300 hover:border-[#007acc] hover:bg-slate-50"
                      }
                    `}
                    title={iconName}
                  >
                    <IconComponent size={20} />
                    <span className="text-[8px] font-medium truncate max-w-full px-1">
                      {iconName}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <p className="text-[11px] text-slate-500">
            {filteredIcons.length} آیکون موجود
          </p>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-100 text-[11px] font-medium transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

export default IconPicker;
