# API ENDPOINT QUICK REFERENCE & VISUAL MAP

## Quick Statistics
- **Total Endpoints**: 150+ (verified)
- **Total Routes Files**: 30 modules
- **Total Controllers**: 29
- **Authentication Methods**: 3 (OTP, Password, JWT)
- **User Roles**: 3 (USER, ADMIN, SUPER_ADMIN)
- **Base URL**: `/api/v1`
- **Last Updated**: ۲۱ آبان ۱۴۰۴

---

## ENDPOINT TREE STRUCTURE

```
/api/v1/
├── auth/                          (5 endpoints) [OTP + Password Auth]
│   ├── POST /request-otp
│   ├── POST /verify-and-register
│   ├── POST /login
│   ├── POST /signup
│   └── GET /me

├── users/                         (3 endpoints) [User Management]
│   ├── GET /me
│   ├── GET / (ADMIN)
│   └── GET /:id

├── needs/                         (60+ endpoints) [CORE: Needs Platform]
│   ├── POST / (Create)
│   ├── GET / (List)
│   ├── GET /trending
│   ├── GET /popular
│   ├── GET /urgent
│   ├── GET /nearby
│   ├── GET /:identifier
│   ├── GET /admin/all (ADMIN)
│   ├── PATCH /:id (ADMIN)
│   ├── DELETE /:id (ADMIN)
│   │
│   ├── Social (Upvote/Support)
│   │   ├── POST /:id/upvote
│   │   ├── POST /:id/support
│   │   └── POST /:id/view
│   │
│   ├── Supporters Management
│   │   ├── GET /:id/supporters/details
│   │   ├── PATCH /:id/supporters/:userId
│   │   ├── POST /:id/supporters/:userId/contributions
│   │   └── DELETE /:id/supporters/:userId
│   │
│   ├── Updates/Timeline
│   │   ├── GET /:id/updates
│   │   ├── POST /:id/updates
│   │   ├── PATCH /:id/updates/:updateId
│   │   └── DELETE /:id/updates/:updateId
│   │
│   ├── Milestones
│   │   ├── GET /:id/milestones
│   │   ├── POST /:id/milestones
│   │   ├── PATCH /:id/milestones/:milestoneId
│   │   ├── DELETE /:id/milestones/:milestoneId
│   │   └── POST /:id/milestones/:milestoneId/complete
│   │
│   ├── Budget
│   │   ├── GET /:id/budget
│   │   ├── POST /:id/budget
│   │   ├── PATCH /:id/budget/:budgetItemId
│   │   ├── DELETE /:id/budget/:budgetItemId
│   │   └── POST /:id/budget/:budgetItemId/add-funds
│   │
│   ├── Verifications
│   │   ├── GET /:id/verifications
│   │   ├── POST /:id/verifications
│   │   ├── PATCH /:id/verifications/:verificationId/review
│   │   └── DELETE /:id/verifications/:verificationId
│   │
│   ├── Tasks
│   │   ├── GET /:id/tasks
│   │   ├── POST /:id/tasks
│   │   ├── PATCH /:id/tasks/:taskId
│   │   ├── DELETE /:id/tasks/:taskId
│   │   ├── PATCH /:id/tasks/:taskId/checklist
│   │   └── POST /:id/tasks/:taskId/complete
│   │
│   ├── Comments
│   │   ├── GET /:id/comments
│   │   ├── POST /:id/comments
│   │   ├── PATCH /:id/comments/:commentId
│   │   └── DELETE /:id/comments/:commentId
│   │
│   └── Nested Routes
│       ├── /:id/messages/ → Supporter Messages
│       ├── /:needId/direct-messages/ → Direct Messages
│       ├── /:needId/teams/ → Teams
│       ├── /:id/polls/ → Polls
│       └── /:id/submissions/ → Submissions

├── comments/                      (5 endpoints) [General Comments]
│   ├── POST /
│   ├── GET /post/:postId
│   ├── GET / (ADMIN)
│   ├── PATCH /:id (ADMIN)
│   └── DELETE /:id (ADMIN)

├── social/                        (27 endpoints) [Follow, Mentions, Tags, Shares]
│   ├── Follow System
│   │   ├── POST /follow/user/:userId
│   │   ├── DELETE /follow/user/:userId
│   │   ├── POST /follow/need/:needId
│   │   ├── DELETE /follow/need/:needId
│   │   ├── GET /users/:userId/followers
│   │   ├── GET /users/:userId/following
│   │   ├── GET /users/:userId/follow-stats
│   │   ├── GET /my-followed-needs
│   │   ├── GET /needs/:needId/followers
│   │   └── GET /follow/suggestions
│   │
│   ├── Mentions System
│   │   ├── GET /mentions/me
│   │   ├── GET /mentions/unread-count
│   │   ├── POST /mentions/:mentionId/read
│   │   └── POST /mentions/read-all
│   │
│   ├── Tags System
│   │   ├── GET /tags/popular
│   │   ├── GET /tags/trending
│   │   ├── GET /tags/search
│   │   └── GET /tags/:tag/needs
│   │
│   └── Share System
│       ├── POST /share
│       ├── GET /share/top
│       ├── GET /share/:itemId/stats
│       ├── GET /share/:needId/og-metadata
│       └── GET /share/:needId/url

├── discovery/                     (16 endpoints) [Leaderboards, Trending, Recommendations]
│   ├── Leaderboard
│   │   ├── GET /leaderboard
│   │   ├── GET /leaderboard/me
│   │   ├── GET /leaderboard/user/:userId
│   │   ├── GET /leaderboard/nearby
│   │   ├── GET /leaderboard/top
│   │   └── GET /leaderboard/multiple
│   │
│   ├── Trending
│   │   ├── GET /trending/needs
│   │   ├── GET /trending/users
│   │   ├── GET /trending/tags
│   │   └── GET /trending/all
│   │
│   ├── Recommendations
│   │   ├── GET /recommendations/needs
│   │   ├── GET /recommendations/users
│   │   ├── GET /recommendations/teams
│   │   ├── GET /recommendations/personalized
│   │   └── GET /recommendations/preferences
│   │
│   └── Combined
│       ├── GET /feed
│       └── GET /stats

├── notifications/                 (14 endpoints) [Notifications & Preferences]
│   ├── Notifications
│   │   ├── GET /
│   │   ├── GET /grouped
│   │   ├── GET /unread-count
│   │   ├── GET /stats
│   │   ├── POST /:id/read
│   │   ├── POST /mark-all-read
│   │   ├── DELETE /:id
│   │   └── DELETE /read
│   │
│   ├── Preferences
│   │   ├── GET /preferences
│   │   ├── PUT /preferences
│   │   ├── POST /preferences/toggle-channel
│   │   ├── POST /preferences/mute-type
│   │   └── POST /preferences/global-mute
│   │
│   └── Push Tokens
│       ├── POST /push-token
│       └── DELETE /push-token/:token

├── stories/                       (17 endpoints) [Stories & Highlights]
│   ├── Stories
│   │   ├── POST /
│   │   ├── GET /feed
│   │   ├── GET /stats
│   │   ├── GET /user/:userId
│   │   ├── GET /:id
│   │   ├── POST /:id/view
│   │   ├── POST /:id/react
│   │   ├── DELETE /:id/react
│   │   ├── DELETE /:id
│   │   └── GET /:id/viewers
│   │
│   └── Highlights
│       ├── POST /highlights
│       ├── GET /highlights/user/:userId
│       ├── POST /highlights/:id/add-story
│       ├── DELETE /highlights/:id/remove-story/:storyId
│       ├── PUT /highlights/:id
│       └── DELETE /highlights/:id

├── media/                         (8 endpoints) [Media Upload & Management]
│   ├── POST /upload (multipart)
│   ├── GET /stats
│   ├── GET /storage
│   ├── GET /user/:userId
│   ├── GET /related/:model/:id
│   ├── GET /:id
│   ├── POST /:id/download
│   └── DELETE /:id

├── gamification/                  (14 endpoints) [Points, Badges, Stats]
│   ├── Leaderboard
│   │   ├── GET /leaderboard
│   │   └── GET /leaderboard/enhanced
│   │
│   ├── Points
│   │   ├── GET /points/my-summary
│   │   ├── GET /points/my-transactions
│   │   ├── GET /points/my-breakdown
│   │   ├── POST /points/daily-bonus
│   │   ├── POST /points/award (ADMIN)
│   │   └── POST /points/deduct (ADMIN)
│   │
│   ├── Badges
│   │   ├── GET /badges
│   │   ├── GET /badges/:badgeId
│   │   ├── GET /badges/my-badges
│   │   ├── GET /badges/:badgeId/progress
│   │   ├── POST /badges/check
│   │   ├── GET /users/:userId/badges
│   │   ├── POST /badges (ADMIN)
│   │   ├── PATCH /badges/:badgeId (ADMIN)
│   │   └── DELETE /badges/:badgeId (ADMIN)
│   │
│   └── Stats
│       ├── GET /stats/me
│       ├── GET /stats/:userId
│       └── GET /activity/me

├── teams/                         (10 endpoints) [Team Management]
│   ├── POST / (Create)
│   ├── GET / (List)
│   ├── GET /my-teams
│   ├── GET /:teamId
│   ├── PATCH /:teamId
│   ├── DELETE /:teamId
│   ├── GET /:teamId/stats
│   ├── POST /:teamId/members
│   ├── DELETE /:teamId/members/:userId
│   ├── PATCH /:teamId/members/:userId/role
│   └── POST /:teamId/invite

├── team-invitations/              (2 endpoints) [Team Invitations]
│   ├── GET /my-invitations
│   └── POST /:invitationId/respond

├── categories/                    (5 endpoints) [General Categories - ADMIN]
│   ├── GET /
│   ├── POST /
│   ├── GET /:id
│   ├── PATCH /:id
│   └── DELETE /:id

├── need-categories/               (4 endpoints) [Need Categories]
│   ├── GET /
│   ├── POST / (ADMIN)
│   ├── PATCH /:id (ADMIN)
│   └── DELETE /:id (ADMIN)

├── blog/
│   ├── articles/                  (6 endpoints)
│   │   ├── GET /
│   │   ├── GET /:identifier
│   │   ├── PATCH /:id/increment-view
│   │   ├── POST / (ADMIN)
│   │   ├── PATCH /:id (ADMIN)
│   │   └── DELETE /:id (ADMIN)
│   │
│   ├── videos/                    (6 endpoints)
│   │   ├── GET /
│   │   ├── GET /:identifier
│   │   ├── PATCH /:id/increment-view
│   │   ├── POST / (ADMIN)
│   │   ├── PATCH /:id (ADMIN)
│   │   └── DELETE /:id (ADMIN)
│   │
│   ├── gallery/                   (6 endpoints)
│   │   ├── GET /
│   │   ├── GET /:identifier
│   │   ├── PATCH /:id/increment-view
│   │   ├── POST / (ADMIN)
│   │   ├── PATCH /:id (ADMIN)
│   │   └── DELETE /:id (ADMIN)
│   │
│   └── featured-items/            (2 endpoints)
│       ├── GET /
│       └── PUT / (ADMIN)

├── news/                          (6 endpoints)
│   ├── GET /
│   ├── GET /:id
│   ├── PATCH /:id/increment-view
│   ├── POST / (ADMIN)
│   ├── PATCH /:id (ADMIN)
│   └── DELETE /:id (SUPER_ADMIN)

├── faqs/                          (5 endpoints)
│   ├── GET /client
│   ├── GET / (ADMIN)
│   ├── POST / (ADMIN)
│   ├── PATCH /:id (ADMIN)
│   └── DELETE /:id (ADMIN)

├── projects/                      (7 endpoints)
│   ├── GET /
│   ├── GET /:identifier
│   ├── PATCH /:id/increment-view (ADMIN)
│   ├── POST / (ADMIN)
│   ├── PATCH /:id (ADMIN)
│   └── DELETE /:id (ADMIN)

├── tags/                          (4 endpoints)
│   ├── GET /
│   ├── POST / (ADMIN)
│   ├── PATCH /:id (ADMIN)
│   └── DELETE /:id (ADMIN)

├── authors/                       (5 endpoints) [ADMIN ONLY]
│   ├── GET /
│   ├── POST /
│   ├── GET /:id
│   ├── PATCH /:id
│   └── DELETE /:id

├── settings/                      (2 endpoints)
│   ├── GET /:key
│   └── PATCH /:key (ADMIN)

├── upload/                        (2 endpoints) [ADMIN ONLY]
│   ├── POST /single (Image upload)
│   └── POST /multiple (Batch upload)

├── public-upload/                 (1 endpoint) [Public]
│   └── POST / (Upload attachments)

└── / (Health Check)               (1 endpoint)
    └── GET / (Status check)
```

---

## AUTHENTICATION FLOW

### Option 1: OTP-Based Registration
```
1. POST /api/v1/auth/request-otp
   - Input: { mobile: "09xxxxxxxxx" }
   - Output: { message: "OTP sent" }

2. POST /api/v1/auth/verify-and-register
   - Input: { mobile, verificationCode, name, password, nationalId, profile }
   - Output: { token, user }

3. GET /api/v1/auth/me (with token)
   - Verify authentication
```

### Option 2: Password-Based
```
1. POST /api/v1/auth/signup
   - Input: { mobile, name, password, ... }
   - Output: { token, user }

2. POST /api/v1/auth/login
   - Input: { mobile, password }
   - Output: { token, user }

3. GET /api/v1/auth/me (with token)
   - Verify authentication
```

### Token Usage
```
Header: Authorization: Bearer <JWT_TOKEN>

All protected endpoints require this header.
Token expires based on JWT_EXPIRES_IN env variable.
```

---

## MIDDLEWARE CHAIN BY ROUTE TYPE

### Public Routes (No Auth Required)
```
Request → Body Parser → Route Handler → Response
```

### Authenticated Routes (protect middleware)
```
Request → Body Parser → Extract Token → Verify JWT → Attach User
 → Route Handler → Response
```

### Role-Based Routes (protect + restrictTo)
```
Request → Body Parser → Extract Token → Verify JWT → Attach User
 → Check Roles → Route Handler → Response
```

### Supporter-Protected Routes (protect + isSupporter)
```
Request → Body Parser → Extract Token → Verify JWT → Attach User
 → Check Need Supporters → Route Handler → Response
```

### Validated Routes (validate middleware)
```
Request → Body Parser → Extract Token → Verify JWT
 → Schema Validation (Zod) → Route Handler → Response
```

### Optional Auth Routes (protectOptional)
```
Request → Body Parser → Try Extract Token → Verify JWT (if exists)
 → Route Handler → Response
```

---

## COMMON PATTERNS

### CRUD Operations
All admin modules follow REST principles:
```
GET    /resource              List all
POST   /resource              Create new
GET    /resource/:id          Get single
PATCH  /resource/:id          Update
DELETE /resource/:id          Delete
```

### Nested Resources
Needs module uses nested routing:
```
/api/v1/needs/:id/updates
/api/v1/needs/:id/milestones
/api/v1/needs/:id/budget
/api/v1/needs/:id/tasks
/api/v1/needs/:id/comments
/api/v1/needs/:id/messages
```

### Feed Endpoints
Discovery uses semantic URLs:
```
GET /trending/needs
GET /trending/users
GET /trending/tags
GET /recommendations/needs
GET /recommendations/users
GET /feed (personalized)
```

### View Counting
Content modules increment views:
```
PATCH /:id/increment-view
Used on: articles, videos, gallery, news, projects
```

---

## STATUS CODES

| Code | Meaning | Common Endpoints |
|------|---------|------------------|
| 200 | OK | GET, PATCH, DELETE success |
| 201 | Created | POST success |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate field |
| 500 | Server Error | Internal error |

---

## QUERY PARAMETERS SUPPORT

### Pagination
```
?limit=20&skip=0
```

### Filters
```
?category=xyz
?status=active
?type=need
```

### Sorting
```
?sort=createdAt
?sort=-updatedAt (descending)
```

### Categories
```
?category=points (for leaderboards)
?period=all_time (for leaderboards)
```

---

## FILE UPLOAD LIMITS

- **Single File**: Up to 50MB
- **Batch Upload**: Up to 10 files
- **Supported Formats**:
  - Images: JPEG, PNG, GIF, WebP, SVG
  - Videos: MP4, MPEG, WebM, QuickTime
  - Audio: MP3, WAV, OGG
  - Documents: PDF, Word, Excel, PowerPoint, TXT, JSON

---

## GENERATED DOCUMENTS

This report includes:
1. **COMPREHENSIVE_BACKEND_REPORT.md** - Full detailed documentation (1,141 lines)
2. **API_ENDPOINT_SUMMARY.md** - This quick reference
3. **BACKEND_ROUTES_MAP.txt** - Complete route tree

---

**Report Generated**: November 11, 2024 (Updated)
**Framework**: Express 5.1.0 + Mongoose 8.17.1
**Language**: TypeScript 5.9.2
**Updated**: ۲۱ آبان ۱۴۰۴
