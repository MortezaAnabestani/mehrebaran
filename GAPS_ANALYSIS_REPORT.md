# 🔍 گزارش جامع تحلیل گپ‌های Backend ↔ Frontend

**تاریخ تحلیل:** 2025-11-03
**نسخه:** 1.0

---

## 📊 خلاصه اجرایی

| شاخص | مقدار | درصد |
|------|-------|------|
| کل Endpoints بک‌اند | 200+ | 100% |
| Endpoints استفاده شده در فرانت | ~85 | ~42% |
| Endpoints استفاده نشده | ~115 | ~58% |
| Endpoints با مسیر اشتباه | ~15 | ~7% |
| Endpoints با HTTP method اشتباه | ~5 | ~2.5% |

### 🎯 نتیجه کلی:

**تنها 42% از امکانات بک‌اند در فرانت استفاده شده است.**

---

## 📑 فهرست مشکلات

1. [Need Module - گپ‌های بزرگ](#1-need-module)
2. [Discovery Module - مسیرهای کاملاً اشتباه](#2-discovery-module)
3. [Notification Module - HTTP Methods اشتباه](#3-notification-module)
4. [Task Module - مسیر نادرست](#4-task-module)
5. [Story Module - مسیرهای جزئی اشتباه](#5-story-module)
6. [Media Module - Endpoints غیرموجود](#6-media-module)
7. [Team Invitations - استفاده نشده](#7-team-invitations)
8. [Social Module - Features جزئی](#8-social-module)

---

## 1. Need Module

### 🔴 وضعیت: **بحرانی - 75% امکانات استفاده نشده**

### Features موجود در بک‌اند که در فرانت نیست:

#### 1.1 Special Feeds

| Endpoint | Method | Description | Priority |
|----------|--------|-------------|----------|
| `/needs/trending` | GET | نیازهای ترند | 🔥 High |
| `/needs/popular` | GET | نیازهای محبوب | 🔥 High |
| `/needs/urgent` | GET | نیازهای فوری | 🔥 High |
| `/needs/nearby` | GET | نیازهای نزدیک (location-based) | 🟡 Medium |

**تأثیر:** بدون این feeds، کاربران نمی‌توانند نیازهای مهم را راحت پیدا کنند.

#### 1.2 Updates (Timeline System)

| Endpoint | Method | Description | Priority |
|----------|--------|-------------|----------|
| `GET /needs/:id/updates` | GET | دریافت بروزرسانی‌های نیاز | 🔥 High |
| `POST /needs/:id/updates` | POST | ایجاد بروزرسانی | 🔥 High |
| `PATCH /needs/:id/updates/:updateId` | PATCH | ویرایش بروزرسانی | 🟡 Medium |
| `DELETE /needs/:id/updates/:updateId` | DELETE | حذف بروزرسانی | 🟡 Medium |

**تأثیر:** نمی‌توان پیشرفت نیازها را به حامیان نشان داد (feature کلیدی).

#### 1.3 Milestones System

| Endpoint | Method | Description | Priority |
|----------|--------|-------------|----------|
| `GET /needs/:id/milestones` | GET | دریافت مایلستون‌ها | 🔥 High |
| `POST /needs/:id/milestones` | POST | ایجاد مایلستون | 🔥 High |
| `PATCH /needs/:id/milestones/:milestoneId` | PATCH | ویرایش مایلستون | 🟡 Medium |
| `DELETE /needs/:id/milestones/:milestoneId` | DELETE | حذف مایلستون | 🟡 Medium |
| `POST /needs/:id/milestones/:milestoneId/complete` | POST | تکمیل مایلستون | 🔥 High |

**تأثیر:** نمی‌توان نیازها را به فازها تقسیم کرد و پیشرفت را tracking کرد.

#### 1.4 Budget Management

| Endpoint | Method | Description | Priority |
|----------|--------|-------------|----------|
| `GET /needs/:id/budget` | GET | دریافت بودجه‌بندی | 🔥 High |
| `POST /needs/:id/budget` | POST | ایجاد آیتم بودجه | 🔥 High |
| `PATCH /needs/:id/budget/:budgetItemId` | PATCH | ویرایش آیتم | 🟡 Medium |
| `DELETE /needs/:id/budget/:budgetItemId` | DELETE | حذف آیتم | 🟡 Medium |
| `POST /needs/:id/budget/:budgetItemId/add-funds` | POST | افزودن وجه به آیتم | 🔥 High |

**تأثیر:** نمی‌توان بودجه را مدیریت و tracking کرد.

#### 1.5 Verification Requests

| Endpoint | Method | Description | Priority |
|----------|--------|-------------|----------|
| `GET /needs/:id/verifications` | GET | دریافت درخواست‌های تأیید | 🟡 Medium |
| `POST /needs/:id/verifications` | POST | ایجاد درخواست تأیید | 🟡 Medium |
| `PATCH /needs/:id/verifications/:verificationId/review` | PATCH | بررسی درخواست (Admin) | 🟡 Medium |
| `DELETE /needs/:id/verifications/:verificationId` | DELETE | حذف درخواست | 🟢 Low |

**تأثیر:** نمی‌توان صحت نیازها را تأیید کرد.

#### 1.6 Supporter Details

| Endpoint | Method | Description | Priority |
|----------|--------|-------------|----------|
| `GET /needs/:id/supporters/details` | GET | جزئیات حامیان | 🔥 High |
| `PATCH /needs/:id/supporters/:userId` | PATCH | بروزرسانی جزئیات حامی | 🟡 Medium |
| `POST /needs/:id/supporters/:userId/contributions` | POST | افزودن کمک مالی | 🔥 High |
| `DELETE /needs/:id/supporters/:userId` | DELETE | حذف حامی | 🟡 Medium |

**تأثیر:** نمی‌توان لیست حامیان و کمک‌های آن‌ها را مدیریت کرد.

#### 1.7 Social Actions (Incorrect Endpoints)

**مشکل در فرانت:**

```typescript
// ❌ Frontend (اشتباه):
followNeed(id) → POST /social/follow { followingType, following }
likeNeed(id) → POST /social/like { targetType, target }

// ✅ Backend (صحیح):
POST /needs/:id/support  // حمایت از نیاز
POST /needs/:id/upvote   // لایک نیاز
POST /needs/:id/view     // افزایش بازدید
```

**تأثیر:** Social actions ممکن است کار نکنند یا به اشتباه کار کنند.

#### 1.8 Nested Resources

| Endpoint | Description | Priority |
|----------|-------------|----------|
| `/needs/:id/messages` | پیام‌های حامیان | 🟡 Medium |
| `/needs/:needId/direct-messages` | پیام‌های مستقیم | 🟡 Medium |
| `/needs/:id/polls` | نظرسنجی‌ها | 🟢 Low |
| `/needs/:id/submissions` | ارسال‌های حامیان | 🟡 Medium |

---

## 2. Discovery Module

### 🔴 وضعیت: **بحرانی - مسیرها 100% اشتباه**

### مشکل اصلی:

Frontend از مسیرهایی استفاده می‌کند که **اصلاً در بک‌اند وجود ندارند!**

### مقایسه مسیرها:

| Frontend (اشتباه) ❌ | Backend (صحیح) ✅ |
|----------------------|-------------------|
| `/discovery/recommended-needs` | `/discovery/recommendations/needs` |
| `/discovery/recommended-users` | `/discovery/recommendations/users` |
| `/discovery/recommended-teams` | `/discovery/recommendations/teams` |
| `/discovery/trending-needs` | `/discovery/trending/needs` |
| `/discovery/trending-users` | `/discovery/trending/users` |
| `/discovery/trending-teams` | ⚠️ **بک‌اند ندارد!** (فقط users/needs) |
| `/discovery/new-needs` | ⚠️ **بک‌اند ندارد!** |
| `/discovery/new-users` | ⚠️ **بک‌اند ندارد!** |
| `/discovery/new-teams` | ⚠️ **بک‌اند ندارد!** |

### Endpoints استفاده نشده:

| Endpoint | Description | Priority |
|----------|-------------|----------|
| `/discovery/leaderboard` | لیدربورد اکتشاف | 🟡 Medium |
| `/discovery/leaderboard/me` | رتبه من | 🟡 Medium |
| `/discovery/leaderboard/user/:userId` | رتبه کاربر | 🟢 Low |
| `/discovery/leaderboard/nearby` | کاربران اطراف | 🟡 Medium |
| `/discovery/leaderboard/top` | برترین‌ها | 🟡 Medium |
| `/discovery/leaderboard/multiple` | چند لیدربورد | 🟢 Low |
| `/discovery/trending/tags` | تگ‌های ترند | 🟡 Medium |
| `/discovery/trending/all` | همه ترندها | 🟡 Medium |
| `/discovery/recommendations/personalized` | پیشنهادات شخصی | 🔥 High |
| `/discovery/recommendations/preferences` | ترجیحات کاربر | 🟡 Medium |
| `/discovery/feed` | فید شخصی‌سازی شده | 🔥 High |
| `/discovery/stats` | آمار اکتشاف | 🟢 Low |

**تأثیر:**
- صفحات Explore و Trending **کاملاً کار نمی‌کنند**
- باید تمام service بازنویسی شود

---

## 3. Notification Module

### 🟡 وضعیت: **متوسط - HTTP Methods اشتباه + Features استفاده نشده**

### 3.1 HTTP Methods اشتباه:

| Endpoint | Frontend ❌ | Backend ✅ |
|----------|------------|-----------|
| `/notifications/:id/read` | PATCH | POST |
| `/notifications/mark-all-read` | PATCH | POST |

**تأثیر:** Mark as read **کار نمی‌کند**.

### 3.2 Endpoints استفاده نشده:

| Endpoint | Method | Description | Priority |
|----------|--------|-------------|----------|
| `/notifications/grouped` | GET | نوتیفیکیشن‌های گروه‌بندی شده | 🔥 High |
| `/notifications/stats` | GET | آمار نوتیفیکیشن‌ها | 🟡 Medium |
| `/notifications/read` | DELETE | حذف خوانده شده‌ها | 🟡 Medium |
| `/notifications/preferences` | GET | دریافت تنظیمات | 🟡 Medium |
| `/notifications/preferences` | PUT | بروزرسانی تنظیمات | 🟡 Medium |
| `/notifications/preferences/toggle-channel` | POST | تغییر کانال | 🟡 Medium |
| `/notifications/preferences/mute-type` | POST | Mute نوع خاص | 🟡 Medium |
| `/notifications/preferences/global-mute` | POST | Mute کلی | 🟡 Medium |
| `/notifications/push-token` | POST | ثبت توکن push | 🔥 High |
| `/notifications/push-token/:token` | DELETE | حذف توکن | 🟡 Medium |

**تأثیر:** کاربران نمی‌توانند تنظیمات نوتیفیکیشن را کنترل کنند.

---

## 4. Task Module

### 🟡 وضعیت: **متوسط - مسیر نادرست**

### مشکل مسیر:

| Frontend ❌ | Backend ✅ |
|------------|-----------|
| `/needs/:needId/teams/:teamId/tasks` | `/needs/:id/tasks` |

Tasks در بک‌اند مستقیماً به Need متصل هستند، نه به Team!

### Endpoints استفاده نشده:

| Endpoint | Method | Description | Priority |
|----------|--------|-------------|----------|
| `/needs/:id/tasks/:taskId/checklist` | PATCH | بروزرسانی چک‌لیست | 🟡 Medium |
| `/needs/:id/tasks/:taskId/complete` | POST | تکمیل تسک | 🔥 High |

**تأثیر:** Tasks ممکن است کار نکنند یا اشتباه کار کنند.

---

## 5. Story Module

### 🟡 وضعیت: **متوسط - مسیر stats اشتباه + Features استفاده نشده**

### 5.1 مسیر اشتباه:

| Frontend ❌ | Backend ✅ |
|------------|-----------|
| `/stories/stats/my` | `/stories/stats` |
| `/stories/stats/user/:userId` | `/stories/stats` |

### 5.2 Endpoints استفاده نشده:

| Endpoint | Method | Description | Priority |
|----------|--------|-------------|----------|
| `/stories/:id/viewers` | GET | لیست بیننده‌های استوری | 🔥 High |
| `/stories/highlights` | POST | ایجاد هایلایت | 🟡 Medium |
| `/stories/highlights/user/:userId` | GET | هایلایت‌های کاربر | 🟡 Medium |
| `/stories/highlights/:id/add-story` | POST | افزودن استوری به هایلایت | 🟡 Medium |
| `/stories/highlights/:id/remove-story/:storyId` | DELETE | حذف استوری از هایلایت | 🟡 Medium |
| `/stories/highlights/:id` | PUT | بروزرسانی هایلایت | 🟡 Medium |
| `/stories/highlights/:id` | DELETE | حذف هایلایت | 🟡 Medium |

**تأثیر:**
- نمیتوان لیست بیننده‌ها را دید
- سیستم Highlights کاملاً استفاده نشده

---

## 6. Media Module

### 🟡 وضعیت: **متوسط - Endpoints غیرموجود در بک‌اند**

### 6.1 Endpoints فرانت که در بک‌اند نیست:

| Frontend Endpoint ❌ | وضعیت |
|---------------------|-------|
| `/media/my` | ❌ وجود ندارد |
| `/media/galleries/my` | ❌ وجود ندارد |
| `/media/delete-multiple` | ❌ وجود ندارد |
| `/media/galleries/:id/media` | ❌ وجود ندارد |

### 6.2 Endpoints بک‌اند که استفاده نشده:

| Endpoint | Method | Description | Priority |
|----------|--------|-------------|----------|
| `/media/stats` | GET | آمار رسانه | 🟡 Medium |
| `/media/storage` | GET | حجم کل فایل‌ها | 🟡 Medium |
| `/media/related/:model/:id` | GET | رسانه‌های مرتبط | 🟡 Medium |
| `/media/:id/download` | POST | افزایش شمارنده دانلود | 🟢 Low |

**تأثیر:**
- `/media/my` باید به `/media/user/:userId` تغییر کند
- Media galleries ممکن است کار نکند

---

## 7. Team Invitations

### 🟡 وضعیت: **استفاده نشده**

### Endpoints موجود در بک‌اند:

| Endpoint | Method | Description | Priority |
|----------|--------|-------------|----------|
| `/team-invitations/my-invitations` | GET | دریافت دعوت‌های من | 🔥 High |
| `/team-invitations/:invitationId/respond` | POST | پاسخ به دعوت (accept/reject) | 🔥 High |

**تأثیر:** کاربران نمی‌توانند دعوت‌های تیم را مدیریت کنند.

---

## 8. Social Module

### 🟢 وضعیت: **خوب - فقط چند feature جزئی**

### Endpoints استفاده نشده:

| Endpoint | Method | Description | Priority |
|----------|--------|-------------|----------|
| `/social/my-followed-needs` | GET | نیازهای دنبال شده من | 🔥 High |
| `/social/share` | POST | ثبت اشتراک‌گذاری | 🟡 Medium |
| `/social/share/top` | GET | محبوب‌ترین اشتراک‌گذاری‌ها | 🟡 Medium |
| `/social/share/:itemId/stats` | GET | آمار اشتراک‌گذاری | 🟡 Medium |
| `/social/share/:needId/og-metadata` | GET | متادیتای OpenGraph | 🟡 Medium |
| `/social/share/:needId/url` | GET | لینک اشتراک‌گذاری | 🟡 Medium |

**تأثیر:** Share tracking و OG metadata استفاده نشده.

---

## 9. Gamification Module

### ✅ وضعیت: **عالی - تطابق کامل**

همه endpoints استفاده شده و مسیرها صحیح هستند.

---

## 10. Team Module

### ✅ وضعیت: **عالی - تطابق کامل**

همه endpoints استفاده شده و مسیرها صحیح هستند.

---

## 11. Comment Module

### ✅ وضعیت: **خوب - محدود به نیاز**

فقط endpoints اولیه استفاده شده (کافی برای نیاز فعلی).

---

## 📋 خلاصه اولویت‌بندی مشکلات

### 🔴 بحرانی (باید فوراً رفع شود):

1. **Discovery Module** - مسیرها 100% اشتباه
2. **Need Module - Special Feeds** - trending, popular, urgent
3. **Need Module - Updates System** - پیشرفت نیاز
4. **Need Module - Milestones** - مدیریت فازها
5. **Need Module - Budget** - مدیریت بودجه
6. **Notification - HTTP Methods** - mark as read کار نمی‌کند

### 🟡 متوسط (مهم اما نه فوری):

1. **Task Module** - مسیر نادرست
2. **Story Module** - stats مسیر اشتباه
3. **Media Module** - endpoints غیرموجود
4. **Team Invitations** - کاملاً استفاده نشده
5. **Notification Preferences** - تنظیمات
6. **Story Highlights** - سیستم کامل استفاده نشده

### 🟢 کم‌اولویت (Nice to have):

1. **Social Share Tracking**
2. **Discovery Leaderboards**
3. **Verification Requests**
4. **Media Stats**

---

## 🎯 توصیه‌ها برای فاز B (رفع گپ‌ها):

### مرحله 1: رفع مسیرهای اشتباه (1-2 ساعت)
- ✅ Discovery service - بازنویسی کامل مسیرها
- ✅ Notification service - تصحیح HTTP methods
- ✅ Task service - تصحیح مسیر
- ✅ Story service - تصحیح مسیر stats
- ✅ Media service - تصحیح مسیرها

### مرحله 2: پیاده‌سازی Features بحرانی (4-6 ساعت)
- ✅ Need special feeds (trending, popular, urgent)
- ✅ Need updates system
- ✅ Need milestones
- ✅ Need budget management
- ✅ Team invitations management
- ✅ Notification preferences

### مرحله 3: Features متوسط (2-3 ساعت)
- ✅ Story viewers list
- ✅ Story highlights
- ✅ Social share tracking
- ✅ Task checklist

### مرحله 4: تست و بهینه‌سازی (2-3 ساعت)
- ✅ تست تمام endpoints
- ✅ رفع باگ‌ها
- ✅ بهینه‌سازی

**زمان کل تخمینی:** 10-15 ساعت

---

**پایان گزارش تحلیل گپ‌ها**
