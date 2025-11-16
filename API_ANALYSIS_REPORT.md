# Comprehensive Backend API Analysis - Social Networking Dashboard

## Executive Summary
The API is a feature-rich platform focused on charitable needs, stories, and community engagement with Instagram-like social features. It includes content management, social interactions, gamification, notifications, and team collaboration capabilities.

---

## 1. CONTENT MANAGEMENT APIs

### 1.1 NEEDS (Primary Content Type)
**File Path**: `/home/user/mehrebaran/packages/api/src/modules/needs/`

#### Create/Edit/Delete Operations:
- `POST /api/v1/needs` - Create a need (supports guest submission)
- `PATCH /api/v1/needs/:id` - Edit need (admin only)
- `DELETE /api/v1/needs/:id` - Delete need (admin only)

#### Content Features:
- Rich fields: title, description, category, urgency level
- Attachment support (images, videos, documents, audio)
- Geo-location tagging with 2dsphere indexing
- Tags support with tagUsage tracking

#### Timeline & Updates:
- `GET /api/v1/needs/:id/updates` - Get all updates for a need
- `POST /api/v1/needs/:id/updates` - Create update/timeline entry
- `PATCH /api/v1/needs/:id/updates/:updateId` - Edit update
- `DELETE /api/v1/needs/:id/updates/:updateId` - Delete update

#### Milestones (Project Tracking):
- `GET /api/v1/needs/:id/milestones` - Get milestones
- `POST /api/v1/needs/:id/milestones` - Create milestone
- `PATCH /api/v1/needs/:id/milestones/:milestoneId` - Update milestone
- `DELETE /api/v1/needs/:id/milestones/:milestoneId` - Delete milestone
- `POST /api/v1/needs/:id/milestones/:milestoneId/complete` - Mark complete with evidence

#### Budget Management:
- `GET /api/v1/needs/:id/budget` - Get budget items
- `POST /api/v1/needs/:id/budget` - Create budget item
- `PATCH /api/v1/needs/:id/budget/:budgetItemId` - Update budget item
- `DELETE /api/v1/needs/:id/budget/:budgetItemId` - Delete budget item
- `POST /api/v1/needs/:id/budget/:budgetItemId/add-funds` - Add funds to specific item

#### Task Management:
- `GET /api/v1/needs/:id/tasks` - Get tasks with filtering (status, assignee, priority)
- `POST /api/v1/needs/:id/tasks` - Create task with deadline
- `PATCH /api/v1/needs/:id/tasks/:taskId` - Update task
- `DELETE /api/v1/needs/:id/tasks/:taskId` - Delete task
- `PATCH /api/v1/needs/:id/tasks/:taskId/checklist` - Update task checklist items
- `POST /api/v1/needs/:id/tasks/:taskId/complete` - Mark task complete with actual hours

#### Verification System:
- `GET /api/v1/needs/:id/verifications` - Get verification requests
- `POST /api/v1/needs/:id/verifications` - Create verification request with evidence
- `PATCH /api/v1/needs/:id/verifications/:verificationId/review` - Review request (admin)
- `DELETE /api/v1/needs/:id/verifications/:verificationId` - Delete request

### 1.2 STORIES (Temporary Content)
**File Path**: `/home/user/mehrebaran/packages/api/src/modules/stories/`

#### Story CRUD:
- `POST /api/v1/stories` - Create story (text, image, video types)
- `DELETE /api/v1/stories/:id` - Delete story
- `GET /api/v1/stories/my` - Get current user's stories
- `GET /api/v1/stories/feed` - Get story feed for followers
- `GET /api/v1/stories/user/:userId` - Get specific user's stories
- `GET /api/v1/stories/:id` - Get story details with privacy checks

#### Story Features:
- Type support: text, image, video
- Privacy levels: public, followers, close_friends, custom (specific users)
- Styling: backgroundColor, textColor, fontFamily
- Expiration support with automatic cleanup
- Reply/Sharing restrictions

#### Story Interactions:
- `POST /api/v1/stories/:id/view` - Record view with duration
- `POST /api/v1/stories/:id/react` - Add emoji reaction
- `DELETE /api/v1/stories/:id/react` - Remove reaction
- `GET /api/v1/stories/:id/viewers` - Get list of viewers

#### Story Statistics:
- `GET /api/v1/stories/stats` - Get user's story stats

#### Story Highlights:
- `POST /api/v1/stories/highlights` - Create highlight/archive
- `GET /api/v1/stories/highlights/user/:userId` - Get user's highlights
- `POST /api/v1/stories/highlights/:id/add-story` - Add story to highlight
- `DELETE /api/v1/stories/highlights/:id/remove-story/:storyId` - Remove from highlight
- `PUT /api/v1/stories/highlights/:id` - Update highlight (title, cover, order)
- `DELETE /api/v1/stories/highlights/:id` - Delete highlight

### 1.3 MEDIA MANAGEMENT
**File Path**: `/home/user/mehrebaran/packages/api/src/modules/stories/media.routes.ts`

#### Upload & Management:
- `POST /api/v1/media/upload` - Upload media file (50MB max)
  - Supports: Images (JPEG, PNG, GIF, WebP, SVG), Videos (MP4, MPEG, MOV, WebM), Audio (MP3, WAV, OGG), Documents (PDF, Word, Excel, PowerPoint)
  - Category-based organization
  - Thumbnail generation support
  - Linking to entities (needs, stories, etc.)
- `GET /api/v1/media/:id` - Get media details with auto view increment
- `DELETE /api/v1/media/:id` - Delete media file

#### Media Organization:
- `GET /api/v1/media/user/:userId` - Get user's media with pagination
- `GET /api/v1/media/related/:model/:id` - Get media for specific entity

#### Media Statistics:
- `GET /api/v1/media/stats` - Get user's media usage stats
- `GET /api/v1/media/storage` - Get total storage usage
- `POST /api/v1/media/:id/download` - Track download counts

### 1.4 SCHEDULING/PUBLISHING
- Story auto-expiration support
- Task deadline management
- Milestone target dates
- No explicit publishing scheduler found (feature gap)

---

## 2. ANALYTICS & INSIGHTS APIs

### 2.1 Content Analytics

#### Need Analytics:
- `GET /api/v1/needs/trending` - Trending needs
- `GET /api/v1/needs/popular` - Popular needs
- `GET /api/v1/needs/urgent` - Urgent needs
- View counter with `POST /api/v1/needs/:id/view`
- Budget progress tracking via virtual fields

#### Story Analytics:
- `GET /api/v1/stories/stats` - Story stats (views, reactions, engagement)
- Viewer tracking stored in story documents

#### Media Analytics:
- View counts per media file
- Download count tracking
- Storage usage per user

### 2.2 Gamification Analytics
**File Path**: `/home/user/mehrebaran/packages/api/src/modules/gamification/`

#### Points System:
- `GET /api/v1/gamification/points/my-summary` - User's point summary
- `GET /api/v1/gamification/points/my-transactions` - Point transaction history
- `GET /api/v1/gamification/points/my-breakdown` - Points breakdown by action type
- Points awarded for: creating needs, completing tasks, supporting others, etc.

#### Leaderboards:
- `GET /api/v1/gamification/leaderboard` - Global points leaderboard
- `GET /api/v1/gamification/leaderboard/enhanced` - Leaderboard with comprehensive stats

#### Badges & Achievements:
- `GET /api/v1/gamification/badges` - All available badges
- `GET /api/v1/gamification/badges/my-badges` - User's earned badges
- `GET /api/v1/gamification/badges/:badgeId/progress` - Progress toward badge
- `POST /api/v1/gamification/badges/check` - Manual badge check/award

#### User Statistics:
- `GET /api/v1/gamification/stats/me` - Current user stats
- `GET /api/v1/gamification/stats/:userId` - Specific user stats
- `GET /api/v1/gamification/activity/me` - Activity summary (last 30 days configurable)

### 2.3 Discovery & Trending
**File Path**: `/home/user/mehrebaran/packages/api/src/modules/discovery/`

#### Trending:
- `GET /api/v1/discovery/trending/needs` - Trending needs
- `GET /api/v1/discovery/trending/users` - Trending users
- `GET /api/v1/discovery/trending/tags` - Trending tags
- `GET /api/v1/discovery/trending/all` - All trending items combined

#### Leaderboards:
- `GET /api/v1/discovery/leaderboard` - Global leaderboard
- `GET /api/v1/discovery/leaderboard/top` - Top users
- `GET /api/v1/discovery/leaderboard/multiple` - Multiple category leaderboards
- `GET /api/v1/discovery/leaderboard/nearby` - Users near your rank

### 2.4 Engagement Metrics

#### Upvotes/Support:
- `POST /api/v1/needs/:id/upvote` - Toggle upvote on need
- `POST /api/v1/needs/:id/support` - Add supporter to need
- Stored in need model's upvotes and supporters arrays

#### Story Reactions:
- Emoji-based reactions on stories
- Reaction counts included in story data

#### Shares:
- `POST /api/v1/social/share` - Log share with platform/metadata
- `GET /api/v1/social/share/:itemId/stats` - Share statistics
- `GET /api/v1/social/share/top` - Top shared items

---

## 3. INTERACTION MANAGEMENT APIs

### 3.1 Comments Management
**File Path**: `/home/user/mehrebaran/packages/api/src/modules/comment/` and Needs module

#### Comments on Needs:
- `GET /api/v1/needs/:id/comments` - Get need comments
- `POST /api/v1/needs/:id/comments` - Create comment with optional parent (threading)
- `PATCH /api/v1/needs/:id/comments/:commentId` - Edit comment
- `DELETE /api/v1/needs/:id/comments/:commentId` - Delete comment (user or admin)

#### Generic Comment Routes:
- `POST /api/v1/comments` - Create comment on posts
- `GET /api/v1/comments/post/:postId` - Get comments for post
- Comment status tracking (pending, approved, rejected)

### 3.2 Reactions/Likes

#### Story Reactions:
- `POST /api/v1/stories/:id/react` - Add emoji reaction
- `DELETE /api/v1/stories/:id/react` - Remove reaction

#### Need Upvotes:
- `POST /api/v1/needs/:id/upvote` - Toggle upvote

#### Like Model (General):
- Model exists in `/home/user/mehrebaran/packages/api/src/modules/social/like.model.ts`
- Supports: needs, comments, stories, users
- Unique constraint: one like per user per target
- **Note**: No dedicated like endpoints found in routes (gap - model exists but routes not exposed)

### 3.3 Direct Messaging
**File Path**: `/home/user/mehrebaran/packages/api/src/modules/direct-messages/`

#### Conversations:
- `POST /api/v1/needs/:needId/direct-messages/conversations` - Create conversation (for need supporters)
- `GET /api/v1/needs/:needId/direct-messages/conversations` - List user's conversations
- `POST /api/v1/needs/:needId/direct-messages/conversations/:conversationId/archive` - Archive conversation
- `GET /api/v1/needs/:needId/direct-messages/conversations/unread-count` - Unread message count

#### Messages:
- `POST /api/v1/needs/:needId/direct-messages/conversations/:conversationId/messages` - Send message
- `GET /api/v1/needs/:needId/direct-messages/conversations/:conversationId/messages` - Get messages with pagination
- `PATCH /api/v1/needs/:needId/direct-messages/messages/:messageId` - Edit message
- `DELETE /api/v1/needs/:needId/direct-messages/messages/:messageId` - Delete message
- `POST /api/v1/needs/:needId/direct-messages/conversations/:conversationId/read` - Mark as read

#### Message Features:
- Reply-to/threading support
- Attachment support
- Message status tracking (read/unread)

### 3.4 Mentions System
**File Path**: `/home/user/mehrebaran/packages/api/src/modules/social/mention.service.ts`

- `GET /api/v1/social/mentions/me` - Get user mentions
- `GET /api/v1/social/mentions/unread-count` - Count unread mentions
- `POST /api/v1/social/mentions/:mentionId/read` - Mark mention as read
- `POST /api/v1/social/mentions/read-all` - Mark all mentions as read
- Mention context filtering (need, comment, story, etc.)

### 3.5 Hashtags & Tagging System
**File Path**: `/home/user/mehrebaran/packages/api/src/modules/social/`

- `GET /api/v1/social/tags/popular` - Popular tags
- `GET /api/v1/social/tags/trending` - Trending tags (configurable days)
- `GET /api/v1/social/tags/search` - Search tags
- `GET /api/v1/social/tags/:tag/needs` - Get needs by tag
- Tag usage tracking and popularity metrics

---

## 4. USER MANAGEMENT APIs

### 4.1 User Profiles
**File Path**: `/home/user/mehrebaran/packages/api/src/modules/users/` and `/home/user/mehrebaran/packages/api/src/modules/author/`

#### User Endpoints:
- `GET /api/v1/users/me` - Get current user profile
- `GET /api/v1/users/:id` - Get user by ID
- `GET /api/v1/users` - List all users (admin only)

#### Author Management (Admin):
- `POST /api/v1/authors` - Create author profile (admin only)
- `GET /api/v1/authors` - List authors
- `GET /api/v1/authors/:identifier` - Get author details
- `PATCH /api/v1/authors/:identifier` - Edit author
- `DELETE /api/v1/authors/:identifier` - Delete author
- Avatar upload with automatic resize/processing

### 4.2 Follow/Following System
**File Path**: `/home/user/mehrebaran/packages/api/src/modules/social/`

#### User Following:
- `POST /api/v1/social/follow/user/:userId` - Follow user
- `DELETE /api/v1/social/follow/user/:userId` - Unfollow user
- `GET /api/v1/social/users/:userId/followers` - Get followers list
- `GET /api/v1/social/users/:userId/following` - Get following list
- `GET /api/v1/social/users/:userId/follow-stats` - Get follow statistics (count of followers/following)

#### Need Following:
- `POST /api/v1/social/follow/need/:needId` - Follow need
- `DELETE /api/v1/social/follow/need/:needId` - Unfollow need
- `GET /api/v1/social/my-followed-needs` - Get user's followed needs
- `GET /api/v1/social/needs/:needId/followers` - Get need followers

#### Social Suggestions:
- `GET /api/v1/social/follow/suggestions` - Get suggested users to follow (algorithm-based)

### 4.3 User Demographics & Insights
- No dedicated demographics API found
- **Gap**: Missing detailed user demographic queries

---

## 5. MODERATION TOOLS

### 5.1 Content Moderation
**Status**: MINIMAL - Found donation verification and verification requests, but no comprehensive moderation system

#### Existing Verification:
- `POST /api/v1/needs/:id/verifications` - Create verification request (for milestones, budget, completion)
- `PATCH /api/v1/needs/:id/verifications/:verificationId/review` - Review verification (admin only)
- Evidence-based verification with image/document/video support

#### Comment Moderation:
- Comment status field: pending, approved, rejected
- `GET /api/v1/comments` - Get all comments with status filter (admin only)
- `PATCH /api/v1/comments/:id` - Update comment status (admin only)
- `DELETE /api/v1/comments/:id` - Delete comment (admin only)

#### Admin Need Management:
- `GET /api/v1/needs/admin/all` - Get all needs for admin review
- `PATCH /api/v1/needs/:id` - Update need (admin only)
- `DELETE /api/v1/needs/:id` - Delete need (admin only)

### 5.2 Reporting System
**Status**: NOT FOUND
- **Gap**: No reporting/flagging endpoints for inappropriate content
- **Gap**: No user reporting system

### 5.3 Block/Ban Features
**Status**: NOT FOUND
- **Gap**: No block user functionality
- **Gap**: No ban/suspend user endpoints
- **Gap**: No block list retrieval

### 5.4 Donation Verification (Related):
- `PATCH /api/v1/donations/:donationId/verify` - Verify bank transfers (admin)

---

## 6. ADDITIONAL FEATURES

### 6.1 Team Collaboration
**File Path**: `/home/user/mehrebaran/packages/api/src/modules/teams/`

#### Team Management:
- `POST /api/v1/needs/:needId/teams` - Create team for need (supporter only)
- `GET /api/v1/needs/:needId/teams` - Get teams for need
- `GET /api/v1/teams/my-teams` - Get user's teams
- `GET /api/v1/teams/:teamId` - Get team details
- `PATCH /api/v1/teams/:teamId` - Update team (owner)
- `DELETE /api/v1/teams/:teamId` - Delete team (owner)
- `GET /api/v1/teams/:teamId/stats` - Get team statistics

#### Team Members:
- `POST /api/v1/needs/:needId/teams/:teamId/members` - Add member
- `DELETE /api/v1/needs/:needId/teams/:teamId/members/:userId` - Remove member
- `PATCH /api/v1/needs/:needId/teams/:teamId/members/:userId/role` - Update member role (supporter, volunteer, coordinator, lead)

#### Team Invitations:
- `POST /api/v1/needs/:needId/teams/:teamId/invite` - Invite user to team
- `GET /api/v1/team-invitations` - Get user's pending invitations (separate module)

### 6.2 Notifications System
**File Path**: `/home/user/mehrebaran/packages/api/src/modules/notifications/`

#### Notification Management:
- `GET /api/v1/notifications` - Get notifications (filterable by type, read status)
- `GET /api/v1/notifications/grouped` - Get grouped notifications
- `GET /api/v1/notifications/unread-count` - Get unread count
- `POST /api/v1/notifications/:id/read` - Mark single as read
- `POST /api/v1/notifications/mark-all-read` - Mark all as read
- `DELETE /api/v1/notifications/:id` - Delete notification
- `DELETE /api/v1/notifications/read` - Delete all read notifications
- `GET /api/v1/notifications/stats` - Get notification statistics

#### Notification Preferences:
- `GET /api/v1/notifications/preferences` - Get user preferences
- `PUT /api/v1/notifications/preferences` - Update preferences
- `POST /api/v1/notifications/preferences/toggle-channel` - Enable/disable channel (email, push, in-app, sms)
- `POST /api/v1/notifications/preferences/mute-type` - Mute specific notification type
- `POST /api/v1/notifications/preferences/global-mute` - Global mute with optional duration

#### Push Notifications:
- `POST /api/v1/notifications/push-token` - Register push token (iOS/Android)
- `DELETE /api/v1/notifications/push-token/:token` - Remove push token

### 6.3 Polls/Voting
**File Path**: `/home/user/mehrebaran/packages/api/src/modules/polls/`

- `GET /api/v1/needs/:needId/polls` - Get polls for need
- `POST /api/v1/needs/:needId/polls` - Create poll (admin only)
- `POST /api/v1/needs/:needId/polls/:pollId/options/:optionId/vote` - Vote on poll (supporter only)

### 6.4 Donations/Fundraising
**File Path**: `/home/user/mehrebaran/packages/api/src/modules/donations/`

#### Donation CRUD:
- `POST /api/v1/donations` - Create donation (guest or logged-in)
- `GET /api/v1/donations/:identifier` - Get donation by ID or tracking code
- `DELETE /api/v1/donations/:id` - Delete donation (admin)

#### Donation Statistics:
- `GET /api/v1/donations/project/:projectId/stats` - Get project fundraising stats
- `GET /api/v1/donations/project/:projectId` - Get donations for project
- `GET /api/v1/donations/project/:projectId/donors` - Get recent donors list

#### Payment Processing:
- `POST /api/v1/donations/:donationId/pay` - Initiate payment (online)
- `GET /api/v1/donations/:donationId/verify` - Verify payment callback
- `PATCH /api/v1/donations/:donationId/verify` - Verify bank transfer (admin)

#### User Donations:
- `GET /api/v1/donations/user/my-donations` - Get user's donation history
- `POST /api/v1/donations/:donationId/upload-receipt` - Upload bank transfer receipt

### 6.5 Volunteering Management
**File Path**: `/home/user/mehrebaran/packages/api/src/modules/volunteers/`

- `POST /api/v1/volunteers/register` - Register as volunteer
- `GET /api/v1/volunteers/my-registrations` - Get user's volunteer registrations
- `GET /api/v1/volunteers/:id` - Get specific registration
- `POST /api/v1/volunteers/:id/withdraw` - Withdraw from volunteering
- `GET /api/v1/volunteers/project/:projectId` - Get project volunteers
- `GET /api/v1/volunteers/project/:projectId/stats` - Volunteer statistics
- `GET /api/v1/volunteers/project/:projectId/active` - Get active volunteers (admin)
- `PATCH /api/v1/volunteers/:id/approve` - Approve volunteer (admin)
- `PATCH /api/v1/volunteers/:id/reject` - Reject volunteer (admin)

### 6.6 Search
**File Path**: `/home/user/mehrebaran/packages/api/src/modules/search/`

- `GET /api/v1/search` - Available but routes not fully detailed in codebase

### 6.7 Geographic Features
- Geo-location support on needs with 2dsphere indexing
- `GET /api/v1/needs/nearby` - Get needs near coordinates (with radius parameter in km)
- Coordinates, address, city, province tracking

### 6.8 Gamification Features
#### Daily Rewards:
- `POST /api/v1/gamification/points/daily-bonus` - Claim daily login bonus

#### Admin Point Management:
- `POST /api/v1/gamification/points/award` - Award points (admin)
- `POST /api/v1/gamification/points/deduct` - Deduct points (admin)

#### Badge Management (Admin):
- `POST /api/v1/gamification/badges` - Create badge
- `PATCH /api/v1/gamification/badges/:badgeId` - Update badge
- `DELETE /api/v1/gamification/badges/:badgeId` - Delete badge

---

## 7. MISSING/GAP FEATURES

### Critical Gaps (For Instagram-like Platform):

1. **Content Moderation**
   - No content reporting/flagging system
   - No automated content moderation
   - No NSFW detection
   - Limited moderation only on comments

2. **User Blocking & Safety**
   - No block user functionality
   - No user ban/suspension system
   - No block list management
   - No user reporting system
   - No restricted/private DM settings

3. **Content Scheduling**
   - No scheduling system for needs/stories
   - No draft/publish workflow (partial support for need statuses)
   - Auto-expiration exists but no scheduled posting

4. **Advanced Analytics**
   - No user demographic insights
   - No cross-content analytics dashboard
   - No engagement rate calculations
   - No follower growth tracking
   - No content performance comparison

5. **Privacy Controls**
   - Limited privacy options for stories (partial implementation)
   - No granular permission system for team members
   - No privacy audit trail

6. **Content Monetization**
   - No sponsored content endpoints
   - No creator fund/payment system
   - No ad/promotion features

7. **Advanced Search**
   - Search module exists but minimal documentation
   - No full-text search endpoints documented

8. **Story Features**
   - No story stickers/filters/effects
   - No music/soundtrack support
   - No location tagging on stories
   - No story questions/polls

9. **Comment Features**
   - No comment likes/reactions
   - No comment filtering (newest, popular)
   - Limited threading (replies exist but basic)

10. **User Relationships**
    - No "close friends" list management for stories
    - No mute user functionality
    - No user activity status

11. **Social Discovery**
    - No trending hashtags algorithm details
    - No recommendation algorithm details
    - Limited content discovery endpoints

12. **Admin Tools**
    - No bulk operations
    - No audit logging for admin actions
    - No content restoration/undo features

---

## 8. SUMMARY STATISTICS

### Endpoints Count by Category:
- **Needs Management**: ~40+ endpoints
- **Stories**: ~20+ endpoints
- **Social/Follow/Mentions**: ~20+ endpoints
- **Notifications**: ~15+ endpoints
- **Gamification**: ~20+ endpoints
- **Direct Messages**: ~8 endpoints
- **Comments**: ~5 endpoints
- **Teams**: ~10+ endpoints
- **Donations**: ~8 endpoints
- **Volunteers**: ~8 endpoints
- **Polls**: ~3 endpoints
- **Discovery**: ~15+ endpoints
- **Media**: ~8 endpoints
- **Users/Authors**: ~6 endpoints

**Total**: 170+ documented endpoints

### Database Models:
Located in respective module directories:
- Need, NeedUpdate, Milestone, BudgetItem, VerificationRequest, Task
- Story, StoryHighlight, Media
- User, Author
- Comment, Like, Follow, Mention, Tag, ShareLog
- Notification, NotificationPreferences, PushToken
- DirectMessage, Conversation
- Team, TeamInvitation
- Gamification (Points, Badge, UserBadge, UserStats)
- Donation, Volunteer
- Poll

---

## File Locations Reference

**API Routes Root**: `/home/user/mehrebaran/packages/api/src/modules/`

Key Files:
- App Router: `/home/user/mehrebaran/packages/api/src/app.ts`
- Needs: `/home/user/mehrebaran/packages/api/src/modules/needs/*`
- Stories: `/home/user/mehrebaran/packages/api/src/modules/stories/*`
- Social: `/home/user/mehrebaran/packages/api/src/modules/social/*`
- Notifications: `/home/user/mehrebaran/packages/api/src/modules/notifications/*`
- Gamification: `/home/user/mehrebaran/packages/api/src/modules/gamification/*`
- Teams: `/home/user/mehrebaran/packages/api/src/modules/teams/*`
- Comments: `/home/user/mehrebaran/packages/api/src/modules/comment/*`
- Direct Messages: `/home/user/mehrebaran/packages/api/src/modules/direct-messages/*`
- Discovery: `/home/user/mehrebaran/packages/api/src/modules/discovery/*`
- Donations: `/home/user/mehrebaran/packages/api/src/modules/donations/*`
- Volunteers: `/home/user/mehrebaran/packages/api/src/modules/volunteers/*`
- Users: `/home/user/mehrebaran/packages/api/src/modules/users/*`
- Authors: `/home/user/mehrebaran/packages/api/src/modules/author/*`
