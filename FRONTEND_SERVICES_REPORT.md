# 📋 گزارش جامع Services فرانت - شبکه نیازسنجی مهر ایران

**تاریخ ایجاد:** 2025-11-03
**مسیر Services:** `packages/web/src/services/`

---

## 📑 فهرست Services

### Services شبکه نیازسنجی:
1. [auth.service.ts](#1-authservicets)
2. [need.service.ts](#2-needservicets)
3. [team.service.ts](#3-teamservicets)
4. [task.service.ts](#4-taskservicets)
5. [social.service.ts](#5-socialservicets)
6. [gamification.service.ts](#6-gamificationservicets)
7. [discovery.service.ts](#7-discoveryservicets)
8. [notification.service.ts](#8-notificationservicets)
9. [story.service.ts](#9-storyservicets)
10. [media.service.ts](#10-mediaservicets)
11. [comment.service.ts](#11-commentservicets)

### Services دیگر (خارج از شبکه نیازسنجی):
- article.service.ts
- news.service.ts
- video.service.ts
- gallery.service.ts
- project.service.ts
- setting.service.ts

---

## 1. auth.service.ts

**تعداد Methods:** 6
**مسیر پایه:** `/api/v1/auth`

| Method | Endpoint | HTTP | Description |
|--------|----------|------|-------------|
| `login()` | `/auth/login` | POST | ورود با موبایل و پسورد |
| `signup()` | `/auth/signup` | POST | ثبت‌نام با موبایل و پسورد |
| `sendOtp()` | `/auth/request-otp` | POST | درخواست OTP |
| `verifyOtp()` | `/auth/verify-and-register` | POST | تأیید OTP |
| `getCurrentUser()` | `/auth/me` | GET | دریافت کاربر جاری |
| `logout()` | - | Local | پاک کردن token از localStorage |

---

## 2. need.service.ts

**تعداد Methods:** 10
**مسیر پایه:** `/api/v1/needs`

| Method | Endpoint | HTTP | Description |
|--------|----------|------|-------------|
| `getNeeds()` | `/needs` | GET | دریافت لیست نیازها |
| `getNeedById()` | `/needs/:id` | GET | دریافت یک نیاز |
| `createNeed()` | `/needs` | POST | ایجاد نیاز |
| `updateNeed()` | `/needs/:id` | PUT | بروزرسانی نیاز |
| `deleteNeed()` | `/needs/:id` | DELETE | حذف نیاز |
| `followNeed()` | `/social/follow` | POST | دنبال کردن نیاز |
| `unfollowNeed()` | `/social/follow/:id` | DELETE | آنفالو نیاز |
| `likeNeed()` | `/social/like` | POST | لایک نیاز |
| `unlikeNeed()` | `/social/like/:id` | DELETE | آنلایک نیاز |
| `getComments()` | `/comments/post/:postId` | GET | دریافت کامنت‌ها |

### ❌ Endpoints موجود در بک‌اند که استفاده نشده:

- `/needs/trending` - نیازهای ترند
- `/needs/popular` - نیازهای محبوب
- `/needs/urgent` - نیازهای فوری
- `/needs/nearby` - نیازهای نزدیک
- `/needs/:id/upvote` - لایک نیاز (endpoint اشتباه در frontend)
- `/needs/:id/support` - حمایت از نیاز
- `/needs/:id/view` - افزایش بازدید
- `/needs/:id/supporters/details` - جزئیات حامیان
- `/needs/:id/supporters/:userId/contributions` - افزودن کمک
- `/needs/:id/updates` - سیستم بروزرسانی‌ها
- `/needs/:id/milestones` - مایلستون‌ها
- `/needs/:id/budget` - بودجه‌بندی
- `/needs/:id/verifications` - تأیید نیازها
- `/needs/:id/tasks` - مدیریت تسک‌ها
- `/needs/:id/polls` - نظرسنجی‌ها
- `/needs/:id/submissions` - ارسال‌های حامیان

---

## 3. team.service.ts

**تعداد Methods:** 10
**مسیر پایه:** `/api/v1/teams`

| Method | Endpoint | HTTP | Description |
|--------|----------|------|-------------|
| `getTeams()` | `/teams` | GET | دریافت تیم‌ها |
| `getMyTeams()` | `/teams/my-teams` | GET | تیم‌های من |
| `getTeamById()` | `/teams/:teamId` | GET | دریافت تیم |
| `createTeam()` | `/teams` | POST | ایجاد تیم |
| `updateTeam()` | `/teams/:teamId` | PATCH | بروزرسانی تیم |
| `deleteTeam()` | `/teams/:teamId` | DELETE | حذف تیم |
| `getTeamStats()` | `/teams/:teamId/stats` | GET | آمار تیم |
| `addMember()` | `/teams/:teamId/members` | POST | افزودن عضو |
| `removeMember()` | `/teams/:teamId/members/:userId` | DELETE | حذف عضو |
| `updateMemberRole()` | `/teams/:teamId/members/:userId/role` | PATCH | تغییر نقش |
| `inviteUser()` | `/teams/:teamId/invite` | POST | دعوت کاربر |

### ✅ تطابق خوب با بک‌اند

### ❌ Endpoints موجود در بک‌اند که استفاده نشده:

- `/team-invitations/my-invitations` - دعوت‌های من
- `/team-invitations/:invitationId/respond` - پاسخ به دعوت

---

## 4. task.service.ts

**تعداد Methods:** 6
**مسیر پایه:** `/api/v1/needs/:needId/teams/:teamId/tasks` (⚠️ مسیر نادرست)

| Method | Endpoint | HTTP | Description |
|--------|----------|------|-------------|
| `getTasks()` | `/needs/:needId/teams/:teamId/tasks` | GET | دریافت تسک‌ها |
| `getTaskById()` | `/needs/:needId/teams/:teamId/tasks/:taskId` | GET | دریافت تسک |
| `createTask()` | `/needs/:needId/teams/:teamId/tasks` | POST | ایجاد تسک |
| `updateTask()` | `/needs/:needId/teams/:teamId/tasks/:taskId` | PATCH | بروزرسانی تسک |
| `updateTaskStatus()` | `/needs/:needId/teams/:teamId/tasks/:taskId/status` | PATCH | تغییر وضعیت |
| `deleteTask()` | `/needs/:needId/teams/:teamId/tasks/:taskId` | DELETE | حذف تسک |

### ⚠️ مشکل مسیردهی:

بک‌اند از مسیر `/needs/:id/tasks` استفاده می‌کند، اما فرانت از `/needs/:needId/teams/:teamId/tasks` استفاده می‌کند.

### ❌ Endpoints موجود در بک‌اند که استفاده نشده:

- `/needs/:id/tasks/:taskId/checklist` - بروزرسانی چک‌لیست
- `/needs/:id/tasks/:taskId/complete` - تکمیل تسک

---

## 5. social.service.ts

**تعداد Methods:** 17
**مسیر پایه:** `/api/v1/social`

| Method | Endpoint | HTTP | Description |
|--------|----------|------|-------------|
| `followUser()` | `/social/follow/user/:userId` | POST | دنبال کردن کاربر |
| `unfollowUser()` | `/social/follow/user/:userId` | DELETE | آنفالو کاربر |
| `followNeed()` | `/social/follow/need/:needId` | POST | دنبال کردن نیاز |
| `unfollowNeed()` | `/social/follow/need/:needId` | DELETE | آنفالو نیاز |
| `getUserFollowers()` | `/social/users/:userId/followers` | GET | فالورهای کاربر |
| `getUserFollowing()` | `/social/users/:userId/following` | GET | فالوینگ کاربر |
| `getUserFollowStats()` | `/social/users/:userId/follow-stats` | GET | آمار فالو |
| `getNeedFollowers()` | `/social/needs/:needId/followers` | GET | فالورهای نیاز |
| `getUserMentions()` | `/social/mentions/me` | GET | منشن‌های من |
| `getUnreadMentionCount()` | `/social/mentions/unread-count` | GET | تعداد منشن خوانده نشده |
| `markMentionAsRead()` | `/social/mentions/:mentionId/read` | POST | علامت‌گذاری منشن |
| `markAllMentionsAsRead()` | `/social/mentions/read-all` | POST | علامت‌گذاری همه منشن‌ها |
| `getPopularTags()` | `/social/tags/popular` | GET | تگ‌های محبوب |
| `getTrendingTags()` | `/social/tags/trending` | GET | تگ‌های ترند |
| `searchTags()` | `/social/tags/search` | GET | جستجوی تگ |
| `getNeedsByTag()` | `/social/tags/:tag/needs` | GET | نیازهای تگ |
| `getSuggestedUsers()` | `/social/follow/suggestions` | GET | کاربران پیشنهادی |

### ✅ تطابق عالی با بک‌اند

### ❌ Endpoints موجود در بک‌اند که استفاده نشده:

- `/social/my-followed-needs` - نیازهای دنبال شده من
- `/social/share` - ثبت اشتراک‌گذاری
- `/social/share/top` - محبوب‌ترین اشتراک‌گذاری‌ها
- `/social/share/:itemId/stats` - آمار اشتراک‌گذاری
- `/social/share/:needId/og-metadata` - متادیتای OpenGraph
- `/social/share/:needId/url` - لینک اشتراک‌گذاری

---

## 6. gamification.service.ts

**تعداد Methods:** 11
**مسیر پایه:** `/api/v1/gamification`

| Method | Endpoint | HTTP | Description |
|--------|----------|------|-------------|
| `getPointSummary()` | `/gamification/points/my-summary` | GET | خلاصه امتیاز |
| `getPointTransactions()` | `/gamification/points/my-transactions` | GET | تراکنش‌ها |
| `getPointsBreakdown()` | `/gamification/points/my-breakdown` | GET | تفکیک امتیاز |
| `claimDailyBonus()` | `/gamification/points/daily-bonus` | POST | جایزه روزانه |
| `getAllBadges()` | `/gamification/badges` | GET | تمام بج‌ها |
| `getUserBadges()` | `/gamification/badges/my-badges` یا `/gamification/users/:userId/badges` | GET | بج‌های کاربر |
| `getBadgeProgress()` | `/gamification/badges/:badgeId/progress` | GET | پیشرفت بج |
| `checkBadges()` | `/gamification/badges/check` | POST | بررسی بج جدید |
| `getLeaderboard()` | `/gamification/leaderboard` | GET | لیدربورد |
| `getLeaderboardWithStats()` | `/gamification/leaderboard/enhanced` | GET | لیدربورد کامل |
| `getUserStats()` | `/gamification/stats/me` یا `/gamification/stats/:userId` | GET | آمار کاربر |
| `getUserActivity()` | `/gamification/activity/me` | GET | فعالیت کاربر |

### ✅ تطابق عالی با بک‌اند

---

## 7. discovery.service.ts

**تعداد Methods:** 9
**مسیر پایه:** `/api/v1/discovery`

| Method | Endpoint | HTTP | Description |
|--------|----------|------|-------------|
| `getRecommendedNeeds()` | `/discovery/recommended-needs` | GET | نیازهای پیشنهادی |
| `getRecommendedUsers()` | `/discovery/recommended-users` | GET | کاربران پیشنهادی |
| `getRecommendedTeams()` | `/discovery/recommended-teams` | GET | تیم‌های پیشنهادی |
| `getTrendingNeeds()` | `/discovery/trending-needs` | GET | نیازهای ترند |
| `getTrendingUsers()` | `/discovery/trending-users` | GET | کاربران ترند |
| `getTrendingTeams()` | `/discovery/trending-teams` | GET | تیم‌های ترند |
| `getNewUsers()` | `/discovery/new-users` | GET | کاربران جدید |
| `getNewNeeds()` | `/discovery/new-needs` | GET | نیازهای جدید |
| `getNewTeams()` | `/discovery/new-teams` | GET | تیم‌های جدید |

### ⚠️ مسیرها اشتباه است!

بک‌اند استفاده می‌کند:
- `/discovery/recommendations/needs`
- `/discovery/recommendations/users`
- `/discovery/recommendations/teams`
- `/discovery/trending/needs`
- `/discovery/trending/users`

اما فرانت فراخوانی می‌کند:
- `/discovery/recommended-needs`
- `/discovery/trending-needs`

### ❌ Endpoints موجود در بک‌اند که استفاده نشده:

- `/discovery/leaderboard` - لیدربورد اکتشاف
- `/discovery/leaderboard/me` - رتبه من
- `/discovery/leaderboard/user/:userId` - رتبه کاربر
- `/discovery/leaderboard/nearby` - کاربران اطراف
- `/discovery/leaderboard/top` - برترین‌ها
- `/discovery/leaderboard/multiple` - چند لیدربورد
- `/discovery/trending/tags` - تگ‌های ترند
- `/discovery/trending/all` - همه ترندها
- `/discovery/recommendations/personalized` - پیشنهادات شخصی
- `/discovery/recommendations/preferences` - ترجیحات
- `/discovery/feed` - فید شخصی
- `/discovery/stats` - آمار اکتشاف

---

## 8. notification.service.ts

**تعداد Methods:** 8
**مسیر پایه:** `/api/v1/notifications`

| Method | Endpoint | HTTP | Description |
|--------|----------|------|-------------|
| `getNotifications()` | `/notifications` | GET | دریافت نوتیفیکیشن‌ها |
| `getUnreadNotifications()` | `/notifications` (isRead=false) | GET | خوانده نشده‌ها |
| `getReadNotifications()` | `/notifications` (isRead=true) | GET | خوانده شده‌ها |
| `getNotificationsByType()` | `/notifications` (type=...) | GET | فیلتر نوع |
| `markAsRead()` | `/notifications/:id/read` | PATCH | علامت‌گذاری |
| `markAllAsRead()` | `/notifications/mark-all-read` | PATCH | علامت‌گذاری همه |
| `deleteNotification()` | `/notifications/:id` | DELETE | حذف نوتیفیکیشن |
| `deleteAllNotifications()` | `/notifications` | DELETE | حذف همه |
| `getUnreadCount()` | `/notifications/unread-count` | GET | تعداد خوانده نشده |

### ⚠️ مشکل HTTP Method:

بک‌اند استفاده می‌کند:
- POST `/notifications/:id/read`
- POST `/notifications/mark-all-read`

اما فرانت استفاده می‌کند:
- PATCH `/notifications/:id/read`
- PATCH `/notifications/mark-all-read`

### ❌ Endpoints موجود در بک‌اند که استفاده نشده:

- `/notifications/grouped` - نوتیفیکیشن‌های گروه‌بندی شده
- `/notifications/stats` - آمار نوتیفیکیشن‌ها
- `/notifications/read` (DELETE) - حذف خوانده شده‌ها
- `/notifications/preferences` - تنظیمات
- `/notifications/preferences/toggle-channel` - تغییر کانال
- `/notifications/preferences/mute-type` - Mute نوع
- `/notifications/preferences/global-mute` - Mute کلی
- `/notifications/push-token` - ثبت توکن push
- `/notifications/push-token/:token` (DELETE) - حذف توکن

---

## 9. story.service.ts

**تعداد Methods:** 11
**مسیر پایه:** `/api/v1/stories`

| Method | Endpoint | HTTP | Description |
|--------|----------|------|-------------|
| `getStoryFeed()` | `/stories/feed` | GET | فید استوری‌ها |
| `getUserStories()` | `/stories/user/:userId` | GET | استوری‌های کاربر |
| `getMyStories()` | `/stories/my` | GET | استوری‌های من |
| `getStoryById()` | `/stories/:id` | GET | دریافت استوری |
| `getActiveStories()` | `/stories` (isActive=true) | GET | استوری‌های فعال |
| `createStory()` | `/stories` | POST | ایجاد استوری |
| `deleteStory()` | `/stories/:id` | DELETE | حذف استوری |
| `viewStory()` | `/stories/:id/view` | POST | مشاهده استوری |
| `reactToStory()` | `/stories/:id/react` | POST | ری‌اکشن |
| `removeReaction()` | `/stories/:id/react` | DELETE | حذف ری‌اکشن |
| `getMyStoryStats()` | `/stories/stats/my` | GET | آمار من |
| `getUserStoryStats()` | `/stories/stats/user/:userId` | GET | آمار کاربر |

### ⚠️ مشکل مسیر:

بک‌اند:
- `/stories/stats` - آمار کاربر جاری

فرانت:
- `/stories/stats/my` - این مسیر وجود ندارد!

### ❌ Endpoints موجود در بک‌اند که استفاده نشده:

- `/stories/:id/viewers` - لیست بیننده‌ها
- `/stories/highlights` - ایجاد هایلایت
- `/stories/highlights/user/:userId` - هایلایت‌های کاربر
- `/stories/highlights/:id/add-story` - افزودن به هایلایت
- `/stories/highlights/:id/remove-story/:storyId` - حذف از هایلایت
- `/stories/highlights/:id` (PUT) - بروزرسانی هایلایت
- `/stories/highlights/:id` (DELETE) - حذف هایلایت

---

## 10. media.service.ts

**تعداد Methods:** 16
**مسیر پایه:** `/api/v1/media`

| Method | Endpoint | HTTP | Description |
|--------|----------|------|-------------|
| `getMedia()` | `/media` | GET | دریافت رسانه‌ها |
| `getMyMedia()` | `/media/my` | GET | رسانه‌های من |
| `getMediaById()` | `/media/:id` | GET | دریافت رسانه |
| `getUserMedia()` | `/media/user/:userId` | GET | رسانه‌های کاربر |
| `getMediaByCategory()` | `/media` (category=...) | GET | فیلتر دسته |
| `getMediaByType()` | `/media` (type=...) | GET | فیلتر نوع |
| `uploadFile()` | `/media/upload` | POST | آپلود فایل |
| `uploadFiles()` | Multiple `/media/upload` | POST | آپلود چند فایل |
| `deleteMedia()` | `/media/:id` | DELETE | حذف رسانه |
| `deleteMultipleMedia()` | `/media/delete-multiple` | POST | حذف چند رسانه |
| `getMediaGalleries()` | `/media/galleries` | GET | گالری‌ها |
| `getMyGalleries()` | `/media/galleries/my` | GET | گالری‌های من |
| `getGalleryById()` | `/media/galleries/:id` | GET | دریافت گالری |
| `createGallery()` | `/media/galleries` | POST | ایجاد گالری |
| `addMediaToGallery()` | `/media/galleries/:galleryId/media` | POST | افزودن به گالری |
| `removeMediaFromGallery()` | `/media/galleries/:galleryId/media/:mediaId` | DELETE | حذف از گالری |
| `deleteGallery()` | `/media/galleries/:id` | DELETE | حذف گالری |

### ⚠️ مسیرهای اشتباه:

بک‌اند از مسیرهای زیر استفاده **نمی‌کند**:
- `/media/my`
- `/media/galleries/my`
- `/media/delete-multiple`
- `/media/galleries/:galleryId/media`

بک‌اند فقط دارد:
- `/media/user/:userId`
- `/media/stats`
- `/media/storage`
- `/media/related/:model/:id`
- `/media/:id/download`

### ❌ Endpoints موجود در بک‌اند که استفاده نشده:

- `/media/stats` - آمار رسانه
- `/media/storage` - حجم فایل‌ها
- `/media/related/:model/:id` - رسانه‌های مرتبط
- `/media/:id/download` - افزایش دانلود

---

## 11. comment.service.ts

**تعداد Methods:** 2
**مسیر پایه:** `/api/v1/comments`

| Method | Endpoint | HTTP | Description |
|--------|----------|------|-------------|
| `getComments()` | `/comments/post/:postId` | GET | دریافت کامنت‌ها |
| `createComment()` | `/comments` | POST | ایجاد کامنت |

### ✅ تطابق خوب (محدود به نیاز)

---

## 📊 خلاصه آمار

| Service | Methods | Endpoints Used | Endpoints Missing | Status |
|---------|---------|----------------|-------------------|---------|
| auth | 6 | 5 | 0 | ✅ عالی |
| need | 10 | 10 | **16** | ⚠️ فقط CRUD اولیه |
| team | 11 | 11 | 2 | ✅ خوب |
| task | 6 | 6 | 2 | ⚠️ مسیر اشتباه |
| social | 17 | 17 | 6 | ✅ خوب |
| gamification | 12 | 12 | 0 | ✅ عالی |
| discovery | 9 | 9 | **12** | ❌ مسیرها اشتباه |
| notification | 9 | 9 | **10** | ⚠️ HTTP methods اشتباه |
| story | 11 | 11 | **7** | ⚠️ مسیر stats اشتباه |
| media | 16 | 16 | **4** | ⚠️ مسیرهای اشتباه |
| comment | 2 | 2 | 0 | ✅ محدود |

**جمع کل:**
- ✅ **Services فعال:** 11
- 📝 **Methods پیاده‌سازی شده:** 109
- ❌ **Endpoints استفاده نشده از بک‌اند:** ~59
- ⚠️ **مسیرها/Methods اشتباه:** ~20

---

## 🔴 مشکلات اصلی شناسایی شده:

### 1. **Discovery Service - مسیرهای کاملاً اشتباه**

Frontend:
```typescript
/discovery/recommended-needs
/discovery/trending-needs
/discovery/new-needs
```

Backend واقعی:
```typescript
/discovery/recommendations/needs
/discovery/trending/needs
// new-needs اصلاً وجود ندارد!
```

### 2. **Notification Service - HTTP Methods اشتباه**

Frontend: PATCH `/notifications/:id/read`
Backend: POST `/notifications/:id/read`

### 3. **Task Service - مسیر نادرست**

Frontend: `/needs/:needId/teams/:teamId/tasks`
Backend: `/needs/:id/tasks`

### 4. **Story Service - مسیر stats اشتباه**

Frontend: `/stories/stats/my`
Backend: `/stories/stats`

### 5. **Media Service - endpointsی که وجود ندارند**

Frontend فراخوانی می‌کند:
- `/media/my` ❌
- `/media/galleries/my` ❌
- `/media/delete-multiple` ❌

Backend فقط دارد:
- `/media/user/:userId` ✅
- `/media/stats` ✅

### 6. **Need Service - فقط CRUD اولیه**

Features پیشرفته بک‌اند که در فرانت نیست:
- ❌ Updates (Timeline)
- ❌ Milestones
- ❌ Budget Items
- ❌ Verification Requests
- ❌ Supporter Details
- ❌ Special Feeds (trending, popular, urgent, nearby)
- ❌ Support Action
- ❌ View Increment
- ❌ Upvote (از endpoint اشتباه استفاده می‌شود)

---

## 🎯 نتیجه‌گیری:

1. **~35% از امکانات بک‌اند استفاده نشده** (خصوصاً در Needs, Discovery, Notifications, Stories)
2. **مسیرها و HTTP methods در چندین سرویس اشتباه است**
3. **نیاز به یکپارچه‌سازی کامل Frontend ↔ Backend**

---

**ادامه در فاز A3: تطبیق و شناسایی گپ‌ها**
