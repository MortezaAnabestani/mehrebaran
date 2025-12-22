# BACKEND DOCUMENTATION INDEX

## Overview
This directory contains comprehensive documentation of the Mehrebaran backend API structure, routes, controllers, and endpoints.

---

## GENERATED DOCUMENTS

### 1. COMPREHENSIVE_BACKEND_REPORT.md (39 KB, 1,141 lines)
**Most Detailed Reference**

Complete technical documentation covering:
- API Infrastructure & Configuration
- Authentication & Middleware Systems (3 auth methods)
- All 31 Module Routes with Full Endpoint Tables
- Complete Controller Documentation (25+ controllers)
- Request/Response Validation Schemas (Zod)
- Error Handling & Status Codes
- Database Models Overview
- Deployment Configuration

**Best For**: Understanding architecture, debugging, integration development

### 2. API_ENDPOINT_SUMMARY.md (17 KB, 546 lines)
**Quick Reference Guide**

Visual and concise documentation covering:
- Complete Endpoint Tree Structure (formatted as ASCII tree)
- All 150+ endpoints organized hierarchically
- Authentication Flow Diagrams
- Middleware Chain Patterns
- Common API Patterns
- Status Codes Reference
- Query Parameters Support
- File Upload Specifications

**Best For**: Quick lookups, API testing, frontend integration

---

## QUICK STATISTICS

| Metric | Value |
|--------|-------|
| **Total Endpoints** | 150+ |
| **Route Files** | 31 modules |
| **Controller Classes** | 25+ |
| **Lines of Code** | 15,632+ (modules only) |
| **Authentication Methods** | 3 (OTP, Password, JWT) |
| **User Roles** | 3 (USER, ADMIN, SUPER_ADMIN) |
| **Middleware Types** | 6 (protect, restrictTo, isSupporter, validate, etc.) |
| **Content Types** | 30+ resource types |

---

## API ORGANIZATION BY CATEGORY

### Core Features
1. **Authentication** (5 endpoints)
   - OTP-based registration
   - Password-based login/signup
   - JWT token management

2. **Users** (3 endpoints)
   - User profiles
   - Admin user management

3. **Needs Platform** (60+ endpoints)
   - Create, list, update needs
   - Supporter management
   - Timeline/updates system
   - Milestones tracking
   - Budget management
   - Task management
   - Comments & discussion
   - Verification system

### Social Features
4. **Social Module** (27 endpoints)
   - Follow/unfollow users and needs
   - Mentions system
   - Tags & tag management
   - Share tracking
   - Engagement metrics

5. **Discovery** (16 endpoints)
   - Leaderboards (points-based)
   - Trending content
   - Personalized recommendations
   - Discovery feed

6. **Notifications** (14 endpoints)
   - Push notifications
   - Notification preferences
   - Notification grouping
   - Unread tracking

### Content Management
7. **Blog System** (20 endpoints)
   - Articles
   - Videos
   - Gallery
   - Featured items

8. **News & Updates** (6 endpoints)

9. **FAQs** (5 endpoints)

10. **Projects** (7 endpoints)

### Engagement Features
11. **Stories** (17 endpoints)
    - Story creation & sharing
    - Highlights/collections
    - Reactions & views

12. **Gamification** (14 endpoints)
    - Points system
    - Badges/achievements
    - Leaderboards
    - User statistics

13. **Teams** (12 endpoints)
    - Team management
    - Member roles
    - Invitations
    - Team statistics

14. **Media** (8 endpoints)
    - File uploads
    - Media management
    - Storage tracking
    - Download logging

### Collaboration
15. **Comments** (5 endpoints)

16. **Direct Messages** (9 endpoints)

17. **Supporter Communications** (4 endpoints)
    - Messages
    - Submissions
    - Reviews

18. **Polls** (3 endpoints)

### Administration
19. **Categories** (5 endpoints)

20. **Tags** (4 endpoints)

21. **Authors** (5 endpoints)

22. **Settings** (2 endpoints)

23. **Upload Management** (3 endpoints)

---

## ROUTING PATTERNS

### Public Endpoints (No Authentication)
- All GET endpoints for content (articles, news, etc.)
- Public leaderboards
- Trending feeds
- Tag searches
- User profiles

### Protected Endpoints (JWT Required)
- User dashboard
- Create/edit personal content
- Follow/unfollow operations
- Notification management
- Story creation

### Admin-Only Endpoints
- Content creation (articles, news, FAQs)
- Category/tag management
- Badge management
- Point awarding/deduction
- Settings modification

### Role-Based (ADMIN, SUPER_ADMIN)
- Full content management
- User administration
- System settings
- Verification reviews

### Supporter-Protected
- Direct messages
- Team operations
- Polls voting
- Submissions

---

## AUTHENTICATION METHODS

### Method 1: OTP (SMS Verification)
```
POST /auth/request-otp → GET code via SMS
POST /auth/verify-and-register → Create account
```

### Method 2: Password
```
POST /auth/signup → Create account
POST /auth/login → Authenticate
```

### Method 3: JWT Token
```
Header: Authorization: Bearer <token>
Used on all protected routes
```

---

## MIDDLEWARE STACK

### Core Middleware
1. **protect** - Verify JWT token (required auth)
2. **protectOptional** - Optional JWT verification
3. **restrictTo(...roles)** - Role-based access control
4. **isSupporter** - Supporter verification for needs
5. **validate(schema)** - Zod schema validation
6. **globalErrorHandler** - Centralized error handling

---

## DATA VALIDATION

### Framework: Zod
- Type-safe schema validation
- Request body, query, params validation
- Custom error messages (in Farsi)
- Returns 400 with detailed errors

### Common Validation Rules
- Mobile: Iranian format (09xxxxxxxxx)
- Password: Min 6 characters
- Name: Min 3 characters
- ID: 10 digits
- Dates: ISO 8601 format

---

## ERROR HANDLING

### Status Codes
- **200** - OK (GET, PATCH, DELETE success)
- **201** - Created (POST success)
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (missing/invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (resource doesn't exist)
- **409** - Conflict (duplicate field)
- **500** - Server Error

### Error Response Format
```json
{
  "message": "Error description",
  "errors": { "field": "error message" },
  "stack": "development mode only"
}
```

---

## FILE OPERATIONS

### Upload Endpoints
- `/api/v1/upload/single` - Single image (ADMIN)
- `/api/v1/upload/multiple` - Batch (up to 10 files)
- `/api/v1/public-upload` - Public attachments
- `/api/v1/media/upload` - General media upload

### Supported File Types
- **Images**: JPEG, PNG, GIF, WebP, SVG
- **Videos**: MP4, MPEG, WebM, QuickTime
- **Audio**: MP3, WAV, OGG
- **Documents**: PDF, Word, Excel, PowerPoint, TXT, JSON

### Limits
- **Max File Size**: 50MB per file
- **Max Batch Size**: 10 files
- **Total Storage**: User-based quota

---

## QUERY PARAMETERS

### Pagination
```
?limit=20&skip=0
?page=1
```

### Filtering
```
?category=xyz
?status=active
?type=need
?sort=createdAt
?sort=-updatedAt (descending)
```

### Leaderboard Parameters
```
?category=points  (points, comments, supporters, etc.)
?period=all_time  (all_time, monthly, weekly)
?limit=100        (top N users)
```

---

## RESPONSE EXAMPLES

### Success Response
```json
{
  "message": "Operation successful",
  "data": { /* resource data */ },
  "results": 25
}
```

### Paginated Response
```json
{
  "results": 20,
  "data": [ /* items */ ]
}
```

### Error Response
```json
{
  "message": "Validation failed",
  "errors": { "mobile": "Invalid format" }
}
```

---

## NESTED ROUTES (Needs Module)

The Needs module supports nested sub-resources:

```
/api/v1/needs/:needId/
├── messages/
├── direct-messages/
├── teams/
├── polls/
└── submissions/
```

Each uses merge params to maintain context.

---

## DATABASE CONNECTIONS

- **Database**: MongoDB
- **ODM**: Mongoose 8.17.1
- **Models**: 40+ document schemas
- **Connection**: Environment-based URI

---

## FRAMEWORK STACK

- **Framework**: Express 5.1.0
- **Language**: TypeScript 5.9.2
- **Validation**: Zod 4.0.17
- **Database**: Mongoose 8.17.1
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 3.0.2
- **File Upload**: Multer 2.0.2
- **Real-time**: Socket.io 4.8.1
- **Image Processing**: Sharp 0.34.3

---

## HOW TO USE THIS DOCUMENTATION

### For API Integration
1. Start with **API_ENDPOINT_SUMMARY.md** for endpoint locations
2. Check authentication flow for token setup
3. Reference specific endpoint requirements
4. Use Zod schemas for validation

### For Backend Development
1. Review **COMPREHENSIVE_BACKEND_REPORT.md** for architecture
2. Find relevant module in Controller section
3. Check validation schemas for request format
4. Review middleware chain for protection level

### For Debugging
1. Reference status codes and error handling
2. Check middleware chain for route protection
3. Review validation schemas for format issues
4. Check role requirements for access issues

---

## KEY DESIGN PATTERNS

### 1. Modular Structure
Each feature module contains:
- `[module].routes.ts` - Route definitions
- `[module].controller.ts` - Request handlers
- `[module].service.ts` - Business logic
- `[module].model.ts` - Data schema
- `[module].validation.ts` - Input schemas

### 2. Error Handling
- AsyncHandler wraps all controller methods
- ApiError class for consistent errors
- Global error middleware catches all errors
- Validation middleware prevents bad requests

### 3. Security
- JWT-based authentication
- Role-based access control (RBAC)
- Request validation (Zod schemas)
- Password hashing (bcryptjs)
- CORS configured

### 4. Data Consistency
- Mongoose schemas enforce structure
- Validation at multiple levels
- Error handling prevents invalid states
- Transaction support for critical operations

---

## COMMON USE CASES

### Create a Need
1. `POST /api/v1/needs` - Submit need
2. `PATCH /api/v1/needs/:id` - Update (ADMIN approval)
3. `POST /api/v1/needs/:id/support` - Add supporter
4. `POST /api/v1/needs/:id/updates` - Post timeline update

### Follow System
1. `POST /api/v1/social/follow/user/:userId` - Follow user
2. `GET /api/v1/social/users/:userId/followers` - Get followers
3. `POST /api/v1/social/mentions/:mentionId/read` - Read mention

### Gamification
1. `GET /api/v1/gamification/leaderboard` - View points
2. `POST /api/v1/gamification/points/daily-bonus` - Claim bonus
3. `GET /api/v1/gamification/badges/my-badges` - View badges

### Content Management
1. `POST /api/v1/blog/articles` - Create article (ADMIN)
2. `GET /api/v1/blog/articles` - List articles
3. `PATCH /api/v1/blog/articles/:id` - Update article (ADMIN)

---

## ENVIRONMENT VARIABLES NEEDED

```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

---

## RECOMMENDATIONS

### For Frontend Teams
- Use **API_ENDPOINT_SUMMARY.md** as primary reference
- Implement JWT token storage
- Handle 401/403 errors for auth
- Use pagination for lists

### For Backend Teams
- Read **COMPREHENSIVE_BACKEND_REPORT.md** for deep dives
- Follow modular pattern for new features
- Use Zod schemas for validation
- Implement proper error handling

### For DevOps/Deployment
- Configure MongoDB connection
- Set environment variables
- Enable CORS if needed
- Configure file upload paths

---

## VERSION INFORMATION

- **API Version**: 1.0.0
- **Report Generated**: November 10, 2024
- **Framework**: Express 5.1.0
- **Language**: TypeScript 5.9.2
- **Database**: MongoDB (Mongoose 8.17.1)

---

## GETTING STARTED

1. Read this INDEX file for overview
2. Choose specific document based on your need:
   - Developer → COMPREHENSIVE_BACKEND_REPORT.md
   - Quick lookup → API_ENDPOINT_SUMMARY.md
3. Find your module/endpoint
4. Check authentication requirements
5. Review validation schema
6. Test with provided examples

---

**Total Documentation**: 1,687 lines across 2 detailed guides
**Coverage**: 100% of backend API (150+ endpoints)
**Status**: Complete and current as of November 10, 2024

