# 📋 گزارش جامع Endpoints بک‌اند - شبکه نیازسنجی مهر ایران

**تاریخ ایجاد:** 2025-11-03
**مسیر پایه:** `/api/v1`

---

## 📑 فهرست

1. [Authentication](#1-authentication)
2. [Users](#2-users)
3. [Needs](#3-needs)
4. [Need Categories](#4-need-categories)
5. [Comments](#5-comments)
6. [Teams](#6-teams)
7. [Team Invitations](#7-team-invitations)
8. [Social](#8-social)
9. [Gamification](#9-gamification)
10. [Discovery](#10-discovery)
11. [Notifications](#11-notifications)
12. [Stories](#12-stories)
13. [Media](#13-media)
14. [Direct Messages](#14-direct-messages)

---

## 1. Authentication

**Base Path:** `/api/v1/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/request-otp` | ❌ | درخواست OTP |
| POST | `/verify-and-register` | ❌ | تأیید OTP و ثبت‌نام |
| POST | `/login` | ❌ | ورود با رمز عبور |
| POST | `/signup` | ❌ | ثبت‌نام با رمز عبور |
| GET | `/me` | ✅ | دریافت اطلاعات کاربر جاری |

**Request/Response Examples:**

```typescript
// POST /auth/login
Request: {
  mobile: string;
  password: string;
}
Response: {
  success: boolean;
  data: {
    token: string;
    user: IUser;
  };
  message: string;
}

// POST /auth/signup
Request: {
  mobile: string;
  name: string;
  password: string;
  email?: string;
  province?: string;
  city?: string;
}
Response: {
  success: boolean;
  data: {
    token: string;
    user: IUser;
  };
  message: string;
}

// GET /auth/me
Response: {
  success: boolean;
  data: IUser;
  message: string;
}
```

---

## 2. Users

**Base Path:** `/api/v1/users`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/me` | ✅ | - | دریافت اطلاعات کاربر جاری |
| GET | `/` | ✅ | Admin | دریافت تمام کاربران |
| GET | `/:id` | ✅ | - | دریافت کاربر با ID |

---

## 3. Needs

**Base Path:** `/api/v1/needs`

### 3.1 CRUD Operations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Optional | ایجاد نیاز جدید |
| GET | `/` | ❌ | دریافت لیست نیازها (با فیلتر) |
| GET | `/:identifier` | ❌ | دریافت یک نیاز (با ID یا slug) |
| PATCH | `/:id` | ✅ Admin | بروزرسانی نیاز |
| DELETE | `/:id` | ✅ Admin | حذف نیاز |
| GET | `/admin/all` | ✅ Admin | دریافت همه نیازها برای ادمین |

### 3.2 Special Feeds

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/trending` | ❌ | نیازهای ترند |
| GET | `/popular` | ❌ | نیازهای محبوب |
| GET | `/urgent` | ❌ | نیازهای فوری |
| GET | `/nearby` | ❌ | نیازهای نزدیک |

### 3.3 Social Interactions

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/:id/upvote` | ✅ | لایک/آنلایک نیاز |
| POST | `/:id/support` | ✅ | حمایت از نیاز |
| POST | `/:id/view` | ❌ | افزایش تعداد بازدید |

### 3.4 Supporter Details

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/:id/supporters/details` | ❌ | دریافت جزئیات حامیان |
| PATCH | `/:id/supporters/:userId` | ✅ Admin | بروزرسانی جزئیات حامی |
| POST | `/:id/supporters/:userId/contributions` | ✅ | افزودن کمک مالی |
| DELETE | `/:id/supporters/:userId` | ✅ | حذف حامی |

### 3.5 Updates (Timeline)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/:id/updates` | ❌ | دریافت بروزرسانی‌ها |
| POST | `/:id/updates` | ✅ | ایجاد بروزرسانی |
| PATCH | `/:id/updates/:updateId` | ✅ | ویرایش بروزرسانی |
| DELETE | `/:id/updates/:updateId` | ✅ | حذف بروزرسانی |

### 3.6 Milestones

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/:id/milestones` | ❌ | دریافت مایلستون‌ها |
| POST | `/:id/milestones` | ✅ | ایجاد مایلستون |
| PATCH | `/:id/milestones/:milestoneId` | ✅ | ویرایش مایلستون |
| DELETE | `/:id/milestones/:milestoneId` | ✅ | حذف مایلستون |
| POST | `/:id/milestones/:milestoneId/complete` | ✅ | تکمیل مایلستون |

### 3.7 Budget Items

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/:id/budget` | ❌ | دریافت آیتم‌های بودجه |
| POST | `/:id/budget` | ✅ | ایجاد آیتم بودجه |
| PATCH | `/:id/budget/:budgetItemId` | ✅ | ویرایش آیتم بودجه |
| DELETE | `/:id/budget/:budgetItemId` | ✅ | حذف آیتم بودجه |
| POST | `/:id/budget/:budgetItemId/add-funds` | ✅ | افزودن وجه به آیتم |

### 3.8 Verification Requests

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/:id/verifications` | ❌ | دریافت درخواست‌های تأیید |
| POST | `/:id/verifications` | ✅ | ایجاد درخواست تأیید |
| PATCH | `/:id/verifications/:verificationId/review` | ✅ Admin | بررسی درخواست |
| DELETE | `/:id/verifications/:verificationId` | ✅ | حذف درخواست |

### 3.9 Task Management

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/:id/tasks` | ❌ | دریافت تسک‌ها |
| POST | `/:id/tasks` | ✅ | ایجاد تسک |
| PATCH | `/:id/tasks/:taskId` | ✅ | ویرایش تسک |
| DELETE | `/:id/tasks/:taskId` | ✅ | حذف تسک |
| PATCH | `/:id/tasks/:taskId/checklist` | ✅ | بروزرسانی چک‌لیست |
| POST | `/:id/tasks/:taskId/complete` | ✅ | تکمیل تسک |

### 3.10 Nested Routes

- `/:id/messages` → Supporter Messages
- `/:needId/direct-messages` → Direct Messages
- `/:needId/teams` → Teams
- `/:id/polls` → Polls
- `/:id/submissions` → Supporter Submissions

---

## 4. Need Categories

**Base Path:** `/api/v1/need-categories`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ❌ | دریافت دسته‌بندی‌ها |
| POST | `/` | ✅ Admin | ایجاد دسته‌بندی |
| PATCH | `/:id` | ✅ Admin | بروزرسانی دسته‌بندی |
| DELETE | `/:id` | ✅ Admin | حذف دسته‌بندی |

---

## 5. Comments

**Base Path:** `/api/v1/comments`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ | ایجاد کامنت |
| GET | `/post/:postId` | ❌ | دریافت کامنت‌های پست |
| GET | `/` | ✅ Admin | دریافت تمام کامنت‌ها |
| PATCH | `/:id` | ✅ Admin | بروزرسانی کامنت |
| DELETE | `/:id` | ✅ Admin | حذف کامنت |

---

## 6. Teams

**Base Path:** `/api/v1/needs/:needId/teams` یا `/api/v1/teams`

### 6.1 CRUD Operations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ Supporter | ایجاد تیم |
| GET | `/` | ❌ | دریافت تیم‌ها |
| GET | `/my-teams` | ✅ | دریافت تیم‌های کاربر |
| GET | `/:teamId` | ❌ | دریافت تیم با ID |
| PATCH | `/:teamId` | ✅ | بروزرسانی تیم |
| DELETE | `/:teamId` | ✅ | حذف تیم |

### 6.2 Statistics

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/:teamId/stats` | ❌ | دریافت آمار تیم |

### 6.3 Member Management

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/:teamId/members` | ✅ | افزودن عضو |
| DELETE | `/:teamId/members/:userId` | ✅ | حذف عضو |
| PATCH | `/:teamId/members/:userId/role` | ✅ | تغییر نقش عضو |

### 6.4 Invitations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/:teamId/invite` | ✅ | دعوت کاربر |

---

## 7. Team Invitations

**Base Path:** `/api/v1/team-invitations`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/my-invitations` | ✅ | دریافت دعوت‌های کاربر |
| POST | `/:invitationId/respond` | ✅ | پاسخ به دعوت |

---

## 8. Social

**Base Path:** `/api/v1/social`

### 8.1 Follow Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/follow/user/:userId` | ✅ | دنبال کردن کاربر |
| DELETE | `/follow/user/:userId` | ✅ | آنفالو کاربر |
| POST | `/follow/need/:needId` | ✅ | دنبال کردن نیاز |
| DELETE | `/follow/need/:needId` | ✅ | آنفالو نیاز |
| GET | `/users/:userId/followers` | ❌ | دریافت فالورهای کاربر |
| GET | `/users/:userId/following` | ❌ | دریافت فالوینگ کاربر |
| GET | `/users/:userId/follow-stats` | ❌ | آمار فالو کاربر |
| GET | `/my-followed-needs` | ✅ | نیازهای دنبال شده توسط من |
| GET | `/needs/:needId/followers` | ❌ | فالورهای نیاز |
| GET | `/follow/suggestions` | ✅ | پیشنهاد کاربران برای فالو |

### 8.2 Mentions Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/mentions/me` | ✅ | دریافت منشن‌های کاربر |
| GET | `/mentions/unread-count` | ✅ | تعداد منشن‌های خوانده نشده |
| POST | `/mentions/:mentionId/read` | ✅ | علامت‌گذاری منشن |
| POST | `/mentions/read-all` | ✅ | علامت‌گذاری همه منشن‌ها |

### 8.3 Tags Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/tags/popular` | ❌ | تگ‌های محبوب |
| GET | `/tags/trending` | ❌ | تگ‌های ترند |
| GET | `/tags/search` | ❌ | جستجوی تگ |
| GET | `/tags/:tag/needs` | ❌ | نیازهای با تگ خاص |

### 8.4 Share Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/share` | Optional | ثبت اشتراک‌گذاری |
| GET | `/share/top` | ❌ | محبوب‌ترین اشتراک‌گذاری‌ها |
| GET | `/share/:itemId/stats` | ❌ | آمار اشتراک‌گذاری آیتم |
| GET | `/share/:needId/og-metadata` | ❌ | متادیتای Open Graph |
| GET | `/share/:needId/url` | ❌ | لینک اشتراک‌گذاری |

---

## 9. Gamification

**Base Path:** `/api/v1/gamification`

### 9.1 Points Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/leaderboard` | ❌ | لیدربورد عمومی |
| GET | `/leaderboard/enhanced` | ❌ | لیدربورد با آمار کامل |
| GET | `/points/my-summary` | ✅ | خلاصه امتیازات من |
| GET | `/points/my-transactions` | ✅ | تراکنش‌های امتیاز من |
| GET | `/points/my-breakdown` | ✅ | تفکیک امتیازات من |
| POST | `/points/daily-bonus` | ✅ | دریافت جایزه روزانه |
| POST | `/points/award` | ✅ Admin | اعطای امتیاز |
| POST | `/points/deduct` | ✅ Admin | کسر امتیاز |

### 9.2 Badges Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/badges` | ❌ | دریافت تمام بج‌ها |
| GET | `/badges/:badgeId` | ❌ | دریافت بج با ID |
| GET | `/badges/my-badges` | ✅ | بج‌های من |
| GET | `/badges/:badgeId/progress` | ✅ | پیشرفت بج |
| POST | `/badges/check` | ✅ | بررسی بج‌های جدید |
| GET | `/users/:userId/badges` | ❌ | بج‌های کاربر |
| POST | `/badges` | ✅ Admin | ایجاد بج |
| PATCH | `/badges/:badgeId` | ✅ Admin | بروزرسانی بج |
| DELETE | `/badges/:badgeId` | ✅ Admin | حذف بج |

### 9.3 Stats Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/stats/me` | ✅ | آمار من |
| GET | `/stats/:userId` | ❌ | آمار کاربر |
| GET | `/activity/me` | ✅ | فعالیت من |

---

## 10. Discovery

**Base Path:** `/api/v1/discovery`

### 10.1 Leaderboard Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/leaderboard` | ❌ | لیدربورد عمومی |
| GET | `/leaderboard/me` | ✅ | رتبه من |
| GET | `/leaderboard/user/:userId` | ❌ | رتبه کاربر |
| GET | `/leaderboard/nearby` | ✅ | کاربران اطراف در رتبه |
| GET | `/leaderboard/top` | ❌ | برترین کاربران |
| GET | `/leaderboard/multiple` | ❌ | چند لیدربورد |

### 10.2 Trending Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/trending/needs` | ❌ | نیازهای ترند |
| GET | `/trending/users` | ❌ | کاربران ترند |
| GET | `/trending/tags` | ❌ | تگ‌های ترند |
| GET | `/trending/all` | ❌ | همه موارد ترند |

### 10.3 Recommendations Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/recommendations/needs` | ✅ | پیشنهاد نیازها |
| GET | `/recommendations/users` | ✅ | پیشنهاد کاربران |
| GET | `/recommendations/teams` | ✅ | پیشنهاد تیم‌ها |
| GET | `/recommendations/personalized` | ✅ | پیشنهادات شخصی |
| GET | `/recommendations/preferences` | ✅ | ترجیحات کاربر |

### 10.4 Combined Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/feed` | Optional | فید شخصی |
| GET | `/stats` | Optional | آمار اکتشاف |

---

## 11. Notifications

**Base Path:** `/api/v1/notifications`

### 11.1 Notifications Management

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ✅ | دریافت نوتیفیکیشن‌ها |
| GET | `/grouped` | ✅ | نوتیفیکیشن‌های گروه‌بندی شده |
| GET | `/unread-count` | ✅ | تعداد خوانده نشده |
| GET | `/stats` | ✅ | آمار نوتیفیکیشن‌ها |
| POST | `/:id/read` | ✅ | علامت‌گذاری خوانده شده |
| POST | `/mark-all-read` | ✅ | علامت‌گذاری همه |
| DELETE | `/:id` | ✅ | حذف نوتیفیکیشن |
| DELETE | `/read` | ✅ | حذف همه خوانده شده‌ها |

### 11.2 Preferences

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/preferences` | ✅ | دریافت تنظیمات |
| PUT | `/preferences` | ✅ | بروزرسانی تنظیمات |
| POST | `/preferences/toggle-channel` | ✅ | تغییر وضعیت کانال |
| POST | `/preferences/mute-type` | ✅ | Mute نوع خاص |
| POST | `/preferences/global-mute` | ✅ | Mute کلی |

### 11.3 Push Tokens

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/push-token` | ✅ | ثبت توکن push |
| DELETE | `/push-token/:token` | ✅ | حذف توکن push |

---

## 12. Stories

**Base Path:** `/api/v1/stories`

### 12.1 Stories Management

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ | ایجاد استوری |
| GET | `/feed` | ✅ | فید استوری‌ها |
| GET | `/stats` | ✅ | آمار استوری‌های من |
| GET | `/user/:userId` | ✅ | استوری‌های کاربر |
| GET | `/:id` | ✅ | دریافت استوری |
| POST | `/:id/view` | ✅ | مشاهده استوری |
| POST | `/:id/react` | ✅ | ری‌اکشن به استوری |
| DELETE | `/:id/react` | ✅ | حذف ری‌اکشن |
| DELETE | `/:id` | ✅ | حذف استوری |
| GET | `/:id/viewers` | ✅ | لیست بیننده‌ها |

### 12.2 Highlights

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/highlights` | ✅ | ایجاد هایلایت |
| GET | `/highlights/user/:userId` | ✅ | هایلایت‌های کاربر |
| POST | `/highlights/:id/add-story` | ✅ | افزودن استوری به هایلایت |
| DELETE | `/highlights/:id/remove-story/:storyId` | ✅ | حذف استوری از هایلایت |
| PUT | `/highlights/:id` | ✅ | بروزرسانی هایلایت |
| DELETE | `/highlights/:id` | ✅ | حذف هایلایت |

---

## 13. Media

**Base Path:** `/api/v1/media`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/upload` | ✅ | آپلود فایل (max 50MB) |
| GET | `/stats` | ✅ | آمار رسانه‌های من |
| GET | `/storage` | ✅ | حجم کل فایل‌ها |
| GET | `/user/:userId` | ✅ | رسانه‌های کاربر |
| GET | `/related/:model/:id` | ✅ | رسانه‌های مرتبط |
| GET | `/:id` | ✅ | دریافت رسانه |
| POST | `/:id/download` | ✅ | افزایش شمارنده دانلود |
| DELETE | `/:id` | ✅ | حذف رسانه |

**Supported File Types:**
- Images: jpeg, jpg, png, gif, webp, svg
- Videos: mp4, mpeg, quicktime, webm
- Audio: mpeg, mp3, wav, ogg
- Documents: pdf, doc, docx, xls, xlsx, ppt, pptx, txt, json

---

## 14. Direct Messages

**Base Path:** `/api/v1/needs/:needId/direct-messages`

### 14.1 Conversations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/conversations` | ✅ Supporter | ایجاد مکالمه |
| GET | `/conversations` | ✅ Supporter | دریافت مکالمات |
| GET | `/conversations/unread-count` | ✅ Supporter | تعداد خوانده نشده |
| POST | `/conversations/:conversationId/archive` | ✅ | آرشیو مکالمه |

### 14.2 Messages

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/conversations/:conversationId/messages` | ✅ | دریافت پیام‌ها |
| POST | `/conversations/:conversationId/messages` | ✅ | ارسال پیام |
| POST | `/conversations/:conversationId/read` | ✅ | علامت‌گذاری خوانده شده |
| PATCH | `/messages/:messageId` | ✅ | ویرایش پیام |
| DELETE | `/messages/:messageId` | ✅ | حذف پیام |

---

## 📊 خلاصه آمار

- **تعداد کل Modules:** 14
- **تعداد کل Endpoints:** 200+
- **Endpoints عمومی (بدون Auth):** ~60
- **Endpoints محافظت شده (با Auth):** ~140
- **Endpoints Admin Only:** ~25

---

## 🔑 نکات مهم

### Authentication Types:
- **❌ Public:** بدون نیاز به احراز هویت
- **✅ Protected:** نیاز به توکن JWT
- **✅ Admin:** نیاز به توکن JWT + نقش Admin/SuperAdmin
- **✅ Supporter:** نیاز به توکن JWT + وضعیت حامی
- **Optional:** احراز هویت اختیاری (عملکرد متفاوت با/بدون توکن)

### Response Format:
همه endpoints از ساختار زیر پیروی می‌کنند:
```typescript
{
  success: boolean;
  data: any;
  message: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}
```

### Error Format:
```typescript
{
  success: false;
  message: string;
  errors?: string[];
}
```

---

**پایان گزارش**
