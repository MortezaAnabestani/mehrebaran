# COMPREHENSIVE BACKEND ROUTES, CONTROLLERS & API ENDPOINTS REPORT

**Project**: Mehrebaran
**Type**: Node.js/Express with TypeScript
**Architecture**: Modular (MVC-based)
**Total Backend Code**: 15,632+ lines of TypeScript

---

## TABLE OF CONTENTS
1. [API Infrastructure](#api-infrastructure)
2. [Authentication & Middleware](#authentication--middleware)
3. [Complete API Endpoints by Module](#complete-api-endpoints-by-module)
4. [Controllers Overview](#controllers-overview)
5. [Request/Response Validation](#requestresponse-validation)
6. [API Map Summary](#api-map-summary)

---

## API INFRASTRUCTURE

### Base Configuration
- **Framework**: Express 5.1.0
- **Base URL**: `/api/v1`
- **CORS**: Enabled (origin: "*")
- **Body Parser**: JSON & URL-encoded support
- **Static Files**: Served from `/public` directory
- **Port**: Configurable via environment
- **Database**: MongoDB with Mongoose 8.17.1

### Server Entry Point
```
Location: /packages/api/src/main.ts
- Connects to MongoDB
- Starts Express server
- Initializes all routes and middleware
```

### Application Setup
```
Location: /packages/api/src/app.ts
- Configures CORS
- Sets up body parsers
- Mounts all module routes
- Applies global error handler
```

---

## AUTHENTICATION & MIDDLEWARE

### Authentication Middleware (`auth.middleware.ts`)

#### 1. **protect** - Required Authentication
- Validates Bearer token from Authorization header
- Extracts user from JWT payload
- Attaches user to `req.user`
- Returns 401 if token invalid/missing
- Used on protected routes

#### 2. **protectOptional** - Optional Authentication
- Validates Bearer token if provided
- Does NOT reject if token missing
- Attaches user to `req.user` only if token valid
- Used on public routes that can personalize for logged-in users

#### 3. **restrictTo(...roles)** - Role-Based Access Control
- Checks if user has required roles
- Supported roles: ADMIN, SUPER_ADMIN
- Returns 403 if insufficient permissions
- Works with protect middleware

### Custom Middleware

#### **isSupporter** - Supporter Verification
- Location: `/modules/needs/need.middleware.ts`
- Checks if user is a supporter of specific need
- Validates need exists
- Returns 403 if user is not a supporter
- Used on need-related protection operations

#### **validate** - Schema Validation
- Location: `/core/middlewares/validate.ts`
- Uses Zod schemas for request validation
- Validates body, query, and params
- Returns 400 with validation errors
- Applied on routes with specific validation requirements

### Error Handler Middleware
- Location: `/core/middlewares/errorHandler.ts`
- Handles:
  - Duplicate field errors (MongoDB)
  - Validation errors (Mongoose & Zod)
  - Custom ApiError instances
- Returns appropriate HTTP status codes
- Includes stack trace in development mode

---

## COMPLETE API ENDPOINTS BY MODULE

### 1. AUTHENTICATION MODULE
**Base Route**: `/api/v1/auth`
**File**: `modules/auth/auth.routes.ts`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/request-otp` | None | Request OTP for mobile verification |
| POST | `/verify-and-register` | None | Verify OTP and register new user |
| POST | `/login` | None | Login with mobile & password |
| POST | `/signup` | None | Sign up with mobile & password |
| GET | `/me` | Required | Get current authenticated user |

**Validation**:
- Mobile: Must match pattern `09\d{9}` (Iranian format)
- OTP: 6 digits
- Password: Minimum 6 characters
- Name: Minimum 3 characters
- National ID: 10 digits

---

### 2. USERS MODULE
**Base Route**: `/api/v1/users`
**File**: `modules/users/user.routes.ts`

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/me` | Required | All | Get authenticated user profile |
| GET | `/` | Required | ADMIN, SUPER_ADMIN | Get all users |
| GET | `/:id` | Required | All | Get user by ID |

**Controller**: `user.controller.ts`
**Methods**:
- `getMe()` - Returns authenticated user from `req.user`
- `getAllUsers()` - Retrieves all users from database
- `getUserById(id)` - Fetches specific user details

---

### 3. NEEDS MODULE (Complex)
**Base Route**: `/api/v1/needs`
**File**: `modules/needs/need.routes.ts`

#### Main Endpoints
| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/` | Optional | All | Get all needs (paginated/filtered) |
| POST | `/` | Optional | All | Create new need (user or guest) |
| GET | `/trending` | None | All | Get trending needs |
| GET | `/popular` | None | All | Get popular needs |
| GET | `/urgent` | None | All | Get urgent needs |
| GET | `/nearby` | None | All | Get nearby needs (geolocation) |
| GET | `/:identifier` | None | All | Get single need by ID/slug |
| GET | `/admin/all` | Required | ADMIN | Get all needs (admin view) |
| PATCH | `/:id` | Required | ADMIN | Update need (admin only) |
| DELETE | `/:id` | Required | ADMIN | Delete need (admin only) |

#### Support/Upvote Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/:id/upvote` | Required | Toggle upvote on need |
| POST | `/:id/support` | Required | Become a supporter of need |
| POST | `/:id/view` | Optional | Increment view counter |

#### Supporter Details Management
| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/:id/supporters/details` | Optional | All | Get supporter details |
| PATCH | `/:id/supporters/:userId` | Required | ADMIN | Update supporter detail |
| POST | `/:id/supporters/:userId/contributions` | Required | All | Add contribution by supporter |
| DELETE | `/:id/supporters/:userId` | Required | All | Remove supporter |

#### Timeline/Updates
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/:id/updates` | None | Get all need updates |
| POST | `/:id/updates` | Required | Create new update |
| PATCH | `/:id/updates/:updateId` | Required | Edit update |
| DELETE | `/:id/updates/:updateId` | Required | Delete update |

#### Milestones
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/:id/milestones` | None | Get all milestones |
| POST | `/:id/milestones` | Required | Create milestone |
| PATCH | `/:id/milestones/:milestoneId` | Required | Update milestone |
| DELETE | `/:id/milestones/:milestoneId` | Required | Delete milestone |
| POST | `/:id/milestones/:milestoneId/complete` | Required | Mark milestone complete |

#### Budget Management
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/:id/budget` | None | Get budget items |
| POST | `/:id/budget` | Required | Create budget item |
| PATCH | `/:id/budget/:budgetItemId` | Required | Update budget item |
| DELETE | `/:id/budget/:budgetItemId` | Required | Delete budget item |
| POST | `/:id/budget/:budgetItemId/add-funds` | Required | Add funds to budget item |

#### Verification/Tasks/Comments
| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/:id/verifications` | None | All | Get verification requests |
| POST | `/:id/verifications` | Required | All | Create verification request |
| PATCH | `/:id/verifications/:verificationId/review` | Required | ADMIN | Review verification |
| DELETE | `/:id/verifications/:verificationId` | Required | All | Delete verification request |
| GET | `/:id/tasks` | None | All | Get tasks |
| POST | `/:id/tasks` | Required | All | Create task |
| PATCH | `/:id/tasks/:taskId` | Required | All | Update task |
| DELETE | `/:id/tasks/:taskId` | Required | All | Delete task |
| PATCH | `/:id/tasks/:taskId/checklist` | Required | All | Update task checklist |
| POST | `/:id/tasks/:taskId/complete` | Required | All | Complete task |
| GET | `/:id/comments` | None | All | Get need comments |
| POST | `/:id/comments` | Required | All | Create comment |
| PATCH | `/:id/comments/:commentId` | Required | All | Update comment |
| DELETE | `/:id/comments/:commentId` | Required | All | Delete comment |

#### Nested Routes (Merges into need context)
- **Messages**: `/:id/messages` → `supporterMessage.routes.ts`
- **Direct Messages**: `/:needId/direct-messages` → `directMessage.routes.ts`
- **Teams**: `/:needId/teams` → `team.routes.ts`
- **Polls**: `/:id/polls` → `poll.routes.ts`
- **Submissions**: `/:id/submissions` → `supporterSubmission.routes.ts`

---

### 4. SUPPORTER MESSAGES MODULE
**Base Route**: `/api/v1/needs/:id/messages`
**File**: `modules/supporter/supporter-messages/supporterMessage.routes.ts`

| Method | Endpoint | Auth | Middleware | Description |
|--------|----------|------|-----------|-------------|
| GET | `/` | None | None | Get all messages for need |
| POST | `/` | Required | isSupporter | Create new message |
| POST | `/:messageId/like` | Required | isSupporter | Toggle like on message |

---

### 5. DIRECT MESSAGES MODULE
**Base Route**: `/api/v1/needs/:needId/direct-messages`
**File**: `modules/direct-messages/directMessage.routes.ts`

#### Conversation Management
| Method | Endpoint | Auth | Middleware | Description |
|--------|----------|------|-----------|-------------|
| POST | `/conversations` | Required | isSupporter | Create conversation |
| GET | `/conversations` | Required | isSupporter | Get user conversations |
| GET | `/conversations/unread-count` | Required | isSupporter | Get unread count |
| POST | `/conversations/:conversationId/archive` | Required | None | Archive conversation |

#### Message Management
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/conversations/:conversationId/messages` | Required | Get conversation messages |
| POST | `/conversations/:conversationId/messages` | Required | Send message |
| POST | `/conversations/:conversationId/read` | Required | Mark as read |
| PATCH | `/messages/:messageId` | Required | Edit message |
| DELETE | `/messages/:messageId` | Required | Delete message |

---

### 6. POLLS MODULE
**Base Route**: `/api/v1/needs/:id/polls`
**File**: `modules/polls/poll.routes.ts`

| Method | Endpoint | Auth | Roles | Middleware | Description |
|--------|----------|------|-------|-----------|-------------|
| GET | `/` | None | All | None | Get all polls for need |
| POST | `/` | Required | ADMIN | None | Create poll |
| POST | `/:pollId/options/:optionId/vote` | Required | All | isSupporter | Vote on poll option |

---

### 7. SUPPORTER SUBMISSIONS MODULE
**Base Route**: `/api/v1/needs/:id/submissions`
**File**: `modules/supporter/supporter-submissions/supporterSubmission.routes.ts`

| Method | Endpoint | Auth | Roles | Middleware | Description |
|--------|----------|------|-------|-----------|-------------|
| GET | `/` | None | All | None | Get submissions by need |
| POST | `/` | Required | All | isSupporter | Create submission |
| GET | `/admin` | Required | ADMIN | None | Get all submissions (admin) |
| PATCH | `/:submissionId/status` | Required | ADMIN | None | Update submission status |

---

### 8. CATEGORIES MODULE
**Base Route**: `/api/v1/categories`
**File**: `modules/categories/category.routes.ts`

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/` | Required | ADMIN | Get all categories |
| POST | `/` | Required | ADMIN | Create category |
| GET | `/:id` | Required | ADMIN | Get category by ID |
| PATCH | `/:id` | Required | ADMIN | Update category |
| DELETE | `/:id` | Required | ADMIN | Delete category |

---

### 9. NEED CATEGORIES MODULE
**Base Route**: `/api/v1/need-categories`
**File**: `modules/need-categories/needCategory.routes.ts`

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/` | None | All | Get all need categories |
| POST | `/` | Required | ADMIN | Create category |
| PATCH | `/:id` | Required | ADMIN | Update category |
| DELETE | `/:id` | Required | ADMIN | Delete category |

---

### 10. COMMENTS MODULE
**Base Route**: `/api/v1/comments`
**File**: `modules/comment/comment.routes.ts`

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| POST | `/` | Required | All | Create comment |
| GET | `/post/:postId` | None | All | Get comments by post |
| GET | `/` | Required | ADMIN | Get all comments (admin) |
| PATCH | `/:id` | Required | ADMIN | Update comment |
| DELETE | `/:id` | Required | ADMIN | Delete comment |

---

### 11. SOCIAL MODULE (Follow, Mentions, Tags, Shares)
**Base Route**: `/api/v1/social`
**File**: `modules/social/social.routes.ts`

#### Follow System
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/follow/user/:userId` | Required | Follow user |
| DELETE | `/follow/user/:userId` | Required | Unfollow user |
| POST | `/follow/need/:needId` | Required | Follow need |
| DELETE | `/follow/need/:needId` | Required | Unfollow need |
| GET | `/users/:userId/followers` | None | Get user's followers |
| GET | `/users/:userId/following` | None | Get user's following |
| GET | `/users/:userId/follow-stats` | None | Get follow statistics |
| GET | `/my-followed-needs` | Required | Get authenticated user's followed needs |
| GET | `/needs/:needId/followers` | None | Get need's followers |
| GET | `/follow/suggestions` | Required | Get suggested users to follow |

#### Mentions System
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/mentions/me` | Required | Get user's mentions |
| GET | `/mentions/unread-count` | Required | Get unread mention count |
| POST | `/mentions/:mentionId/read` | Required | Mark mention as read |
| POST | `/mentions/read-all` | Required | Mark all mentions as read |

#### Tags System
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/tags/popular` | None | Get popular tags |
| GET | `/tags/trending` | None | Get trending tags |
| GET | `/tags/search` | None | Search tags |
| GET | `/tags/:tag/needs` | None | Get needs by tag |

#### Share System
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/share` | Optional | Log share event |
| GET | `/share/top` | None | Get top shared items |
| GET | `/share/:itemId/stats` | None | Get item share statistics |
| GET | `/share/:needId/og-metadata` | None | Get OpenGraph metadata |
| GET | `/share/:needId/url` | None | Get share URL |

---

### 12. DISCOVERY MODULE
**Base Route**: `/api/v1/discovery`
**File**: `modules/discovery/discovery.routes.ts`

#### Leaderboard Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/leaderboard` | None | Get leaderboard (public) |
| GET | `/leaderboard/me` | Required | Get current user's rank |
| GET | `/leaderboard/user/:userId` | None | Get specific user's rank |
| GET | `/leaderboard/nearby` | Required | Get nearby users in rankings |
| GET | `/leaderboard/top` | None | Get top users |
| GET | `/leaderboard/multiple` | None | Get multiple category leaderboards |

#### Trending Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/trending/needs` | None | Get trending needs |
| GET | `/trending/users` | None | Get trending users |
| GET | `/trending/tags` | None | Get trending tags |
| GET | `/trending/all` | None | Get all trending items |

#### Recommendations Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/recommendations/needs` | Required | Get recommended needs |
| GET | `/recommendations/users` | Required | Get recommended users |
| GET | `/recommendations/teams` | Required | Get recommended teams |
| GET | `/recommendations/personalized` | Required | Get personalized recommendations |
| GET | `/recommendations/preferences` | Required | Get user preferences |

#### Combined/Discovery Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/feed` | Optional | Get personalized feed |
| GET | `/stats` | Optional | Get discovery statistics |

---

### 13. NOTIFICATIONS MODULE
**Base Route**: `/api/v1/notifications`
**File**: `modules/notifications/notification.routes.ts`

#### Notification Management
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Required | Get user notifications (filtered) |
| GET | `/grouped` | Required | Get notifications grouped by type |
| GET | `/unread-count` | Required | Get unread notification count |
| GET | `/stats` | Required | Get notification statistics |
| POST | `/:id/read` | Required | Mark notification as read |
| POST | `/mark-all-read` | Required | Mark all as read |
| DELETE | `/:id` | Required | Delete notification |
| DELETE | `/read` | Required | Delete all read notifications |

#### Preferences Management
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/preferences` | Required | Get notification preferences |
| PUT | `/preferences` | Required | Update preferences |
| POST | `/preferences/toggle-channel` | Required | Enable/disable channel |
| POST | `/preferences/mute-type` | Required | Mute notification type |
| POST | `/preferences/global-mute` | Required | Toggle global mute |

#### Push Token Management
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/push-token` | Required | Register push token |
| DELETE | `/push-token/:token` | Required | Remove push token |

---

### 14. STORIES MODULE
**Base Route**: `/api/v1/stories`
**File**: `modules/stories/story.routes.ts`

#### Story Management
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Required | Create story |
| GET | `/feed` | Required | Get story feed |
| GET | `/stats` | Required | Get user's story stats |
| GET | `/user/:userId` | Required | Get user's stories |
| GET | `/:id` | Required | Get story by ID |
| POST | `/:id/view` | Required | Log story view |
| POST | `/:id/react` | Required | Add reaction to story |
| DELETE | `/:id/react` | Required | Remove reaction from story |
| DELETE | `/:id` | Required | Delete story |
| GET | `/:id/viewers` | Required | Get story viewers |

#### Story Highlights
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/highlights` | Required | Create highlight |
| GET | `/highlights/user/:userId` | Required | Get user's highlights |
| POST | `/highlights/:id/add-story` | Required | Add story to highlight |
| DELETE | `/highlights/:id/remove-story/:storyId` | Required | Remove story from highlight |
| PUT | `/highlights/:id` | Required | Update highlight |
| DELETE | `/highlights/:id` | Required | Delete highlight |

---

### 15. MEDIA MODULE
**Base Route**: `/api/v1/media`
**File**: `modules/stories/media.routes.ts`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/upload` | Required | Upload media file (multipart) |
| GET | `/stats` | Required | Get user media statistics |
| GET | `/storage` | Required | Get total storage usage |
| GET | `/user/:userId` | Required | Get user's media files |
| GET | `/related/:model/:id` | Required | Get media related to entity |
| GET | `/:id` | Required | Get media by ID |
| POST | `/:id/download` | Required | Log download |
| DELETE | `/:id` | Required | Delete media |

**Supported File Types**:
- Images: JPEG, PNG, GIF, WebP, SVG
- Videos: MP4, MPEG, QuickTime, WebM
- Audio: MP3, WAV, OGG
- Documents: PDF, Word, Excel, PowerPoint, TXT, JSON
- Max File Size: 50MB

---

### 16. GAMIFICATION MODULE
**Base Route**: `/api/v1/gamification`
**File**: `modules/gamification/gamification.routes.ts`

#### Leaderboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/leaderboard` | None | Get points leaderboard |
| GET | `/leaderboard/enhanced` | None | Get leaderboard with stats |

#### Points Management
| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/points/my-summary` | Required | All | Get user's points summary |
| GET | `/points/my-transactions` | Required | All | Get points transactions history |
| GET | `/points/my-breakdown` | Required | All | Get points breakdown by category |
| POST | `/points/daily-bonus` | Required | All | Claim daily bonus |
| POST | `/points/award` | Required | ADMIN | Award points to user |
| POST | `/points/deduct` | Required | ADMIN | Deduct points from user |

#### Badges
| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/badges` | None | All | Get all available badges |
| GET | `/badges/:badgeId` | None | All | Get badge details |
| GET | `/badges/my-badges` | Required | All | Get user's earned badges |
| GET | `/badges/:badgeId/progress` | Required | All | Get progress toward badge |
| POST | `/badges/check` | Required | All | Check for earned badges |
| GET | `/users/:userId/badges` | None | All | Get specific user's badges |
| POST | `/badges` | Required | ADMIN | Create badge |
| PATCH | `/badges/:badgeId` | Required | ADMIN | Update badge |
| DELETE | `/badges/:badgeId` | Required | ADMIN | Delete badge |

#### User Stats
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/stats/me` | Required | Get current user stats |
| GET | `/stats/:userId` | None | Get user stats |
| GET | `/activity/me` | Required | Get user activity log |

---

### 17. TEAMS MODULE
**Base Route**: `/api/v1/teams`
**File**: `modules/teams/team.routes.ts`

#### Team Management
| Method | Endpoint | Auth | Middleware | Description |
|--------|----------|------|-----------|-------------|
| POST | `/` | Required | isSupporter | Create team |
| GET | `/` | None | None | Get all teams |
| GET | `/my-teams` | Required | None | Get user's teams |
| GET | `/:teamId` | None | None | Get team by ID |
| PATCH | `/:teamId` | Required | None | Update team |
| DELETE | `/:teamId` | Required | None | Delete team |
| GET | `/:teamId/stats` | None | None | Get team statistics |

#### Member Management
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/:teamId/members` | Required | Add member to team |
| DELETE | `/:teamId/members/:userId` | Required | Remove member from team |
| PATCH | `/:teamId/members/:userId/role` | Required | Update member role |
| POST | `/:teamId/invite` | Required | Invite user to team |

---

### 18. TEAM INVITATIONS MODULE
**Base Route**: `/api/v1/team-invitations`
**File**: `modules/teams/teamInvitation.routes.ts`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/my-invitations` | Required | Get user's team invitations |
| POST | `/:invitationId/respond` | Required | Accept/reject invitation |

---

### 19. BLOG/ARTICLES MODULE
**Base Route**: `/api/v1/blog/articles`
**File**: `modules/blog/articles/article.routes.ts`

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/` | None | All | Get all articles |
| GET | `/:identifier` | None | All | Get article by ID/slug |
| PATCH | `/:id/increment-view` | None | All | Increment view count |
| POST | `/` | Required | ADMIN | Create article |
| PATCH | `/:id` | Required | ADMIN | Update article |
| DELETE | `/:id` | Required | ADMIN | Delete article |

---

### 20. BLOG/VIDEOS MODULE
**Base Route**: `/api/v1/blog/videos`
**File**: `modules/blog/videos/video.routes.ts`

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/` | None | All | Get all videos |
| GET | `/:identifier` | None | All | Get video by ID/slug |
| PATCH | `/:id/increment-view` | None | All | Increment view count |
| POST | `/` | Required | ADMIN | Create video |
| PATCH | `/:id` | Required | ADMIN | Update video |
| DELETE | `/:id` | Required | ADMIN | Delete video |

---

### 21. BLOG/GALLERY MODULE
**Base Route**: `/api/v1/blog/gallery`
**File**: `modules/blog/gallery/gallery.routes.ts`

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/` | None | All | Get all gallery items |
| GET | `/:identifier` | None | All | Get gallery item by ID/slug |
| PATCH | `/:id/increment-view` | None | All | Increment view count |
| POST | `/` | Required | ADMIN | Create gallery item |
| PATCH | `/:id` | Required | ADMIN | Update gallery item |
| DELETE | `/:id` | Required | ADMIN | Delete gallery item |

---

### 22. BLOG/FEATURED ITEMS MODULE
**Base Route**: `/api/v1/blog/featured-items`
**File**: `modules/blog/featuredItems/featured.routes.ts`

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/` | None | All | Get featured items |
| PUT | `/` | Required | ADMIN | Update featured items |

---

### 23. NEWS MODULE
**Base Route**: `/api/v1/news`
**File**: `modules/news/news.routes.ts`

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/` | None | All | Get all news |
| GET | `/:id` | None | All | Get news by ID |
| PATCH | `/:id/increment-view` | None | All | Increment view count |
| POST | `/` | Required | ADMIN | Create news |
| PATCH | `/:id` | Required | ADMIN | Update news |
| DELETE | `/:id` | Required | SUPER_ADMIN | Delete news |

---

### 24. FAQS MODULE
**Base Route**: `/api/v1/faqs`
**File**: `modules/faqs/faq.routes.ts`

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/client` | None | All | Get FAQs for clients |
| GET | `/` | Required | ADMIN | Get all FAQs (admin) |
| POST | `/` | Required | ADMIN | Create FAQ |
| PATCH | `/:id` | Required | ADMIN | Update FAQ |
| DELETE | `/:id` | Required | ADMIN | Delete FAQ |

---

### 25. PROJECTS MODULE
**Base Route**: `/api/v1/projects`
**File**: `modules/projects/project.routes.ts`

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/` | None | All | Get all projects |
| GET | `/:identifier` | None | All | Get project by ID/slug |
| POST | `/` | Required | ADMIN | Create project |
| PATCH | `/:id` | Required | ADMIN | Update project |
| DELETE | `/:id` | Required | ADMIN | Delete project |
| PATCH | `/:id/increment-view` | Required | ADMIN | Increment view count |

---

### 26. TAGS MODULE
**Base Route**: `/api/v1/tags`
**File**: `modules/tag/tag.routes.ts`

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/` | None | All | Get all tags |
| POST | `/` | Required | ADMIN | Create tag |
| PATCH | `/:id` | Required | ADMIN | Update tag |
| DELETE | `/:id` | Required | ADMIN | Delete tag |

---

### 27. AUTHORS MODULE
**Base Route**: `/api/v1/authors`
**File**: `modules/author/author.routes.ts`

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/` | Required | ADMIN | Get all authors |
| POST | `/` | Required | ADMIN | Create author |
| GET | `/:id` | Required | ADMIN | Get author by ID |
| PATCH | `/:id` | Required | ADMIN | Update author |
| DELETE | `/:id` | Required | ADMIN | Delete author |

---

### 28. SETTINGS MODULE
**Base Route**: `/api/v1/settings`
**File**: `modules/settings/setting.routes.ts`

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/:key` | None | All | Get setting by key |
| PATCH | `/:key` | Required | ADMIN | Update setting |

---

### 29. UPLOAD MODULE
**Base Route**: `/api/v1/upload`
**File**: `modules/upload/upload.routes.ts`

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| POST | `/single` | Required | ADMIN | Upload single image |
| POST | `/multiple` | Required | ADMIN | Upload multiple images (up to 10) |

**Image Processing**:
- Resizing and optimization
- Multiple format support
- Automatic processing on upload

---

### 30. PUBLIC UPLOAD MODULE
**Base Route**: `/api/v1/public-upload`
**File**: `modules/public-upload/public-upload.routes.ts`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | None | Upload attachments (public) |

---

### 31. HEALTH CHECK
**Base Route**: `/`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | None | Check API health status |

---

## CONTROLLERS OVERVIEW

### Controller Pattern
Each module has a controller class with async methods using:
- **AsyncHandler**: Wraps methods for error handling
- **Zod Validation**: Input validation before processing
- **ApiError**: Consistent error throwing

### Key Controllers

#### 1. AuthController
**Location**: `/modules/auth/auth.controller.ts`

**Methods**:
- `requestOtp(mobile)` → Sends OTP to mobile
- `verifyAndRegister(mobile, code, userData)` → Registers user after OTP verification
- `login(mobile, password)` → Authenticates user
- `signup(userData)` → Creates new user account
- `getCurrentUser(userId)` → Returns authenticated user profile

#### 2. NeedController
**Location**: `/modules/needs/need.controller.ts`
**~350+ lines** - Most complex controller

**Main Methods**:
- `create()` - Create need (user or guest submission)
- `getAll()` - Get needs with filters
- `getOne()` - Get single need by identifier
- `update()` - Update need (admin)
- `delete()` - Delete need (admin)
- `toggleUpvote()` - Vote on need
- `addSupporter()` - Become supporter
- `getSupporterDetails()` - Get supporter information
- `updateSupporterDetail()` - Update supporter profile
- `addContribution()` - Log supporter contribution
- `removeSupporterDetail()` - Remove supporter
- `getUpdates()` / `createUpdate()` / `updateUpdate()` / `deleteUpdate()` - Timeline management
- `getMilestones()` / `createMilestone()` / `updateMilestone()` / `deleteMilestone()` / `completeMilestone()` - Milestone tracking
- `getBudgetItems()` / `createBudgetItem()` / `updateBudgetItem()` / `deleteBudgetItem()` / `addFundsToBudgetItem()` - Budget management
- `getVerificationRequests()` / `createVerificationRequest()` / `reviewVerificationRequest()` / `deleteVerificationRequest()` - Verification system
- `getTasks()` / `createTask()` / `updateTask()` / `deleteTask()` / `updateTaskChecklist()` / `completeTask()` - Task management
- `getComments()` / `createComment()` / `updateComment()` / `deleteComment()` - Comment system
- `getTrending()` / `getPopular()` / `getUrgent()` / `getNearby()` - Feed endpoints
- `incrementView()` - View counter
- `getAllForAdmin()` - Admin listing

#### 3. SocialController
**Location**: `/modules/social/social.controller.ts`

**Follow System**:
- `followUser()` - Follow a user
- `unfollowUser()` - Unfollow user
- `followNeed()` - Follow a need
- `unfollowNeed()` - Unfollow need
- `getUserFollowers()` - Get followers list
- `getUserFollowing()` - Get following list
- `getUserFollowStats()` - Get follow statistics
- `getNeedFollowers()` - Get need followers
- `getSuggestedUsers()` - Get follow suggestions

**Mentions System**:
- `getUserMentions()` - Get mentions
- `getUnreadMentionCount()` - Count unread
- `markMentionAsRead()` - Mark as read
- `markAllMentionsAsRead()` - Mark all as read

**Tags System**:
- `getPopularTags()` - Popular tags
- `getTrendingTags()` - Trending tags
- `searchTags()` - Search functionality
- `getNeedsByTag()` - Filter needs by tag

**Share System**:
- `logShare()` - Log share event
- `getTopSharedItems()` - Top shared content
- `getItemShareStats()` - Share statistics
- `getOGMetadata()` - OpenGraph data
- `getShareUrl()` - Generate share URL

#### 4. DiscoveryController
**Location**: `/modules/discovery/discovery.controller.ts`

**Leaderboard**:
- `getLeaderboard()` - Public leaderboard
- `getMyRank()` - User's rank
- `getUserRank()` - Specific user's rank
- `getNearbyUsers()` - Nearby in rankings
- `getTopUsers()` - Top users
- `getMultipleCategoryLeaderboards()` - Multiple categories

**Trending**:
- `getTrendingNeeds()` - Trending needs
- `getTrendingUsers()` - Trending users
- `getTrendingTags()` - Trending tags
- `getAllTrending()` - All trending items

**Recommendations**:
- `recommendNeeds()` - Recommended needs
- `recommendUsers()` - Recommended users
- `recommendTeams()` - Recommended teams
- `getPersonalizedRecommendations()` - Personalized
- `getUserPreferences()` - User preferences

**Combined**:
- `getPersonalizedFeed()` - Personalized feed
- `getDiscoveryStats()` - Discovery statistics

#### 5. NotificationController
**Location**: `/modules/notifications/notification.controller.ts`

**Notification Management**:
- `getNotifications()` - Get notifications list
- `getGroupedNotifications()` - Grouped by type
- `getUnreadCount()` - Unread count
- `getStats()` - Notification stats
- `markAsRead()` - Mark single as read
- `markAllAsRead()` - Mark all as read
- `deleteNotification()` - Delete single
- `deleteAllRead()` - Delete all read

**Preferences**:
- `getPreferences()` - Get settings
- `updatePreferences()` - Update settings
- `toggleChannel()` - Enable/disable channel
- `muteType()` - Mute type
- `toggleGlobalMute()` - Global mute

**Push Tokens**:
- `registerPushToken()` - Register token
- `removePushToken()` - Remove token

#### 6. GamificationController
**Location**: `/modules/gamification/gamification.controller.ts`

**Points**:
- `getLeaderboard()` - Points leaderboard
- `getLeaderboardWithStats()` - With statistics
- `getPointSummary()` - User's summary
- `getPointTransactions()` - Transaction history
- `getPointsBreakdown()` - By category
- `claimDailyBonus()` - Claim bonus
- `awardPoints()` - Admin award
- `deductPoints()` - Admin deduct

**Badges**:
- `getAllBadges()` - All badges
- `getBadgeById()` - Badge details
- `getUserBadges()` - User's badges
- `getBadgeProgress()` - Progress toward badge
- `checkBadges()` - Check earned badges
- `createBadge()` - Admin create
- `updateBadge()` - Admin update
- `deleteBadge()` - Admin delete

**Stats**:
- `getUserStats()` - User statistics
- `getUserActivity()` - Activity log

---

## REQUEST/RESPONSE VALIDATION

### Validation Framework
- **Library**: Zod (v4.0.17)
- **Location**: `/modules/*/[module].validation.ts`
- **Middleware**: `/core/middlewares/validate.ts`

### Example Validation Schemas

#### Authentication Validation
```typescript
// Request OTP
requestOtpSchema = {
  body: {
    mobile: string (pattern: /^09\d{9}$/)
  }
}

// Verify and Register
verifyAndRegisterSchema = {
  body: {
    mobile: string (pattern: /^09\d{9}$/),
    verificationCode: string (length: 6),
    name: string (min: 3),
    password?: string (min: 6),
    nationalId: string (length: 10),
    profile: {
      major: string (min: 2),
      yearOfAdmission: string (length: 4)
    }
  }
}

// Login
loginSchema = {
  body: {
    mobile: string (pattern: /^09\d{9}$/),
    password: string (min: 1)
  }
}

// Signup
signupSchema = {
  body: {
    mobile: string (pattern: /^09\d{9}$/),
    name: string (min: 3),
    password: string (min: 6),
    nationalId?: string (length: 10),
    major?: string (min: 2),
    yearOfAdmission?: string (length: 4)
  }
}
```

#### Need Creation Validation
```typescript
needBodySchema = {
  title: string (min: 5),
  description: string (min: 20),
  category?: string,
  urgencyLevel?: enum ["low", "medium", "high", "critical"],
  attachments?: array of {
    fileType: enum ["image", "audio", "video"],
    url: string (url format)
  },
  estimatedDuration?: string,
  requiredSkills?: array of strings,
  tags?: array of strings,
  location?: {
    type: "Point",
    coordinates: [number, number],
    address?: string,
    locationName?: string,
    city?: string,
    province?: string,
    country?: string,
    isLocationApproximate?: boolean
  },
  deadline?: string (ISO 8601 datetime),
  guestName?: string (min: 3),
  guestEmail?: string (email format)
}
```

---

## API MAP SUMMARY

### Total Endpoints: 150+ (verified)

### By Category:
- **Authentication**: 5 endpoints
- **User Management**: 3 endpoints
- **Needs & Support**: 60+ endpoints (largest module)
- **Social Features**: 27 endpoints
- **Discovery & Recommendations**: 16 endpoints
- **Notifications**: 14 endpoints
- **Stories & Media**: 17 endpoints
- **Gamification**: 14 endpoints
- **Teams**: 10 endpoints
- **Content Management (Blog, News, Articles, etc.)**: 30+ endpoints
- **Settings & Admin**: 10 endpoints
- **File Upload**: 4 endpoints

### Authentication Methods:
1. **OTP-Based** (SMS verification)
2. **Password-Based** (Username + Password)
3. **JWT Tokens** (Bearer token in Authorization header)

### Access Control:
- **Public Routes**: No authentication required
- **Authenticated Routes**: JWT token required
- **Admin Routes**: ADMIN or SUPER_ADMIN role required
- **Supporter Routes**: Must be supporter of specific need

### Error Handling:
- **400**: Bad Request (validation errors, invalid input)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (insufficient permissions/roles)
- **404**: Not Found (resource doesn't exist)
- **409**: Conflict (duplicate field)
- **500**: Internal Server Error

---

## CORE UTILITIES

### AsyncHandler
**Location**: `/core/utils/asyncHandler.ts`
- Wraps async controller methods
- Catches errors and passes to error handler
- Prevents unhandled promise rejections

### ApiError
**Location**: `/core/utils/apiError.ts`
- Custom error class extending Error
- Includes statusCode and isOperational flag
- Used for consistent error responses

### Token Management
**Location**: `/core/utils/token.utils.ts`
- JWT creation and verification
- Token signing with secret
- Payload encoding

### Slug Utils
**Location**: `/core/utils/slug.utils.ts`
- Generate URL-friendly slugs from titles
- Used for articles, needs, projects, etc.

---

## DATABASE

### Models (Mongoose)
- User
- Need
- NeedComment
- NeedUpdate
- Milestone
- BudgetItem
- VerificationRequest
- Task
- Follow
- Mention
- Like
- Share
- Tag/TagUsage
- Comment
- Article
- Video
- Gallery
- FeaturedItem
- News
- Project
- Category
- Author
- FAQ
- Setting
- Story
- StoryHighlight
- Media
- Notification
- NotificationPreferences
- PushToken
- Badge
- UserBadge
- UserStats
- PointTransaction
- Team
- TeamInvitation
- DirectMessage
- Conversation
- Poll
- SupporterMessage
- SupporterSubmission

---

## DEPLOYMENT & CONFIGURATION

### Environment Variables Needed:
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `MONGODB_URI` - Database connection string
- `JWT_SECRET` - Secret for token signing
- `JWT_EXPIRES_IN` - Token expiration time

### Scripts:
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled server
- `npm run dev` - Run with nodemon (development)
- `npm run seed` - Run database seeders
- `npm run seed:dev` - Run seeders in development

---

## SUMMARY STATISTICS

- **Total Route Files**: 30
- **Total Controller Files**: 29
- **Total Middleware**: 2 core + 2 module-specific
- **Total Validation Schemas**: 20+
- **Total Endpoints**: 150+
- **Lines of Code**: ~15,000 (modules only)
- **Authentication Methods**: 3
- **User Roles**: 3 (USER, ADMIN, SUPER_ADMIN)

---

**Generated**: November 11, 2024 (Updated)
**Project**: Mehrebaran Backend API v1.0.0
**Last Updated**: ۲۱ آبان ۱۴۰۴
