# MEHREBARAN - COMPREHENSIVE FRONTEND STRUCTURE & COMPONENT ARCHITECTURE

## Project Overview

This is a **monorepo** with multiple frontend packages:
- **Web Package**: Next.js 13+ application (Main public/network application)
- **Dashboard Package**: React admin dashboard with React Router

---

## 1. WEB PACKAGE - MAIN FRONTEND (Next.js 13+ App Router)

### Directory Structure
```
/packages/web/src/
├── app/                          # Next.js App Router
├── components/                   # Reusable React components
├── contexts/                     # Context providers (Auth, etc.)
├── hooks/                        # Custom hooks
├── services/                     # API service layer
├── types/                        # TypeScript types
├── utils/                        # Utility functions
├── lib/                          # Library configurations
└── fakeData/                     # Mock data
```

---

## 2. ROUTING STRUCTURE & PAGES

### App Router Structure (Next.js 13+)

#### Root Layout
- **File**: `/app/layout.tsx`
- **Type**: Server Component (Root Layout)
- **Props**:
  - `children: React.ReactNode`
- **Features**:
  - Global fonts (Geist Sans & Mono)
  - AuthProvider wrapper
  - ClientSideEffect hook
  - Header & Footer components
  - RTL direction
  - Metadata configuration

#### Public Pages (Accessible without authentication)

| Page Path | File | Component Type | Purpose |
|-----------|------|----------------|---------|
| `/` | `/app/page.tsx` | Server Component | Home page with hero, projects, news sections |
| `/login` | `/app/login/page.tsx` | Client Component | User login form |
| `/signup` | `/app/signup/page.tsx` | Client Component | User registration (2-step form) |
| `/about-us` | `/app/about-us/page.tsx` | Client Component | About organization page |
| `/projects` | `/app/projects/page.tsx` | Page | Projects listing |
| `/projects/active` | `/app/projects/active/page.tsx` | Page | Active projects |
| `/projects/active/[id]` | `/app/projects/active/[id]/page.tsx` | Page | Active project details |
| `/projects/completed` | `/app/projects/completed/page.tsx` | Page | Completed projects |
| `/projects/[slug]` | `/app/projects/[slug]/page.tsx` | Page | Project details by slug |
| `/news` | `/app/news/page.tsx` | Page | News listing |
| `/news/[id]` | `/app/news/[id]/page.tsx` | Page | News article details |
| `/blog` | `/app/blog/page.tsx` | Page | Blog hub |
| `/blog/articles` | `/app/blog/articles/page.tsx` | Page | Articles listing |
| `/blog/articles/[id]` | `/app/blog/articles/[id]/page.tsx` | Page | Article details |
| `/blog/gallery` | `/app/blog/gallery/page.tsx` | Page | Gallery listing |
| `/blog/gallery/[id]` | `/app/blog/gallery/[id]/page.tsx` | Page | Gallery item details |
| `/blog/videos` | `/app/blog/videos/page.tsx` | Page | Videos listing |
| `/blog/videos/[id]` | `/app/blog/videos/[id]/page.tsx` | Page | Video details |
| `/faqs` | `/app/faqs/page.tsx` | Page | FAQs |
| `/focus` | `/app/focus/page.tsx` | Page | Focus/Interactive page |
| `/contact-us` | `/app/contact-us/page.tsx` | Page | Contact page |

#### Protected Pages (Requires Authentication)

| Page Path | File | Component Type | Protection | Purpose |
|-----------|------|----------------|-----------|---------|
| `/network` | `/app/network/page.tsx` | Client + ProtectedRoute | Yes | Needs network feed |
| `/network/[id]` | `/app/network/[id]/page.tsx` | Page | Yes | Profile/User details |
| `/network/[id]/[slug]` | `/app/network/[id]/[slug]/page.tsx` | Page | Yes | Nested user content |
| `/network/explore` | `/app/network/explore/page.tsx` | Page | Yes | Discover needs |
| `/network/trending` | `/app/network/trending/page.tsx` | Page | Yes | Trending needs |
| `/network/tags` | `/app/network/tags/page.tsx` | Page | Yes | Tag browsing |
| `/network/teams` | `/app/network/teams/page.tsx` | Page | Yes | Teams listing |
| `/network/teams/[id]` | `/app/network/teams/[id]/page.tsx` | Page | Yes | Team details |
| `/network/needs/[id]` | `/app/network/needs/[id]/page.tsx` | Client Component | Yes | Need details page |
| `/network/stories` | `/app/network/stories/page.tsx` | Page | Yes | Stories feed |
| `/network/leaderboard` | `/app/network/leaderboard/page.tsx` | Client Component | Yes | Gamification leaderboard |
| `/network/profile` | `/app/network/profile/page.tsx` | Page | Yes | User profile |
| `/network/notifications` | `/app/network/notifications/page.tsx` | Page | Yes | Notifications |
| `/network/users/[id]` | `/app/network/users/[id]/page.tsx` | Page | Yes | User profile view |

---

## 3. COMPONENT HIERARCHY

### Layout Components

#### Header Components
```
Header (Client Component)
├── props: (none)
├── state:
│   ├── scrolled: boolean (scroll detection)
│   ├── open: boolean (mobile menu toggle)
│   └── pathname: string (current route)
│
├── Sub-components:
│   ├── Search (Client Component)
│   │   └── props: { onSearch: (term) => void, className?: string }
│   │
│   └── Navbar (Client Component)
│       ├── props: { deviceSize: "mobile" | "desktop" }
│       ├── mainMenuItems: MenuItem[] (home page links)
│       └── networkMenuItems: MenuItem[] (network page links)
│
└── Features:
    ├── Dynamic header colors (mblue/morange based on page)
    ├── Responsive menu (desktop vs mobile)
    ├── Logo with blur placeholder
    ├── Scroll-aware styling
    └── Search bar integration
```

#### Footer Components
```
Footer (Client Component)
├── Sub-components:
│   ├── SocialMedia
│   ├── Menu
│   ├── License
│   ├── Codabiat
│   └── Wave (SVG animation)
│
├── Features:
│   ├── Dynamic colors (mblue/morange based on page)
│   ├── Social media links
│   ├── Navigation menu
│   ├── Wave animation
│   └── License information
│
└── Props:
    └── pathname detection for styling
```

#### Other Layout Components
- **Container** - Wrapper component for content
- **DashboardLayout** (Dashboard package) - Admin layout with Sidebar + Header

---

### Home Page Components

#### Home Page Structure (`/app/page.tsx`)
Server-side data fetching with sections:

```
Home (Server Component)
├── Data Fetched:
│   ├── heroSettings (IHomePageHeroSetting)
│   ├── projects (active, limit: 3)
│   └── news (limit: 8)
│
├── Sub-components:
│   ├── HeroSection
│   │   └── props: { settings: IHomePageHeroSetting }
│   │
│   ├── WhatWeDidSection
│   │   ├── Shows statistics of work done
│   │   └── Static component
│   │
│   ├── RunningProjectsSection
│   │   ├── props: { projects: IProject[] }
│   │   ├── Features:
│   │   │   ├── SmartSwiper for carousel
│   │   │   ├── ProgressBars
│   │   │   └── DonationProgress
│   │   │
│   │   └── Sub-components:
│   │       ├── DonationProgress
│   │       │   └── Shows current/target progress
│   │       │
│   │       └── ProgressBars
│   │           └── Visualizes donation metrics
│   │
│   ├── NewsSection
│   │   ├── props: { newsItems: INews[] }
│   │   ├── Features: SmartSwiper carousel
│   │   └── Uses Card component
│   │
│   ├── BlogSection
│   │   └── Static content section
│   │
│   └── AreasOfActivitySection
│       ├── Interactive diagram
│       ├── AreaItem components
│       ├── Line components
│       └── InteractiveDiagram
```

---

### Shared UI Components (Reusable)

#### Smart Button Component
```typescript
// File: /components/ui/SmartButton.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "mblue" | "mgray" | "morange";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asLink?: boolean;
  href?: string;
  className?: string;
}
```

**Features**:
- Multiple variants (color schemes)
- Multiple sizes
- Icon support (left & right)
- Can render as Link or Button
- Full width option
- Disabled state
- Tailwind styling with clsx

---

#### Card Component
```typescript
// File: /components/shared/Card.tsx
type CardItem = (INews | IArticle | IProject | IVideo | IGallery) & {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
};

interface CardProps {
  cardItem?: CardItem;
  horizontal?: boolean;
  page?: "news" | "articles" | "projects" | "videos" | "galleries";
}
```

**Features**:
- Horizontal/Vertical layout
- Featured image with optimization
- Title and excerpt
- "Learn more" button
- Type-safe for multiple content types
- Shadow & border effects

---

#### OptimizedImage Component
```typescript
// File: /components/ui/OptimizedImage.tsx
type SmartImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: "up" | "down";
  rounded?: boolean;
  className?: string;
  sizes?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
};
```

**Features**:
- Next.js Image optimization
- Lazy loading
- Priority control
- Blur placeholder
- Responsive sizing
- Object cover styling

---

#### Pagination Component
```typescript
// File: /components/ui/Pagination.tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
}
```

**Features**:
- URL-based navigation
- Smart page number display
- Previous/Next buttons
- Works with search params

---

#### Loading Component
```typescript
// File: /components/ui/Loading.tsx
// Placeholder component (minimal implementation)
```

---

### SmartSwiper Component (Carousel)
```typescript
// File: /components/ui/swiper/SmartSwiper.tsx
interface SmartSwiperProps {
  items: React.ReactNode[];
  slidesPerView?: number;
  spaceBetween?: number;
  loop?: boolean;
  autoplay?: boolean | { delay: number; disableOnInteraction?: boolean };
  showNavigation?: boolean;
  showPagination?: boolean;
  centeredSlides?: boolean;
  grabCursor?: boolean;
  breakpoints?: { [width: number]: { slidesPerView: number; spaceBetween?: number } };
  onSlideChange?: (swiper: any) => void;
  onSwiper?: (swiper: any) => void;
  outsideBtn?: boolean;
}
```

**Features**:
- Swiper.js integration
- Responsive breakpoints
- Navigation arrows
- Pagination dots
- Autoplay support
- Mobile-friendly

---

### Network/Needs Components

#### NeedCard Component
```typescript
// File: /components/network/NeedCard.tsx
interface NeedCardProps {
  need: INeed;
  variant?: "feed" | "compact";
  onUpdate?: () => void;
}
```

**Features**:
- Two layout variants (feed/compact)
- User info with avatar
- Title, description, tags
- Progress bar (if target amount set)
- Like/Follow toggle buttons
- Optimistic updates
- Trending badge
- Image gallery
- Team info display

**State Management**:
- `isLiked`: boolean
- `likesCount`: number
- `isFollowing`: boolean

**Actions**:
- `handleLike()` - Like/unlike with optimistic update
- `handleFollow()` - Follow/unfollow with optimistic update

---

#### TeamCard Component
```typescript
// File: /components/network/TeamCard.tsx
interface TeamCardProps {
  team: ITeam;
  variant?: "card" | "compact";
  onUpdate?: () => void;
}
```

**Features**:
- Card and compact variants
- Team name, description, tags
- Status badge (active/paused/completed/disbanded)
- Member count (active/total)
- Tasks completed counter
- Contribution score
- Member avatars (preview with +X more)
- Focus area translation
- Join button

---

#### TaskCard Component
```typescript
// File: /components/network/TaskCard.tsx
interface TaskCardProps {
  task: ITask;
  needId: string;
  onUpdate?: () => void;
  isDraggable?: boolean;
}
```

**Features**:
- Status badge (pending/in_progress/review/completed/blocked)
- Priority indicator (color-coded icons)
- Progress bar
- Checklist tracking (X/Y items)
- Assigned to (user info)
- Deadline with countdown
- Blocking reason (if blocked)
- Status transition actions
- Metadata (estimated hours, dependencies)

---

### Comment Component
```typescript
// File: /components/shared/Comment.tsx
interface CommentProps {
  postId: string;
  postType: "News" | "Article" | "Video" | "Gallery";
}
```

**Features**:
- Comment list display
- Comment count
- Guest comment form (name, email, content)
- Loading state
- Form validation
- Success/error messages
- Date formatting (Persian)

---

### Gamification Components

#### LeaderboardTable Component
```typescript
// File: /components/gamification/LeaderboardTable.tsx
interface LeaderboardTableProps {
  entries: ILeaderboardEntry[];
  currentUserId?: string;
  variant?: "default" | "compact";
  showLevel?: boolean;
  showBadge?: boolean;
}
```

**Features**:
- Two variants (table/compact list)
- Rank display with medals (🥇🥈🥉)
- User avatar and info
- Level display
- Badge display
- Score formatting (M/K abbreviations)
- Highlight current user
- Responsive design

---

#### AchievementCard Component
```typescript
// File: /components/gamification/AchievementCard.tsx
interface AchievementCardProps {
  badge: IBadge | IUserBadge;
  earned?: boolean;
  earnedAt?: Date;
  progress?: number;
  variant?: "card" | "compact";
}
```

**Features**:
- Tier colors (bronze/silver/gold/platinum/diamond)
- Card and compact variants
- Badge icon, name, description
- Progress bar (if not earned)
- Earned date display
- Points reward display
- Category info

---

#### PointsDisplay & LevelBadge Components
- **PointsDisplay**: Shows user points with star icon
- **LevelBadge**: Displays user level

---

### Social Components

#### UserCard Component
```typescript
// File: /components/social/UserCard.tsx
interface UserCardProps {
  user: {
    _id: string;
    name: string;
    avatar?: string;
    level?: number;
    followersCount?: number;
    followingCount?: number;
  };
  currentUserId?: string;
  initialFollowState?: boolean;
  variant?: "card" | "compact" | "list";
  onFollowChange?: () => void;
}
```

**Features**:
- Three layout variants (card/compact/list)
- User avatar (initials or image)
- Name and level display
- Followers/following counts
- Follow/Unfollow button
- Edit profile button (if current user)
- Optimistic follow state updates

---

### Stories Components

#### StoryCard Component
```typescript
// File: /components/stories/StoryCard.tsx
interface StoryCardProps {
  story: IStory;
  hasUnviewed?: boolean;
  onClick?: () => void;
}
```

**Features**:
- Story preview (image/video/text)
- User avatar overlay
- Time ago display
- Unviewed indicator (ring animation)
- Video play button
- Expired overlay
- Type-specific handling

---

#### StoryViewer Component
- Component for displaying stories in fullscreen/modal view

---

### Discovery & Notifications

#### SuggestedSection Component
- Suggests users/needs to follow

#### NotificationBadge & NotificationItem
- Badge counter
- Notification list items

---

### Auth Components

#### ProtectedRoute Component
```typescript
// File: /components/auth/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}
```

**Features**:
- Checks authentication via useAuth hook
- Redirects to login if not authenticated
- Loading skeleton while checking
- Customizable redirect path

---

## 4. AUTHENTICATION & CONTEXT

### AuthContext (`/contexts/AuthContext.tsx`)

**Type Definition**:
```typescript
interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  sendOtp: (mobile: string) => Promise<void>;
  verifyOtp: (data: OtpData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}
```

**Features**:
- User state management
- Token persistence (localStorage)
- Initial user fetch on mount
- OTP-based authentication support
- Password-based authentication
- Logout with cleanup
- User refresh capability

**Custom Hook**:
```typescript
export const useAuth = (): AuthContextType => {
  // Must be used within AuthProvider
}
```

---

## 5. SERVICES LAYER

### Service Pattern
All services follow a singleton pattern with error handling and TypeScript types.

### Core Services

#### Authentication Service
```typescript
// /services/auth.service.ts
export interface LoginCredentials {
  mobile: string;
  password: string;
}

export interface SignupData {
  mobile: string;
  name: string;
  password: string;
  nationalId?: string;
  major?: string;
  yearOfAdmission?: string;
}

export interface OtpData {
  mobile: string;
  code: string;
}

class AuthService {
  public login(credentials: LoginCredentials): Promise<any>
  public signup(data: SignupData): Promise<any>
  public sendOtp(mobile: string): Promise<void>
  public verifyOtp(data: OtpData): Promise<any>
  public logout(): void
  public getCurrentUser(): Promise<IUser>
  public getToken(): string | null
  public setToken(token: string): void
}
```

---

#### Need Service
```typescript
// /services/need.service.ts
class NeedService {
  // CRUD Operations
  public async getNeeds(params?: GetNeedsParams): Promise<GetNeedsResponse>
  public async getNeedById(id: string): Promise<INeed>
  public async createNeed(data: CreateNeedData): Promise<INeed>
  public async updateNeed(id: string, data: Partial<CreateNeedData>): Promise<INeed>
  public async deleteNeed(id: string): Promise<void>

  // Interactions
  public async followNeed(id: string): Promise<void>
  public async unfollowNeed(id: string): Promise<void>
  public async likeNeed(id: string): Promise<void>
  public async unlikeNeed(id: string): Promise<void>

  // Filtering
  public async getTrendingNeeds(params?: GetNeedsParams): Promise<GetNeedsResponse>
  public async getPopularNeeds(params?: GetNeedsParams): Promise<GetNeedsResponse>
  public async getUrgentNeeds(params?: GetNeedsParams): Promise<GetNeedsResponse>
  public async getNearbyNeeds(params?: GetNeedsParams & { lat?: number; lng?: number; radius?: number }): Promise<GetNeedsResponse>
  public async getMyNeeds(params?: GetNeedsParams): Promise<GetNeedsResponse>

  // Updates & Milestones
  public async getUpdates(needId: string): Promise<any[]>
  public async createUpdate(needId: string, data: { title: string; content: string; images?: string[] }): Promise<any>
  public async updateUpdate(needId: string, updateId: string, data: { title?: string; content?: string; images?: string[] }): Promise<any>
  public async deleteUpdate(needId: string, updateId: string): Promise<void>

  public async getMilestones(needId: string): Promise<any[]>
  public async createMilestone(needId: string, data: { title: string; description?: string; targetAmount?: number; deadline?: Date }): Promise<any>

  // Budget Management
  public async getBudgetItems(needId: string): Promise<any[]>
  public async createBudgetItem(needId: string, data: { category: string; description?: string; amount: number }): Promise<any>

  // Comments
  public async getComments(needId: string): Promise<any[]>
  public async createComment(needId: string, content: string, parentId?: string): Promise<any>
  public async updateComment(needId: string, commentId: string, content: string): Promise<any>
  public async deleteComment(needId: string, commentId: string): Promise<void>

  // Supporters & Verification
  public async getSupporterDetails(needId: string): Promise<any[]>
  public async addContribution(needId: string, userId: string, data: { type: string; amount?: number; description?: string }): Promise<any>
  public async getVerificationRequests(needId: string): Promise<any[]>
  public async createVerificationRequest(needId: string, data: { type: string; documents?: string[]; notes?: string }): Promise<any>
}
```

**Key Parameters**:
```typescript
export interface GetNeedsParams {
  page?: number;
  limit?: number;
  skip?: number;
  category?: string;
  status?: string;
  priority?: NeedPriority;
  search?: string;
  sortBy?: string;
  tags?: string[];
  trending?: boolean;
}

export interface CreateNeedData {
  title: string;
  description: string;
  category?: string;
  priority?: NeedPriority;
  tags?: string[];
  targetAmount?: number;
  deadline?: Date;
  location?: { address: string; city: string; province: string; coordinates?: { latitude: number; longitude: number } };
  images?: string[];
}
```

---

#### Gamification Service
```typescript
// /services/gamification.service.ts
class GamificationService {
  public async getLeaderboard(category: string, period: string, limit?: number): Promise<ILeaderboardResponse>
  public async getUserBadges(userId: string): Promise<IUserBadge[]>
  public async getUserAchievements(userId: string): Promise<IAchievement[]>
  public async getUserLevel(userId: string): Promise<ILevel>
  public async getPoints(userId: string): Promise<number>
}

interface ILeaderboardEntry {
  rank: number;
  user: IUser;
  score: number;
  level: number;
  badge?: IBadge;
}

interface ILeaderboardResponse {
  entries: ILeaderboardEntry[];
  userEntry?: ILeaderboardEntry;
  totalParticipants: number;
}
```

---

#### Other Services Available
- **Comment Service**: `getCommentsByPost()`, `createComment()`
- **Social Service**: `followUser()`, `unfollowUser()`
- **Project Service**: `getProjects()`, `getProjectById()`
- **News Service**: `getNews()`
- **Article Service**: `getArticles()`, `getArticleById()`
- **Video Service**: `getVideos()`, `getVideoById()`
- **Gallery Service**: `getGalleries()`, `getGalleryById()`
- **Story Service**: `getStories()`, `isStoryExpired()`, `getStoryTimeAgo()`
- **Team Service**: `getTeams()`, `getTeamById()`
- **Task Service**: `updateTaskStatus()`, `completeTask()`
- **Notification Service**: `getNotifications()`
- **Discovery Service**: `getSuggestions()`
- **Setting Service**: `getSetting()`
- **Media Service**: Media upload handling

---

## 6. HOOKS

### Custom Hooks

#### useConvertNumbersToPersian
- Converts numbers to Persian (Farsi) numerals
- Used for date and number localization

---

## 7. UTILITIES

### Utility Functions

#### ClientSideEffect
- Runs client-side initialization logic
- Used in root layout

#### formatNumberHumanReadable
- Formats large numbers (1M, 2K, etc.)

#### handleSearch
- Search logic and utilities

---

## 8. DASHBOARD PACKAGE (Admin)

### Structure
```
/packages/dashboard/src/
├── App.tsx                          # Root component
├── routes/AppRoutes.tsx             # Route definitions
├── components/
│   └── layout/
│       ├── DashboardLayout.tsx      # Main layout
│       ├── Header.tsx               # Header
│       └── Sidebar.tsx              # Sidebar navigation
├── page/
│   ├── DashboardPage.tsx            # Home dashboard
│   ├── LoginPage.tsx                # Login
│   └── tags/
│       ├── TagsListPage.tsx         # Tags list
│       └── TagFormPage.tsx          # Tag form
├── context/
│   └── AuthContext.tsx              # Auth context (minimal)
├── api/
│   └── auth.service.ts              # Auth API calls
└── main.tsx                         # Entry point
```

### Routing (React Router)
```
/login                              # LoginPage
/                                   # DashboardLayout wrapper
├── /                               # DashboardPage (home)
└── /tags (commented out)           # TagsListPage
```

### Components

#### DashboardLayout
```typescript
// Wrapper with Sidebar + Header + Outlet
// RTL support
// Flexbox layout
```

#### Header
- Simple placeholder header with Arabic text

#### Sidebar
- Navigation links
- Dark background (gray-800)

---

## 9. TYPES & INTERFACES

### Common Types (`/types/types.ts`)

```typescript
interface MenuItem {
  label: string;
  href: string;
}

interface WhatWeDidType {
  title: string;
  numOfProject: number;
  icon: string;
  color: "mblue" | "mgray";
  href?: string;
  textColor: "black" | "white";
}

interface RuningProjectsType {
  id: string;
  title: string;
  img: string;
  description: string;
}

interface DonationProjectsType {
  targetAmount: number;
  collectedAmount: number;
  targetVolunteer: number;
  collectedVolunteer: number;
  totalRaised: string;
  requiredVolunteers: string;
  deadLine?: number;
}

interface CardType {
  img: string;
  title: string;
  description: string;
  href: string;
}

interface AreasOfActivity {
  title: string;
  icon: string;
  description: string;
  color: "mblue" | "mgray";
  position: "top" | "bottom";
}

interface FAQsType {
  answer: string;
  question: string;
}

interface SigningDataForm1 {
  mobile: string;
}

interface SigningDataForm2 {
  name: string;
  major: string;
  yearOfAdmission: string;
  verificationCode: string;
  ID: string;
}

interface NeedsNetworkSectionsType {
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  link: "social-responsibility" | "volunteer-camps" | "effective-altruism" | "environment";
  subject: {
    title: string;
    description: string;
    comments: string[];
    images: string[];
    totalVote: number;
  }[];
}
```

---

## 10. API LAYER CONFIGURATION

### API Instance (`/lib/api.ts`)
- Axios wrapper
- Base URL configuration
- Token injection
- Error handling

---

## 11. STYLING & THEMING

### Tailwind Colors
- **mblue**: Primary blue color
- **morange**: Orange accent color
- **mgray**: Gray for borders/backgrounds
- Custom color scheme defined in tailwind config

### Font Classes
- Geist Sans (--font-geist-sans)
- Geist Mono (--font-geist-mono)

### Global Styles
- RTL (dir="rtl") for all pages
- Responsive design (mobile-first)

---

## 12. COMPONENT PROP PATTERNS

### Common Props Patterns

**Loading States**
```typescript
isLoading: boolean
error: string | null
```

**Action Props**
```typescript
onUpdate?: () => void
onFollowChange?: () => void
onSearch?: (term: string) => void
onSlideChange?: (swiper: any) => void
```

**Variant Props**
```typescript
variant?: "card" | "compact" | "list" | "feed"
```

**Display Control**
```typescript
showLevel?: boolean
showBadge?: boolean
showNavigation?: boolean
showPagination?: boolean
```

---

## 13. STATE MANAGEMENT PATTERNS

### Component State
- React's useState for local component state
- Optimistic updates for interactions
- useEffect for side effects

### Global State
- AuthContext for authentication
- Component props for passing data down

### Data Fetching
- Services for API calls
- useEffect hooks for loading data
- State variables for loading/error handling

---

## 14. FORM HANDLING

### Login Page Form
```typescript
{
  mobile: string;
  password: string;
}
```

**Validations**:
- Mobile required
- Password required
- Error messages

---

### Signup Page Form (2-Step)
**Step 1**:
```typescript
{
  mobile: string;
}
```

**Step 2**:
```typescript
{
  name: string (required);
  password: string (min 6 chars, required);
  confirmPassword: string (must match password, required);
  nationalId: string (optional);
  major: string (optional);
  yearOfAdmission: string (optional);
}
```

**Validations**:
- Password match
- Minimum length
- All required fields
- Error messaging

---

### Need Creation Form
```typescript
{
  title: string;
  description: string;
  category?: string;
  priority?: NeedPriority;
  tags?: string[];
  targetAmount?: number;
  deadline?: Date;
  location?: { address, city, province, coordinates };
  images?: string[];
}
```

---

### Comment Form
```typescript
{
  content: string (required);
  guestName: string (required);
  guestEmail: string (required);
  postId: string;
  postType: "News" | "Article" | "Video" | "Gallery";
  parentId?: string (for replies);
}
```

---

## 15. KEY FEATURES & INTERACTIONS

### Optimistic Updates
Used in:
- NeedCard (like/follow)
- UserCard (follow)
- TaskCard (status changes)
- Social actions

Pattern:
1. Update UI immediately
2. Call API
3. Revert if error occurs

### Debouncing
- Search input (500ms delay)

### RTL Support
- All pages have `dir="rtl"`
- Flexbox ordering adjusted
- Text alignment adjusted

### Responsive Breakpoints
- Mobile (< 640px)
- Tablet (640px - 1024px)
- Desktop (> 1024px)

### Dark/Light Mode
- Not implemented
- Consistent color scheme throughout

### Accessibility
- ARIA labels on buttons
- Semantic HTML
- Focus states
- Image alt texts

---

## 16. SPECIAL COMPONENTS

### Media Uploader
- File upload handling
- Image/video support

### Video Player
- Video playback component
- Media integration

### Interactive Diagram
- Areas of activity visualization
- Interactive elements

### AppleWatchDock
- Custom dock-like UI component
- Focus page feature

---

## SUMMARY

This is a **comprehensive Next.js 13+ application** with:

- **40+ Pages** covering home, blog, projects, network features
- **50+ Reusable Components** organized by feature area
- **15+ Services** for API communication
- **Complete Authentication System** with OTP & password support
- **Gamification Features** (leaderboards, badges, achievements)
- **Social Features** (follow, likes, comments)
- **Rich Content Management** (needs, teams, tasks, stories)
- **Responsive Design** with mobile-first approach
- **TypeScript** for type safety
- **Optimistic Updates** for better UX
- **Service Layer Pattern** for API abstraction
- **Context API** for global state
- **Tailwind CSS** for styling
- **Next.js 13+ App Router** for routing

**Key Architectural Decisions**:
1. Server components for static content (home page)
2. Client components for interactive features (network)
3. Protected routes for authenticated areas
4. Singleton service classes
5. Context + hooks for auth management
6. Component composition over inheritance
