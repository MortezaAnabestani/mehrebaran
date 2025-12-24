# 📱 سیستم طراحی ریسپانسیو مهرباران

یک سیستم جامع برای ایجاد رابط کاربری ریسپانسیو با الگوهای استاندارد و قابل استفاده مجدد.

---

## 📋 فهرست

1. [نصب و راه‌اندازی](#نصب-و-راه‌اندازی)
2. [Breakpoints](#breakpoints)
3. [کامپوننت‌ها](#کامپوننت‌ها)
4. [Hooks](#hooks)
5. [ثابت‌های ریسپانسیو](#ثابت‌های-ریسپانسیو)
6. [مثال‌های کاربردی](#مثال‌های-کاربردی)

---

## 🚀 نصب و راه‌اندازی

```tsx
// Import کامپوننت‌ها
import {
  ResponsiveCard,
  ResponsiveGrid,
  ResponsiveContainer,
  ResponsiveHeading,
} from '@/components/ui/responsive'

// Import Hooks
import { useIsMobile, useBreakpoint } from '@/hooks/useResponsive'

// Import ثابت‌ها
import { RESPONSIVE_SIZES, RESPONSIVE_SPACING } from '@/styles/responsive-constants'
```

---

## 📐 Breakpoints

```typescript
{
  xs: 0,      // < 640px  (Mobile Portrait)
  sm: 640,    // < 768px  (Mobile Landscape / Small Tablet)
  md: 768,    // < 1024px (Tablet)
  lg: 1024,   // < 1280px (Desktop)
  xl: 1280,   // < 1536px (Large Desktop)
  2xl: 1536   // +        (Extra Large)
}
```

---

## 🧩 کامپوننت‌ها

### 1. ResponsiveCard

کارت چند منظوره با استایل Skeuomorphic

```tsx
<ResponsiveCard
  size="md"                    // "sm" | "md" | "lg"
  variant="elevated"           // "neumorphic" | "flat" | "elevated"
  clickable={true}
  onClick={() => {}}
  hover={true}
  className="..."
>
  محتوای کارت
</ResponsiveCard>
```

**Preset Cards:**
```tsx
<NeedCardContainer onClick={...}>...</NeedCardContainer>
<TeamCardContainer onClick={...}>...</TeamCardContainer>
<StatsCardContainer>...</StatsCardContainer>
```

### 2. ResponsiveGrid

سیستم Grid با الگوهای آماده

```tsx
<ResponsiveGrid
  cols={1}           // Mobile
  smCols={2}         // Tablet Small
  mdCols={3}         // Tablet
  lgCols={4}         // Desktop
  xlCols={6}         // Large Desktop
  gap="md"           // "sm" | "md" | "lg"
>
  {items.map(item => <div key={item.id}>...</div>)}
</ResponsiveGrid>
```

**Preset Grids:**
```tsx
<NeedsGrid>...</NeedsGrid>      // 1 → 2 → 3 columns
<TeamsGrid>...</TeamsGrid>       // 1 → 2 → 4 columns
<StoriesGrid>...</StoriesGrid>   // 2 → 3 → 4 → 6 columns
<StatsGrid>...</StatsGrid>       // 2 → 3 → 4 columns
```

### 3. ResponsiveContainer

کانتینر با padding استاندارد

```tsx
<ResponsiveContainer
  maxWidth="xl"              // "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  paddingX={true}
  paddingY={false}
  center={true}
>
  محتوا
</ResponsiveContainer>
```

**Preset Containers:**
```tsx
<ResponsiveSection background="light">...</ResponsiveSection>
<ResponsivePageWrapper>...</ResponsivePageWrapper>
```

### 4. ResponsiveText

تایپوگرافی ریسپانسیو

```tsx
// Headings
<ResponsiveHeading level={1}>عنوان بزرگ</ResponsiveHeading>
<ResponsiveHeading level={2} as="h1">عنوان H2 به عنوان H1</ResponsiveHeading>

// Body Text
<ResponsiveBody size="md">متن معمولی</ResponsiveBody>

// Labels & Captions
<ResponsiveLabel>برچسب</ResponsiveLabel>
<ResponsiveCaption>توضیحات کوچک</ResponsiveCaption>
```

---

## 🪝 Hooks

### useBreakpoint()
```tsx
const breakpoint = useBreakpoint()
// Returns: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

{breakpoint === 'xs' && <MobileView />}
{breakpoint >= 'lg' && <DesktopView />}
```

### useIsMobile() / useIsTablet() / useIsDesktop()
```tsx
const isMobile = useIsMobile()   // xs or sm
const isTablet = useIsTablet()   // md
const isDesktop = useIsDesktop() // lg, xl, 2xl

{isMobile ? <MobileMenu /> : <DesktopMenu />}
```

### useWindowSize()
```tsx
const { width, height } = useWindowSize()

console.log(`Window: ${width}x${height}`)
```

### useOrientation()
```tsx
const orientation = useOrientation()
// Returns: "portrait" | "landscape"
```

### useMediaQuery()
```tsx
const isSmallScreen = useMediaQuery('(max-width: 768px)')
const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
```

---

## 🎨 ثابت‌های ریسپانسیو

### RESPONSIVE_SIZES

```tsx
import { RESPONSIVE_SIZES } from '@/styles/responsive-constants'

// Avatar
<img className={RESPONSIVE_SIZES.avatar.md} />
// Output: "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"

// Icon
<Icon className={RESPONSIVE_SIZES.icon.sm} />

// Button
<button className={RESPONSIVE_SIZES.button.lg}>کلیک کنید</button>

// Image
<img className={RESPONSIVE_SIZES.image.lg} />
```

### RESPONSIVE_SPACING

```tsx
import { RESPONSIVE_SPACING } from '@/styles/responsive-constants'

// Card Padding
<div className={RESPONSIVE_SPACING.card.md}>...</div>

// Button Padding
<button className={RESPONSIVE_SPACING.button.md}>...</button>

// Gap
<div className={cn("flex", RESPONSIVE_SPACING.gap.md)}>...</div>
```

### RESPONSIVE_TEXT

```tsx
import { RESPONSIVE_TEXT } from '@/styles/responsive-constants'

<h1 className={RESPONSIVE_TEXT.heading.h1}>عنوان</h1>
<p className={RESPONSIVE_TEXT.body.md}>متن</p>
<span className={RESPONSIVE_TEXT.label}>برچسب</span>
```

### RESPONSIVE_GRID

```tsx
import { RESPONSIVE_GRID } from '@/styles/responsive-constants'

<div className={cn("grid", RESPONSIVE_GRID.cols.needs)}>
  {/* 1 → 2 → 3 columns */}
</div>
```

---

## 💡 مثال‌های کاربردی

### مثال 1: کارت نیاز ریسپانسیو

```tsx
import { NeedCardContainer } from '@/components/ui/responsive'
import { RESPONSIVE_SIZES, RESPONSIVE_TEXT } from '@/styles/responsive-constants'

function NeedCard({ need }) {
  return (
    <NeedCardContainer onClick={() => router.push(`/needs/${need.id}`)}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={need.user.avatar}
          className={cn(RESPONSIVE_SIZES.avatar.md, "rounded-full")}
        />
        <div>
          <h3 className={RESPONSIVE_TEXT.heading.h4}>{need.user.name}</h3>
          <p className={RESPONSIVE_TEXT.caption}>2 ساعت پیش</p>
        </div>
      </div>

      {/* Image */}
      <img
        src={need.image}
        className={cn(RESPONSIVE_SIZES.image.md, "rounded-xl object-cover w-full")}
      />

      {/* Content */}
      <h2 className={cn(RESPONSIVE_TEXT.heading.h3, "mt-4 mb-2")}>
        {need.title}
      </h2>
      <p className={RESPONSIVE_TEXT.body.sm}>{need.description}</p>
    </NeedCardContainer>
  )
}
```

### مثال 2: لیست تیم‌ها

```tsx
import { TeamsGrid } from '@/components/ui/responsive'
import { useIsMobile } from '@/hooks/useResponsive'

function TeamsPage() {
  const isMobile = useIsMobile()

  return (
    <ResponsivePageWrapper>
      <ResponsiveContainer>
        <ResponsiveHeading level={1} className="mb-8">
          تیم‌های فعال
        </ResponsiveHeading>

        <TeamsGrid>
          {teams.map(team => (
            <TeamCard key={team.id} team={team} compact={isMobile} />
          ))}
        </TeamsGrid>
      </ResponsiveContainer>
    </ResponsivePageWrapper>
  )
}
```

### مثال 3: صفحه با Sidebar شرطی

```tsx
import { useIsDesktop } from '@/hooks/useResponsive'

function NeedDetailPage() {
  const isDesktop = useIsDesktop()

  return (
    <ResponsiveContainer maxWidth="2xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <NeedContent />
        </div>

        {/* Sidebar - فقط در Desktop */}
        {isDesktop && (
          <aside className="lg:col-span-4">
            <NeedSidebar />
          </aside>
        )}
      </div>
    </ResponsiveContainer>
  )
}
```

---

## 📊 چک‌لیست ریسپانسیو

قبل از push کردن کامپوننت جدید، این موارد را بررسی کنید:

- [ ] Avatar ها responsive هستند؟
- [ ] Padding/Margin از RESPONSIVE_SPACING استفاده می‌کند؟
- [ ] Font-size ها responsive هستند؟
- [ ] Image/Video height ها responsive هستند؟
- [ ] Grid columns در mobile/tablet/desktop مناسب است؟
- [ ] Icon size ها responsive هستند؟
- [ ] Button size ها responsive هستند؟
- [ ] در mobile تست شده است؟ (< 640px)
- [ ] در tablet تست شده است؟ (768px - 1024px)
- [ ] در desktop تست شده است؟ (> 1024px)

---

## 🔄 Migration Guide

برای تبدیل کامپوننت‌های قدیمی:

```tsx
// ❌ قبل
<div className="p-6 w-12 h-12 text-lg">...</div>

// ✅ بعد
import { RESPONSIVE_SIZES, RESPONSIVE_SPACING, RESPONSIVE_TEXT } from '@/styles/responsive-constants'

<div className={cn(
  RESPONSIVE_SPACING.card.md,
  RESPONSIVE_SIZES.avatar.md,
  RESPONSIVE_TEXT.heading.h4
)}>...</div>
```

---

## 📝 نکات مهم

1. **همیشه از Mobile-First شروع کنید**
2. **از preset ها استفاده کنید** (سریعتر و استانداردتر)
3. **Breakpoint ها را رعایت کنید** (xs, sm, md, lg, xl)
4. **تست کنید** در همه سایزها قبل از commit

---

## 🤝 مشارکت

اگر الگوی جدیدی نیاز دارید:
1. به فایل `responsive-constants.ts` اضافه کنید
2. در این README مستند کنید
3. مثال استفاده بنویسید

---

**نسخه:** 1.0.0
**آخرین بروزرسانی:** 2025-01-24
