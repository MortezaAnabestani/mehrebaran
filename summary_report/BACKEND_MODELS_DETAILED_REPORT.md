# Comprehensive Backend Models & Database Structure Report

## Project Overview
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based with password hashing (bcryptjs)
- **Architecture**: Modular (39 models organized in domain-based modules)

---

## DATABASE STRUCTURE & MODELS

### 1. USER MANAGEMENT MODELS

#### User Model (`users/user.model.ts`)
**Purpose**: Core user profile and authentication
**Fields**:
- `mobile` (String, required, unique): Phone number for authentication
- `name` (String, required): User's full name
- `password` (String, select: false): Hashed password
- `nationalId` (String, required, unique): National ID
- `profile` (Nested):
  - `major` (String): Field of study/specialization
  - `yearOfAdmission` (String): Year of enrollment
- `role` (String, enum): USER, ADMIN, SUPER_ADMIN (default: USER)
- `timestamps`: createdAt, updatedAt

**Methods**:
- `comparePassword(password: string)`: Async password verification using bcrypt

**Middleware**:
- Pre-save: Auto-hashes password if modified using bcryptjs (salt rounds: 10)

**Indexes**: mobile (unique), nationalId (unique)

---

#### OTP Model (`auth/otp.model.ts`)
**Purpose**: One-Time Password for phone-based authentication
**Fields**:
- `mobile` (String, required): User's phone number
- `code` (String, required): OTP code
- `expiresAt` (Date, required): Expiration time (TTL: 5 minutes)

**Indexes**: TTL index with 5-minute expiration

---

### 2. CORE CONTENT MODELS

#### Need Model (`needs/need.model.ts`) - COMPLEX MODEL
**Purpose**: Central model for charitable/humanitarian needs with extensive tracking
**Key Fields**:
- `title` (String, required): Need title
- `slug` (String, unique, indexed): Auto-generated URL slug from Persian title
- `description` (String, required): Detailed description
- `category` (ObjectId, ref: NeedCategory, required, indexed): Category reference
- `status` (String, enum, indexed): draft, pending, under_review, approved, in_progress, completed, rejected, archived, cancelled (default: draft)
- `urgencyLevel` (String, enum, indexed): low, medium, high, critical (default: medium)

**Submitter Info**:
- `submittedBy.user` (ObjectId, ref: User): User who submitted
- `submittedBy.guestName` (String): Anonymous submission name
- `submittedBy.guestEmail` (String): Anonymous submission email

**Media & Engagement**:
- `attachments` (Array): Files (image, audio, video)
- `upvotes` (Array of ObjectIds): User references who upvoted
- `supporters` (Array of ObjectIds): Supporter users
- `viewsCount` (Number, indexed): View counter

**Nested Schemas**:

1. **GeoLocation** (Embedded):
   - `type` (String): "Point" (GeoJSON format)
   - `coordinates` (Array, 2dsphere indexed): [longitude, latitude]
   - `address`, `locationName`, `city`, `province` (Strings)
   - `country` (String, default: "ایران")
   - `isLocationApproximate` (Boolean)

2. **Attachment**:
   - `fileType` (String, enum): image, audio, video
   - `url` (String): File URL

3. **Supporter Detail** (Embedded):
   - `user` (ObjectId, ref: User): Supporter reference
   - `role` (String, enum): supporter, volunteer, coordinator, lead
   - `joinedAt` (Date): When they joined
   - `contributions` (Array): Financial/time contributions
   - `isActive` (Boolean): Active status
   - `badge` (String): Supporter badge
   - **Virtuals**: `totalFinancialContribution`, `totalHoursContribution`

4. **Budget Item** (Embedded with tracking):
   - `title`, `description` (Strings): Item name and details
   - `category` (String): Equipment, services, materials
   - `estimatedCost`, `actualCost`, `amountRaised` (Numbers)
   - `currency` (String, default: "IRR")
   - `status` (String, enum): pending, partial, fully_funded, exceeded
   - `priority` (Number 1-5)

5. **Milestone** (Embedded with timestamps):
   - `title`, `description` (Strings)
   - `targetDate`, `completionDate` (Dates)
   - `status` (String, enum): pending, in_progress, completed, delayed
   - `progressPercentage` (Number 0-100)
   - `order` (Number): Ordering
   - `evidence` (Array): Proof URLs

6. **Verification Request** (Embedded):
   - `type` (String, enum): milestone_completion, budget_expense, need_completion, progress_update
   - `status` (String, enum): pending, approved, rejected, needs_revision
   - `relatedItemId`, `relatedItemType` (Strings): What's being verified
   - `description`, `evidence` (Array)
   - `submittedBy` (ObjectId, ref: User): Submitter
   - `reviewedBy` (ObjectId, ref: User): Reviewer
   - `adminComments`, `rejectionReason` (Strings)

7. **Task** (Embedded with complex tracking):
   - `title`, `description` (Strings)
   - `assignedTo`, `assignedBy` (ObjectIds, ref: User)
   - `status` (String, enum): todo, in_progress, review, completed, blocked
   - `priority` (String, enum): low, medium, high, critical
   - `deadline`, `completedAt` (Dates)
   - `progressPercentage` (Number 0-100)
   - `dependencies` (Array of task IDs)
   - `checklist` (Array): Sub-tasks
   - **Nested Checklist**:
     - `title` (String)
     - `completed` (Boolean)

8. **Status History** (Embedded):
   - `status` (String, enum): All status values
   - `changedBy` (ObjectId, ref: User)
   - `changedAt` (Date)
   - `reason` (String)

**Virtual Fields**:
- `upvotesCount`: Count of upvotes
- `comments`: Virtual populate from Comment model (postType: "Need")
- `overallProgress`: Calculated from milestones (0-100%)
- `totalBudget`: Sum of all budget items
- `totalRaised`: Sum of amounts raised
- `budgetProgress`: Percentage funded (0-100%)
- `pendingVerificationsCount`: Pending verification requests
- `totalTasksCount`, `completedTasksCount`: Task counts
- `tasksProgress`: Task completion percentage

**Indexes**:
- `slug` (unique, indexed)
- `category` (indexed)
- `status` (indexed)
- `urgencyLevel` (indexed)
- `viewsCount` (indexed)
- `priority` (indexed)

**Middleware**:
- Pre-save: Auto-generates slug, tracks status changes, updates budget item status based on amounts raised

---

#### NeedCategory Model (`need-categories/needCategory.model.ts`)
**Purpose**: Categories for classifying needs
**Fields**:
- `name` (String, required, unique)
- `slug` (String, unique, indexed)
- `description` (String)

**Middleware**: Auto-generates slug from name

**Predefined Categories** (from seeder):
- سلامت و درمان (Health & Medicine)
- آموزش (Education)
- مسکن (Housing)
- غذا و تغذیه (Food & Nutrition)
- اشتغال و کسب‌وکار (Employment & Business)
- محیط زیست (Environment)
- اضطراری (Emergency)
- فرهنگ و هنر (Culture & Arts)

---

#### NeedComment Model (`needs/needComment.model.ts`)
**Purpose**: Comments on needs and updates
**Fields**:
- `content` (String, required, trimmed)
- `user` (ObjectId, ref: User, required)
- `target` (ObjectId, required, refPath: targetType)
- `targetType` (String, enum): "need", "update"
- `parent` (ObjectId, ref: NeedComment): Reply to another comment

**Indexes**:
- `target` + `createdAt` (compound)
- `user` + `createdAt` (compound)

---

### 3. TEAM & COLLABORATION MODELS

#### Team Model (`teams/team.model.ts`)
**Purpose**: Team management for need support
**Fields**:
- `need` (ObjectId, ref: Need, required)
- `name` (String, required)
- `description` (String)
- `focusArea` (String, enum): fundraising, logistics, communication, technical, volunteer, coordination, documentation, general
- `members` (Array of TeamMember schemas):
  - `user` (ObjectId, ref: User, required)
  - `role` (String, enum): leader, co_leader, member
  - `joinedAt`, `invitedBy` (Dates)
  - `tasksCompleted`, `contributionScore` (Numbers)
  - `isActive`, `leftAt`, `leaveReason` (Status fields)
- `status` (String, enum): active, paused, completed, disbanded
- `maxMembers` (Number)
- `tags` (Array of Strings)
- `createdBy` (ObjectId, ref: User, required)
- `isPrivate` (Boolean, default: false)

**Virtual Fields**:
- `totalMembers`: Count of all members
- `activeMembers`: Count of active members
- `tasksCompletedByTeam`: Sum of completed tasks
- `teamProgress`: Completion percentage

**Middleware**: Auto-promotes first active member to leader if none exists

**Indexes**:
- `need` + `status`
- `need` + `focusArea`
- `members.user`

---

#### TeamInvitation Model (`teams/teamInvitation.model.ts`)
**Purpose**: Track team membership invitations
**Fields**:
- `team` (ObjectId, ref: Team, required)
- `invitedUser` (ObjectId, ref: User, required)
- `invitedBy` (ObjectId, ref: User, required)
- `status` (String, enum): pending, accepted, rejected, expired
- `message` (String): Invitation message
- `expiresAt` (Date, default: +7 days)
- `respondedAt` (Date)

**Middleware**: Auto-expires invitations
**Indexes**: TTL index on expiresAt

---

### 4. BLOG & CONTENT MODELS

#### Article Model (`blog/articles/article.model.ts`)
**Purpose**: Blog articles
**Fields**:
- `title` (String, required)
- `subtitle` (String)
- `slug` (String, unique, indexed)
- `seo` (SEO schema): metaTitle, metaDescription
- `content` (String, required): Rich text content
- `excerpt` (String, required): Short preview
- `featuredImage` (ResponsiveImage): desktop/mobile URLs
- `gallery` (Array of ResponsiveImages)
- `category` (ObjectId, ref: Category, required)
- `tags` (Array of ObjectIds, ref: Tag)
- `author` (ObjectId, ref: Author, required)
- `status` (String, enum): draft, published, archived
- `views` (Number, default: 0)
- `relatedArticles` (Array of ObjectIds, ref: Article)

**Virtual Fields**:
- `comments`: Populated from Comment model (postType: "Article")

**Middleware**: Auto-generates slug from title

---

#### Video Model (`blog/videos/video.model.ts`)
**Purpose**: Video content management
**Fields**:
- `title` (String, required)
- `subtitle` (String)
- `slug` (String, unique, indexed)
- `seo` (SEO schema)
- `description` (String, required)
- `videoUrl` (String, required): Video source URL
- `coverImage` (ResponsiveImage)
- `cameraman` (ObjectId, ref: Author)
- `category` (ObjectId, ref: Category)
- `tags` (Array of ObjectIds, ref: Tag)
- `status` (String, enum): draft, published
- `views` (Number)
- `relatedVideos` (Array of ObjectIds, ref: Video)

**Virtual Fields**: comments (from Comment model, postType: "Video")

---

#### Gallery Model (`blog/gallery/gallery.model.ts`)
**Purpose**: Image gallery collections
**Fields**:
- `title` (String, required)
- `subtitle` (String)
- `slug` (String, unique, indexed)
- `seo` (SEO schema)
- `description` (String, required)
- `images` (Array of ResponsiveImages, required)
- `photographer` (ObjectId, ref: Author)
- `category` (ObjectId, ref: Category): Optional
- `tags` (Array of ObjectIds, ref: Tag)
- `status` (String, enum): draft, published
- `views` (Number)
- `relatedGalleries` (Array of ObjectIds, ref: Gallery)

**Virtual Fields**: comments (postType: "Gallery")

---

#### FeaturedItem Model (`blog/featuredItems/featuredItem.model.ts`)
**Purpose**: Manage featured content on homepage
**Fields**:
- `order` (Number, required, unique): Display order
- `item` (ObjectId, required, refPath: itemType): Polymorphic reference
- `itemType` (String, enum): Article, Video, Gallery

---

### 5. NEWS & AUTHOR MODELS

#### News Model (`news/news.model.ts`)
**Purpose**: News/updates content
**Fields**:
- `title` (String, required)
- `slug` (String, unique, indexed)
- `seo.metaTitle` (String, required)
- `seo.metaDescription` (String)
- `content` (String, required)
- `excerpt` (String, required)
- `featuredImage` (ResponsiveImage, required)
- `gallery` (Array of ResponsiveImages)
- `author` (ObjectId, ref: Author, required)
- `category` (ObjectId, ref: Category, required)
- `tags` (Array of ObjectIds, ref: Tag)
- `status` (String, enum): draft, published, archived
- `views` (Number, default: 0)
- `relatedNews` (Array of ObjectIds, ref: News)

**Virtual Fields**: comments

**Middleware**: Auto-generates slug

---

#### Author Model (`author/author.model.ts`)
**Purpose**: Author/contributor profiles
**Fields**:
- `name` (String, required)
- `slug` (String, unique, indexed)
- `metaTitle` (String, required)
- `bio` (String): Author biography
- `metaDescription` (String)
- `avatar` (ResponsiveImage)

**Middleware**: Auto-generates slug from name

---

#### Category Model (`categories/category.model.ts`)
**Purpose**: General content categorization (for articles, videos, etc.)
**Fields**:
- `name` (String, required, unique)
- `slug` (String, required, unique)
- `description` (String)

---

#### Tag Model (`tag/tag.model.ts`)
**Purpose**: Tagging system for content
**Fields**:
- `name` (String, required, unique)
- `slug` (String, unique)

**Middleware**: Auto-generates slug from name

---

### 6. SOCIAL INTERACTION MODELS

#### Follow Model (`social/follow.model.ts`)
**Purpose**: User following and need following
**Fields**:
- `follower` (ObjectId, ref: User, required, indexed)
- `following` (ObjectId, ref: User): For following users
- `followType` (String, enum): "user", "need" (required)
- `followedNeed` (ObjectId, ref: Need): For following needs

**Indexes**:
- Unique compound index on `follower` + `following` (when following exists)
- Unique compound index on `follower` + `followedNeed` (when followedNeed exists)
- Indexes on followType

**Middleware**: Validates that either following or followedNeed is set based on followType

---

#### Like Model (`social/like.model.ts`)
**Purpose**: Liking system for needs, comments, stories, users
**Fields**:
- `user` (ObjectId, ref: User, required)
- `target` (ObjectId, required, refPath: targetType)
- `targetType` (String, enum): need, comment, story, user
- Persian comment: "هر کاربر فقط یک بار می‌تواند یک target را لایک کند"

**Indexes**: Unique compound index on `user` + `target` + `targetType`

---

#### NeedComment Model (see Need Comments section above)

---

#### Mention Model (`social/mention.model.ts`)
**Purpose**: Track @mentions in comments and messages
**Fields**:
- `mentionedUser` (ObjectId, ref: User, required, indexed)
- `mentionedBy` (ObjectId, ref: User, required)
- `context` (String, enum): comment, message, need_update, task_description, team_invitation, direct_message
- `contextId` (String): ID of the context
- `relatedModel` (String, required): Model name
- `relatedId` (String, required, indexed)
- `text` (String): Mention text
- `isRead` (Boolean, default: false)

**Indexes**:
- `mentionedUser` + `isRead` + `createdAt` (compound)
- `context` + `contextId`
- `relatedModel` + `relatedId`

---

#### TagUsage Model (`social/tagUsage.model.ts`)
**Purpose**: Track hashtag usage analytics
**Fields**:
- `tag` (String, required, trimmed)
- `normalizedTag` (String, required, unique, lowercase, indexed)
- `usageCount` (Number, default: 1, min: 0)
- `relatedNeeds` (Array of ObjectIds, ref: Need)
- `lastUsedAt` (Date, default: now)

**Indexes**: On usageCount, lastUsedAt

---

#### ShareLog Model (`social/shareLog.model.ts`)
**Purpose**: Analytics for social sharing
**Fields**:
- `user` (ObjectId, ref: User)
- `sharedItem` (ObjectId, ref: Need, required, indexed)
- `sharedItemType` (String, default: "need")
- `platform` (String, enum): telegram, whatsapp, twitter, linkedin, facebook, instagram, email, copy_link, other
- `ipAddress`, `userAgent`, `referrer` (Strings): Technical data
- `metadata` (Mixed): Additional data

**Indexes**: On platform + createdAt, sharedItem + createdAt, user + createdAt

---

### 7. GAMIFICATION MODELS

#### Badge Model (`gamification/badge.model.ts`)
**Purpose**: Achievement badges system
**Fields**:
- `name` (String, required)
- `nameEn` (String, required)
- `description` (String, required)
- `category` (String, enum): contributor, supporter, creator, helper, communicator, leader, expert, milestone, special, seasonal
- `rarity` (String, enum): common, rare, epic, legendary
- `icon` (String, required): Badge icon URL
- `color` (String): Badge color
- `conditions` (Array of BadgeCondition schemas):
  - `type` (String, enum): points, count, streak, milestone, custom
  - `target` (Number)
  - `action` (String)
  - `description` (String, required)
- `points` (Number, default: 0): Points earned
- `isActive` (Boolean, default: true)
- `isSecret` (Boolean, default: false): Hidden badge
- `order` (Number, default: 0)

**Indexes**: On category + rarity, isActive

---

#### UserBadge Model (`gamification/userBadge.model.ts`)
**Purpose**: Track earned badges per user
**Fields**:
- `user` (ObjectId, ref: User, required, indexed)
- `badge` (ObjectId, ref: Badge, required)
- `earnedAt` (Date, default: now)
- `progress` (Number, 0-100): Partial progress toward badge
- `metadata` (Mixed): Additional badge data

**Indexes**:
- Unique compound on `user` + `badge`
- Compound on `user` + `earnedAt`

---

#### UserStats Model (`gamification/userStats.model.ts`) - COMPREHENSIVE STATS
**Purpose**: Aggregate user gamification statistics
**Fields**:
- `userId` (String, required, unique, indexed)
- `totalPoints` (Number, default: 0, indexed)
- `currentLevel` (Number, default: 1, indexed)
- `needsCreated`, `needsSupported`, `needsCompleted` (Numbers)
- `needsUpvoted`, `tasksCompleted`, `tasksAssigned` (Numbers)
- `teamsCreated`, `teamsJoined` (Numbers)
- `totalFinancialContributions`, `totalHoursContributed` (Numbers)
- `totalContributions` (Number)
- `followersCount`, `followingCount` (Numbers)
- `messagesCount`, `commentsCount`, `badgesCount` (Numbers)
- `commonBadges`, `rareBadges`, `epicBadges`, `legendaryBadges` (Numbers)
- `currentLoginStreak`, `longestLoginStreak` (Numbers)
- `lastLoginDate`, `firstContributionDate`, `firstNeedCreatedDate`, `firstTeamCreatedDate` (Dates)
- `globalRank` (Number): Global ranking
- `categoryRanks` (Map): Rankings by category

**Indexes**: On totalPoints, currentLevel, totalContributions, needsCreated, needsSupported, badgesCount

---

#### PointTransaction Model (`gamification/pointTransaction.model.ts`)
**Purpose**: Log all point transactions
**Fields**:
- `user` (ObjectId, ref: User, required, indexed)
- `action` (String, enum): need_created, need_upvote, need_support, supporter_contribution, task_completed, task_assigned, milestone_completed, verification_approved, comment_posted, message_sent, team_created, team_joined, need_completed, daily_login, profile_completed, first_contribution, invite_accepted, badge_earned, level_up, admin_bonus, penalty
- `points` (Number, required): Points awarded/deducted
- `description` (String)
- `relatedModel` (String)
- `relatedId` (String)
- `metadata` (Mixed)

**Indexes**: On user + createdAt, action, relatedModel + relatedId

---

### 8. STORY & MEDIA MODELS

#### Story Model (`stories/story.model.ts`) - FULL-FEATURED SOCIAL
**Purpose**: Instagram-like story system with expiry
**Fields**:
- `user` (ObjectId, ref: User, required, indexed)
- `type` (String, enum): image, video, text
- `media` (StoryMedia schema):
  - `type` (String, enum): image, video, audio, document, file
  - `url` (String, required)
  - `thumbnail`, `duration` (Optional fields)
  - `metadata` (Mixed)
- `text`, `backgroundColor`, `textColor`, `fontFamily` (Strings): For text stories
- `caption` (String)
- `privacy` (String, enum, indexed): public, followers, close_friends, custom
- `allowedUsers` (Array of Strings): Custom privacy list
- `linkedNeed` (ObjectId, ref: Need): Associated need
- `linkedUrl` (String): Custom URL
- `views` (Array of StoryView schemas):
  - `user` (ObjectId, ref: User)
  - `viewedAt` (Date)
  - `viewDuration` (Number): Seconds
- `viewsCount` (Number, indexed)
- `reactions` (Array of StoryReaction schemas):
  - `user` (ObjectId, ref: User)
  - `emoji` (String)
  - `reactedAt` (Date)
- `reactionsCount` (Number)
- `allowReplies`, `allowSharing` (Booleans)
- `highlightedUntil` (Date): Highlight expiry
- `isActive` (Boolean, indexed)
- `expiresAt` (Date, required, indexed): Auto-deletes after this

**Instance Methods**:
- `addView(userId, viewDuration?)`: Add view
- `addReaction(userId, emoji)`: React with emoji
- `removeReaction(userId)`: Remove reaction
- `hasUserViewed(userId)`: Check if viewed

**Static Methods**:
- `getActiveByUser(userId)`: Get user's active stories
- `getFeedStories(currentUserId, followingIds)`: Get feed stories
- `deleteExpired()`: Cleanup expired stories
- `getUserStoryStats(userId)`: Get stats

**Virtual Fields**:
- `isExpired`: Boolean check
- `timeRemaining`: Seconds left
- `viewsList`: Virtual populate

**Middleware**: Auto-sets expiresAt to +24 hours if not set

**Indexes**:
- Compound on user + isActive + expiresAt
- On privacy + expiresAt (query optimization)
- TTL index on expiresAt

---

#### StoryHighlight Model (`stories/storyHighlight.model.ts`)
**Purpose**: Persist selected stories as highlights
**Fields**:
- `user` (ObjectId, ref: User, required, indexed)
- `title` (String, required, max 50 chars)
- `coverImage` (String, required): Thumbnail
- `stories` (Array of ObjectIds, ref: Story)
- `order` (Number, default: 0)
- `isActive` (Boolean, indexed)

**Instance Methods**:
- `addStory(storyId)`: Add story to highlight
- `removeStory(storyId)`: Remove story

**Static Methods**:
- `getByUser(userId)`: Get user's highlights with populated stories

**Indexes**: Compound on user + isActive + order

---

#### Media Model (`stories/media.model.ts`) - COMPLETE MEDIA SYSTEM
**Purpose**: Centralized media file management
**Fields**:
- `uploadedBy` (ObjectId, ref: User, required, indexed)
- `type` (String, enum, indexed): image, video, audio, document, file
- `category` (String, enum, indexed): profile, cover, need, story, message, comment, gallery, document
- `url` (String, required)
- `cdnUrl` (String): CDN URL
- `path` (String, required): File path
- `metadata` (MediaMetadata schema):
  - `originalName`, `mimeType`, `extension` (Strings, required)
  - `size` (Number, required)
  - `dimensions`: { width, height, aspectRatio }
  - `duration` (Number): For videos
  - `isProcessed` (Boolean)
  - `processingStatus` (String, enum): pending, processing, completed, failed
  - `processingError` (String)
  - `thumbnail`, `thumbnailSmall`, `thumbnailMedium`, `thumbnailLarge` (Strings)
  - `exif`, `codec`, `bitrate`, `frameRate` (Mixed/Number)
- `relatedModel`, `relatedId` (Strings, indexed): Associated entity
- `altText`, `caption` (Strings)
- `isPublic` (Boolean, indexed)
- `isActive` (Boolean, indexed)
- `viewsCount`, `downloadsCount` (Numbers)
- `storageProvider` (String, enum): local, s3, cloudinary, cdn
- `storageKey` (String)

**Instance Methods**:
- `incrementViews()`: Increment view counter
- `incrementDownloads()`: Increment download counter

**Static Methods**:
- `getByUser(userId, category?)`: Get user's media
- `getByRelated(relatedModel, relatedId)`: Get related media
- `getTotalSize(userId)`: Get total storage used

**Virtual Fields**:
- `sizeInMB`: File size formatted
- `durationFormatted`: Video duration formatted

**Indexes**:
- Compound on uploadedBy + category + createdAt
- Compound on relatedModel + relatedId
- On isActive + createdAt

---

### 9. MESSAGING & NOTIFICATION MODELS

#### Conversation Model (`direct-messages/conversation.model.ts`)
**Purpose**: Group and one-to-one conversations for need support
**Fields**:
- `need` (ObjectId, ref: Need, required)
- `participants` (Array of ObjectIds, ref: User, required)
- `type` (String, enum): one_to_one, group
- `title` (String): For group conversations
- `lastMessage` (ObjectId, ref: DirectMessage)
- `lastMessageAt` (Date)
- `createdBy` (ObjectId, ref: User, required)
- `isArchived` (Boolean)
- `archivedBy` (Array of ObjectIds, ref: User)

**Virtual Fields**:
- `unreadCount`: Calculated in service

**Indexes**: Compound on need + participants, participants + lastMessageAt

---

#### DirectMessage Model (`direct-messages/directMessage.model.ts`)
**Purpose**: Individual messages in conversations
**Fields**:
- `conversation` (ObjectId, ref: Conversation, required)
- `sender` (ObjectId, ref: User, required)
- `content` (String, required)
- `readBy` (Array of ReadBy schemas):
  - `user` (ObjectId, ref: User)
  - `readAt` (Date)
- `attachments` (Array of MessageAttachment schemas):
  - `type` (String, enum): image, document, video, audio
  - `url`, `filename` (Strings, required)
  - `fileSize`, `mimeType` (Optional)
- `replyTo` (ObjectId, ref: DirectMessage): Reply to message
- `isEdited` (Boolean), `editedAt` (Date)
- `isDeleted` (Boolean), `deletedAt` (Date)

**Post-save Middleware**: Updates conversation's lastMessage

**Indexes**: On conversation + createdAt, sender

---

#### Notification Model (`notifications/notification.model.ts`) - COMPREHENSIVE
**Purpose**: Central notification hub with multi-channel delivery
**Fields**:
- `recipient` (ObjectId, ref: User, required, indexed)
- `type` (String, enum, indexed): mention, follow, follow_need, badge_earned, level_up, need_update, need_completed, need_support, task_assigned, task_completed, milestone_completed, team_invitation, team_joined, team_left, comment_posted, comment_reply, direct_message, verification_approved, verification_rejected, admin_announcement, system_alert
- `title`, `titleEn` (Strings, required)
- `message`, `messageEn` (Strings, required)
- `priority` (String, enum, indexed): low, normal, high, urgent

**Related Entity**:
- `actor` (ObjectId, ref: User): Who triggered notification
- `relatedModel`, `relatedId` (Strings)
- `relatedEntity` (Mixed): Embedded entity

**Notification State**:
- `isRead` (Boolean, indexed)
- `readAt` (Date)

**Delivery Status** (Multi-channel):
- `channels` (Array, enum): in_app, email, push, sms
- `deliveryStatus` (Object with sub-objects):
  - `in_app`: { delivered, deliveredAt }
  - `email`: { sent, sentAt, failureReason }
  - `push`: { sent, sentAt, failureReason }
  - `sms`: { sent, sentAt, failureReason }

**UI Related**:
- `icon`, `color` (Strings)
- `actionUrl`, `actionLabel` (Strings)

**Grouping & Management**:
- `groupKey` (String, indexed): For notification grouping
- `metadata` (Mixed)
- `expiresAt` (Date, indexed)

**Instance Methods**:
- `markAsRead()`: Mark single notification as read

**Static Methods**:
- `markAllAsRead(userId)`: Mark all user notifications as read
- `getUnreadCount(userId)`: Get unread count
- `deleteExpired()`: Delete expired notifications

**Virtual Fields**:
- `timeAgo`: Formatted time (Persian)

**Middleware**: Sets delivery status defaults, auto-populates relatedEntity

**Indexes**:
- Compound on recipient + isRead + createdAt
- Compound on recipient + type + createdAt
- On groupKey

---

#### NotificationPreferences Model (`notifications/notificationPreferences.model.ts`) - GRANULAR CONTROL
**Purpose**: User notification settings and preferences
**Fields**:
- `user` (ObjectId, ref: User, required, unique, indexed)

**Channel Preferences** (4 channels, each with):
- `in_app`, `email`, `push`, `sms` (Objects):
  - `enabled` (Boolean)
  - `types` (Array of NotificationTypes)

**Global Settings**:
- `globalMute` (Boolean): Mute all notifications
- `muteUntil` (Date): Temporary mute
- `mutedTypes` (Array): Muted notification types

**Quiet Hours**:
- `quietHoursEnabled` (Boolean)
- `quietHoursStart`, `quietHoursEnd` (Strings): HH:MM format

**Digest Settings**:
- `emailDigest.enabled` (Boolean)
- `emailDigest.frequency` (String, enum): daily, weekly, never
- `emailDigest.time`, `emailDigest.dayOfWeek` (String/Number)

**Advanced**:
- `groupSimilar` (Boolean): Group similar notifications
- `maxPerDay` (Number): Maximum notifications per day

**Instance Methods**:
- `isChannelEnabled(channel, type)`: Check if notification type is enabled for channel
- `isInQuietHours()`: Check if currently in quiet hours

**Static Methods**:
- `getOrCreate(userId)`: Get or create preferences

---

#### PushToken Model (`notifications/pushToken.model.ts`)
**Purpose**: Device tokens for push notifications
**Fields**:
- `user` (ObjectId, ref: User, required, indexed)
- `token` (String, required, unique): Device token
- `platform` (String, enum): ios, android, web
- `deviceId` (String): Device identifier
- `isActive` (Boolean, indexed)
- `lastUsedAt` (Date)

**Static Methods**:
- `deactivateOldTokens(days)`: Deactivate unused tokens
- `getUserTokens(userId, platform?)`: Get user's active tokens

**Middleware**: Updates lastUsedAt on save

**Indexes**: Compound on user + isActive, on isActive + lastUsedAt

---

### 10. SUPPORTER MODELS

#### SupporterMessage Model (`supporter/supporter-messages/supporterMessage.model.ts`)
**Purpose**: Message board for need supporters
**Fields**:
- `content` (String, required)
- `author` (ObjectId, ref: User, required)
- `need` (ObjectId, ref: Need, required)
- `parentMessage` (ObjectId, ref: SupporterMessage): For replies
- `likes` (Array of ObjectIds, ref: User)

---

#### SupporterSubmission Model (`supporter/supporter-submissions/supporterSubmission.model.ts`)
**Purpose**: Evidence/proof submissions by supporters
**Fields**:
- `submitter` (ObjectId, ref: User, required)
- `need` (ObjectId, ref: Need, required)
- `image` (ResponsiveImage, required)
- `caption` (String)
- `status` (String, enum): pending, approved, rejected (status from SubmissionStatus enum)

---

### 11. MISC MODELS

#### Poll Model (`polls/poll.model.ts`)
**Purpose**: Surveys for needs
**Fields**:
- `question` (String, required)
- `options` (Array of PollOption):
  - `text` (String, required)
  - `votes` (Array of ObjectIds, ref: User)
  - **Virtual**: `votesCount`
- `need` (ObjectId, ref: Need, required)
- `expiresAt` (Date)

---

#### Comment Model (`comment/comment.model.ts`) - GENERAL PURPOSE
**Purpose**: Comments on news, articles, projects (polymorphic)
**Fields**:
- `content` (String, required)
- `author` (ObjectId, ref: User)
- `guestName`, `guestEmail` (Strings): Anonymous comments
- `post` (ObjectId, required, refPath: postType): Polymorphic reference
- `postType` (String, enum): News, Article, Project
- `parent` (ObjectId, ref: Comment): Reply to comment
- `status` (String, enum): PENDING, APPROVED, REJECTED, SPAM (from CommentStatus enum)

**Indexes**: Unique compound indexes to prevent duplicate comments (user + content + post), (guestEmail + content + post)

---

#### Project Model (`projects/project.model.ts`)
**Purpose**: Projects/campaigns
**Fields**:
- `title` (String, required)
- `subtitle` (String)
- `slug` (String, unique)
- `description` (String, required)
- `excerpt` (String)
- `featuredImage` (ResponsiveImage, required)
- `gallery` (Array of ResponsiveImages)
- `seo` (SEO schema, required)
- `category` (ObjectId, ref: Category, required)
- `status` (String, enum): draft, active, completed
- `targetAmount`, `amountRaised` (Numbers)
- `targetVolunteer`, `collectedVolunteer` (Numbers)
- `deadline` (Date, required)
- `views` (Number)

**Middleware**: Auto-generates slug

---

#### Setting Model (`settings/setting.model.ts`)
**Purpose**: Key-value settings storage
**Fields**:
- `key` (String, required, unique, indexed)
- `value` (Mixed, required): Any type of value

---

#### FAQ Model (`faqs/faq.model.ts`)
**Purpose**: Frequently asked questions
**Fields**:
- `question` (String, required)
- `answer` (String, required)
- `order` (Number, default: 0)
- `isActive` (Boolean, default: true)

---

## SHARED SCHEMAS

### ResponsiveImage Schema
```typescript
{
  desktop: String (required),
  mobile: String (required)
}
```

### SEO Schema
```typescript
{
  metaTitle: String (required),
  metaDescription: String
}
```

---

## RELATIONSHIP DIAGRAM

### Key Relationships:

**User** (Central Hub)
├── created Needs (1:M) → Need.submittedBy.user
├── created Articles (1:M) → Article.author
├── created Teams (1:M) → Team.createdBy
├── created Comments (1:M) → Comment.author
├── follows Users (M:M) → Follow (followType: "user")
├── follows Needs (M:M) → Follow (followType: "need")
├── liked content (M:M) → Like
├── received Notifications (1:M) → Notification
└── has Badges (M:M) → UserBadge

**Need** (Core Content)
├── has Category (M:1) → NeedCategory
├── has Comments (1:M) → NeedComment
├── has Budget Items (1:M, embedded)
├── has Milestones (1:M, embedded)
├── has Tasks (1:M, embedded)
├── has Supporters (M:M, embedded in supporterDetails)
├── has Teams (1:M) → Team
├── has Polls (1:M) → Poll
├── has Stories (1:M) → Story.linkedNeed
├── has Conversations (1:M) → Conversation
└── has Followers (M:M) → Follow (followType: "need")

**Team** (Collaboration)
├── belongs to Need (M:1)
├── has Members (1:M, embedded with User refs)
├── has Invitations (1:M) → TeamInvitation
└── has Tasks (embedded in Need)

**Article/News/Video/Gallery** (Content)
├── has Category (M:1)
├── has Tags (M:M)
├── has Author (M:1)
├── has Comments (1:M) → Comment
└── has Media (1:M) → Media

---

## SEEDERS & TEST DATA

### User Seeder (`user.seeder.ts`)
- **Admin**: 1 super_admin (mobile: 09120000000)
- **Users**: 50 regular users with Persian names
- **Roles**: First 5 users get admin role, rest are users
- **Password**: All use `password123` (hashed)
- **Profiles**: Random majors (Computer Science, Medicine, Law) and years

### NeedCategory Seeder (`needCategory.seeder.ts`)
Creates 8 predefined categories:
1. سلامت و درمان (Health & Medicine)
2. آموزش (Education)
3. مسکن (Housing)
4. غذا و تغذیه (Food & Nutrition)
5. اشتغال و کسب‌وکار (Employment)
6. محیط زیست (Environment)
7. اضطراری (Emergency)
8. فرهنگ و هنر (Culture & Arts)

### Need Seeder (`need.seeder.ts`)
- **Created**: ~20 sample needs per category
- **Statuses**: Mix of draft, pending, approved, in_progress
- **Locations**: Various Iranian cities with geolocation
- **Budget Items**: 2-5 items per need
- **Milestones**: 3-5 per need
- **Supporters**: Random users assigned as supporters

### Team Seeder (`team.seeder.ts`)
- **Teams**: 8 teams created
- **Members**: 3-10 members per team with random roles
- **Focus Areas**: Various (fundraising, logistics, etc.)

### Social Seeder (`social.seeder.ts`)
- **Follows**: 1-10 users followed per user, 1-5 needs followed per user
- **Likes**: 1-8 needs liked per user
- **Comments**: Various comments on needs

---

## KEY DESIGN PATTERNS

1. **Polymorphic References** (discriminator pattern):
   - Comment.post + Comment.postType: References News/Article/Project
   - Like.target + Like.targetType: References Need/Comment/Story/User
   - FeaturedItem.item + FeaturedItem.itemType: References Article/Video/Gallery

2. **Embedded Documents** (Denormalization for performance):
   - Need contains budget items, milestones, tasks, supporters (all embedded)
   - Team contains members (embedded)
   - Story contains views and reactions (embedded)

3. **Virtual Population**:
   - Article/News comments virtual ref
   - Need.upvotesCount virtual
   - Story.viewsList virtual

4. **TTL Indexes** (Auto-cleanup):
   - OTP expires after 5 minutes
   - Stories expire based on expiresAt
   - Notifications can expire
   - TeamInvitations TTL-based

5. **Pre/Post Middleware**:
   - Auto-slug generation
   - Password hashing
   - Status tracking
   - Budget status updates
   - Message auto-save to conversation

6. **Unique Constraints**:
   - Single follow per user-to-user pair
   - Single like per user-target pair
   - Single badge per user

7. **Indexes for Performance**:
   - Compound indexes on frequently queried fields
   - Indexed on foreign keys
   - Indexed on commonly filtered fields (status, active, etc.)

---

## DATABASE STATISTICS

- **Total Models**: 38
- **Total Collections**: 38 (one per model)
- **Embedded Schemas**: ~15 (within models)
- **Relationships**: Complex multi-level relationships
- **Database**: MongoDB
- **ODM**: Mongoose

**تفاوت با گزارش قبلی:** تعداد models از 39 به 38 اصلاح شد پس از بررسی دقیق ساختار واقعی پروژه.

