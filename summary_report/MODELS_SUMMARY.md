# Backend Models Summary - Quick Reference

## Project Overview
- **Backend Framework**: Express.js + TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Total Models**: 39 organized in domain-based modules
- **Database Type**: Document-based (NoSQL)

## Model Organization (by Module)

### Core User & Auth (2 models)
1. **User** - Core user profile & authentication
   - Phone-based authentication (mobile + password)
   - Role-based access (USER, ADMIN, SUPER_ADMIN)
   - Methods: comparePassword()

2. **OTP** - One-time passwords for authentication
   - 5-minute expiration (TTL index)
   - Phone-based OTP verification

### Core Content - Needs (3 models)
3. **Need** - MOST COMPLEX MODEL - Central humanitarian need tracker
   - Status workflow: draft → pending → under_review → approved → in_progress → completed/rejected
   - Embedded: GeoLocation, Budget Items, Milestones, Tasks, Verification Requests, Status History
   - Supporters with contribution tracking
   - Auto-generated Persian slugs
   - 8+ virtual fields for progress calculations
   - Key indexes: slug, category, status, urgencyLevel

4. **NeedCategory** - 8 predefined categories (health, education, housing, food, employment, environment, emergency, culture)

5. **NeedComment** - Threaded comments on needs and updates

### Team & Collaboration (2 models)
6. **Team** - Team management for need support
   - Members with roles: leader, co_leader, member
   - Status tracking: active, paused, completed, disbanded
   - Focus areas: fundraising, logistics, communication, technical, volunteer, coordination, documentation
   - Virtual fields: totalMembers, activeMembers, teamProgress

7. **TeamInvitation** - Team membership invitations
   - 7-day expiration (TTL)
   - Status: pending, accepted, rejected, expired

### Blog & Content (6 models)
8. **Article** - Blog articles with SEO
   - Rich content, gallery support
   - Related articles
   - Virtual comments field

9. **Video** - Video content management
   - Video URL storage
   - Cover image & thumbnails
   - Related videos

10. **Gallery** - Image gallery collections
    - Multiple responsive images
    - Photographer reference
    - Related galleries

11. **News** - News/announcements
    - Gallery support
    - Related news articles
    - Virtual comments

12. **Author** - Content author/contributor profiles
    - Avatar with responsive images
    - SEO metadata

13. **FeaturedItem** - Homepage featured content
    - Polymorphic reference (Article, Video, Gallery)
    - Display ordering

### Categories & Tags (2 models)
14. **Category** - Content categorization
    - Used for articles, videos, news

15. **Tag** - Content tagging system
    - Normalized slugs
    - Usage tracking

### Social Interactions (6 models)
16. **Follow** - User & need following
    - Two separate follow types: user → user, user → need
    - Unique constraints to prevent duplicates
    - Validation: either following or followedNeed required

17. **Like** - Multi-target liking system
    - Can like: needs, comments, stories, users
    - Unique constraint: user can only like each target once

18. **Mention** - @mention tracking
    - Used in: comments, messages, updates, tasks, invitations
    - Supports read/unread state
    - Trackable across multiple contexts

19. **TagUsage** - Hashtag analytics
    - Usage counting
    - Related needs tracking
    - Popularity tracking (lastUsedAt)

20. **ShareLog** - Social sharing analytics
    - Platform tracking: telegram, whatsapp, twitter, linkedin, facebook, instagram, email, copy_link
    - Technical metadata: IP, user agent, referrer

### Gamification (4 models)
21. **Badge** - Achievement system
    - Categories: contributor, supporter, creator, helper, communicator, leader, expert, milestone, special, seasonal
    - Rarity levels: common, rare, epic, legendary
    - Conditions: points, count, streak, milestone, custom

22. **UserBadge** - User earned badges
    - Progress tracking (0-100%)
    - Unique constraint: one badge per user

23. **UserStats** - Comprehensive user gamification statistics
    - Aggregate stats: 40+ different counters
    - Points, levels, rankings
    - Login streaks, contribution dates
    - Category rankings (Map)
    - Global ranking

24. **PointTransaction** - Point transaction log
    - 20+ action types (need_created, task_completed, milestone_completed, badge_earned, etc.)
    - Traceable to related entities
    - Metadata support for additional info

### Stories & Media (3 models)
25. **Story** - Instagram-style ephemeral content
    - 24-hour expiration with TTL auto-delete
    - Multi-type: image, video, text
    - Views & reactions tracking (embedded)
    - Privacy levels: public, followers, close_friends, custom
    - Instance methods: addView(), addReaction(), removeReaction(), hasUserViewed()
    - Static methods: getActiveByUser(), getFeedStories(), deleteExpired(), getUserStoryStats()

26. **StoryHighlight** - Persistent story collections
    - Save stories beyond 24-hour expiry
    - Cover image per highlight
    - Ordering support

27. **Media** - Centralized file management
    - Multiple categories: profile, cover, need, story, message, comment, gallery, document
    - Rich metadata: dimensions, duration, EXIF data, codec info
    - Processing workflow: pending → processing → completed/failed
    - Multiple thumbnails (small, medium, large)
    - Storage provider support: local, s3, cloudinary, cdn
    - View & download counters

### Messaging & Notifications (5 models)
28. **Conversation** - Group & one-to-one conversations
    - Associated with needs
    - Participant management
    - Last message tracking
    - Archive functionality

29. **DirectMessage** - Individual messages
    - Read tracking per recipient
    - Attachments: image, document, video, audio
    - Reply-to support
    - Edit & soft-delete support
    - Auto-updates conversation's lastMessage

30. **Notification** - Multi-channel notification hub
    - 20+ notification types
    - 4 delivery channels: in_app, email, push, sms
    - Per-channel delivery status tracking
    - Priority levels: low, normal, high, urgent
    - Grouping support
    - TTL expiration
    - Instance methods: markAsRead()
    - Static methods: markAllAsRead(), getUnreadCount(), deleteExpired()
    - Virtual: timeAgo (Persian formatted)

31. **NotificationPreferences** - Granular notification settings
    - Per-channel configuration (in_app, email, push, sms)
    - Global mute, temporary mute, type-specific mute
    - Quiet hours with start/end times
    - Email digest settings
    - Group similar notifications
    - Instance methods: isChannelEnabled(), isInQuietHours()

32. **PushToken** - Device push notification tokens
    - Platform support: ios, android, web
    - Device ID tracking
    - Active/inactive state
    - Last used tracking
    - Static methods: deactivateOldTokens(), getUserTokens()

### Supporter Models (2 models)
33. **SupporterMessage** - Message board for supporters
    - Threaded discussions
    - Like system
    - Author & need references

34. **SupporterSubmission** - Evidence submissions
    - Image-based submissions
    - Status: pending, approved, rejected
    - Caption support

### Miscellaneous (2 models)
35. **Poll** - Survey system for needs
    - Multiple options
    - Vote tracking per option
    - Optional expiration
    - Virtual votesCount

36. **Comment** - General-purpose polymorphic comments
    - Used by: News, Article, Project
    - Guest & registered user support
    - Threaded comments (parent field)
    - Status: PENDING, APPROVED, REJECTED, SPAM
    - Unique constraints to prevent exact duplicates

37. **Project** - Project/campaign management
    - Fundraising targets
    - Volunteer targets
    - Gallery support
    - Status: draft, active, completed

38. **Setting** - Key-value configuration storage
    - Mixed value types
    - Used for app-wide settings

39. **FAQ** - Frequently Asked Questions
    - Ordering support
    - Active/inactive toggle

## Key Features by Model Type

### With Soft Delete
- DirectMessage (isDeleted, deletedAt)
- Comment (status-based soft delete)

### With TTL Auto-Cleanup
- OTP (5 minutes)
- Story (24 hours or until highlighted)
- TeamInvitation (7 days)
- Notification (configurable via expiresAt)

### With Polymorphic References
- Comment (post + postType)
- Like (target + targetType)
- FeaturedItem (item + itemType)

### With Virtual Fields
- Need (8 virtuals: upvotesCount, overallProgress, totalBudget, budgetProgress, etc.)
- Team (4 virtuals: totalMembers, activeMembers, tasksCompletedByTeam, teamProgress)
- Story (3 virtuals: isExpired, timeRemaining, viewsList)
- Poll options (votesCount)
- Notification (timeAgo in Persian)
- Media (sizeInMB, durationFormatted)

### With Instance Methods
- Story (addView, addReaction, removeReaction, hasUserViewed)
- StoryHighlight (addStory, removeStory)
- Notification (markAsRead)
- NotificationPreferences (isChannelEnabled, isInQuietHours)
- Media (incrementViews, incrementDownloads)

### With Static Methods
- Story (getActiveByUser, getFeedStories, deleteExpired, getUserStoryStats)
- StoryHighlight (getByUser)
- Notification (markAllAsRead, getUnreadCount, deleteExpired)
- NotificationPreferences (getOrCreate)
- PushToken (deactivateOldTokens, getUserTokens)
- Media (getByUser, getByRelated, getTotalSize)

### With Pre-Save Middleware
- User (password hashing)
- Need (slug generation, status tracking, budget status updates)
- Article (slug generation)
- News (slug generation)
- Video (slug generation)
- Gallery (slug generation)
- Author (slug generation)
- Tag (slug generation)
- NeedCategory (slug generation)
- Team (auto-promote first member to leader)
- Follow (validation: either following or followedNeed must exist)
- TeamInvitation (auto-expire check)
- PushToken (update lastUsedAt)

### With Post-Save Middleware
- DirectMessage (auto-update conversation's lastMessage)

## Database Indexes

### Unique Indexes
- User: mobile, nationalId
- Need: slug
- Article: slug
- News: slug
- Video: slug
- Gallery: slug
- Category: name, slug
- Tag: name, slug
- Author: slug
- NeedCategory: name, slug
- UserBadge: user + badge (compound)
- Follow: Complex - follower+following (partial), follower+followedNeed (partial)
- Like: user + target + targetType (compound, unique)
- PushToken: token
- FeaturedItem: order
- Setting: key

### Important Compound Indexes
- Comment: post+author+content, post+guestEmail+content
- NeedComment: target+createdAt, user+createdAt
- DirectMessage: conversation+createdAt, sender
- Story: user+isActive+expiresAt, privacy+expiresAt, expiresAt (TTL)
- Conversation: need+participants, participants+lastMessageAt
- UserBadge: user+earnedAt
- Notification: recipient+isRead+createdAt, recipient+type+createdAt, groupKey
- Team: need+status, need+focusArea, members.user
- Media: uploadedBy+category+createdAt, relatedModel+relatedId, isActive+createdAt
- PushToken: user+isActive, isActive+lastUsedAt
- Mention: mentionedUser+isRead+createdAt, context+contextId, relatedModel+relatedId

### Geospatial Indexes
- Need.location.coordinates (2dsphere)

## Seeder Data

### Seeders Available
1. **user.seeder.ts** - Creates 51 users (1 super_admin + 50 regular)
2. **needCategory.seeder.ts** - Creates 8 predefined categories
3. **need.seeder.ts** - Creates ~160 needs with various statuses, locations, budgets, milestones
4. **team.seeder.ts** - Creates 8 teams with 3-10 members each
5. **social.seeder.ts** - Creates follows, likes, comments

### Default Test Account
- Mobile: 09120000000
- Password: password123
- Role: super_admin

## Key Design Patterns

1. **Polymorphic References** - Like, Comment, FeaturedItem use refPath
2. **Embedded Documents** - Need contains 15+ nested types for complex tracking
3. **Virtual Fields** - For calculated values and lazy population
4. **TTL Indexes** - Auto-cleanup of OTP, Stories, Notifications
5. **Pre/Post Middleware** - Automatic slug generation, password hashing, status tracking
6. **Unique Constraints** - Prevent duplicate follows, likes, badges
7. **Partial Indexes** - Conditional unique indexes on Follow model
8. **Compound Indexes** - For common query patterns

## Relationship Hierarchy

```
User (Hub)
├── Creates Needs, Articles, Teams, Comments, Stories, Messages
├── Follows Users & Needs
├── Likes Content
├── Receives Notifications & Messages
└── Earns Badges & Points

Need (Content Hub)
├── Has Category & Comments
├── Has Supporters with detailed tracking
├── Has Teams for collaboration
├── Has Budget Items, Milestones, Tasks (embedded)
├── Has Verification Requests & Status History
├── Has Followers & Followers List
└── Can be Linked to Stories & Polls

Article/News/Video/Gallery (Content)
├── Has Category, Tags, Author
├── Has Virtual Comments
└── Can be Featured

Team
├── Belongs to Need
├── Has Members with contribution tracking
├── Has Invitations
└── Has Tasks (embedded in Need)
```

## File Location
Full detailed report: `/home/user/mehrebaran/BACKEND_MODELS_DETAILED_REPORT.md`

