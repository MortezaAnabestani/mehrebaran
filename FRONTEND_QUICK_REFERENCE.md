# FRONTEND QUICK REFERENCE GUIDE

## Two Main Frontend Applications

### 1. WEB PACKAGE (Main Application)
- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Location**: `/packages/web/src/`
- **Key Features**: Public pages, network features, gamification, social features

### 2. DASHBOARD PACKAGE (Admin)
- **Framework**: React + React Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Location**: `/packages/dashboard/src/`
- **Key Features**: Admin interface for content management

---

## WEB PACKAGE QUICK STATS

| Metric | Count |
|--------|-------|
| Pages | 40+ |
| Components | 50+ |
| Services | 15+ |
| Protected Routes | 14+ |
| Public Routes | 20+ |
| Custom Hooks | 3+ |
| Utility Functions | 5+ |
| Types/Interfaces | 20+ |

---

## COMPONENT ORGANIZATION

```
/components/
├── auth/                      Auth protection
├── discovery/                 Discovery features
├── features/                  Feature-specific
│   ├── home/                  Home page sections
│   └── video/                 Video components
├── gamification/              Leaderboards, badges
├── layout/                    Header, footer
├── media/                     Media upload
├── network/                   Needs, teams, tasks
├── notifications/             Notifications
├── shared/                    Cards, comments, forms
├── social/                    User cards, profiles
├── stories/                   Story display
├── ui/                        Base components
└── views/                     Special views
```

---

## KEY COMPONENT VARIANTS

### Buttons
```
<SmartButton variant="mblue|mgray|morange" size="sm|md|lg" />
```

### Cards
```
<Card page="news|articles|projects|videos|galleries" horizontal={true|false} />
<NeedCard variant="feed|compact" />
<TeamCard variant="card|compact" />
<UserCard variant="card|compact|list" />
```

### Tables
```
<LeaderboardTable variant="default|compact" />
```

### Images
```
<OptimizedImage priority="up|down" fill={true|false} placeholder="blur|empty" />
```

---

## ROUTING QUICK MAP

### Authentication
```
/login           - Login form
/signup          - 2-step signup
```

### Public Content
```
/                - Home page (server component)
/about-us        - About page
/contact-us      - Contact page
/faqs            - FAQs
/focus           - Focus/interactive page
```

### Projects & News
```
/projects                  - Projects hub
/projects/active           - Active projects list
/projects/active/[id]      - Active project detail
/projects/completed        - Completed projects
/projects/[slug]          - Project detail by slug

/news                     - News list
/news/[id]               - News detail
```

### Blog
```
/blog                       - Blog hub
/blog/articles             - Articles list
/blog/articles/[id]        - Article detail
/blog/gallery              - Gallery list
/blog/gallery/[id]         - Gallery detail
/blog/videos               - Videos list
/blog/videos/[id]          - Video detail
```

### Protected - Network
```
/network                    - Main feed
/network/needs/[id]        - Need detail (with comments)
/network/explore           - Discover needs
/network/trending          - Trending needs
/network/tags              - Tag browsing
/network/teams             - Teams list
/network/teams/[id]        - Team detail
/network/stories           - Stories feed
/network/leaderboard       - Gamification leaderboard
/network/profile           - User profile
/network/notifications     - Notifications
/network/users/[id]        - User profile view
```

---

## FORM STRUCTURE

### Authentication Forms
- **Login**: Mobile + Password
- **Signup**: 2-step (Mobile → Details + Password)

### Content Forms
- **Need Creation**: Title, Description, Category, Priority, Tags, Target, Deadline, Location, Images
- **Comments**: Content, Guest Name, Guest Email, Parent ID (for replies)

---

## API SERVICES OVERVIEW

### Core Services
1. **Auth Service** - Login, signup, OTP, token management
2. **Need Service** - CRUD, trending, popular, nearby, updates, milestones, budget, comments
3. **Gamification Service** - Leaderboards, badges, achievements, levels, points
4. **Social Service** - Follow/unfollow users

### Content Services
5. **Project Service** - Projects listing and details
6. **News Service** - News articles
7. **Article Service** - Blog articles
8. **Video Service** - Video content
9. **Gallery Service** - Image galleries
10. **Story Service** - Story management
11. **Team Service** - Team management
12. **Task Service** - Task status management
13. **Comment Service** - Comment management
14. **Notification Service** - Notifications
15. **Media Service** - Media uploads
16. **Setting Service** - Settings retrieval
17. **Discovery Service** - Suggestions

---

## STATE MANAGEMENT

### Global (AuthContext)
```typescript
interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login(credentials): Promise<void>;
  signup(data): Promise<void>;
  logout(): void;
  // ... more
}
```

### Local Component State
- useState for component state
- useEffect for side effects
- Optimistic updates for better UX

---

## COMMON PATTERNS

### Optimistic Updates
```typescript
// 1. Update UI immediately
setIsLiked(!isLiked);

// 2. Call API
await needService.likeNeed(id);

// 3. Revert on error (if needed)
```

### Debounced Search
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    fetchNeeds(); // Called after 500ms delay
  }, 500);
  return () => clearTimeout(timer);
}, [searchQuery]);
```

### Protected Routes
```typescript
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

---

## TAILWIND CONFIGURATION

### Custom Colors
- `mblue` - Primary blue (#0066cc or similar)
- `morange` - Accent orange (#ff6600 or similar)
- `mgray` - Gray for backgrounds (#f0f0f0 or similar)

### Responsive Prefixes
- No prefix: Mobile-first
- `md:` - 640px and up (tablet)
- `lg:` - 1024px and up (desktop)

### Special Classes
- `dir="rtl"` - Right-to-left text direction
- `w-8/10` - 80% width
- `w-9/10` - 90% width

---

## TYPE DEFINITIONS

### Common Types
```typescript
// User types from common-types package
IUser
IComment
IPost
INeed
IProject
INews
IArticle
IVideo
IGallery
IStory
ITeam
ITask
ILeaderboardEntry
IBadge
```

### Service Parameters
```typescript
GetNeedsParams {
  page?: number;
  limit?: number;
  skip?: number;
  category?: string;
  status?: string;
  search?: string;
  tags?: string[];
}

CreateNeedData {
  title: string;
  description: string;
  category?: string;
  tags?: string[];
  targetAmount?: number;
  deadline?: Date;
  location?: { address, city, province };
  images?: string[];
}
```

---

## COMMON PROP PATTERNS

### Status Props
```typescript
isLoading: boolean
error: string | null
success: string | null
```

### Action Props
```typescript
onUpdate?: () => void
onFollow?: () => void
onChange?: (value) => void
onSearch?: (term: string) => void
```

### Variant Props
```typescript
variant?: "card" | "compact" | "list" | "feed"
```

### Control Props
```typescript
showLevel?: boolean
showBadge?: boolean
disabled?: boolean
fullWidth?: boolean
```

---

## FILE LOCATIONS QUICK MAP

| What | Where |
|------|-------|
| Components | `/components/**/*.tsx` |
| Pages | `/app/**/page.tsx` |
| Layouts | `/components/layout/` |
| Services | `/services/*.service.ts` |
| Context | `/contexts/*.tsx` |
| Types | `/types/types.ts` |
| Hooks | `/hooks/*.tsx` |
| Utils | `/utils/*.tsx` |
| Constants | Throughout components |
| Icons | `/public/icons/` |
| Images | `/public/images/` |

---

## HOOKS AVAILABLE

### Custom Hooks
- `useConvertNumbersToPersian()` - Number localization
- `useAuth()` - Authentication context hook

### Built-in Hooks Used
- `useState()` - Component state
- `useEffect()` - Side effects
- `useContext()` - Context consumption
- `useRouter()` - Navigation
- `usePathname()` - Current path
- `useSearchParams()` - Query params
- `useParams()` - Route params

---

## CSS/STYLING UTILITIES

### Text Utilities
- `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, etc.
- `font-bold`, `font-semibold`, `font-medium`
- `text-center`, `text-right`, `text-left`, `text-justify`

### Layout Utilities
- `flex`, `grid`, `absolute`, `relative`, `fixed`
- `flex-col`, `flex-row`, `justify-between`, `items-center`
- `gap-4`, `space-x-2`, `space-y-4`

### Color Utilities
- `bg-mblue`, `bg-morange`, `bg-mgray`
- `text-mblue`, `text-morange`, `text-mgray`
- `border-mblue`, `border-gray-200`

### Size Utilities
- `w-full`, `h-full`, `w-8/10`, `h-12`
- `p-4`, `px-6`, `py-3`, `m-2`

### Visual Effects
- `rounded-md`, `rounded-lg`, `rounded-xl`
- `shadow-sm`, `shadow-md`, `shadow-lg`
- `opacity-50`, `hover:opacity-80`
- `transition-all`, `duration-200`

---

## DEPLOYMENT CONSIDERATIONS

### Build Output
- Static exports for public pages
- Dynamic rendering for protected routes
- Image optimization with Next.js Image

### Environment Variables
- `NEXT_PUBLIC_API_URL` - API base URL

### Performance
- Image lazy loading
- Code splitting per route
- Server-side rendering for home page
- Client-side rendering for interactive pages

---

## TESTING STRATEGY

### Components to Test
- Form submissions (login, signup, needs)
- Protected route access
- Optimistic updates
- Service calls

### Test Tools
- Jest (unit tests)
- React Testing Library (component tests)
- Cypress/Playwright (e2e tests)

---

## DEBUGGING TIPS

### Common Issues
1. **Auth not persisting**: Check localStorage and token management
2. **Images not loading**: Verify image paths and Next.js Image setup
3. **RTL issues**: Ensure `dir="rtl"` is set correctly
4. **Styling not applied**: Clear Tailwind cache, verify color names

### Debug Tools
- Browser DevTools
- React DevTools extension
- Network tab for API calls
- Console for error messages

---

## DOCUMENTATION FILES CREATED

1. **FRONTEND_COMPREHENSIVE_STRUCTURE.md** - Detailed architecture document
2. **FRONTEND_COMPONENT_TREE.md** - Visual component hierarchy
3. **FRONTEND_QUICK_REFERENCE.md** - This file

---

## NEXT STEPS FOR DEVELOPERS

1. Read FRONTEND_COMPREHENSIVE_STRUCTURE.md for detailed documentation
2. Review FRONTEND_COMPONENT_TREE.md for visual hierarchy
3. Check specific service files for API integration patterns
4. Follow existing component patterns for new components
5. Use SmartButton, Card, and OptimizedImage as base components
6. Implement protected routes using ProtectedRoute component
7. Use AuthContext for authentication state

