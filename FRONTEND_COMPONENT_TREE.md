# COMPONENT TREE - VISUAL HIERARCHY

## PROJECT STRUCTURE OVERVIEW

```
Mehrebaran (Monorepo)
├── Web Package (Next.js 13+ Main App)
│   ├── Pages: 40+ routes
│   ├── Components: 50+ reusable components
│   ├── Services: 15+ API services
│   ├── Hooks: Custom hooks
│   ├── Contexts: Auth context
│   ├── Utils: Helpers & utilities
│   └── Types: TypeScript definitions
│
└── Dashboard Package (React + React Router Admin)
    ├── Pages: Login, Dashboard, Tags
    ├── Components: Layout, Header, Sidebar
    ├── Routes: React Router config
    └── Services: Auth service

```

---

## APP ROUTER STRUCTURE (Next.js 13+)

```
ROOT LAYOUT (layout.tsx)
│
├── PUBLIC PAGES
│   ├── / (Home)
│   │   ├── HeroSection
│   │   ├── WhatWeDidSection
│   │   ├── RunningProjectsSection
│   │   │   └── DonationProgress
│   │   │   └── ProgressBars
│   │   ├── NewsSection
│   │   ├── BlogSection
│   │   └── AreasOfActivitySection
│   │       └── InteractiveDiagram
│   │
│   ├── /login
│   │   └── Login Form (2-field)
│   │
│   ├── /signup
│   │   ├── Step 1: Mobile
│   │   └── Step 2: Details + Password
│   │
│   ├── /about-us
│   ├── /contact-us
│   ├── /faqs
│   ├── /focus
│   │
│   └── CONTENT SECTIONS
│       ├── /projects
│       │   ├── /projects/active
│       │   │   └── /projects/active/[id]
│       │   ├── /projects/completed
│       │   └── /projects/[slug]
│       │
│       ├── /news
│       │   └── /news/[id]
│       │
│       ├── /blog (Hub)
│       │   ├── /blog/articles
│       │   │   └── /blog/articles/[id]
│       │   ├── /blog/gallery
│       │   │   └── /blog/gallery/[id]
│       │   └── /blog/videos
│       │       └── /blog/videos/[id]
│
│
├── PROTECTED PAGES (Requires Auth)
│   ├── /network (Main feed)
│   │   ├── /network/needs/[id]
│   │   │   ├── NeedCard (Full)
│   │   │   ├── Comment Section
│   │   │   └── Support Card
│   │   │
│   │   ├── /network/explore
│   │   ├── /network/trending
│   │   ├── /network/tags
│   │   ├── /network/teams
│   │   │   └── /network/teams/[id]
│   │   │       └── TeamCard
│   │   │
│   │   ├── /network/stories
│   │   │   └── StoryCard (Multiple)
│   │   │       └── StoryViewer
│   │   │
│   │   ├── /network/leaderboard
│   │   │   ├── Filters (Category + Period)
│   │   │   └── LeaderboardTable
│   │   │       └── LeaderboardEntry
│   │   │
│   │   ├── /network/profile
│   │   ├── /network/notifications
│   │   └── /network/users/[id]
│       └── UserCard
│
└── SHARED LAYOUT
    ├── Header (with Navbar + Search)
    │   ├── Search Component
    │   └── Navbar (Responsive menu)
    │
    └── Footer
        ├── SocialMedia
        ├── Menu
        ├── License
        ├── Wave
        └── Codabiat

```

---

## COMPONENT HIERARCHY BY FEATURE

### UI/BASE COMPONENTS

```
UI Components/
├── SmartButton
│   ├── variants: mblue | mgray | morange
│   ├── sizes: sm | md | lg
│   └── features: icons, fullWidth, asLink
│
├── Card
│   ├── horizontal/vertical layout
│   └── content types: news, article, project, video, gallery
│
├── OptimizedImage
│   ├── fill mode (responsive)
│   ├── fixed size mode
│   ├── priority: up | down
│   └── placeholder: blur | empty
│
├── Pagination
│   ├── page numbers
│   ├── prev/next
│   └── smart display (1-5 pages)
│
├── Loading (Placeholder)
│
└── Container (Wrapper)
```

### LAYOUT COMPONENTS

```
Layout/
├── Header
│   ├── Search
│   ├── Navbar
│   │   ├── mainMenuItems[]
│   │   └── networkMenuItems[]
│   └── Logo
│
├── Footer
│   ├── SocialMedia
│   ├── Menu
│   ├── License
│   ├── Wave
│   └── Codabiat
│
└── Swiper Components
    ├── SmartSwiper (Carousel)
    │   └── SwiperButton
    └── GallerySwiper
```

### NETWORK/SOCIAL COMPONENTS

```
Network/
├── NeedCard (2 variants: feed | compact)
│   ├── User Info (avatar, name, time)
│   ├── Title & Description
│   ├── Tags (up to 3)
│   ├── Images (gallery)
│   ├── Progress Bar (if targetAmount)
│   ├── Team Info
│   └── Actions (Like, Comment, Share, Follow)
│
├── TeamCard (2 variants: card | compact)
│   ├── Name & Description
│   ├── Status Badge
│   ├── Focus Area
│   ├── Stats (members, tasks, points)
│   ├── Member Avatars (preview)
│   └── Actions (View, Join)
│
├── TaskCard
│   ├── Title & Description
│   ├── Status Badge
│   ├── Priority Icon
│   ├── Progress Bar
│   ├── Checklist Preview
│   ├── Assigned To
│   ├── Deadline with Countdown
│   ├── Block Indicator
│   └── Status Actions
│
└── StoryCard
    ├── Preview (image | video | text)
    ├── User Avatar (overlay)
    ├── Time Ago
    ├── Unviewed Indicator
    ├── Video Play Button
    ├── Expired Overlay
    └── Click Handler
```

### GAMIFICATION COMPONENTS

```
Gamification/
├── LeaderboardTable (2 variants: default | compact)
│   ├── Rank Column (medals 🥇🥈🥉)
│   ├── User Info
│   ├── Level (optional)
│   ├── Badge (optional)
│   └── Score (with star icon)
│
├── AchievementCard (2 variants: card | compact)
│   ├── Tier Colors (bronze-diamond)
│   ├── Badge Icon
│   ├── Name & Description
│   ├── Progress Bar (if not earned)
│   ├── Earned Date
│   └── Points Reward
│
├── LevelBadge
│
└── PointsDisplay (⭐ + score)
```

### SOCIAL COMPONENTS

```
Social/
├── UserCard (3 variants: card | compact | list)
│   ├── Avatar (initials | image)
│   ├── Name & Level
│   ├── Followers/Following counts
│   ├── Follow/Unfollow Button
│   └── Edit Profile Button (if current user)
│
└── Discovery/
    └── SuggestedSection
```

### CONTENT COMPONENTS

```
Content/
├── Comment
│   ├── Comment List
│   │   ├── User Avatar
│   │   ├── Author Name
│   │   ├── Comment Text
│   │   ├── Date
│   │   └── Replies (nested)
│   │
│   └── Comment Form
│       ├── Content (textarea)
│       ├── Guest Name
│       ├── Guest Email
│       └── Submit Button
│
├── ProjectCard
│   ├── Featured Image
│   ├── Title
│   ├── Description
│   └── "Learn More" Button
│
└── DonationForm (Stub)
    └── TODO: Implement
```

### STORIES COMPONENTS

```
Stories/
├── StoryCard (shown above)
│
└── StoryViewer
    └── Fullscreen/Modal story display
```

### NOTIFICATION COMPONENTS

```
Notifications/
├── NotificationBadge (counter)
│
└── NotificationItem
    ├── Icon/Type
    ├── Message
    ├── Time
    └── Action Button
```

### AUTH COMPONENTS

```
Auth/
└── ProtectedRoute
    ├── Checks isAuthenticated
    ├── Shows loading skeleton
    ├── Redirects to /login if not auth
    └── Renders children if auth
```

---

## HOME PAGE COMPONENT STRUCTURE (Server-Side)

```
Home (Server Component)
├── Data Fetched (Promise.all):
│   ├── heroSettings
│   ├── projects (active, 3 limit)
│   └── news (8 limit)
│
└── Sections:
    ├── HeroSection
    │   └── props: { settings }
    │
    ├── WhatWeDidSection (Static)
    │   └── Statistics display
    │
    ├── RunningProjectsSection
    │   ├── props: { projects }
    │   ├── SmartSwiper carousel
    │   ├── DonationProgress
    │   └── ProgressBars
    │
    ├── NewsSection
    │   ├── props: { newsItems }
    │   ├── SmartSwiper carousel
    │   └── Card components
    │
    ├── BlogSection (Static)
    │
    └── AreasOfActivitySection
        ├── AreaItem[]
        ├── Line[]
        └── InteractiveDiagram
```

---

## NEED DETAIL PAGE STRUCTURE

```
NeedDetailPage (/network/needs/[id])
├── Header (Back button, Breadcrumb)
│
└── Main Content (3-column grid on LG)
    ├── Left Column (2 cols on LG)
    │   ├── Need Card
    │   │   ├── Creator Info
    │   │   ├── Title
    │   │   ├── Status Badge
    │   │   ├── Description
    │   │   ├── Tags
    │   │   ├── Images
    │   │   ├── Progress Section
    │   │   ├── Team Info
    │   │   └── Actions (Like, Comment, Share, Support)
    │   │
    │   └── Comments Section
    │       ├── Comment Form
    │       └── Comment List (with replies)
    │
    └── Right Sidebar (1 col on LG)
        ├── Support Card
        │   ├── Description
        │   └── "Financial Support" Button
        │
        ├── Category Card
        │   └── Category badge
        │
        └── Stats Card
            ├── Views count
            ├── Likes count
            ├── Comments count
            └── Shares count
```

---

## LEADERBOARD PAGE STRUCTURE

```
LeaderboardPage (/network/leaderboard)
├── Header (🏆 Title + Description)
│
└── Main Content
    ├── Breadcrumb
    │
    ├── Filters Card
    │   ├── Category Buttons:
    │   │   ├── ⭐ Points
    │   │   ├── 📝 Needs Created
    │   │   ├── 🤝 Needs Supported
    │   │   └── ✅ Tasks Completed
    │   │
    │   └── Period Buttons:
    │       ├── All Time
    │       ├── Monthly
    │       ├── Weekly
    │       └── Daily
    │
    ├── User Position Card (if found)
    │   ├── Rank (#N)
    │   ├── User name
    │   ├── Level
    │   └── Score
    │
    ├── Leaderboard Table
    │   ├── LeaderboardTable (variant: default)
    │   └── LeaderboardEntry[] (table rows)
    │
    ├── Total Participants Info
    │
    └── Info Box (Points Guide)
        ├── Scoring system
        └── Important notes
```

---

## FORMS & VALIDATION

### Login Form
```
Mobile (tel input, required)
Password (password input, required)
Error display
Submit button (loading state)
Link to signup
```

### Signup Form (2-Step)
```
Step 1:
  Mobile (tel input, required)
  
Step 2:
  Name (text input, required)
  Password (password input, min 6, required)
  Confirm Password (must match, required)
  National ID (optional)
  Major (optional)
  Year of Admission (optional)
  Back/Submit buttons
```

### Need Creation Form
```
Title (text input, required)
Description (textarea, required)
Category (select, optional)
Priority (select, optional)
Tags (array, optional)
Target Amount (number, optional)
Deadline (date, optional)
Location (object, optional)
Images (upload, optional)
Submit button (loading state)
```

### Comment Form
```
Content (textarea, required)
Guest Name (text, required)
Guest Email (email, required)
Submit button (loading state)
Success/Error message display
```

---

## STATE MANAGEMENT

### Global State (AuthContext)
```
user: IUser | null
isAuthenticated: boolean
isLoading: boolean

Methods:
  login()
  signup()
  sendOtp()
  verifyOtp()
  logout()
  refreshUser()
```

### Component State Examples

**NeedCard**:
- isLiked: boolean
- likesCount: number
- isFollowing: boolean

**UserCard**:
- isFollowing: boolean
- isLoading: boolean

**NetworkPage**:
- needs: INeed[]
- isLoading: boolean
- error: string | null
- searchQuery: string
- selectedCategory: string
- selectedStatus: string
- sortBy: string

**LeaderboardPage**:
- leaderboard: ILeaderboardResponse | null
- isLoading: boolean
- error: string | null
- category: string
- period: string

---

## SERVICES MAPPING

```
Services/
├── auth.service
│   ├── login(credentials)
│   ├── signup(data)
│   ├── sendOtp(mobile)
│   ├── verifyOtp(data)
│   ├── logout()
│   ├── getCurrentUser()
│   ├── getToken()
│   └── setToken(token)
│
├── need.service
│   ├── getNeeds(params)
│   ├── getNeedById(id)
│   ├── createNeed(data)
│   ├── updateNeed(id, data)
│   ├── deleteNeed(id)
│   ├── followNeed(id) / unfollowNeed(id)
│   ├── likeNeed(id) / unlikeNeed(id)
│   ├── getTrendingNeeds(params)
│   ├── getPopularNeeds(params)
│   ├── getUrgentNeeds(params)
│   ├── getNearbyNeeds(params)
│   ├── getMyNeeds(params)
│   ├── getUpdates(needId)
│   ├── createUpdate(needId, data)
│   ├── getMilestones(needId)
│   ├── createMilestone(needId, data)
│   ├── getBudgetItems(needId)
│   ├── createBudgetItem(needId, data)
│   ├── getComments(needId)
│   ├── createComment(needId, content, parentId)
│   ├── getSupporterDetails(needId)
│   ├── addContribution(needId, userId, data)
│   ├── getVerificationRequests(needId)
│   ├── createVerificationRequest(needId, data)
│   └── [update/delete methods]
│
├── gamification.service
│   ├── getLeaderboard(category, period, limit)
│   ├── getUserBadges(userId)
│   ├── getUserAchievements(userId)
│   ├── getUserLevel(userId)
│   └── getPoints(userId)
│
├── social.service
│   ├── followUser(userId)
│   └── unfollowUser(userId)
│
├── project.service
│   ├── getProjects(params)
│   └── getProjectById(id)
│
├── news.service
│   └── getNews(params)
│
├── article.service
│   ├── getArticles(params)
│   └── getArticleById(id)
│
├── video.service
│   ├── getVideos(params)
│   └── getVideoById(id)
│
├── gallery.service
│   ├── getGalleries(params)
│   └── getGalleryById(id)
│
├── story.service
│   ├── getStories(params)
│   ├── isStoryExpired(story)
│   └── getStoryTimeAgo(createdAt)
│
├── team.service
│   ├── getTeams(params)
│   └── getTeamById(id)
│
├── task.service
│   ├── updateTaskStatus(needId, taskId, status)
│   └── completeTask(needId, taskId)
│
├── notification.service
│   └── getNotifications(params)
│
├── discovery.service
│   └── getSuggestions()
│
├── setting.service
│   └── getSetting(key)
│
├── media.service
│   └── uploadMedia(file)
│
└── comment.service
    ├── getCommentsByPost(postId)
    └── createComment(data)
```

---

## PAGES QUICK REFERENCE

### Public Pages (20)
```
Home, Login, Signup, About, Contact, FAQs, Focus
Projects (3), News (2), Blog (7 - hub + articles + gallery + videos)
```

### Protected Pages (14+)
```
Network (main + needs details)
Explore, Trending, Tags, Teams (+ details)
Stories, Leaderboard, Profile
Notifications, Users (profile view)
```

### Total: 40+ Pages

---

## RESPONSIVE BREAKPOINTS

```
Mobile:     < 640px   (full width, stacked layout)
Tablet:     640-1024px (medium layout)
Desktop:    > 1024px  (full layout, sidebars)
```

---

## STYLING SYSTEM

### Colors
- mblue: Primary blue
- morange: Accent orange
- mgray: Borders/backgrounds

### Fonts
- Geist Sans (body)
- Geist Mono (code/mono)

### Patterns
- RTL support (all pages)
- Shadow effects
- Border radius (rounded-md, rounded-lg, rounded-xl)
- Hover states
- Transition animations

