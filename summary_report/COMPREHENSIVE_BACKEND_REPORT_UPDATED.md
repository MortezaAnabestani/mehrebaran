# COMPREHENSIVE BACKEND ROUTES, CONTROLLERS & API ENDPOINTS REPORT (UPDATED)

**Project**: Mehrebaran
**Type**: Node.js/Express with TypeScript
**Architecture**: Modular (MVC-based)
**Total Backend Code**: 18,000+ lines of TypeScript
**Last Updated**: January 1, 2026

---

## 📊 EXECUTIVE SUMMARY

### Current Statistics
- **Total Modules**: 32 (up from 30)
- **Total Route Files**: 39
- **Total Controllers**: 38
- **Total Models**: 46
- **Total API Endpoints**: 180+ (up from 150+)
- **Authentication Methods**: 3 (OTP, Password, JWT)
- **User Roles**: 3 (USER, ADMIN, SUPER_ADMIN)

### New Modules Added
Since the last documentation (November 2024), the following modules have been added:

1. **Donations Module** (13 endpoints) - Donation management with payment integration
2. **Volunteers Module** (11 endpoints) - Volunteer registration and management
3. **Focus Areas Module** (7 endpoints) - Project focus area categorization
4. **Search Module** (1 endpoint) - Global search functionality
5. **Admin Module** (22 endpoints) - Comprehensive admin dashboard and analytics
6. **Help Requests Module** (6 endpoints) - User help request system
7. **Bug Reports Module** (5 endpoints) - Bug tracking system
8. **Image Upload Center** (4 endpoints) - Centralized image management
9. **Tasks Module (Standalone)** (9 endpoints) - Personal task management

---

## TABLE OF CONTENTS
1. [API Infrastructure](#api-infrastructure)
2. [Authentication & Middleware](#authentication--middleware)
3. [Complete API Endpoints by Module](#complete-api-endpoints-by-module)
4. [New Modules Documentation](#new-modules-documentation)
5. [Controllers Overview](#controllers-overview)
6. [Request/Response Validation](#requestresponse-validation)
7. [API Map Summary](#api-map-summary)

---

## API INFRASTRUCTURE

### Base Configuration
- **Framework**: Express 5.1.0
- **Base URL**: `/api/v1`
- **CORS**: Enabled (origins: localhost:5173, localhost:3000, localhost:127.0.0.1:5173)
- **CORS Credentials**: Enabled
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
- Configures CORS with specific origins
- Sets up body parsers
- Mounts all 32 module routes
- Serves static files
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

---

### 2. USERS MODULE
**Base Route**: `/api/v1/users`
**File**: `modules/users/user.routes.ts`

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/me` | Required | All | Get authenticated user profile |
| GET | `/` | Required | ADMIN, SUPER_ADMIN | Get all users |
| GET | `/:id` | Required | All | Get user by ID |

---

### 3. NEEDS MODULE (Complex)
**Base Route**: `/api/v1/needs`
**File**: `modules/needs/need.routes.ts`

[All previous needs endpoints remain the same - 60+ endpoints]

---

### 4. **DONATIONS MODULE** ⭐ NEW
**Base Route**: `/api/v1/donations`
**File**: `modules/donations/donation.routes.ts`

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| POST | `/` | None | All | Create donation (guest or authenticated) |
| GET | `/all` | Required | ADMIN | Get all donations (admin view) |
| GET | `/project/:projectId` | None | All | Get donations for a project |
| GET | `/project/:projectId/stats` | None | All | Get project donation statistics |
| GET | `/project/:projectId/donors` | None | All | Get recent donors list |
| POST | `/:donationId/pay` | None | All | Initiate online payment |
| GET | `/:donationId/verify` | None | All | Verify payment callback |
| GET | `/user/my-donations` | Required | All | Get user's donation history |
| POST | `/:donationId/upload-receipt` | Required | All | Upload payment receipt |
| PATCH | `/:donationId/verify` | Required | ADMIN | Verify bank transfer |
| DELETE | `/:id` | Required | ADMIN | Delete donation |
| GET | `/:identifier` | None | All | Get donation by ID or tracking code |

**Features**:
- Guest and authenticated donations
- Online payment integration
- Bank transfer support with receipt upload
- Donation tracking with unique codes
- Real-time donation statistics
- Admin verification workflow

---

### 5. **VOLUNTEERS MODULE** ⭐ NEW
**Base Route**: `/api/v1/volunteers`
**File**: `modules/volunteers/volunteer.routes.ts`

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/all` | Required | ADMIN | Get all volunteer registrations |
| GET | `/project/:projectId` | None | All | Get volunteers for a project |
| GET | `/project/:projectId/stats` | None | All | Get volunteer statistics |
| GET | `/project/:projectId/active` | None | All | Get active volunteers |
| POST | `/register` | Required | All | Register as volunteer |
| GET | `/my-registrations` | Required | All | Get user's registrations |
| POST | `/:id/withdraw` | Required | All | Withdraw from volunteering |
| PATCH | `/:id` | Required | ADMIN | Update registration |
| PATCH | `/:id/approve` | Required | ADMIN | Approve volunteer |
| PATCH | `/:id/reject` | Required | ADMIN | Reject volunteer |
| DELETE | `/:id` | Required | ADMIN | Delete registration |
| GET | `/:id` | Required | All | Get specific registration |

**Features**:
- Project-based volunteer registration
- Approval workflow
- Withdrawal system
- Active volunteer tracking
- Statistics and reporting

---

### 6. **FOCUS AREAS MODULE** ⭐ NEW
**Base Route**: `/api/v1/focus-areas`
**File**: `modules/focus-areas/focus-area.routes.ts`

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/` | None | All | Get all focus areas |
| GET | `/:id` | None | All | Get focus area by ID |
| POST | `/` | Required | ADMIN | Create focus area |
| PATCH | `/:id` | Required | ADMIN | Update focus area |
| DELETE | `/:id` | Required | SUPER_ADMIN | Delete focus area |
| PATCH | `/reorder` | Required | ADMIN | Reorder focus areas |
| PATCH | `/:id/toggle-active` | Required | ADMIN | Toggle active status |

**Features**:
- Categorize projects by focus areas
- Ordering support
- Active/inactive toggling
- Public read access

---

### 7. **SEARCH MODULE** ⭐ NEW
**Base Route**: `/api/v1/search`
**File**: `modules/search/search.routes.ts`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | None | Global search across all content |

**Features**:
- Cross-model search capability
- Searches needs, projects, articles, users, etc.
- No authentication required
- Query parameter-based filtering

---

### 8. **ADMIN MODULE** ⭐ NEW
**Base Route**: `/api/v1/admin`
**File**: `modules/admin/admin.routes.ts`

#### Admin Management
| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/all` | Required | ADMIN | Get all admin users |
| GET | `/one/:id` | Required | ADMIN | Get admin by ID |
| POST | `/create` | Required | SUPER_ADMIN | Create new admin (with avatar upload) |
| PATCH | `/:id` | Required | ADMIN | Update admin (with avatar upload) |
| DELETE | `/:id` | Required | SUPER_ADMIN | Delete admin |

#### Dashboard Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard/overview` | Required (ADMIN) | Dashboard overview with stats/KPIs |
| GET | `/dashboard/trending-needs` | Required (ADMIN) | Get trending needs |
| GET | `/dashboard/active-users` | Required (ADMIN) | Active users statistics |
| GET | `/dashboard/donation-progress` | Required (ADMIN) | Donation progress metrics |

#### Analytics Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/analytics/content` | Required (ADMIN) | Content analytics (needs, stories, comments) |
| GET | `/analytics/users` | Required (ADMIN) | User analytics (growth, activity, engagement) |
| GET | `/analytics/engagement` | Required (ADMIN) | Engagement analytics (views, reactions, follows, shares) |
| GET | `/analytics/views` | Required (ADMIN) | Site views analytics |

#### Moderation Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/moderation/needs` | Required (ADMIN) | Get needs requiring moderation |
| PUT | `/moderation/needs/bulk-status` | Required (ADMIN) | Bulk update needs status |
| GET | `/moderation/comments` | Required (ADMIN) | Get comments requiring moderation |
| GET | `/moderation/donations` | Required (ADMIN) | Get donations requiring moderation |
| PUT | `/moderation/donations/:donationId/status` | Required (ADMIN) | Update donation status |

#### Activity Feed
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/activity-feed` | Required (ADMIN) | Recent activities across platform |

**Features**:
- Comprehensive admin management
- Real-time dashboard with KPIs
- Advanced analytics and reporting
- Content moderation tools
- Bulk operations support
- Activity tracking

---

### 9. **HELP REQUESTS MODULE** ⭐ NEW
**Base Route**: `/api/v1/help-requests`
**File**: `modules/help-requests/help-request.routes.ts`

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| POST | `/` | None | All | Submit help request (with media upload, up to 5 images) |
| GET | `/` | Required | ADMIN | Get all help requests |
| GET | `/stats` | Required | ADMIN | Get help request statistics |
| GET | `/:id` | Required | ADMIN | Get help request by ID |
| PATCH | `/:id/status` | Required | ADMIN | Update request status |
| DELETE | `/:id` | Required | ADMIN | Delete help request |

**Features**:
- Public submission (no auth required)
- Multi-image upload support (up to 5)
- Status tracking workflow
- Admin-only access to view/manage
- Statistics dashboard

---

### 10. **BUG REPORTS MODULE** ⭐ NEW
**Base Route**: `/api/v1/bug-reports`
**File**: `modules/bug-reports/bug-report.routes.ts`

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| POST | `/` | None | All | Submit bug report (with screenshots, up to 5) |
| GET | `/` | Required | ADMIN | Get all bug reports |
| GET | `/:id` | Required | ADMIN | Get bug report by ID |
| PATCH | `/:id/status` | Required | ADMIN | Update bug status |
| DELETE | `/:id` | Required | ADMIN | Delete bug report |

**Features**:
- Public bug submission
- Screenshot upload support (up to 5)
- Status management
- Admin tracking and resolution workflow

---

### 11. **IMAGE UPLOAD CENTER** ⭐ NEW
**Base Route**: `/api/v1/imageUploadCenter`
**File**: `modules/image-upload-center/image-upload-center.routes.ts`

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| POST | `/` | Required | ADMIN | Upload image with auto-processing |
| GET | `/` | Required | All | Get all uploaded images |
| GET | `/:id` | Required | All | Get image by ID |
| DELETE | `/:id` | Required | ADMIN | Delete image |

**Features**:
- Centralized image storage
- Auto-resize and optimization
- Admin-only upload
- Authenticated read access

---

### 12. **TASKS MODULE (STANDALONE)** ⭐ NEW
**Base Route**: `/api/v1/tasks`
**File**: `modules/tasks/task.routes.ts`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/stats` | Required | Get task statistics |
| GET | `/today` | Required | Get today's tasks |
| GET | `/overdue` | Required | Get overdue tasks |
| GET | `/date-range` | Required | Get tasks by date range |
| GET | `/` | Required | Get all user tasks |
| POST | `/` | Required | Create new task |
| GET | `/:id` | Required | Get task by ID |
| PATCH | `/:id` | Required | Update task |
| DELETE | `/:id` | Required | Delete task |

**Features**:
- Personal task management (separate from need-related tasks)
- Date-based filtering
- Overdue task tracking
- Statistics and analytics
- All routes require authentication

---

### EXISTING MODULES (UNCHANGED)

The following modules remain as documented in the previous report:

- **Comments Module** (5 endpoints)
- **Social Module** (27 endpoints) - Follow, Mentions, Tags, Shares
- **Discovery Module** (16 endpoints) - Leaderboards, Trending, Recommendations
- **Notifications Module** (14 endpoints)
- **Stories Module** (17 endpoints)
- **Media Module** (8 endpoints)
- **Gamification Module** (14 endpoints)
- **Teams Module** (10 endpoints)
- **Team Invitations** (2 endpoints)
- **Categories Module** (5 endpoints)
- **Need Categories** (4 endpoints)
- **Blog/Articles** (6 endpoints)
- **Blog/Videos** (6 endpoints)
- **Blog/Gallery** (6 endpoints)
- **Blog/Featured Items** (2 endpoints)
- **News Module** (6 endpoints)
- **FAQs Module** (5 endpoints)
- **Projects Module** (7 endpoints)
- **Tags Module** (4 endpoints)
- **Authors Module** (5 endpoints)
- **Settings Module** (2 endpoints)
- **Upload Module** (2 endpoints)
- **Public Upload** (1 endpoint)
- **Health Check** (1 endpoint)

---

## SUMMARY STATISTICS (UPDATED)

- **Total Route Files**: 39 (was 30)
- **Total Controller Files**: 38 (was 29)
- **Total Middleware**: 2 core + 2 module-specific
- **Total Validation Schemas**: 30+
- **Total Endpoints**: 180+ (was 150+)
- **Lines of Code**: ~18,000 (was ~15,000)
- **Authentication Methods**: 3
- **User Roles**: 3 (USER, ADMIN, SUPER_ADMIN)
- **New Modules Since Last Update**: 9

---

## KEY CHANGES FROM PREVIOUS VERSION

### Module Additions
1. **Donations** - Complete payment and donation tracking system
2. **Volunteers** - Volunteer management with approval workflow
3. **Focus Areas** - Project categorization
4. **Search** - Global search functionality
5. **Admin** - Comprehensive admin dashboard and analytics
6. **Help Requests** - User support ticket system
7. **Bug Reports** - Bug tracking system
8. **Image Upload Center** - Centralized image management
9. **Tasks** - Personal task management

### Infrastructure Updates
- CORS now explicitly configured with specific origins and credentials
- Enhanced image upload capabilities across modules
- Improved moderation tools in admin module
- Better analytics and reporting capabilities

### Endpoint Count Growth
- Previous: ~150 endpoints
- Current: ~180 endpoints
- Increase: +30 endpoints (+20%)

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

**Generated**: January 1, 2026
**Project**: Mehrebaran Backend API v1.2.0
**Last Updated**: ۱۱ دی ۱۴۰۴
**Previous Version**: November 11, 2024 (۲۱ آبان ۱۴۰۴)
