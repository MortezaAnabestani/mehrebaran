import * as LucideIcons from "lucide-react";

const BadgeIcon = ({ iconName, className = "w-6 h-6", fallback = "🏆" }) => {
  // اگر نام آیکون lucide باشد
  if (iconName && LucideIcons[iconName]) {
    const Icon = LucideIcons[iconName];
    return <Icon className={className} />;
  }

  // اگر ایموجی باشد یا fallback
  return <span className={`inline-block ${className}`}>{iconName || fallback}</span>;
};

export default BadgeIcon;
