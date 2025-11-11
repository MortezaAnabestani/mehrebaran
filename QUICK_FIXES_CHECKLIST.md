# ✅ چک‌لیست سریع رفع مشکلات

> **برای استفاده روزانه - فقط موارد عملیاتی**

---

## 🔴 CRITICAL - رفع فوری (امروز!)

### API Endpoint Mismatches

- [ ] **Discovery Module**
  - File: `packages/api/src/modules/discovery/discovery.routes.ts`
  - Fix: تغییر routes به `/recommendations/needs` و `/trending/needs`
  - یا: تغییر frontend service به `/recommendations` و `/trending`

- [ ] **Notification Mark as Read**
  - File: `packages/api/src/modules/notification/notification.routes.ts`
  - Fix: تغییر `router.post('/:id/read')` به `router.patch('/:id/read')`

- [ ] **Task Module Paths**
  - Files: تطبیق routes بین frontend و backend

### Security

- [ ] **CORS Wildcard**
  - File: `packages/api/src/app.ts`
  - Fix: محدود کردن به allowed origins
  ```typescript
  origin: [
    'http://localhost:3000',
    'https://mehrebaran.org'
  ]
  ```

- [ ] **Rate Limiting**
  - Install: `pnpm add express-rate-limit`
  - File: Create `packages/api/src/core/middleware/rateLimiter.middleware.ts`
  - Apply: به auth routes و API

- [ ] **Input Sanitization**
  - Install: `pnpm add dompurify jsdom`
  - File: Create `packages/api/src/core/utils/sanitize.ts`
  - Apply: به همه controllers که user input می‌گیرند

---

## 🟠 HIGH PRIORITY - این هفته

### Configuration

- [ ] **Environment Variables**
  - Create: `packages/api/.env.example`
  - Create: `packages/web/.env.example`
  - Content: همه required و optional variables

- [ ] **Environment Validation**
  - Create: `packages/api/src/core/config/env.validation.ts`
  - Use Zod for validation
  - Add to: `server.ts`

### Error Handling

- [ ] **Database Connection**
  - File: `packages/api/src/core/config/database.config.ts`
  - Add: try/catch، retry logic، event handlers

- [ ] **Error Logging**
  - Install: `pnpm add winston winston-daily-rotate-file`
  - Create: `packages/api/src/core/utils/logger.ts`
  - Replace: همه `console.error` با `logger.error`

- [ ] **Frontend Error Boundary**
  - Create: `packages/web/src/components/ErrorBoundary.tsx`
  - Add to: `layout.tsx`

### Security

- [ ] **OTP Attempt Limiting**
  - File: `packages/api/src/models/OTP.ts`
  - Add: `attempts`, `maxAttempts`, `isBlocked` fields
  - Update: `auth.controller.ts` verify logic

- [ ] **Pagination Limits**
  - Create: `packages/api/src/core/middleware/pagination.middleware.ts`
  - Max limit: 100 items
  - Apply: به همه list endpoints

---

## 🟡 MEDIUM PRIORITY - این ماه

### Infrastructure

- [ ] **Docker**
  - Create: `Dockerfile.api`
  - Create: `Dockerfile.web`
  - Create: `docker-compose.yml`
  - Create: `.dockerignore`

- [ ] **Database Indexes**
  - File: `packages/api/src/models/Need.ts`
  - Add: indexes برای `status`, `urgencyLevel`, `totalLikes`, `location.city`
  - File: `packages/api/src/models/User.ts`
  - Add: indexes برای `role`, `isActive`

- [ ] **Image Optimization**
  - File: `packages/web/next.config.ts`
  - Add: image configuration
  - Replace: `<img>` با `<Image>` در components

### Features

- [ ] **Password Reset**
  - Create: `packages/api/src/models/PasswordReset.ts`
  - Add routes: `/auth/forgot-password`, `/auth/reset-password`
  - Add controllers

- [ ] **Socket.IO Completion**
  - Create: `packages/api/src/core/socket/socket.handler.ts`
  - Implement: event handlers
  - Add: authentication middleware

### User Experience

- [ ] **Toast Notifications**
  - Install: `pnpm add react-hot-toast`
  - Create: `packages/web/src/lib/toast.ts`
  - Update: services برای نمایش errors
  - Add: `<Toaster />` به layout

- [ ] **Health Check Endpoint**
  - Route: `GET /health`
  - Return: { status, database, uptime, version }

---

## ⚪ LOW PRIORITY - آینده

### External Services

- [ ] Email (SendGrid/Mailgun)
- [ ] SMS (Twilio)
- [ ] Push Notifications (Firebase)
- [ ] Cloud Storage (S3/Cloudinary)
- [ ] Redis Caching
- [ ] CDN Setup

### Testing

- [ ] Unit Tests (Jest)
- [ ] Integration Tests
- [ ] E2E Tests (Playwright)
- [ ] Load Testing

### DevOps

- [ ] CI/CD Pipeline (GitHub Actions)
- [ ] Monitoring (Prometheus/Grafana)
- [ ] Database Backup Automation
- [ ] API Documentation (Swagger)

---

## 📊 Progress Tracking

```
Critical (8):     [░░░░░░░░] 0/8
High (12):        [░░░░░░░░░░░░] 0/12
Medium (15):      [░░░░░░░░░░░░░░░] 0/15
Low (10):         [░░░░░░░░░░] 0/10

Overall:          [░░░░░░░░░░░░░░░░░░░░] 0/45 (0%)
```

---

## 🚀 Quick Commands

```bash
# Install dependencies
pnpm add express-rate-limit
pnpm add dompurify jsdom
pnpm add winston winston-daily-rotate-file
pnpm add react-hot-toast

# Create files
touch packages/api/.env.example
touch packages/web/.env.example
touch packages/api/src/core/middleware/rateLimiter.middleware.ts
touch packages/api/src/core/utils/sanitize.ts
touch packages/api/src/core/utils/logger.ts
touch packages/web/src/components/ErrorBoundary.tsx

# Docker
touch Dockerfile.api
touch Dockerfile.web
touch docker-compose.yml
```

---

**آخرین بروزرسانی:** ۲۲ بهمن ۱۴۰۳
