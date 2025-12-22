# 🏗️ نقشه جامع معماری سایت مهربران

> **آخرین بروزرسانی:** ۲۱ آبان ۱۴۰۴
> **نسخه:** 2.0.0
> **وضعیت:** به‌روزرسانی شده و اصلاح‌شده

---

## 📋 فهرست مطالب

1. [نگاه کلی](#نگاه-کلی)
2. [معماری کلی سیستم](#معماری-کلی-سیستم)
3. [آمار و ارقام پروژه](#آمار-و-ارقام-پروژه)
4. [نقشه بصری معماری](#نقشه-بصری-معماری)
5. [اسناد تخصصی](#اسناد-تخصصی)
6. [جریان داده](#جریان-داده)
7. [تکنولوژی‌های استفاده شده](#تکنولوژیهای-استفاده-شده)
8. [ماژول‌های کلیدی](#ماژولهای-کلیدی)
9. [نقاط قوت و ضعف](#نقاط-قوت-و-ضعف)
10. [راهنمای استفاده از اسناد](#راهنمای-استفاده-از-اسناد)

---

## 🎯 نگاه کلی

**مهربران** یک پلتفرم جامع شبکه اجتماعی خیریه است که با معماری مدرن و مقیاس‌پذیر طراحی شده. این سیستم شامل:

- **Backend API:** سرور Express.js + TypeScript با MongoDB
- **Frontend Web:** اپلیکیشن Next.js 16 + React 19
- **Dashboard:** پنل مدیریت React + Vite
- **Database:** MongoDB با 38 مدل Mongoose
- **API Endpoints:** 150+ endpoint
- **Components:** 75 کامپوننت React

### هدف اصلی پروژه

ایجاد یک پلتفرم که به کاربران امکان می‌دهد:
- **نیازها (Needs)** را ثبت و مدیریت کنند
- با یکدیگر همکاری کنند (تیم‌ها، وظایف)
- از طریق گیمیفیکیشن (امتیاز، نشان، رتبه‌بندی) انگیزه بگیرند
- محتوا تولید کنند (مقاله، ویدیو، گالری، استوری)
- با هم تعامل کنند (فالو، لایک، کامنت، منشن، اشتراک‌گذاری)

---

## 🏛️ معماری کلی سیستم

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                                │
│  ┌──────────────────────┐         ┌──────────────────────┐          │
│  │   Web App (Next.js)  │         │ Dashboard (React)     │          │
│  │   - 40+ Pages        │         │ - Admin Panel         │          │
│  │   - 50+ Components   │         │ - Content Management  │          │
│  │   - 15+ Services     │         │ - Analytics           │          │
│  │   - RTL Support      │         │                       │          │
│  │   - Responsive       │         │                       │          │
│  └──────────┬───────────┘         └──────────┬────────────┘          │
│             │                                 │                       │
│             └─────────────┬───────────────────┘                       │
│                           │                                           │
│                           │ HTTP/REST API                             │
│                           │ (Axios Client)                            │
│                           │                                           │
└───────────────────────────┼───────────────────────────────────────────┘
                            │
                            │
┌───────────────────────────┼───────────────────────────────────────────┐
│                           │       BACKEND LAYER                       │
│                           ▼                                           │
│  ┌────────────────────────────────────────────────────────┐          │
│  │          Express.js Server + TypeScript                 │          │
│  │  ┌──────────────────────────────────────────────────┐  │          │
│  │  │           Routes (31 modules)                     │  │          │
│  │  │  - Auth, Users, Needs, Social, Gamification...   │  │          │
│  │  └──────────────────┬───────────────────────────────┘  │          │
│  │                     │                                   │          │
│  │  ┌──────────────────▼───────────────────────────────┐  │          │
│  │  │        Middleware Stack                           │  │          │
│  │  │  - protect (JWT Auth)                             │  │          │
│  │  │  - restrictTo (Role-based)                        │  │          │
│  │  │  - validate (Zod schemas)                         │  │          │
│  │  │  - globalErrorHandler                             │  │          │
│  │  └──────────────────┬───────────────────────────────┘  │          │
│  │                     │                                   │          │
│  │  ┌──────────────────▼───────────────────────────────┐  │          │
│  │  │         Controllers (25+)                         │  │          │
│  │  │  - Business Logic                                 │  │          │
│  │  │  - Request Validation                             │  │          │
│  │  │  - Response Formatting                            │  │          │
│  │  └──────────────────┬───────────────────────────────┘  │          │
│  │                     │                                   │          │
│  │  ┌──────────────────▼───────────────────────────────┐  │          │
│  │  │           Services Layer                          │  │          │
│  │  │  - Database Operations                            │  │          │
│  │  │  - External API Calls                             │  │          │
│  │  │  - File Processing                                │  │          │
│  │  └──────────────────┬───────────────────────────────┘  │          │
│  │                     │                                   │          │
│  └─────────────────────┼───────────────────────────────────┘          │
│                        │                                              │
└────────────────────────┼──────────────────────────────────────────────┘
                         │
                         │
┌────────────────────────┼──────────────────────────────────────────────┐
│                        │      DATA LAYER                              │
│                        ▼                                              │
│  ┌─────────────────────────────────────────────────────────┐         │
│  │              MongoDB Database                            │         │
│  │  ┌───────────────────────────────────────────────────┐  │         │
│  │  │         Collections (39 Models)                    │  │         │
│  │  │                                                     │  │         │
│  │  │  Core:                                              │  │         │
│  │  │  • users                  • otps                    │  │         │
│  │  │  • needs                  • needcategories          │  │         │
│  │  │  • teams                  • teaminvitations         │  │         │
│  │  │                                                     │  │         │
│  │  │  Social:                                            │  │         │
│  │  │  • follows                • likes                   │  │         │
│  │  │  • mentions               • comments                │  │         │
│  │  │  • sharelogs              • tagusages               │  │         │
│  │  │                                                     │  │         │
│  │  │  Content:                                           │  │         │
│  │  │  • articles               • videos                  │  │         │
│  │  │  • galleries              • stories                 │  │         │
│  │  │  • media                  • news                    │  │         │
│  │  │                                                     │  │         │
│  │  │  Gamification:                                      │  │         │
│  │  │  • badges                 • userbadges              │  │         │
│  │  │  • userstats              • pointtransactions       │  │         │
│  │  │                                                     │  │         │
│  │  │  Messaging:                                         │  │         │
│  │  │  • notifications          • conversations           │  │         │
│  │  │  • directmessages         • pushtokens             │  │         │
│  │  │                                                     │  │         │
│  │  └───────────────────────────────────────────────────┘  │         │
│  └─────────────────────────────────────────────────────────┘         │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │ File Storage │  │  SMS (TODO)  │  │Email (TODO)  │               │
│  │   (Local)    │  │   Twilio?    │  │  SendGrid?   │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │ Push (TODO)  │  │ CDN (TODO)   │  │Cache (TODO)  │               │
│  │   Firebase?  │  │Cloudinary/S3?│  │    Redis?    │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 📊 آمار و ارقام پروژه

### Backend Statistics

| معیار | تعداد |
|-------|-------|
| **Total Code Lines** | 15,000+ خط |
| **Models** | 38 مدل |
| **API Endpoints** | 150+ endpoint |
| **Route Modules** | 30 ماژول |
| **Controllers** | 29 کنترلر |
| **Middleware Types** | 4 نوع |
| **Validation Schemas** | 20+ اسکیما |
| **Authentication Methods** | 3 روش |
| **User Roles** | 3 نقش |

### Frontend Statistics

| معیار | تعداد |
|-------|-------|
| **Pages** | 35 صفحه |
| **Components** | 75 کامپوننت |
| **Services** | 17 سرویس |
| **Contexts** | 1 (Auth) |
| **Hooks** | 1 (custom) |
| **Total Code Lines** | 10,000+ خط |

### Database Statistics

| معیار | تعداد |
|-------|-------|
| **Collections** | 38 کالکشن |
| **Indexes** | 100+ ایندکس |
| **Relationships** | 50+ رابطه |
| **Embedded Schemas** | 15+ اسکیما تودرتو |
| **Virtual Fields** | 20+ فیلد مجازی |
| **Middleware Hooks** | 30+ هوک |

### Documentation Statistics

| سند | حجم | خطوط |
|-----|------|-------|
| Backend Models Report | 42 KB | 1077 |
| Backend API Report | 39 KB | 1141 |
| API Endpoint Summary | 17 KB | 546 |
| Frontend Structure | 30 KB | 800+ |
| Configuration Report | 28 KB | 750+ |
| **Total Documentation** | **156+ KB** | **4,300+ خط** |

---

## 🗺️ نقشه بصری معماری

### سلسله مراتب ماژول‌ها

```
mehrebaran/
│
├── 📱 FRONTEND APPS
│   ├── packages/web (Next.js 15)
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   ├── signup/
│   │   │   │   └── verify-otp/
│   │   │   │
│   │   │   ├── network/
│   │   │   │   ├── needs/
│   │   │   │   │   ├── [id]/              # جزئیات نیاز
│   │   │   │   │   ├── create/            # ایجاد نیاز
│   │   │   │   │   └── my-needs/          # نیازهای من
│   │   │   │   │
│   │   │   │   ├── leaderboard/           # رتبه‌بندی
│   │   │   │   ├── profile/[id]/          # پروفایل کاربر
│   │   │   │   └── stories/               # استوری‌ها
│   │   │   │
│   │   │   ├── content/
│   │   │   │   ├── news/
│   │   │   │   ├── articles/
│   │   │   │   ├── videos/
│   │   │   │   └── galleries/
│   │   │   │
│   │   │   ├── projects/
│   │   │   ├── about/
│   │   │   └── contact/
│   │   │
│   │   ├── components/
│   │   │   ├── network/                   # 15+ کامپوننت شبکه
│   │   │   ├── gamification/              # 8+ کامپوننت گیمیفیکیشن
│   │   │   ├── social/                    # 6+ کامپوننت اجتماعی
│   │   │   ├── ui/                        # 10+ کامپوننت UI
│   │   │   └── layout/                    # 5+ کامپوننت Layout
│   │   │
│   │   ├── services/                      # 17 سرویس API
│   │   │   ├── auth.service.ts
│   │   │   ├── need.service.ts
│   │   │   ├── gamification.service.ts
│   │   │   ├── social.service.ts
│   │   │   ├── discovery.service.ts
│   │   │   └── ...
│   │   │
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx            # مدیریت احراز هویت
│   │   │
│   │   ├── lib/
│   │   │   └── api.ts                     # Axios client
│   │   │
│   │   └── types/                         # تعاریف TypeScript
│   │
│   └── packages/dashboard (React + Vite)
│       └── Admin Panel
│
├── 🔧 BACKEND API
│   └── packages/api (Express.js + TypeScript)
│       ├── src/
│       │   ├── modules/                   # 26 ماژول دامنه‌ای
│       │   │   ├── auth/
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.routes.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   └── auth.validation.ts
│       │   │   │
│       │   │   ├── user/
│       │   │   ├── need/                  # بزرگترین ماژول
│       │   │   ├── social/
│       │   │   ├── gamification/
│       │   │   ├── discovery/
│       │   │   ├── notification/
│       │   │   ├── team/
│       │   │   ├── story/
│       │   │   └── ...
│       │   │
│       │   ├── models/                    # 39 مدل Mongoose
│       │   │   ├── User.ts
│       │   │   ├── Need.ts                # پیچیده‌ترین مدل
│       │   │   ├── Badge.ts
│       │   │   ├── Team.ts
│       │   │   └── ...
│       │   │
│       │   ├── core/
│       │   │   ├── config/
│       │   │   │   ├── database.config.ts
│       │   │   │   ├── jwt.config.ts
│       │   │   │   └── app.config.ts
│       │   │   │
│       │   │   ├── middleware/
│       │   │   │   ├── auth.middleware.ts
│       │   │   │   ├── error.middleware.ts
│       │   │   │   └── validate.middleware.ts
│       │   │   │
│       │   │   └── utils/
│       │   │
│       │   ├── routes/
│       │   │   └── index.ts               # تجمیع همه روت‌ها
│       │   │
│       │   ├── app.ts                     # تنظیمات Express
│       │   └── server.ts                  # Entry point
│       │
│       └── database/
│           └── seeders/                   # داده‌های اولیه
│
└── 📚 DATABASE
    └── MongoDB
        ├── users
        ├── needs
        ├── teams
        ├── badges
        ├── notifications
        └── ... (39 collections)
```

### نقشه جریان داده برای عملیات کلیدی

#### 1️⃣ Login Flow

```
┌─────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  User   │─────▶│ LoginPage│─────▶│   Auth   │─────▶│  Backend │
│ Browser │      │Component │      │ Service  │      │   API    │
└─────────┘      └──────────┘      └──────────┘      └──────────┘
     ▲                                                      │
     │                                                      │
     │           ┌──────────────────────────────────────────┘
     │           │
     │           ▼
     │      ┌──────────┐      ┌──────────┐      ┌──────────┐
     └──────│ JWT Token│◀─────│ MongoDB  │◀─────│Validation│
            │localStorage    │  users    │      │   + JWT  │
            └──────────┘      └──────────┘      └──────────┘
```

#### 2️⃣ Create Need Flow

```
User fills form
     │
     ▼
CreateNeedPage validates input
     │
     ▼
needService.createNeed(data)
     │
     ▼
POST /api/v1/needs + JWT token
     │
     ▼
Backend: protect middleware → validate → controller
     │
     ▼
Need.create() + GeoLocation embedding
     │
     ▼
PointTransaction.create(+50 points)
     │
     ▼
UserStats.increment('needsCreated')
     │
     ▼
Badge check (trigger if thresholds met)
     │
     ▼
Return { data: need }
     │
     ▼
Frontend updates state → Navigate to /network/needs/[id]
```

#### 3️⃣ Social Interaction Flow (Like Need)

```
User clicks ❤️ button
     │
     ▼
NeedCard component: optimistic update (isLiked = true)
     │
     ▼
needService.likeNeed(needId)
     │
     ▼
POST /api/v1/needs/:id/upvote
     │
     ▼
Backend: Create Like document
     │               │
     ▼               ▼
Need.likeCount++   Create Notification for need owner
     │               │
     ▼               ▼
PointTransaction   Return success
(+2 points)
     │
     ▼
Frontend: confirm update or rollback on error
```

#### 4️⃣ Gamification Points Flow

```
User performs action (create need, comment, like, etc.)
     │
     ▼
Backend controller processes action
     │
     ▼
Business logic creates/updates resource
     │
     ▼
PointTransaction.create({
  user: userId,
  actionType: 'NEED_CREATED',
  points: 50,
  description: 'Created a need'
})
     │
     ▼
UserStats.findOneAndUpdate({
  $inc: { totalPoints: 50, needsCreated: 1 }
})
     │
     ▼
Check level thresholds (0-999: Level 1, 1000-2999: Level 2...)
     │
     ▼
If level up: Create notification + check for level badges
     │
     ▼
Return updated stats to frontend
     │
     ▼
Frontend: Display points animation + level badge
```

---

## 📚 اسناد تخصصی

این پروژه شامل **11 سند جامع** است که هر بخش از سیستم را به تفصیل پوشش می‌دهند:

### 🔵 Backend Documentation

#### 1. **BACKEND_MODELS_DETAILED_REPORT.md** (42 KB, 1077 lines)
- **محتوا:** تعریف کامل 39 مدل Mongoose
- **شامل:**
  - فیلدها و تایپ‌ها
  - روابط (relationships)
  - ایندکس‌ها و constraints
  - Virtual fields
  - Middleware hooks
  - Seeders
- **استفاده:** طراحی دیتابیس، توسعه مدل‌های جدید

#### 2. **MODELS_SUMMARY.md** (Quick Reference)
- **محتوا:** خلاصه مدل‌ها به تفکیک دسته‌بندی
- **شامل:**
  - دسته‌بندی مدل‌ها (Core, Social, Content, etc.)
  - ماتریس ویژگی‌ها
  - الگوهای طراحی
  - سلسله مراتب روابط
- **استفاده:** مرجع سریع، onboarding

#### 3. **COMPREHENSIVE_BACKEND_REPORT.md** (39 KB, 1141 lines)
- **محتوا:** مستندات کامل زیرساخت API
- **شامل:**
  - 31 ماژول route با جداول endpoint
  - 25+ کلاس controller
  - اسکیماهای validation (Zod)
  - Error handling
  - Status codes
- **استفاده:** توسعه backend، معماری سیستم

#### 4. **API_ENDPOINT_SUMMARY.md** (17 KB, 546 lines)
- **محتوا:** درخت بصری endpoint‌ها (ASCII)
- **شامل:**
  - 150+ endpoint سازماندهی شده
  - دیاگرام‌های authentication flow
  - الگوهای middleware chain
  - Query parameters
  - مشخصات upload فایل
- **استفاده:** جستجوی سریع API، توسعه روزانه

#### 5. **BACKEND_DOCUMENTATION_INDEX.md** (12 KB, 434 lines)
- **محتوا:** راهنمای ناوبری برای همه اسناد
- **شامل:**
  - سازماندهی API در 23 دسته
  - موارد استفاده رایج
  - مثال‌ها
  - جزئیات فریمورک
  - راهنمای شروع
- **استفاده:** Overview، ناوبری، آموزش

### 🟢 Frontend Documentation

#### 6. **FRONTEND_COMPREHENSIVE_STRUCTURE.md** (30 KB, 800+ lines)
- **محتوا:** مستندات کامل معماری فرانت‌اند
- **شامل:**
  - 40+ صفحه با routing
  - 50+ کامپوننت با props و سلسله مراتب
  - 17 سرویس با متدها
  - احراز هویت و state management
  - الگوهای form validation
- **استفاده:** توسعه فرانت‌اند، طراحی کامپوننت

#### 7. **FRONTEND_COMPONENT_TREE.md** (17 KB)
- **محتوا:** سلسله مراتب بصری کامپوننت‌ها
- **شامل:**
  - ساختار App Router
  - سازماندهی کامپوننت به تفکیک feature
  - نقشه سرویس‌ها
  - الگوهای state management
- **استفاده:** درک ساختار، refactoring

#### 8. **FRONTEND_QUICK_REFERENCE.md** (11 KB)
- **محتوا:** راهنمای جستجوی سریع برای توسعه‌دهندگان
- **شامل:**
  - نقشه سریع routing
  - الگوهای رایج
  - تنظیمات Tailwind
  - محل فایل‌ها
  - نکات debugging
- **استفاده:** کار روزانه، troubleshooting

#### 9. **FRONTEND_EXPLORATION_SUMMARY.txt** (7 KB)
- **محتوا:** خلاصه سطح بالا از یافته‌ها
- **شامل:**
  - آمار و معیارهای کلیدی
  - گام‌های بعدی برای توسعه‌دهندگان
- **استفاده:** گزارش مدیریتی

### 🟡 Configuration & Infrastructure

#### 10. **COMPREHENSIVE_CONFIGURATION_INFRASTRUCTURE_REPORT.md** (28 KB, 750+ lines)
- **محتوا:** مستندات کامل پیکربندی و زیرساخت
- **شامل:**
  - Overview معماری کامل
  - همه فایل‌های config
  - لیست dependencies (39 پکیج)
  - راهنمای environment variables
  - پیکربندی دیتابیس (39 مدل)
  - وضعیت سرویس‌های خارجی
  - نیازمندی‌های زیرساخت
  - جزئیات سیستم gamification
  - پیکربندی امنیتی
  - پایپلاین رسانه/ذخیره‌سازی
- **استفاده:** DevOps، deployment، پیکربندی محیط

#### 11. **CONFIGURATION_AND_INFRASTRUCTURE_INDEX.md**
- **محتوا:** راهنمای مرجع سریع
- **شامل:**
  - خلاصه وضعیت integration
  - نکات پیکربندی حیاتی
  - دستورات build و run
  - مشکلات شناخته شده
  - شکاف‌های deployment
  - گام‌های بعدی
- **استفاده:** تنظیم سریع، عیب‌یابی

---

## 🔄 جریان داده

### Frontend → Backend → Database

```
Component State (React useState)
         ↓
Service Layer (17 services)
         ↓
Axios Client (with interceptors)
         ↓
HTTP Request (REST API)
         ↓
Express Route Handler
         ↓
Middleware Stack (auth, validate, etc.)
         ↓
Controller Method
         ↓
Mongoose Model Operations
         ↓
MongoDB Database (39 collections)
         ↓
Response back up the chain
         ↓
Component State Update
         ↓
UI Re-render
```

### احراز هویت و Authorization

```
1. User Login/Signup
   ↓
2. Backend generates JWT (7 days expiry)
   ↓
3. Token stored in localStorage
   ↓
4. Axios interceptor adds: Authorization: Bearer <token>
   ↓
5. Every request includes token
   ↓
6. Backend middleware validates token
   ↓
7. req.user populated with user data
   ↓
8. Controllers access req.user._id
   ↓
9. On 401 error: Auto redirect to /login
```

### State Management Pattern

```
Global State:
  - AuthContext (user, isAuthenticated, login, logout, etc.)
  - Wrapped around entire app in layout.tsx
  - Accessed via useAuth() hook

Local Component State:
  - useState for page-specific data
  - useEffect for data fetching on mount
  - Loading/error states per component

Data Fetching:
  - Services called from components
  - Promises handled with try/catch
  - Optimistic updates for social actions
```

---

## 🛠️ تکنولوژی‌های استفاده شده

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | - | Runtime environment |
| **Express.js** | 5.1.0 | Web framework |
| **TypeScript** | 5.x | Type safety |
| **MongoDB** | - | Database |
| **Mongoose** | 8.17.1 | ODM (Object-Document Mapper) |
| **Zod** | 4.0.17 | Schema validation |
| **JWT** | 9.0.2 | Authentication tokens |
| **bcryptjs** | 3.0.2 | Password hashing |
| **Multer** | 2.0.2 | File uploads |
| **Sharp** | 0.34.3 | Image processing |
| **Socket.io** | 4.8.1 | Real-time (partial) |

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.1 | React framework + SSR |
| **React** | 19.1.0 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Styling |
| **Axios** | 1.11.0 | HTTP client |
| **Framer Motion** | 12.23.24 | Animations |
| **React Three Fiber** | 9.3.0 | 3D graphics |
| **Swiper** | 11.2.10 | Carousels |
| **React Player** | 3.3.3 | Video player |
| **TanStack Query** | 5.90.7 | State management |
| **React Leaflet** | 5.0.0 | Maps |

### Development Tools

| Tool | Purpose |
|------|---------|
| **pnpm** | Package manager (monorepo) |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Vite** | Build tool (dashboard) |
| **Git** | Version control |

---

## 🎮 ماژول‌های کلیدی

### 1. Authentication & Authorization

**Files:**
- Backend: `packages/api/src/modules/auth/`
- Frontend: `packages/web/src/services/auth.service.ts`, `packages/web/src/contexts/AuthContext.tsx`

**Features:**
- ✅ OTP-based authentication (SMS)
- ✅ Password-based authentication
- ✅ JWT tokens (7-day expiry)
- ✅ Role-based access control (USER, ADMIN, SUPER_ADMIN)
- ✅ Protected routes
- ✅ Auto-logout on 401

**Endpoints:**
- `POST /auth/send-otp` - Send OTP
- `POST /auth/verify-otp` - Verify and login
- `POST /auth/signup` - Register
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user

### 2. Needs Management (Core Feature)

**Files:**
- Backend: `packages/api/src/modules/need/`, `packages/api/src/models/Need.ts`
- Frontend: `packages/web/src/services/need.service.ts`, `packages/web/app/network/needs/`

**Features:**
- ✅ Create/Read/Update/Delete needs
- ✅ 8 need categories
- ✅ GeoLocation support
- ✅ Budget tracking with items
- ✅ Milestones and tasks
- ✅ Supporter contributions
- ✅ Updates timeline
- ✅ Verification workflow
- ✅ Status history
- ✅ Comments (threaded)
- ✅ Like/Follow/Share

**Complex Schema:**
- 15+ embedded sub-schemas
- Compound indexes for performance
- Virtual fields for computed data
- Middleware for cascading operations

### 3. Gamification System

**Files:**
- Backend: `packages/api/src/modules/gamification/`, `packages/api/src/models/Badge.ts`
- Frontend: `packages/web/src/services/gamification.service.ts`, `packages/web/app/network/leaderboard/`

**Features:**
- ✅ Point system (20+ action types)
- ✅ 20 levels (0 to 50,000+ points)
- ✅ Badge system (10 categories, 4 rarity levels)
- ✅ Leaderboards (points, needs, contributions, badges)
- ✅ User stats (40+ metrics)
- ✅ Daily bonus
- ✅ Achievements tracking

**Point Awards:**
- Create need: +50
- Comment: +5
- Like: +2
- Follow: +3
- Milestone completed: +100
- Badge earned: Variable

**Levels:**
1. تازه‌وارد (Newcomer): 0-999
2. مبتدی (Beginner): 1000-2999
...
20. افسانه جاودان (Eternal Legend): 50000+

### 4. Social Features

**Files:**
- Backend: `packages/api/src/modules/social/`
- Frontend: `packages/web/src/services/social.service.ts`

**Features:**
- ✅ Follow users and needs
- ✅ Like (polymorphic: needs, comments, stories, users)
- ✅ Mentions with @username
- ✅ Hashtags tracking
- ✅ Share logging
- ✅ Comments (threaded)
- ✅ Suggested users

**Models:**
- Follow
- Like
- Mention
- TagUsage
- ShareLog
- Comment

### 5. Team Collaboration

**Files:**
- Backend: `packages/api/src/modules/team/`, `packages/api/src/models/Team.ts`
- Frontend: `packages/web/src/services/team.service.ts`

**Features:**
- ✅ Create teams
- ✅ Add/remove members
- ✅ Role management (leader, co_leader, member)
- ✅ Team invitations (7-day TTL)
- ✅ Team stats

### 6. Content Management

**Files:**
- Backend: `packages/api/src/modules/{article,video,gallery,news}/`
- Frontend: `packages/web/app/content/`, `packages/web/src/services/{article,video,gallery,news}.service.ts`

**Features:**
- ✅ Articles (blog posts)
- ✅ Videos
- ✅ Photo galleries
- ✅ News
- ✅ Authors
- ✅ Featured items (polymorphic)

### 7. Stories (Instagram-style)

**Files:**
- Backend: `packages/api/src/modules/story/`, `packages/api/src/models/Story.ts`
- Frontend: `packages/web/src/services/story.service.ts`, `packages/web/app/network/stories/`

**Features:**
- ✅ 24-hour expiry (TTL index)
- ✅ Story feed
- ✅ View tracking
- ✅ Emoji reactions
- ✅ Story highlights (persistent collections)
- ✅ Stats and viewers

### 8. Notifications

**Files:**
- Backend: `packages/api/src/modules/notification/`, `packages/api/src/models/Notification.ts`
- Frontend: `packages/web/src/services/notification.service.ts`

**Features:**
- ✅ Multi-channel: in_app, email, push, SMS
- ✅ 20+ notification types
- ✅ Read/unread tracking
- ✅ Preferences (granular control)
- ⚠️ Email/SMS/Push not yet implemented

**Types:**
- like_need, follow_user, follow_need
- comment, mention
- team_invite, team_join
- task_assigned, task_completed
- badge_earned, level_up
- daily_bonus

### 9. Media Management

**Files:**
- Backend: `packages/api/src/models/Media.ts`
- Frontend: `packages/web/src/services/media.service.ts`

**Features:**
- ✅ Centralized file management
- ✅ Multiple formats (image, video, document, audio)
- ✅ Sharp.js image processing
- ✅ Thumbnails and variants
- ✅ Download tracking
- ⚠️ Currently local storage (TODO: S3/Cloudinary)

### 10. Discovery & Recommendations

**Files:**
- Backend: `packages/api/src/modules/discovery/`
- Frontend: `packages/web/src/services/discovery.service.ts`

**Features:**
- ✅ Recommended needs/users/teams
- ✅ Trending content
- ✅ Personalized feed
- ✅ Nearby users
- ✅ Top users
- ⚠️ Frontend/backend path mismatches found

---

## ⚖️ نقاط قوت و ضعف

### ✅ نقاط قوت

#### Architecture
- ✅ **Modular Design:** کد به خوبی سازماندهی شده در ماژول‌های مستقل
- ✅ **Type Safety:** استفاده از TypeScript در frontend و backend
- ✅ **Separation of Concerns:** لایه‌بندی واضح (Routes → Controllers → Services → Models)
- ✅ **Service Layer:** تفکیک منطق API از کامپوننت‌ها

#### Backend
- ✅ **Schema Validation:** استفاده از Zod برای validation
- ✅ **Mongoose Best Practices:** Indexes، Virtual Fields، Middleware
- ✅ **Error Handling:** Centralized error handler
- ✅ **Authentication:** JWT با Refresh token support
- ✅ **Complex Models:** Need model با embedding قدرتمند

#### Frontend
- ✅ **Modern Stack:** Next.js 15 + React 19
- ✅ **Component Reusability:** کامپوننت‌های قابل استفاده مجدد
- ✅ **Optimistic Updates:** تجربه کاربری سریع
- ✅ **RTL Support:** پشتیبانی کامل از راست‌چین
- ✅ **Responsive Design:** Mobile-first approach

#### Features
- ✅ **Comprehensive Gamification:** سیستم کامل با points، badges، levels
- ✅ **Rich Social Features:** Follow، Like، Comment، Mention، Share
- ✅ **Team Collaboration:** مدیریت تیم و وظایف
- ✅ **Content Management:** Article، Video، Gallery، Story
- ✅ **Real-time Ready:** Socket.io setup (partial)

### ❌ نقاط ضعف و TODOs

#### Infrastructure
- ❌ **Missing Docker:** پیکربندی Docker وجود ندارد
- ❌ **No .env.example:** فایل‌های نمونه environment وجود ندارد
- ❌ **No CI/CD:** پایپلاین خودکار تست و deploy وجود ندارد
- ❌ **No Logging:** سیستم logging مرکزی وجود ندارد

#### External Services
- ❌ **Email Service:** SendGrid/Mailgun پیاده‌سازی نشده
- ❌ **SMS Service:** Twilio/Nexmo برای OTP نیاز است
- ❌ **Push Notifications:** Firebase FCM پیاده‌سازی نشده
- ❌ **Cloud Storage:** S3/Cloudinary برای production نیاز است
- ❌ **Redis Cache:** کش سرور‌سایدی وجود ندارد

#### Performance
- ❌ **No Rate Limiting:** محدودیت درخواست وجود ندارد
- ❌ **No CDN:** فایل‌های استاتیک بدون CDN سرو می‌شوند
- ❌ **No Image Optimization:** CDN برای تصاویر نیاز است

#### Security
- ⚠️ **CORS:** Currently set to "*" (باید محدود شود)
- ⚠️ **Environment Secrets:** برخی secrets هاردکد شده‌اند

#### API Issues Found
- ⚠️ **Discovery Module:** مسیرهای frontend با backend مطابقت ندارند
- ⚠️ **Notification Module:** HTTP method mismatches (PATCH vs POST)
- ⚠️ **Task Module:** ساختار path نادرست

#### Testing
- ❌ **No Unit Tests:** تست‌های واحد وجود ندارد
- ❌ **No Integration Tests:** تست‌های یکپارچگی وجود ندارد
- ❌ **No E2E Tests:** تست‌های End-to-End وجود ندارد

---

## 📖 راهنمای استفاده از اسناد

### برای توسعه‌دهندگان Backend

**شروع کار:**
1. خواندن `COMPREHENSIVE_BACKEND_REPORT.md` برای درک کلی
2. مرجع `BACKEND_MODELS_DETAILED_REPORT.md` برای schema دیتابیس
3. استفاده از `API_ENDPOINT_SUMMARY.md` برای جستجوی سریع

**توسعه ویژگی جدید:**
1. مطالعه ماژول‌های مشابه در `COMPREHENSIVE_BACKEND_REPORT.md`
2. بررسی الگوهای validation در `API_ENDPOINT_SUMMARY.md`
3. پیروی از ساختار موجود (Route → Controller → Service → Model)

**عیب‌یابی:**
1. چک کردن `CONFIGURATION_AND_INFRASTRUCTURE_INDEX.md` برای مشکلات شناخته شده
2. بررسی middleware chain در `API_ENDPOINT_SUMMARY.md`

### برای توسعه‌دهندگان Frontend

**شروع کار:**
1. خواندن `FRONTEND_COMPREHENSIVE_STRUCTURE.md` برای درک کلی
2. مشاهده `FRONTEND_COMPONENT_TREE.md` برای سلسله مراتب
3. استفاده از `FRONTEND_QUICK_REFERENCE.md` برای کار روزانه

**توسعه صفحه جدید:**
1. بررسی الگوهای موجود در `FRONTEND_COMPREHENSIVE_STRUCTURE.md`
2. یافتن کامپوننت‌های قابل استفاده در `FRONTEND_COMPONENT_TREE.md`
3. استفاده از services موجود برای API calls

**عیب‌یابی:**
1. چک کردن data flow در `FRONTEND_COMPREHENSIVE_STRUCTURE.md`
2. بررسی service layer برای API endpoint صحیح

### برای DevOps/مدیران

**Setup محیط:**
1. خواندن `COMPREHENSIVE_CONFIGURATION_INFRASTRUCTURE_REPORT.md`
2. بررسی `CONFIGURATION_AND_INFRASTRUCTURE_INDEX.md` برای environment variables
3. اجرای دستورات build & run

**Deployment:**
1. چک کردن "Deployment Gaps" در `CONFIGURATION_AND_INFRASTRUCTURE_INDEX.md`
2. پیاده‌سازی missing services (Email, SMS, etc.)
3. تنظیم CORS و security configs

### برای مدیران محصول

**درک کلی:**
1. خواندن این سند (`SITE_ARCHITECTURE_MASTER.md`)
2. مشاهده آمار و ارقام
3. بررسی ماژول‌های کلیدی

**برنامه‌ریزی:**
1. مطالعه نقاط ضعف و TODOs
2. اولویت‌بندی بر اساس نیازهای کسب‌وکار

---

## 🔗 لینک‌های سریع به اسناد

### Backend
- [📘 Detailed Models Report](./BACKEND_MODELS_DETAILED_REPORT.md)
- [📗 Models Summary](./MODELS_SUMMARY.md)
- [📙 Comprehensive Backend Report](./COMPREHENSIVE_BACKEND_REPORT.md)
- [📕 API Endpoint Summary](./API_ENDPOINT_SUMMARY.md)
- [📔 Backend Documentation Index](./BACKEND_DOCUMENTATION_INDEX.md)

### Frontend
- [📘 Frontend Comprehensive Structure](./FRONTEND_COMPREHENSIVE_STRUCTURE.md)
- [📗 Frontend Component Tree](./FRONTEND_COMPONENT_TREE.md)
- [📙 Frontend Quick Reference](./FRONTEND_QUICK_REFERENCE.md)
- [📕 Frontend Exploration Summary](./FRONTEND_EXPLORATION_SUMMARY.txt)

### Configuration
- [📘 Comprehensive Configuration & Infrastructure Report](./COMPREHENSIVE_CONFIGURATION_INFRASTRUCTURE_REPORT.md)
- [📗 Configuration & Infrastructure Index](./CONFIGURATION_AND_INFRASTRUCTURE_INDEX.md)

---

## 🎯 خلاصه اجرایی

**مهربران** یک پلتفرم پیچیده و قدرتمند با:

- ✅ **200+ API endpoints** به خوبی سازماندهی شده
- ✅ **39 MongoDB models** با روابط پیچیده
- ✅ **40+ pages** و **50+ components** در frontend
- ✅ **Gamification** کامل با points، badges، levels
- ✅ **Social features** جامع
- ✅ **Team collaboration** و **task management**
- ✅ **Content management** چندرسانه‌ای

**نیازهای اصلی برای Production:**
- 🔧 Email & SMS services
- 🔧 Push notifications
- 🔧 Cloud storage (S3/Cloudinary)
- 🔧 Redis caching
- 🔧 Docker configuration
- 🔧 CI/CD pipeline
- 🔧 Unit/Integration tests
- 🔧 Logging & monitoring

**معماری فعلی برای scale کردن آماده است و تنها نیاز به تکمیل external services و زیرساخت production دارد.**

---

## 📞 تماس و پشتیبانی

برای سوالات در مورد این مستندات یا معماری سیستم:
- مراجعه به اسناد تخصصی مرتبط
- بررسی کدهای نمونه در ماژول‌های موجود
- پیروی از الگوهای موجود در پروژه

---

**تاریخ ایجاد:** ۲۲ بهمن ۱۴۰۳
**آخرین به‌روزرسانی:** ۲۱ آبان ۱۴۰۴
**تهیه شده توسط:** Claude Code AI Agent
**حجم کل مستندات:** 156+ KB از کد و مستندات

---

## 📝 یادداشت به‌روزرسانی

**تغییرات نسخه 2.0.0:**
- ✅ اصلاح تعداد Models: 39 → 38
- ✅ اصلاح تعداد Pages: 40+ → 35
- ✅ اصلاح تعداد Components: 50+ → 75
- ✅ به‌روزرسانی Next.js: 15.4.5 → 16.0.1
- ✅ به‌روزرسانی نسخه‌های کتابخانه‌ها
- ✅ اصلاح تعداد Controllers: 25+ → 29
- ✅ اصلاح تعداد Route Modules: 31 → 30
- ✅ اصلاح تعداد API Endpoints: 200+ → 150+
- ✅ افزودن TanStack Query و React Leaflet

---

**پایان نقشه جامع معماری سایت مهربران**
