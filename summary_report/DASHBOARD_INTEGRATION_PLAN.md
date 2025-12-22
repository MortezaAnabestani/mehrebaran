# 📊 برنامه جامع Integration داشبورد با Backend مهربران

> **تاریخ تهیه:** ۲۱ آبان ۱۴۰۴
> **نسخه:** 1.0.0
> **وضعیت:** نیاز به تصمیم‌گیری کاربر

---

## 🎯 خلاصه اجرایی

**داشبورد فعلی:** یک CMS کامل برای مدیریت سایت خبری/مجله (vaqayet.com)
**Backend مهربران:** پلتفرم شبکه اجتماعی خیریه با امکانات Needs، Teams، Gamification

**نتیجه:** تفاوت اساسی در مدل داده و business logic

---

## 📊 مقایسه ساختاری

### داشبورد موجود:
- **Technology:** React 18 + Vite + Redux Toolkit
- **UI:** Material Tailwind
- **Pages:** 51 صفحه
- **Components:** 32 کامپوننت
- **Features:** 20+ ماژول CMS

### Backend مهربران:
- **Technology:** Express.js + TypeScript + MongoDB
- **Models:** 38 مدل
- **API Endpoints:** 150+ endpoint
- **Features:** Social Network + Gamification + Needs Management

---

## ⚠️ تفاوت‌های کلیدی

### 1. مدل‌های داده

| داشبورد فعلی | Backend مهربران | سازگاری |
|--------------|-----------------|---------|
| **Articles** (مقالات) | **Article** | ✅ مشابه |
| **Authors** (نویسندگان) | **Author** | ✅ مشابه |
| **Galleries** (گالری) | **Gallery** | ✅ مشابه |
| **Tags** (برچسب‌ها) | **Tag** | ✅ مشابه |
| **FAQs** (سوالات) | **FAQ** | ✅ مشابه |
| **Sections** (دسته‌بندی) | **Category** | ⚠️ شبیه اما متفاوت |
| **Issues** (شماره نشریه) | ❌ ندارد | ❌ غیرقابل تطبیق |
| **Events** (رویدادها) | ❌ ندارد | ❌ غیرقابل تطبیق |
| **Educations** (آموزش) | ❌ ندارد | ❌ غیرقابل تطبیق |
| **Honors** (افتخارات) | ❌ ندارد | ❌ غیرقابل تطبیق |
| **Banners** (بنرها) | ❌ ندارد | ❌ غیرقابل تطبیق |
| **Admins** (مدیران) | **User** (با نقش ADMIN) | ⚠️ متفاوت |
| ❌ ندارد | **Needs** (نیازها) | 🆕 نیاز به افزودن |
| ❌ ندارد | **Teams** (تیم‌ها) | 🆕 نیاز به افزودن |
| ❌ ندارد | **Gamification** (نقاط/نشان‌ها) | 🆕 نیاز به افزودن |
| ❌ ندارد | **Stories** (استوری‌ها) | 🆕 نیاز به افزودن |
| ❌ ندارد | **Projects** (پروژه‌ها) | 🆕 نیاز به افزودن |
| ❌ ندارد | **Social** (Follow/Like/Mention) | 🆕 نیاز به افزودن |
| ❌ ندارد | **Notifications** (اعلانات) | 🆕 نیاز به افزودن |

### 2. Authentication

| ویژگی | داشبورد فعلی | Backend مهربران |
|-------|--------------|-----------------|
| **Method** | Cookie-based | JWT Bearer Token |
| **2FA** | ✅ دارد | ❌ ندارد |
| **reCAPTCHA** | ✅ دارد | ❌ ندارد |
| **Roles** | admin, manager | USER, ADMIN, SUPER_ADMIN |
| **Login Endpoint** | `POST /api/admins/login` | `POST /api/v1/auth/login` |

### 3. API Structure

| ویژگی | داشبورد فعلی | Backend مهربران |
|-------|--------------|-----------------|
| **Base URL** | `/api` | `/api/v1` |
| **Identifier** | slug-based | ID یا slug-based (متغیر) |
| **Pagination** | `page`, `limit` | `skip`, `limit` (احتمالی) |
| **Response Format** | `{ articles: [], totalPages }` | `{ data: [], pagination }` (احتمالی) |
| **Error Format** | `{ error: "message" }` | `{ message: "error" }` (احتمالی) |

---

## 🛠️ راهکارهای پیشنهادی

### روش ۱: تطبیق کامل (Full Adaptation) ⭐ توصیه می‌شود

**مزایا:**
- ✅ استفاده از UI/UX آماده و زیبا
- ✅ کامپوننت‌های آماده و tested
- ✅ Redux state management آماده

**معایب:**
- ❌ نیاز به تغییرات گسترده در API calls
- ❌ حذف بخش‌های غیرقابل استفاده
- ❌ افزودن صفحات جدید برای Needs, Teams, etc.

**مراحل:**
1. حذف ماژول‌های غیرضروری (Issues, Events, Educations, Honors, Banners)
2. تطبیق ماژول‌های مشابه (Articles, Authors, Galleries, Tags, FAQs)
3. افزودن ماژول‌های جدید (Needs, Teams, Gamification, Stories, Projects, Social, Notifications)
4. تغییر authentication به JWT
5. تغییر base URL و response format

---

### روش ۲: استفاده جزئی (Partial Use)

**مزایا:**
- ✅ کار کمتر
- ✅ فقط بخش‌های مشترک استفاده می‌شود

**معایب:**
- ❌ از بسیاری امکانات داشبورد استفاده نمی‌شود
- ❌ نیاز به ساخت صفحات جدید برای features اصلی

**مراحل:**
1. استفاده از Components و Layouts آماده
2. حذف تمام صفحات
3. ساخت صفحات جدید از صفر با کامپوننت‌های آماده

---

### روش ۳: شروع از صفر (Start Fresh)

**مزایا:**
- ✅ کنترل کامل
- ✅ بدون legacy code

**معایب:**
- ❌ زمان‌بر
- ❌ نیاز به طراحی UI/UX از ابتدا

---

## 📋 برنامه عملیاتی روش ۱ (توصیه شده)

### فاز ۱: آماده‌سازی (۱-۲ روز)

#### 1.1 کپی داشبورد به پروژه
```bash
cp -r /home/user/mehrebaran/temp-dashboard/dashboard /home/user/mehrebaran/packages/dashboard
```

#### 1.2 تغییر Environment Variables
```env
# .env
VITE_SERVER_PUBLIC_API_URL=http://localhost:5001/api/v1
VITE_SERVER_PUBLIC_API_URL_WITHOUT_API=http://localhost:5001
```

#### 1.3 نصب Dependencies
```bash
cd packages/dashboard
pnpm install
```

---

### فاز ۲: حذف ماژول‌های غیرضروری (۱ روز)

**فایل‌ها/پوشه‌های قابل حذف:**

```
src/pages/issues/          ❌ حذف
src/pages/events/          ❌ حذف
src/pages/educations/      ❌ حذف
src/pages/honors/          ❌ حذف
src/pages/banners/         ❌ حذف
src/pages/camp/            ❌ حذف
src/pages/applications/    ❌ حذف (یا تطبیق)
src/pages/users/           ⚠️ نگه‌داری اما تغییر
src/pages/comments/        ⚠️ نگه‌داری اما تغییر

src/features/issuesSlice.js         ❌ حذف
src/features/eventsSlice.js          ❌ حذف
src/features/educationsSlice.js      ❌ حذف
src/features/honorsSlice.js          ❌ حذف
src/features/bannersSlice.js         ❌ حذف
src/features/adBannerSlice.js        ❌ حذف

src/hooks/useIssueForm.js       ❌ حذف
src/hooks/useEventForm.js       ❌ حذف
src/hooks/useEducationForm.js   ❌ حذف
src/hooks/useHonorForm.js       ❌ حذف
src/hooks/useBannerForm.js      ❌ حذف
```

---

### فاز ۳: تطبیق Authentication (۲-۳ روز)

#### 3.1 تغییر Login Page
**فایل:** `src/pages/auth/LoginPage.jsx`

**تغییرات:**
```javascript
// قبل (Cookie-based)
const response = await axios.post('/api/admins/login', {
  username,
  password,
  recaptchaValue
}, { withCredentials: true });

// بعد (JWT-based)
const response = await axios.post('/api/v1/auth/login', {
  mobile,  // یا email
  password
});

// ذخیره token در localStorage
localStorage.setItem('token', response.data.token);
```

#### 3.2 تغییر Axios Config
**فایل جدید:** `src/services/api.js`

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_PUBLIC_API_URL
});

// Request interceptor - افزودن token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - مدیریت 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### 3.3 تغییر Protected Route
**فایل:** `src/routes/ProtectedRoute.jsx`

```javascript
// قبل
const isAuthenticated = /* check cookie */;

// بعد
const token = localStorage.getItem('token');
const isAuthenticated = !!token;
```

---

### فاز ۴: تطبیق ماژول‌های مشترک (۳-۵ روز)

#### 4.1 Articles (مقالات)

**API Mapping:**
```javascript
// قبل
GET /api/articles?title=&section=&author=&status=&tags=&page=&limit=&sort=
POST /api/articles
PUT /api/articles/:slug
DELETE /api/articles/:slug

// بعد
GET /api/v1/blog/articles?title=&category=&author=&status=&tags=&page=&limit=&sort=
POST /api/v1/blog/articles
PATCH /api/v1/blog/articles/:id  // یا :slug
DELETE /api/v1/blog/articles/:id
```

**فایل‌های نیاز به تغییر:**
- `src/features/articlesSlice.js`
- `src/pages/articles/Articles.jsx`
- `src/pages/articles/CreateArticle.jsx`
- `src/pages/articles/EditArticle.jsx`

#### 4.2 Authors (نویسندگان)

**API Mapping:**
```javascript
// قبل
GET /api/authors
POST /api/authors
PUT /api/authors/:slug
DELETE /api/authors/:slug

// بعد
GET /api/v1/authors
POST /api/v1/authors
PATCH /api/v1/authors/:id
DELETE /api/v1/authors/:id
```

#### 4.3 Galleries (گالری‌ها)

**API Mapping:**
```javascript
// قبل
GET /api/galleries
POST /api/galleries
PUT /api/galleries/:slug
DELETE /api/galleries/:slug

// بعد
GET /api/v1/blog/gallery
POST /api/v1/blog/gallery
PATCH /api/v1/blog/gallery/:id
DELETE /api/v1/blog/gallery/:id
```

#### 4.4 Tags (برچسب‌ها)

**API Mapping:**
```javascript
// قبل
GET /api/tags
POST /api/tags
PUT /api/tags/:id
DELETE /api/tags/:id

// بعد
GET /api/v1/tags
POST /api/v1/tags
PATCH /api/v1/tags/:id
DELETE /api/v1/tags/:id
```

#### 4.5 FAQs (سوالات متداول)

**API Mapping:**
```javascript
// قبل
GET /api/faqs
POST /api/faqs
PUT /api/faqs/:id
DELETE /api/faqs/:id

// بعد
GET /api/v1/faqs
POST /api/v1/faqs
PATCH /api/v1/faqs/:id
DELETE /api/v1/faqs/:id
```

---

### فاز ۵: افزودن ماژول‌های جدید (۵-۱۰ روز)

#### 5.1 Needs (نیازها) - اصلی‌ترین ماژول

**صفحات جدید:**
```
src/pages/needs/
├── Needs.jsx                    # لیست نیازها
├── CreateNeed.jsx               # ایجاد نیاز
├── EditNeed.jsx                 # ویرایش نیاز
├── NeedDetails.jsx              # جزئیات نیاز
├── NeedBudget.jsx               # مدیریت بودجه
├── NeedMilestones.jsx           # مدیریت مایلستون‌ها
├── NeedTasks.jsx                # مدیریت تسک‌ها
├── NeedSupporters.jsx           # مدیریت حمایت‌کنندگان
└── NeedVerifications.jsx        # مدیریت تاییدیه‌ها
```

**Redux Slice:**
```javascript
// src/features/needsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchNeeds = createAsyncThunk('needs/fetchAll', async (filters) => {
  const response = await api.get('/needs', { params: filters });
  return response.data;
});

// ... سایر thunks

const needsSlice = createSlice({
  name: 'needs',
  initialState: { needs: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    // ... handles
  }
});
```

**Hook:**
```javascript
// src/hooks/useNeedForm.js
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const needSchema = yup.object({
  title: yup.string().min(5).required(),
  description: yup.string().min(20).required(),
  category: yup.string().required(),
  urgencyLevel: yup.string().oneOf(['low', 'medium', 'high', 'critical']),
  // ... سایر فیلدها
});

export const useNeedForm = (defaultValues) => {
  return useForm({
    resolver: yupResolver(needSchema),
    defaultValues
  });
};
```

#### 5.2 Teams (تیم‌ها)

**صفحات جدید:**
```
src/pages/teams/
├── Teams.jsx                    # لیست تیم‌ها
├── CreateTeam.jsx               # ایجاد تیم
├── EditTeam.jsx                 # ویرایش تیم
├── TeamDetails.jsx              # جزئیات تیم
├── TeamMembers.jsx              # مدیریت اعضا
└── TeamInvitations.jsx          # مدیریت دعوت‌نامه‌ها
```

#### 5.3 Gamification (گیمیفیکیشن)

**صفحات جدید:**
```
src/pages/gamification/
├── Badges.jsx                   # مدیریت نشان‌ها
├── CreateBadge.jsx              # ایجاد نشان
├── EditBadge.jsx                # ویرایش نشان
├── Leaderboard.jsx              # جدول امتیازات
├── UserStats.jsx                # آمار کاربران
└── PointTransactions.jsx        # تراکنش‌های امتیاز
```

#### 5.4 Stories (استوری‌ها)

**صفحات جدید:**
```
src/pages/stories/
├── Stories.jsx                  # لیست استوری‌ها
├── StoryDetails.jsx             # جزئیات استوری
└── StoryHighlights.jsx          # هایلایت‌ها
```

#### 5.5 Projects (پروژه‌ها)

**صفحات جدید:**
```
src/pages/projects/
├── Projects.jsx                 # لیست پروژه‌ها
├── CreateProject.jsx            # ایجاد پروژه
├── EditProject.jsx              # ویرایش پروژه
└── ProjectDetails.jsx           # جزئیات پروژه
```

#### 5.6 Social Features (ویژگی‌های اجتماعی)

**صفحات جدید:**
```
src/pages/social/
├── Follows.jsx                  # مدیریت فالوها
├── Likes.jsx                    # مدیریت لایک‌ها
├── Mentions.jsx                 # مدیریت منشن‌ها
├── Shares.jsx                   # مدیریت اشتراک‌گذاری‌ها
└── Tags.jsx                     # مدیریت تگ‌های اجتماعی
```

#### 5.7 Notifications (اعلانات)

**صفحات جدید:**
```
src/pages/notifications/
├── Notifications.jsx            # لیست اعلانات
├── NotificationSettings.jsx    # تنظیمات اعلانات
└── PushTokens.jsx               # مدیریت توکن‌های push
```

---

### فاز ۶: تست و Debug (۲-۳ روز)

1. تست login/logout
2. تست CRUD operations
3. تست pagination
4. تست file upload
5. تست error handling
6. تست responsive design

---

### فاز ۷: Deployment (۱ روز)

1. Build production
2. تنظیم ENV variables
3. Deploy به سرور
4. تست production

---

## 📊 تخمین زمان

| فاز | زمان تخمینی |
|-----|-------------|
| فاز ۱: آماده‌سازی | ۱-۲ روز |
| فاز ۲: حذف ماژول‌های غیرضروری | ۱ روز |
| فاز ۳: تطبیق Authentication | ۲-۳ روز |
| فاز ۴: تطبیق ماژول‌های مشترک | ۳-۵ روز |
| فاز ۵: افزودن ماژول‌های جدید | ۵-۱۰ روز |
| فاز ۶: تست و Debug | ۲-۳ روز |
| فاز ۷: Deployment | ۱ روز |
| **جمع کل** | **۱۵-۲۷ روز** |

---

## ⚠️ چالش‌های احتمالی

### 1. تفاوت Response Format
**چالش:** Backend مهربران ممکن است response format متفاوتی داشته باشد
**راه‌حل:** ایجاد یک adapter layer در Redux slices

### 2. File Upload
**چالش:** Backend ممکن است multipart/form-data را متفاوت handle کند
**راه‌حل:** بررسی و تطبیق با multer configuration backend

### 3. Slug vs ID
**چالش:** بعضی endpoints slug دارند، بعضی ID
**راه‌حل:** تطبیق با backend یا ایجاد wrapper functions

### 4. Pagination
**چالش:** سبک pagination متفاوت
**راه‌حل:** تطبیق query parameters

---

## 🎯 توصیه‌های من

### توصیه ۱: شروع با فازهای ۱-۴ (Minimum Viable Dashboard)
ابتدا فقط:
- Authentication
- Articles
- Authors
- Galleries
- Tags
- FAQs

**مزیت:** سریع‌تر آماده می‌شود و می‌توانید تست کنید

### توصیه ۲: افزودن تدریجی ماژول‌های جدید
بعد از اطمینان از کارکرد صحیح فازهای ۱-۴:
- هر هفته یک ماژول جدید (Needs, Teams, etc.)

### توصیه ۳: استفاده از TypeScript
تبدیل داشبورد به TypeScript برای type safety بهتر

---

## 🤔 سوالات برای تصمیم‌گیری

قبل از شروع، لطفاً به این سوالات پاسخ دهید:

1. **آیا می‌خواهید از تمام UI/UX داشبورد موجود استفاده کنید؟**
   - [ ] بله، با تغییرات لازم (روش ۱)
   - [ ] خیر، فقط کامپوننت‌ها (روش ۲)
   - [ ] خیر، از صفر شروع می‌کنیم (روش ۳)

2. **کدام features را در اولویت قرار می‌دهید؟**
   - [ ] Blog (Articles, Authors, Galleries)
   - [ ] Needs Management
   - [ ] Teams & Collaboration
   - [ ] Gamification
   - [ ] Social Features
   - [ ] همه موارد

3. **چه زمانی می‌خواهید dashboard آماده شود؟**
   - [ ] سریع (۱-۲ هفته) - MVP
   - [ ] متوسط (۳-۴ هفته) - کامل‌تر
   - [ ] کامل (۱-۲ ماه) - تمام features

4. **آیا backend مهربران API های لازم را دارد؟**
   - [ ] بله، همه endpoints آماده است
   - [ ] خیر، نیاز به توسعه backend هم هست
   - [ ] مطمئن نیستم

5. **آیا می‌خواهید من شروع به پیاده‌سازی کنم؟**
   - [ ] بله، فوراً شروع کن (کدام فاز؟)
   - [ ] ابتدا یک demo ساده بساز
   - [ ] فقط راهنمایی کن، خودم انجام می‌دهم

---

**منتظر تصمیم شما هستم!** 🚀

بگویید از کدام روش استفاده کنیم و از کجا شروع کنیم؟
