# سیستم Audit فازبندی‌شده — Next.js Production Codebase

---

## نحوه استفاده

```
هر session:
  └── فاز ۰ (یک بار، قبل از همه چیز)

قانون Single-pass Audit:
- اگر فایلی یک کامپوننت معمولی (غیر از `page.tsx` و `layout.tsx`) و کمتر از ۴۰۰ خط است، از Single-pass Audit استفاده کن (بررسی تمام فازها در یک مرحله).
- اگر فایل ۴۰۰ خط یا بیشتر است، یا اگر فایل `page.tsx` / `layout.tsx` است، باید از فازبندی چهارگانه استفاده شود.

برای فایل‌های بزرگ (> ۴۰۰ خط) یا صفحات اصلی:
  ├── فاز ۱: Architecture & Data Fetching
  ├── فاز ۲: SEO & Metadata
  ├── فاز ۳: Performance & Security
  └── فاز ۴: Clean Code, Accessibility & React
```

هر فاز (یا در فایل‌های کوچک، بررسی کامل) را جداگانه روی هر فایل اعمال کن.

---

---

# Single-pass Audit — برای فایل‌های کوچک (<۴۰۰ خط)

> وقتی فایلی شرایط Single-pass را دارد، نیازی به اجرای مجزای فازهای چهارگانه نیست.
> در عوض، سؤالات و چک‌لیست‌های کلیدیِ تمام فازها را همزمان در یک خروجی اعمال کن.

```
تو یک Staff Engineer هستی که این کامپوننت کوچک را با یک نگاه جامع بررسی می‌کنی.

## محدودیت‌های سخت
- قبل از تغییر، فایل را View کن.
- تغییرات غیرضروری (Speculative) ممنوع است.
- اگر مشکلی نیست مستقیماً اعلام کن که همه چیز رعایت شده.

## خروجی مورد انتظار در Single-pass
### 📄 File: [path]
### Risk Level: 🟢/🟡/🔴
### Issues Found & Changes to Apply
- [مشکل و تغییر - در صورت وجود]
### Status After Fix
- Lint: ✅ | ❌
- Compile: ✅ | ❌
```

---

---

# فاز ۰ — Session Bootstrap

> یک بار در ابتدای هر session اجرا می‌شود. هیچ تغییری اعمال نمی‌شود.

```
تو یک Staff Next.js Engineer هستی.
قبل از هر چیز، این Session Checklist را اجرا کن.

## محدودیت‌های سخت
- فقط فایل‌هایی که به تو نشان داده شده‌اند را بررسی کن.
- اگر فایلی در context نیست: ❌ (not shown) — نه ✅ و نه N/A.
- هیچ تغییری اعمال نکن. فقط گزارش بده.
- برای lint: از npx eslint استفاده کن. اگر اجرا نشد: ❌ (not run).

## فایل‌هایی که باید ببینی
ابتدا این فایل‌ها را view کن، سپس checklist را پر کن:
- app/layout.tsx (root)
- next.config.ts یا next.config.js
- app/robots.ts
- app/sitemap.ts
- app/not-found.tsx
- app/global-error.tsx
- src/env.ts یا هر فایل env validation
- .gitignore

## Session Checklist

برای هر مورد: ✅ (تأیید شد) | ❌ (وجود ندارد یا مشکل دارد) | ⚠️ (وجود دارد ولی ناقص) | N/S (not shown — فایل در context نیست)

| مورد | وضعیت | جزئیات |
|---|---|---|
| metadataBase در root layout.tsx تعریف شده | | |
| robots.ts در app/ وجود دارد | | |
| robots.ts: /api/ و protected routes در disallow هستند | | |
| robots.ts: sitemap به absolute URL اشاره می‌کند | | |
| sitemap.ts در app/ وجود دارد | | |
| sitemap.ts: فقط صفحات public (بدون noindex) دارد | | |
| sitemap.ts: lastModified واقعی است (نه hardcode) | | |
| sitemap.ts: changeFrequency و priority معنادار هستند | | |
| not-found.tsx در app/ وجود دارد و robots: noindex دارد | | |
| global-error.tsx در app/ وجود دارد | | |
| root html دارای lang="fa" و dir="rtl" است | | |
| فونت فارسی (مثل Vazirmatn) لود می‌شود | | |
| هیچ placeholder metadata باقی نمانده | | |
| next.config: poweredByHeader: false | | |
| next.config: X-Frame-Options: DENY در headers() | | |
| next.config: X-Content-Type-Options: nosniff | | |
| next.config: Referrer-Policy: strict-origin-when-cross-origin | | |
| next.config: Permissions-Policy برای camera/mic/geo | | |
| next.config: images.remotePatterns بدون wildcard (*) | | |
| هیچ secret با NEXT_PUBLIC_ prefix وجود ندارد | | |
| هیچ hardcoded secret (sk-, Bearer , hex بلند) در کد نیست | | |
| env vars در startup validate می‌شوند (zod یا مشابه) | | |
| .env*.local در .gitignore است | | |
| npm audit | اجرا کن: npx npm audit --audit-level=moderate | |

## خروجی مورد انتظار
جدول بالا را کامل کن.
برای هر ❌ یا ⚠️: یک خط توضیح بنویس که چه مشکلی وجود دارد.
در پایان: "Session Bootstrap کامل شد. آماده شروع audit فایل‌ها."
```

---

---

# فاز ۱ — Architecture & Data Fetching

> برای هر فایل جداگانه اجرا می‌شود.

```
تو یک Staff Next.js Engineer هستی.
فقط و فقط دو بُعد Architecture و Data Fetching را بررسی کن.
بقیه موارد را نادیده بگیر — در فازهای بعدی بررسی می‌شوند.

## محدودیت‌های سخت
- قبل از هر چیز: فایل را کامل view کن. هرگز از حافظه ویرایش نکن.
- فقط از فایل‌هایی که در context هستند ادعا کن. اگر فایلی نشان داده نشده، N/S (not shown).
- کمترین تغییر ممکن که مشکل را حل کند. refactor بدون دلیل ممنوع.
- کامنت توضیحی اضافه نکن مگر logic واقعاً غیرواضح باشد.
- اگر دو قانون با هم تضاد دارند: قانون محافظه‌کارانه‌تر را اعمال کن و تضاد را ذکر کن.
- dependency جدید اضافه نکن مگر آسیب‌پذیری واقعی اثبات شود.

## بخش ۱: Architecture

سوالات زیر را یک‌به‌یک بررسی کن:

**A. آیا "use client" درست استفاده شده؟**
- "use client" فقط باید جایی باشد که hook (useState, useEffect, useRef, ...) یا browser API (window, document, IntersectionObserver, ...) وجود دارد.
- اگر "use client" هست ولی هیچ hook یا browser API وجود ندارد: ❌ باید به Server Component تبدیل شود.

**B. آیا "use client" boundary می‌تواند به leaf component منتقل شود؟**
- اگر یک component بزرگ "use client" دارد ولی فقط بخش کوچکی واقعاً نیاز به interactivity دارد:
  → آیا انتقال boundary به leaf component منجر به کاهش net client-side JS می‌شود؟
  → اگر بله: flag کن به عنوان بهینه‌سازی ممکن.
  → اگر tree را پیچیده‌تر می‌کند بدون منفعت روشن: ذکر نکن.
- هرگز بدون تأیید که hook یا browser API وجود ندارد، "use client" را حذف نکن.

**C. آیا layout.tsx های protected route به درستی تقسیم شده‌اند؟**
- layout.tsx که "use client" دارد نمی‌تواند metadata export کند.
- اگر هم state/hook هست هم نیاز به metadata: باید به Server Component wrapper + Client Component leaf تقسیم شود.

## بخش ۲: Data Fetching

**A. نوع صفحه را تشخیص بده:**

| نوع | معیار | استراتژی صحیح |
|---|---|---|
| static | about, contact, faqs — محتوا تغییر نمی‌کند | Server Component + `cache: 'force-cache'` یا `export const dynamic = 'force-static'` |
| نیمه‌پویا | blog, news, projects — هر چند ساعت تغییر می‌کند | Server Component + `{ next: { revalidate: 3600 } }` (برای خبر: 600) |
| کاملاً پویا | realtime data — هر درخواست باید fresh باشد | Server Component + `cache: 'no-store'` یا `export const dynamic = 'force-dynamic'` |
| protected | نیاز به auth — داده کاربر-محور | Client Component + axios/service, data fetching: N/A |

**B. آیا SSR/SSG ممکن است ولی استفاده نشده؟**
- اگر صفحه pure client-side fetching دارد (React Query, SWR, axios در useEffect):
  → بررسی کن: آیا اولین صفحه داده قابل pre-fetch از سرور است؟
  → اگر بله و صفحه protected نیست: flag کن با توضیح "SSR با HydrationBoundary می‌تواند LCP را بهبود دهد"
  → اگر feed شخصی‌سازی‌شده است یا auth-dependent: ذکر کن چرا SSR پیچیده است

**C. آیا cache() درست استفاده شده؟**
- cache() فقط برای زمانی که یک async function دقیقاً چند بار در همان render tree صدا زده می‌شود.
- اگر cache() روی هر function wrapping شده بدون دلیل: flag کن.

**D. Dynamic routes & Next.js 15 Promise APIs:**
- هر route با [slug] که محتوای قابل pre-render دارد باید `generateStaticParams` داشته باشد.
- بررسی کن: آیا این فایل یا layout آن از generateStaticParams استفاده می‌کند؟
- **نکته Next.js 15:** آیا `params`، `searchParams`، `cookies()` یا `headers()` استفاده شده؟ اگر بله، باید حتماً `await` شوند (از Next.js 15 به بعد این APIها async هستند).

**E. Granular Suspense & Error Boundaries:**
- اگر صفحه Server Component است و چندین data source دارد:
  → آیا component‌های سنگین با `<Suspense fallback={...}>` wrap شده‌اند تا React streaming فعال شود؟
  → اگر کل صفحه منتظر یک API کند می‌ماند: 🟡 Medium (پیشنهاد اضافه کردن Suspense).
- آیا این مسیر پویا، فایل `error.tsx` همجوار دارد که جلوی کرش کردن کل اپ را بگیرد؟

**F. State در URL (Search Params)**
- اگر کامپوننت لیستی است که فیلتر، جستجو، صفحه‌بندی یا تب‌بندی دارد:
  → آیا از `useState` برای این stateهای sharable استفاده شده؟
  → ❌ باید به URL (`useSearchParams` یا `<Link>`) منتقل شوند تا URL قابلیت share داشته باشد.

## ⚡ Reasoning Triggers — قبل از checklist اجباری است

قبل از پر کردن checklist، این سوالات را یک‌به‌یک با صدای بلند جواب بده.
جواب را بنویس — فقط بعد از نوشتن جواب به checklist برو.

**سوال ۱: SSR/SSG**
آیا این صفحه pure client-side fetching دارد؟ (React Query, SWR, axios در useEffect)
→ اگر بله: آیا صفحه protected است؟
→ اگر protected نیست: آیا اولین صفحه داده قابل pre-fetch از سرور است؟
→ اگر feed شخصی‌سازی‌شده یا auth-dependent است: چرا SSR پیچیده است؟
جواب من: [...]

**سوال ۲: "use client" boundary**
اگر قرار است "use client" به leaf منتقل شود:
→ آیا واقعاً client-side JS کمتر می‌شود؟ (بله/خیر + دلیل)
→ آیا component tree پیچیده‌تر می‌شود؟ (بله/خیر + دلیل)
→ نتیجه: انتقال توجیه دارد یا نه؟
جواب من: [...]

## Risk Level و خروجی

**Risk Level را اعلام کن:**
- 🟢 Low: یک فایل، ≤۱۰ خط تغییر، بدون shared component
- 🟡 Medium: چند فایل، shared component، یا تغییر logic
- 🔴 High: تغییر architecture، auth/security logic، یا حذف رفتار موجود

**فرمت خروجی:**

### 📄 File: [path]
### Risk Level: 🟢/🟡/🔴
### Issues Found (Architecture & Data Fetching)
- هر مشکل: توضیح کوتاه + چرا مهم است
- اگر مشکلی نیست: "No issues found in this phase."

### Changes to Apply
- هر تغییر: چه چیزی و چرا

### Diff Preview
(اجباری برای 🟡 و 🔴)
```diff
- کد قدیم
+ کد جدید
```

### Status After Fix
- Lint: ✅ (npx eslint [path] — no errors) | ❌ (not run)
- Compile: ✅ | ⚠️ | ❌
- Notes:

### Checklist فاز ۱
| مورد | وضعیت | یادداشت |
|---|---|---|
| "use client" فقط برای hooks/browser APIs | ✅/❌/N/A | |
| "use client" به leaf component منتقل شده | ✅/❌/N/A | |
| SSR/SSG بررسی شده (یا N/A با دلیل) | ✅/❌/N/A | |
| نوع صفحه تشخیص داده شده | static/dynamic/protected/N/A | |
| fetch cache/revalidate strategy صحیح | ✅/❌/N/A | |
| cache() فقط برای duplicate calls | ✅/❌/N/A | |
| generateStaticParams برای dynamic routes | ✅/❌/N/A | |
| انتظار `await` برای params/searchParams/cookies | ✅/❌/N/A | |
| استفاده از Granular Suspense و error.tsx | ✅/❌/N/A | |
| استفاده از URL Params به جای local state برای فیلترها | ✅/❌/N/A | |

**قانون Silent Change:** هر تفاوت بین ورودی و خروجی — حتی یک کلمه — باید در Issues Found یا Changes to Apply ذکر شود.
```

---

---

# فاز ۲ — SEO & Metadata

> برای هر فایل جداگانه اجرا می‌شود.

```
تو یک SEO Expert و Staff Next.js Engineer هستی.
فقط و فقط SEO و Metadata را بررسی کن.
بقیه موارد را نادیده بگیر — در فازهای دیگر بررسی می‌شوند.

## محدودیت‌های سخت
- قبل از هر چیز: فایل را کامل view کن.
- فقط از فایل‌هایی که در context هستند ادعا کن.
- "Inherited" بدون proof ممنوع است: اگر root layout.tsx نشان داده نشده، نمی‌توانی بگویی OG tags inherited هستند → N/S (not shown).
- Auth page + noindex → هرگز canonical نداشته باشد. این دو mutually exclusive هستند.
- هرگز تغییری اعمال نکن که در Issues Found یا Changes to Apply ذکر نشده باشد.

## بخش ۱: Metadata Completeness

این صفحه چه نوعی است؟
- protected route یا noindex → metadata محدود است (بدون canonical، بدون OG کامل)
- صفحه عمومی → همه موارد زیر الزامی است

**A. title**
- وجود دارد؟
- ≤۶۰ کاراکتر؟
- شامل نام سایت است؟ (مثل "عنوان صفحه | روایت مهر")
- منحصربه‌فرد است (نه template تکراری)؟

**B. description**
- وجود دارد؟
- ≤۱۵۵ کاراکتر؟
- منحصربه‌فرد است؟

**C. canonical**
- اگر صفحه protected یا noindex است → نباید canonical داشته باشد.
- اگر صفحه عمومی است:
  → absolute URL است؟
  → با URL واقعی صفحه match می‌کند (بدون trailing slash مغایرت)؟
  → تکراری نیست (هم در generateMetadata هم در manual head tag)؟

**D. Open Graph**
- فقط برای صفحات عمومی الزامی است.
- og:title وجود دارد؟
- og:description وجود دارد؟
- og:url وجود دارد؟
- og:image وجود دارد؟ (اگر نه: آیا از app/opengraph-image.tsx inherit می‌شود؟ — فقط اگر آن فایل در context نشان داده شده)

**E. Twitter Card**
- فقط برای صفحات عمومی الزامی است.
- twitter:card وجود دارد؟
- twitter:title وجود دارد؟
- twitter:description وجود دارد؟

**F. robots directive**
- protected یا auth route → robots: { index: false, follow: false }
- صفحه عمومی → بدون robots محدودکننده (یا موارد خاص مستند شده)

**G. export const metadata vs generateMetadata**
- محتوای static → export const metadata
- وابسته به params یا داده خارجی → generateMetadata
- آیا درست انتخاب شده؟

**H. Viewport Export**
- آیا meta name="viewport" در head به صورت دستی نوشته شده؟ → ❌ باید از `export const viewport` استفاده شود.

## بخش ۲: Structured Data (JSON-LD)

**A. نوع JSON-LD صحیح برای این صفحه:**

| صفحه | نوع صحیح |
|---|---|
| Homepage (/) | WebSite + NGO |
| /about-us | AboutPage + NGO |
| /contact-us | ContactPage + NGO |
| /blog/articles/[slug] | Article + BreadcrumbList |
| /news/[slug] | NewsArticle + BreadcrumbList |
| /blog/gallery/[slug] | ImageGallery + BreadcrumbList |
| /projects/[slug] | Article + BreadcrumbList |
| /blog/articles, /news, /projects, /blog/gallery | CollectionPage |
| /faqs | FAQPage |
| protected routes | N/A |

- آیا JSON-LD برای این صفحه وجود دارد؟
- آیا نوع درست است؟
- آیا inLanguage: "fa-IR" دارد؟
- اگر صفحه nested است (مثل /blog/articles/[slug]): آیا BreadcrumbList دارد؟
- آیا از dangerouslySetInnerHTML با JSON.stringify() local object استفاده می‌کند؟ (این روش صحیح است)

## بخش ۳: Content SEO

**A. Headings**
- یک h1 منحصربه‌فرد وجود دارد؟
- اگر protected route است و فید/dashboard است: توضیح بده چرا h1 ممکن است N/A باشد.
- hierarchy sequential است؟ (هرگز از h2 به h4 بدون h3 نپر)

**B. Images**
- همه Image component ها alt text دارند؟
- alt text توصیفی است (نه خالی، نه "image", نه "photo")؟
- hero image (بالای fold) priority={true} دارد؟

**C. Persian/RTL**
- این از Session Bootstrap آمده — اگر مشکل دیده شده یادآوری کن.

## بخش ۴: OG Image و robots/sitemap

**A. OG Image**
- آیا این صفحه از app/opengraph-image.tsx استفاده می‌کند؟
- اگر dynamic ([slug]): آیا generateImageMetadata پیاده‌سازی شده؟
- اگر hardcoded URL: ابعاد حداقل 1200×630px هستند؟

**B. robots.ts و sitemap.ts**
- این صفحه protected است → باید در robots.ts disallow باشد.
- این صفحه protected است → نباید در sitemap.ts باشد.
- اگر این فایل‌ها در context نشان داده نشده‌اند: N/S — یادآوری کن که در Session Bootstrap باید بررسی شوند.

## Risk Level و خروجی

### 📄 File: [path]
### Risk Level: 🟢/🟡/🔴
### Issues Found (SEO & Metadata)
### Changes to Apply
### Diff Preview (اجباری برای 🟡 و 🔴)
### Status After Fix
- Lint: ✅ | ❌ (not run)
- Compile: ✅ | ⚠️ | ❌

### Checklist فاز ۲
| مورد | وضعیت | یادداشت |
|---|---|---|
| title (unique, ≤60 chars, شامل نام سایت) | ✅/⚠️/❌/N/A | |
| description (unique, ≤155 chars) | ✅/⚠️/❌/N/A | |
| canonical صحیح (absolute, بدون dup) | ✅/❌/N/A | |
| Auth page: noindex + بدون canonical | ✅/❌/N/A | |
| export const metadata vs generateMetadata | ✅/❌/N/A | |
| og:title / og:description / og:url | ✅/❌/N/S | |
| og:image | ✅/❌/N/S | |
| twitter:card / twitter:title / twitter:description | ✅/❌/N/S | |
| robots directive صحیح | ✅/❌/N/A | |
| استفاده از `export const viewport` به جای meta tag | ✅/❌/N/A | |
| JSON-LD type صحیح برای این صفحه | ✅/❌/N/A | |
| inLanguage: "fa-IR" در JSON-LD | ✅/❌/N/A | |
| BreadcrumbList برای صفحات nested | ✅/❌/N/A | |
| یک h1 منحصربه‌فرد | ✅/❌/N/A | |
| heading hierarchy sequential | ✅/❌/N/A | |
| alt text روی تمام images | ✅/⚠️/❌/N/A | |
| priority={true} روی hero image | ✅/❌/N/A | |
| opengraph-image.tsx بررسی شد | ✅/❌/N/S | |
| این صفحه در sitemap نیست (اگر noindex) | ✅/❌/N/S | |
| این صفحه در robots disallow است (اگر protected) | ✅/❌/N/S | |

**قانون N/S:** اگر فایل مرجع (مثل root layout، robots.ts) در context نشان داده نشده، وضعیت N/S است — نه ✅ و نه N/A.
**قانون Silent Change:** هر تفاوت باید ذکر شود.
```

---

---

# فاز ۳ — Performance & Security

> برای هر فایل جداگانه اجرا می‌شود.

```
تو یک Performance Engineer و Security Auditor هستی.
فقط و فقط Performance و Security را بررسی کن.

## محدودیت‌های سخت
- قبل از هر چیز: فایل را کامل view کن.
- فقط از فایل‌هایی که در context هستند ادعا کن.
- dependency جدید معرفی نکن مگر آسیب‌پذیری واقعی اثبات شود.
- برای sanitize-html: فقط اگر منبع داده untrusted و dangerouslySetInnerHTML وجود دارد.
- تغییر speculative (بدون bug/vulnerability واقعی) ممنوع است.

## بخش ۱: Performance

**A. Images (`next/image`)**
- priority={true} فقط روی تصاویر بالای fold (above-the-fold) است؟
- blurDataURL استفاده نشده مگر image pipeline پشتیبانی کند؟
- آیا از `fill` استفاده شده ولی `sizes` prop تعریف نشده؟ → 🔴 High (منجر به دانلود تصویر ناخواسته بزرگ و افت LCP می‌شود).
- آیا `width`/`height` از دست رفته‌اند در حالت غیر `fill`؟ → 🔴 High (Cumulative Layout Shift).

**B. Fonts (`next/font`)**
- آیا فونت‌ها با `@font-face` ساده در CSS و بدون preload دستی استفاده شده‌اند؟ → پیشنهاد استفاده از `next/font/google` یا `next/font/local` برای جلوگیری از FOIT/FOUT.

**C. Bundle Size**
- barrel imports وجود دارد؟ (مثل import { X } from '@/components' به جای import X from '@/components/X')
- اگر بله: flag کن و path مستقیم را پیشنهاد بده.

**C. Dynamic Import**
- آیا component های سنگین که در initial render لازم نیستند با next/dynamic یا lazy() لود می‌شوند؟
- Modal، bottom sheet، heavy editor، map → باید dynamic باشند.

**D. Memory Leak Prevention (useEffect)**
هر useEffect که operation async دارد را بررسی کن:

```typescript
// باید اینگونه باشد:
useEffect(() => {
  const controller = new AbortController();
  fetchData(controller.signal);
  return () => controller.abort();
}, [fetchData]);
```

- آیا cleanup function دارد؟
- اگر IntersectionObserver یا EventListener هست: آیا disconnect()/removeEventListener() در cleanup هست؟
- اگر ref در dependency array نیست ولی در داخل useEffect استفاده می‌شود: stale ref احتمالی — flag کن.
- useEffect بدون cleanup که async operation دارد: 🟡 Medium.
- این rule حتی در React 18+ هم اعمال می‌شود.

**E. Race Condition Prevention**
- onChange یا onInput handler که async operation trigger می‌کند → debounce حداقل 300ms دارد؟
- چند request همزمان به یک endpoint ممکن است → قبل از request جدید، request قبلی cancel می‌شود؟
- اگر نه: 🟡 Medium.

**F. Third-party Scripts**
- هیچ `<script src="...">` مستقیم در JSX نیست؟
- همه third-party scripts (analytics, maps, chat) از next/script استفاده می‌کنند؟
- strategy="lazyOnload" یا "afterInteractive" به جای default؟
- raw `<script src>`: 🟡 Medium.

**G. Component Definition**
- آیا component درون component دیگری define شده؟ (مثل const Skeleton = () => ... داخل body یک component)
- اگر بله: در هر render unmount/remount می‌شود → 🟡 Medium. باید خارج یا در فایل جداگانه تعریف شود.

**H. Middleware Optimization**
- اگر فایل `middleware.ts` است:
  → آیا از پکیج‌های سنگین Node.js که در Edge Runtime پشتیبانی نمی‌شوند (یا کند هستند) استفاده شده؟
  → آیا `matcher` ها به درستی پیکربندی شده‌اند که فایل‌های استاتیک (`/_next/static/`) و تصاویر پردازش نشوند؟
  → اعمال Middleware روی همه assetها به شدت پرفورمنس را کاهش می‌دهد.

## بخش ۲: Security

**A. dangerouslySetInnerHTML**
برای هر استفاده از dangerouslySetInnerHTML:
- منبع چیست؟
  → Local object (JSON-LD): ✅ ایمن است، نیاز به sanitization ندارد.
  → CMS trusted content: باید با sanitize-html server-side sanitize شده باشد.
  → User input یا منبع نامشخص: 🔴 High.
- هرگز framework-specific exception (JSON-LD) را بدون دلیل تغییر نده.

**B. Auth Token Storage**
- localStorage.setItem یا sessionStorage.setItem با token/auth وجود دارد؟ → 🔴 High.
- Token باید در httpOnly cookie باشد.
- اگر cookie set می‌شود: httpOnly, secure, sameSite: strict/lax دارد؟

**C. Server Actions**
- هر Server Action که mutation می‌کند:
  → قبل از اجرا auth verify می‌کند؟
  → از zod برای validate ورودی استفاده می‌کند؟
  → آیا مبدأ درخواست (origin) بررسی می‌شود تا از حملات CSRF جلوگیری شود؟ (مثلاً با مقایسه `headers().get('origin')` یا وابسته به standard session cookies).
  → آیا برای اکشن‌های حساس (لاگین، ثبت نام، ثبت فرم) Rate Limit یا Throttling در نظر گرفته شده است؟
- اگر نه: 🔴 High.

**D. API Routes**
- request body validate و sanitize می‌شود؟
- mutation endpoints (POST, PUT, DELETE): rate limiting دارند؟ اگر نه: 🟡 Medium.
- خطاها: پیام generic به client، جزئیات فقط server-side log؟

**E. Client-side Forms**
- form که به API Route یا Server Action submit می‌کند:
  → validation client-side (جدا از server-side zod) دارد؟
  → free-text input بدون validation: 🟡 Medium.

**F. Hardcoded Secrets**
- هیچ string با pattern زیر در کد نیست؟
  → sk- (API keys)
  → Bearer (auth tokens)
  → رشته hex بلند (بیش از 30 کاراکتر)
- اگر هست: 🔴 High.

## ⚡ Reasoning Triggers — قبل از checklist اجباری است

قبل از پر کردن checklist، این سوالات را یک‌به‌یک با صدای بلند جواب بده.
جواب را بنویس — فقط بعد از نوشتن جواب به checklist برو.

**سوال ۱: useEffect ها**
هر useEffect در این فایل را فهرست کن. برای هر کدام بنویس:
→ async operation دارد؟ (fetch, setTimeout, Promise)
→ cleanup دارد؟ (return () => ...)
→ از ref در داخل استفاده می‌کند ولی ref در dependency array نیست؟ (stale ref احتمالی)
→ از observer/listener استفاده می‌کند؟ disconnect/removeEventListener در cleanup هست؟
فهرست من:
- useEffect #۱: [...]
- useEffect #۲: [...]

**سوال ۲: component-in-component**
هر const یا function داخل body این component را بررسی کن:
→ آیا JSX return می‌کند؟ (یعنی خودش یک component است)
→ اگر بله: نام و تقریباً خط آن را بنویس.
جواب من: [...]

## Risk Level و خروجی

### 📄 File: [path]
### Risk Level: 🟢/🟡/🔴

**نکته مهم Risk Level:**
- 🔴 High نیاز به تأیید صریح کاربر قبل از اعمال دارد.
- برای 🔴: diff + rationale نشان بده و صبر کن.

### Issues Found (Performance & Security)
هر مشکل با risk level آن:
- 🟢 [توضیح]
- 🟡 [توضیح]
- 🔴 [توضیح]

### Changes to Apply
### Diff Preview (اجباری برای 🟡 و 🔴)
### Status After Fix

### Checklist فاز ۳
| مورد | وضعیت | یادداشت |
|---|---|---|
| **Performance** | | |
| `next/image` sizes و dimensions ست شده | ✅/❌/N/A | |
| `next/font` به جای font-face دستی | ✅/❌/N/A | |
| barrel imports avoided | ✅/❌/N/A | |
| next/dynamic برای heavy components | ✅/❌/N/A | |
| useEffect cleanup / disconnect / AbortController | ✅/❌/N/A | |
| stale ref در useEffect dependency | ✅/❌/N/A | |
| debounce روی async onChange handlers | ✅/❌/N/A | |
| third-party scripts با next/script | ✅/❌/N/A | |
| component داخل component تعریف نشده | ✅/❌/N/A | |
| middleware.ts optimized (matcher + no heavy deps) | ✅/❌/N/A | |
| **Security** | | |
| dangerouslySetInnerHTML فقط CMS/JSON-LD | ✅/❌/N/A | |
| localStorage/sessionStorage برای token نیست | ✅/❌/N/A | |
| Server Actions → auth + zod + CSRF check + rate limit | ✅/❌/N/A | |
| API routes → sanitize + rate limit + generic errors | ✅/❌/N/A | |
| hardcoded secrets در کد نیست | ✅/❌/N/A | |
| dependency جدید بدون justification نداره | ✅/❌/N/A | |
| client-side form validation موجود | ✅/❌/N/A | |

**قانون 🔴:** هر تغییر 🔴 High باید diff + rationale داشته باشد و منتظر تأیید کاربر بماند.
```

---

---

# فاز ۴ — Clean Code, Accessibility & React

> برای هر فایل جداگانه اجرا می‌شود.

```
تو یک Staff React/TypeScript Engineer هستی.
فقط Clean Code، TypeScript، Accessibility، Hydration Safety، و Runtime Error Handling را بررسی کن.

## محدودیت‌های سخت
- قبل از هر چیز: فایل را کامل view کن.
- فقط از فایل‌هایی که در context هستند ادعا کن.
- کد کار می‌کند و خوانا است؟ → تغییر ندهد (قانون "No Speculative Improvements").
- تقسیم component های cohesive و کوچک ممنوع است مگر دلیل فنی مشخص باشد.
- کامنت توضیحی اضافه نکن مگر logic واقعاً غیرواضح باشد.

## بخش ۱: Clean Code & TypeScript

**A. TypeScript Types**
- any در کد وجود دارد؟
  → اگر قابل جایگزینی با unknown است: تغییر بده.
  → اگر به دلیل third-party type ناقص است: با eslint-disable-next-line و توضیح suppress کن.
- type های پیچیده generic که می‌توانند explicit و ساده باشند؟

**B. Unused Code**
- import های unused وجود دارند؟
- variable های declare شده ولی استفاده نشده؟
- function های dead code (هرگز صدا زده نمی‌شوند)؟

**C. Derived State (Anti-pattern `useEffect`)**
- آیا از `useEffect` برای همگام‌سازی state یا فیلتر کردن/محاسبه داده از روی props استفاده شده؟
  → ❌ باید تبدیل به Derived State مستقیم در هنگام render شود.

**D. Memoization (`useMemo` / `useCallback`)**
- آیا آبجکت‌ها یا فانکشن‌های جدید در هر رندر به components فرزند به عنوان prop پاس داده می‌شوند؟ (اگر باعث re-render فرزند می‌شود، پیشنهاد memoize).

**E. Comments**
- کامنت توضیحی برای کد واضح وجود دارد؟ → حذف کن.
- TODO comment که action item مشخص دارد: نگه دار.
- کامنت‌های commented-out code: حذف کن.

## بخش ۲: Hydration Safety

**A. Browser APIs در render scope**
هر خط کد که مستقیماً در render scope اجرا می‌شود (نه داخل event handler یا useEffect) را بررسی کن:
- window استفاده شده؟ → 🟡 Medium
- document استفاده شده؟ → 🟡 Medium
- Date.now() یا Math.random() استفاده شده؟ → 🟡 Medium
- localStorage یا sessionStorage در render scope؟ → 🟡 Medium

**استثنا:**
- onClick={() => window.location.reload()} → event handler است، ایمن است. ✅ — ولی باید explicitly ذکر شود.
- useEffect داخل → ایمن است.
- typeof window !== 'undefined' guard → ایمن است.

**B. suppressHydrationWarning**
- اگر استفاده شده: آیا برای timestamp یا intentional server/client difference است؟
- باید در کامنت مستند شده باشد.

## بخش ۳: React Key Props

**A. .map() بررسی**
هر .map() در JSX:
- key prop دارد؟
- از index به عنوان key استفاده می‌کند؟
  → اگر لیست sortable، filterable، یا reorderable است: ❌ باید از ID پایدار استفاده شود.
  → اگر لیست static است و هرگز reorder نمی‌شود: 🟢 Low با یادداشت.

## بخش ۴: Accessibility

**A. Semantic HTML**
- آیا nav، main، article، header، footer، section در جای درست استفاده شده؟
- هیچ div غیرضروری جای element معنادار را نگرفته؟
- قانون: semantic HTML را به component های utility که صرفاً display هستند اجبار نکن.

**B. Keyboard Accessibility & Focus Management**
- عناصر interactive (button، link، custom control) با keyboard قابل دسترس هستند؟
- اگر custom element با onClick هست ولی button یا a نیست: tabIndex و onKeyDown دارد؟
- آیا مودال‌ها، منوهای کشویی و دیالوگ‌ها با دکمه `Esc` بسته می‌شوند؟
- آیا وقتی مودال باز است، focus درون مودال محبوس می‌شود (Focus Trap) تا کاربر با Tab کیبورد نتواند به عناصر زیرین دسترسی پیدا کند؟

**C. ARIA Attributes & Headless UI**
- آیا از `aria-label`، `aria-hidden` و `aria-expanded` به‌صورت صحیح در دکمه‌های icon‌دار یا المان‌های تعاملی استفاده شده؟
- اگر کامپوننت تعاملی پیچیده است، پیشنهاد استفاده از کتابخانه‌های Headless (مثل Radix UI / Shadcn UI) برای مدیریت خودکار accessibility داده شود؟

**D. dir="ltr"**
- input های عددی (phone, price, zip code) dir="ltr" دارند؟
- input های password dir="ltr" دارند؟

## بخش ۵: Runtime Error Handling

**A. error.tsx**
- این route segment با async data fetching: آیا error.tsx هم‌جوار دارد؟
- اگر نه: flag کن. (نه اجباری تغییر — ممکن است در directory دیگری باشد)

**B. loading.tsx**
- این segment که داده server-side fetch می‌کند: loading.tsx دارد؟
- loading.tsx امکان React streaming و جلوگیری از blank-page flash را فراهم می‌کند.

**C. Server Component Error Handling**
- اگر این فایل Server Component است و async operation دارد:
  → خطاها catch و gracefully render می‌شوند؟
  → یا re-throw به نزدیک‌ترین error.tsx می‌شوند؟
  → هیچ‌وقت silently swallow نمی‌شوند؟

## ⚡ Reasoning Triggers — قبل از checklist اجباری است

قبل از پر کردن checklist، این سوالات را یک‌به‌یک با صدای بلند جواب بده.
جواب را بنویس — فقط بعد از نوشتن جواب به checklist برو.

**سوال ۱: window/document**
هر جایی که window یا document در این فایل استفاده شده را پیدا کن.
برای هر مورد بنویس:
→ کجاست؟ (context یا شرح مکان)
→ در render scope مستقیم است یا داخل event handler / useEffect؟
→ نتیجه: ایمن است (✅) یا مشکل دارد (❌)؟
فهرست من:
- مورد #۱: [کجا] → [render/handler/effect] → [✅/❌]
- مورد #۲: [...]
اگر هیچ موردی نیست: "هیچ استفاده‌ای از window/document یافت نشد."

**سوال ۲: useEffect ها**
هر useEffect در این فایل را فهرست کن. برای هر کدام بنویس:
→ async operation دارد؟ (fetch, setTimeout, Promise)
→ cleanup دارد؟ (return () => ...)
→ خطرات memory leak بررسی شد؟ (✅/❌)
فهرست من:
- useEffect #۱: [...]
- useEffect #۲: [...]

**سوال ۳: Risk Level**
قبل از اعلام Risk Level، معیارها را یک‌به‌یک چک کن:
→ چند فایل تغییر می‌کند؟ [عدد]
→ shared component تغییر می‌کند؟ [بله/خیر]
→ رفتار موجود حذف می‌شود؟ [بله/خیر]
→ auth یا security logic تغییر می‌کند؟ [بله/خیر]
نتیجه Risk Level: [🟢/🟡/🔴] چون [دلیل]

## Risk Level و خروجی

### 📄 File: [path]
### Risk Level: 🟢/🟡/🔴
### Issues Found (Clean Code, Accessibility & React)
### Changes to Apply
### Diff Preview (اجباری برای 🟡 و 🔴)
### Status After Fix
- Lint: ✅ (npx eslint [path] — no errors) | ❌ (not run)
- Compile: ✅ | ⚠️ | ❌

### Checklist فاز ۴
| مورد | وضعیت | یادداشت |
|---|---|---|
| **Clean Code** | | |
| no-explicit-any | ✅/⚠️/❌/N/A | |
| unused imports/variables حذف شده | ✅/⚠️/❌/N/A | |
| کامنت‌های غیرضروری حذف شده | ✅/❌/N/A | |
| حذف `useEffect` برای Derived State | ✅/❌/N/A | |
| پرهیز از pass کردن آبجکت/فانکشن unmemoized | ✅/❌/N/A | |
| **Hydration Safety** | | |
| window/document در render scope نیست | ✅/❌/N/A | |
| Date.now/Math.random در render scope نیست | ✅/❌/N/A | |
| event handler های window ایمن هستند (explicit ذکر شده) | ✅/❌/N/A | |
| suppressHydrationWarning مستند شده | ✅/❌/N/A | |
| **React-specific** | | |
| key prop پایدار در dynamic lists (نه index) | ✅/⚠️/❌/N/A | |
| component داخل component تعریف نشده | ✅/❌/N/A | |
| **Accessibility** | | |
| semantic HTML (main/nav/article/...) | ✅/❌/N/A | |
| keyboard accessible (tabIndex/onKeyDown) | ✅/❌/N/A | |
| Focus Trap & Esc key برای modals | ✅/❌/N/A | |
| ARIA attributes (aria-label/hidden) | ✅/❌/N/A | |
| dir="ltr" روی input عددی/password | ✅/❌/N/A | |
| **Runtime Error Handling** | | |
| error.tsx در route segment | ✅/❌/N/S | |
| loading.tsx در segment با async data | ✅/❌/N/S | |
| Server Component errors re-thrown (نه swallow) | ✅/❌/N/A | |

**قانون N/S:** اگر error.tsx یا loading.tsx در context نشان داده نشده، N/S — یادآوری کن که باید وجود داشته باشد.
**قانون Silent Change:** هر تفاوت باید ذکر شود.
```

---

---

## راهنمای وضعیت‌ها

| نماد | معنا |
|---|---|
| ✅ | تأیید شد — فایل بررسی شد و مشکلی نیست |
| ❌ | مشکل دارد یا وجود ندارد |
| ⚠️ | وجود دارد ولی ناقص است |
| N/A | به این فایل/صفحه مربوط نیست (با دلیل) |
| N/S | فایل مرجع در context نشان داده نشده — ادعایی نمی‌شود |

## قوانین جهانی (در همه فازها)

1. **Read-First:** فایل را کامل view کن قبل از هر تغییر.
2. **Scope Awareness:** فقط از فایل‌های موجود در context ادعا کن.
3. **Smallest Safe Change:** کمترین تغییر ممکن.
4. **No Speculative Improvements:** کد کار می‌کند؟ تغییر نده.
5. **Silent Change Rule:** هر تفاوت باید ذکر شود.
6. **Risk Protocol:**
   - 🟢 Low → اعمال مستقیم
   - 🟡 Medium → diff نشان بده، سپس اعمال
   - 🔴 High → diff + rationale، منتظر تأیید بمان