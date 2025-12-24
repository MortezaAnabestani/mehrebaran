/**
 * Responsive Design Constants
 * ثابت‌های طراحی ریسپانسیو برای استفاده در کل پروژه
 *
 * استفاده:
 * import { RESPONSIVE_SIZES, RESPONSIVE_SPACING } from '@/styles/responsive-constants'
 * <div className={RESPONSIVE_SIZES.avatar.md}>...</div>
 */

export const RESPONSIVE_SIZES = {
  /** اندازه‌های Avatar */
  avatar: {
    xs: "w-6 h-6 sm:w-8 sm:h-8",
    sm: "w-8 h-8 sm:w-10 sm:h-10",
    md: "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14",
    lg: "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24",
    xl: "w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36",
  },

  /** اندازه‌های Icon */
  icon: {
    xs: "w-3 h-3 sm:w-4 sm:h-4",
    sm: "w-4 h-4 md:w-5 md:h-5",
    md: "w-5 h-5 md:w-6 md:h-6",
    lg: "w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8",
    xl: "w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12",
  },

  /** اندازه‌های Button */
  button: {
    sm: "w-8 h-8 sm:w-9 sm:h-9",
    md: "w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11",
    lg: "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14",
  },

  /** اندازه‌های Image */
  image: {
    sm: "h-32 sm:h-40 md:h-48",
    md: "h-48 sm:h-56 md:h-64",
    lg: "h-56 md:h-64 lg:h-72",
    xl: "h-64 md:h-72 lg:h-80 xl:h-96",
  },
};

export const RESPONSIVE_SPACING = {
  /** Padding برای Card */
  card: {
    xs: "p-2 sm:p-3",
    sm: "p-3 sm:p-4 md:p-5",
    md: "p-4 md:p-6",
    lg: "p-6 md:p-8 lg:p-10",
  },

  /** Padding برای Section */
  section: {
    xs: "p-3 md:p-4 lg:p-6",
    sm: "p-4 md:p-6 lg:p-8",
    md: "p-6 md:p-8 lg:p-12",
    lg: "p-8 md:p-12 lg:p-16",
  },

  /** Padding برای Button */
  button: {
    xs: "px-2 py-1 sm:px-3 sm:py-1.5",
    sm: "px-3 py-1.5 sm:px-4 sm:py-2",
    md: "px-4 py-2 sm:px-5 sm:py-2.5",
    lg: "px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4",
  },

  /** Gap برای Grid/Flex */
  gap: {
    xs: "gap-1 sm:gap-2",
    sm: "gap-2 sm:gap-3 md:gap-4",
    md: "gap-3 md:gap-4 lg:gap-6",
    lg: "gap-4 md:gap-6 lg:gap-8",
  },

  /** Margin عمودی */
  vertical: {
    xs: "my-2 sm:my-3",
    sm: "my-3 sm:my-4 md:my-6",
    md: "my-4 md:my-6 lg:my-8",
    lg: "my-6 md:my-8 lg:my-12",
  },
};

export const RESPONSIVE_TEXT = {
  /** اندازه‌های Heading */
  heading: {
    h1: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black",
    h2: "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold",
    h3: "text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold",
    h4: "text-base sm:text-lg md:text-xl lg:text-2xl font-semibold",
    h5: "text-sm sm:text-base md:text-lg font-semibold",
    h6: "text-xs sm:text-sm md:text-base font-semibold",
  },

  /** اندازه‌های Body */
  body: {
    xs: "text-[10px] sm:text-xs md:text-sm",
    sm: "text-xs sm:text-sm md:text-base",
    md: "text-sm sm:text-base md:text-lg",
    lg: "text-base sm:text-lg md:text-xl",
  },

  /** اندازه‌های Label/Caption */
  label: "text-[10px] sm:text-xs md:text-sm font-medium",
  caption: "text-[9px] sm:text-[10px] md:text-xs",
};

export const RESPONSIVE_BORDER = {
  /** Border Radius */
  radius: {
    sm: "rounded-lg md:rounded-xl",
    md: "rounded-xl md:rounded-2xl",
    lg: "rounded-2xl md:rounded-3xl",
  },

  /** Border Width */
  width: {
    sm: "border sm:border-2",
    md: "border-2 md:border-3",
    lg: "border-2 md:border-4",
  },
};

export const RESPONSIVE_GRID = {
  /** Grid Columns Preset */
  cols: {
    auto: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    needs: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    teams: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    stories: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
    stats: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    profile: "grid-cols-3 md:grid-cols-3 lg:grid-cols-3",
  },
};

/**
 * Helper function برای ترکیب کردن class های responsive
 */
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

/**
 * مثال استفاده:
 *
 * import { RESPONSIVE_SIZES, RESPONSIVE_SPACING, RESPONSIVE_TEXT, cn } from '@/styles/responsive-constants'
 *
 * <div className={cn(
 *   RESPONSIVE_SPACING.card.md,
 *   RESPONSIVE_BORDER.radius.md,
 *   "bg-white shadow-lg"
 * )}>
 *   <img className={cn(RESPONSIVE_SIZES.avatar.lg, "rounded-full")} />
 *   <h2 className={RESPONSIVE_TEXT.heading.h2}>Title</h2>
 *   <p className={RESPONSIVE_TEXT.body.md}>Content</p>
 * </div>
 */
