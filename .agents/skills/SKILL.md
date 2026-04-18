---
name: STS Project Skill
description: Comprehensive guide to the STS (Shift Tracking System) codebase — architecture, conventions, patterns, and development workflows.
---

# STS – Shift Tracking System

A workforce management platform for shift tracking and employee management with role-based access control (ADMIN / EMPLOYEE) and multiple pay types (HOURLY / REVENUE).

---

## 1. Repository Layout

```
STS/
├── backend/                    # Node.js / Express API
│   ├── server.js               # Entry point — connects DB & starts server
│   ├── src/
│   │   ├── app.js              # Express app setup, CORS, routes, middleware
│   │   ├── config/
│   │   │   └── db.js           # MongoDB / Mongoose connection
│   │   ├── models/
│   │   │   ├── user.model.js   # User schema (roles, payType, shiftTemplate)
│   │   │   └── shiftlog.model.js  # ShiftLog schema (HOURLY / REVENUE shifts)
│   │   ├── services/           # Business logic layer
│   │   │   ├── auth.service.js
│   │   │   ├── user.service.js
│   │   │   └── shift.service.js
│   │   ├── controllers/        # Request handling, delegates to services
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   └── shiftlog.controller.js
│   │   ├── routes/             # Express routers
│   │   │   ├── auth.js         # /api/auth/*
│   │   │   ├── user.js         # /api/user/*
│   │   │   └── shift.js        # /api/shift/*
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js      # JWT verification (cookie + Bearer)
│   │   │   ├── authorize.js           # Role-based authorization
│   │   │   ├── upload.middleware.js    # Multer + Cloudinary image uploads
│   │   │   └── globalErrorHandler.js  # Centralized Express error handler
│   │   └── utils/
│   ├── scripts/
│   │   ├── createAdmin.js      # Bootstrap first admin (CLI only)
│   │   ├── seed-employees.js   # Seed test employees
│   │   └── seedShiftLogs.js    # Seed test shift logs
│   ├── tests/
│   └── uploads/                # Local file uploads (gitignored)
│
├── frontend/vite-project/      # React SPA
│   ├── src/
│   │   ├── main.tsx            # App entry with providers
│   │   ├── App.tsx             # Root component
│   │   ├── pages/
│   │   │   ├── login.tsx       # Public login page
│   │   │   ├── Home.tsx        # Employee dashboard
│   │   │   └── adminDashboard.tsx  # Admin dashboard
│   │   ├── ui-components/      # Reusable UI components
│   │   │   ├── Header.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── LoadingScreen.tsx
│   │   │   ├── Loading-spinner.tsx
│   │   │   ├── add-shift-form.tsx
│   │   │   ├── add-employee-form.tsx
│   │   │   ├── employee-list.tsx
│   │   │   ├── employee-logs-modal.tsx
│   │   │   ├── shift-log-list.tsx
│   │   │   └── shift-template-settings.tsx
│   │   ├── services/           # Axios HTTP layer
│   │   │   ├── http.ts         # Axios instance + Bearer interceptor
│   │   │   ├── auth-services.ts
│   │   │   ├── employee.services.ts
│   │   │   └── shiftlog-services.ts
│   │   ├── queries/            # TanStack React Query hooks
│   │   │   ├── auth-queries.ts
│   │   │   ├── employee-queries.ts
│   │   │   ├── shift-queries.ts
│   │   │   └── user-queries.ts
│   │   ├── routes/
│   │   │   ├── AppRoutes.tsx      # Route definitions
│   │   │   ├── ProtectedRoute.tsx # Auth guard (redirect to /login)
│   │   │   └── PublicRoute.tsx    # Guest guard (redirect to /)
│   │   ├── layouts/
│   │   │   └── admin-layout.tsx   # Shared layout for authenticated pages
│   │   └── utils/
│   │       ├── contexts/       # React Contexts (auth)
│   │       ├── hooks/          # Custom hooks
│   │       ├── providers/      # Context providers
│   │       └── types/          # TypeScript type definitions
│   ├── e2e/                    # Playwright E2E tests
│   ├── playwright.config.ts
│   ├── vite.config.ts
│   └── tsconfig*.json
│
├── .github/                    # CI/CD workflows
├── deployment_notes.md         # Render deployment guide
└── README.md
```

---

## 2. Tech Stack

| Layer         | Technology                                                                 |
|---------------|---------------------------------------------------------------------------|
| **Frontend**  | React 19, TypeScript, Vite 7, Tailwind CSS v4, React Router DOM v7        |
| **State**     | TanStack React Query v5 (server state), React Context (auth state)        |
| **HTTP**      | Axios with Bearer token interceptor (`localStorage`)                      |
| **Backend**   | Node.js, Express 5, ES Modules (`"type": "module"`)                       |
| **Database**  | MongoDB with Mongoose 9                                                   |
| **Auth**      | JWT (access token in cookie + `Authorization: Bearer` header), bcrypt     |
| **Uploads**   | Multer + Cloudinary (image proof for shifts)                              |
| **Testing**   | Vitest (unit), Playwright (E2E)                                           |
| **Deployment**| Render (backend service + static site)                                    |

---

## 3. Data Models

### User (`user.model.js`)

| Field            | Type                          | Notes                                           |
|------------------|-------------------------------|--------------------------------------------------|
| `email`          | String (unique, lowercase)    | Unique among active users (partial index)         |
| `name`           | String                        | Display name                                      |
| `hashedPassword` | String                        | `select: false` — never returned by default       |
| `role`           | `"ADMIN"` \| `"EMPLOYEE"`     | Controls dashboard access                         |
| `isActive`       | Boolean                       | Soft-delete flag                                  |
| `createdBy`      | ObjectId → User               | `null` for system-created admins                  |
| `shiftTemplate`  | `{ startTime, endTime, breakDuration }` | Default shift prefill                   |
| `payType`        | `"HOURLY"` \| `"REVENUE"` \| `null` | Determines shift log structure            |

### ShiftLog (`shiftlog.model.js`)

| Field            | Type                          | Notes                                           |
|------------------|-------------------------------|--------------------------------------------------|
| `userId`         | ObjectId → User               | Indexed                                           |
| `date`           | Date                          | Shift date                                        |
| `shiftType`      | `"HOURLY"` \| `"REVENUE"`     | Determines which fields are relevant              |
| `startTime`      | String (`"HH:mm"`)           | For HOURLY shifts                                 |
| `endTime`        | String (`"HH:mm"`)           | For HOURLY shifts                                 |
| `breakDuration`  | Number (minutes)              | For HOURLY shifts                                 |
| `totalHours`     | Number                        | Calculated server-side                            |
| `revenue`        | Number                        | For REVENUE shifts                                |
| `ownPay`         | Number                        | Calculated earnings                               |
| `imageUrl`       | String                        | Cloudinary URL or local upload path               |
| `notes`          | String                        | Optional notes                                    |

**Compound index:** `{ userId: 1, date: -1 }` for efficient pagination.

---

## 4. Architecture & Conventions

### Backend Layering

```
Route → Controller → Service → Model
```

- **Routes** (`src/routes/`): Define endpoints, apply middleware (`verifyJWT`, `authorize`, `upload`).
- **Controllers** (`src/controllers/`): Parse request, call service, send response. Thin layer — no business logic.
- **Services** (`src/services/`): All business logic, validation, and database queries live here.
- **Models** (`src/models/`): Mongoose schemas only. No methods or statics beyond schema definition.

### Error Handling

- Use `http-errors` (`createHttpError`) to throw semantic HTTP errors from services.
- Errors bubble up to `globalErrorHandler.js` middleware which formats the response.

### Authentication Flow

1. Login → backend returns JWT access token.
2. Token stored in `localStorage` on the frontend.
3. Axios interceptor attaches `Authorization: Bearer <token>` to every request.
4. `auth.middleware.js` checks cookies first, then `Authorization` header.
5. `authorize.js` middleware checks `req.user.role` against allowed roles.

### Frontend Patterns

| Pattern                    | Convention                                                              |
|----------------------------|-------------------------------------------------------------------------|
| **File naming**            | Kebab-case for components (`add-shift-form.tsx`), camelCase for pages   |
| **Services**               | Thin Axios wrappers in `services/` — one file per domain               |
| **Queries**                | TanStack React Query hooks in `queries/` — one file per domain         |
| **Routing**                | `AppRoutes.tsx` with `ProtectedRoute` / `PublicRoute` wrapper routes    |
| **Layouts**                | Shared layouts via `<Outlet />` pattern (`admin-layout.tsx`)            |
| **Barrel exports**         | `index.ts` files in `pages/`, `ui-components/`, `layouts/`             |
| **Styling**                | Tailwind CSS v4 (plugin via `@tailwindcss/vite`)                        |
| **Toast notifications**    | `react-hot-toast` for user feedback                                     |
| **Icons**                  | `react-icons` library                                                   |

---

## 5. API Routes

| Method | Path                  | Auth | Role    | Description                        |
|--------|-----------------------|------|---------|------------------------------------|
| POST   | `/api/auth/login`     | No   | —       | Login, returns JWT                 |
| POST   | `/api/auth/register`  | Yes  | ADMIN   | Register a new employee            |
| GET    | `/api/user/*`         | Yes  | Varies  | User profile & management          |
| GET    | `/api/shift/*`        | Yes  | Varies  | Shift log CRUD & pagination        |
| POST   | `/api/shift/*`        | Yes  | EMPLOYEE| Create shift log (with image)      |
| GET    | `/health`             | No   | —       | Health check                       |

---

## 6. Environment Variables

### Backend (`.env`)

| Variable                 | Purpose                                         |
|--------------------------|-------------------------------------------------|
| `PORT`                   | Server port (default 5000)                      |
| `MONGO_URI`              | MongoDB connection string                       |
| `JWT_SECRET_KEY`         | JWT signing secret                              |
| `CLOUDINARY_CLOUD_NAME`  | Cloudinary cloud name                           |
| `CLOUDINARY_API_KEY`     | Cloudinary API key                              |
| `CLOUDINARY_API_SECRET`  | Cloudinary API secret                           |
| `FRONTEND_URL`           | Allowed CORS origin(s)                          |
| `CORS_ORIGIN`            | Additional CORS origin(s)                       |

### Frontend (`.env`)

| Variable              | Purpose                             |
|-----------------------|-------------------------------------|
| `VITE_FRONTEND_URL`   | Backend API base URL for Axios      |

---

## 7. Development Commands

### Backend (`backend/`)

```bash
npm install           # Install dependencies
npm run dev           # Start with nodemon (hot reload)
npm start             # Production start
npm run seed:admin    # Create admin: node scripts/createAdmin.js <email> <password>
npm test              # Run Vitest tests
```

### Frontend (`frontend/vite-project/`)

```bash
npm install           # Install dependencies
npm run dev           # Vite dev server with --host (LAN accessible)
npm run build         # TypeScript check + production build
npm run lint          # ESLint
npm test              # Vitest unit tests
npm run test:e2e      # Playwright E2E tests
npm run test:e2e:ui   # Playwright with interactive UI
```

---

## 8. Key Patterns to Follow

### Adding a New API Feature (Backend)

1. **Model**: Add or modify schema in `src/models/`.
2. **Service**: Create/update business logic in `src/services/`.
3. **Controller**: Create thin handler in `src/controllers/`.
4. **Route**: Register route in `src/routes/`, apply middleware.
5. **App**: Mount new router in `src/app.js` under `/api/<resource>/`.

### Adding a New Frontend Feature

1. **Types**: Define TypeScript types in `src/utils/types/`.
2. **Service**: Create Axios wrapper in `src/services/`.
3. **Query**: Create TanStack Query hook in `src/queries/`.
4. **Component**: Build UI component in `src/ui-components/`.
5. **Page**: Compose components into a page in `src/pages/`.
6. **Route**: Add route in `src/routes/AppRoutes.tsx`, wrap with `ProtectedRoute` or `PublicRoute`.
7. **Export**: Update barrel `index.ts` files.

### Adding a New Script

- Place in `backend/scripts/`.
- Import `db.js` config to connect to MongoDB.
- Make idempotent (safe to run multiple times).
- Add npm script in `backend/package.json`.

---

## 9. Deployment (Render)

- **Backend**: Node.js Web Service — start command `npm start`.
- **Frontend**: Static Site — build command `npm run build`, publish directory `dist/`.
- **Admin bootstrap**: Use temporary start command approach (see `deployment_notes.md`).
- **Free tier**: No SSH/terminal access — scripts must run via start command or temporary API routes.

---

## 10. Important Gotchas

1. **ES Modules**: Both backend and frontend use `"type": "module"`. Always use `import/export`, never `require`.
2. **Password field**: `hashedPassword` has `select: false`. Must explicitly `.select('+hashedPassword')` in auth queries.
3. **Unique email**: Enforced via partial index on `{ isActive: true }` — deactivated users can share emails with active users.
4. **CORS**: Multiple origins supported via comma-separated `FRONTEND_URL` and `CORS_ORIGIN` env vars. `localhost:5173` and `localhost:5000` always allowed in dev.
5. **Image uploads**: Multer + Cloudinary middleware on shift creation routes. Local `uploads/` directory is gitignored.
6. **Pagination**: Shift logs use composite cursor pagination (`date` + `_id`) for correct chronological ordering.
7. **Pay type logic**: `shiftType` on ShiftLog mirrors `payType` on User. HOURLY shifts require `startTime`/`endTime`; REVENUE shifts use `revenue` field instead.
8. **Tailwind v4**: Uses the Vite plugin (`@tailwindcss/vite`), not PostCSS — no `tailwind.config.js` file.
9. **Shift Date Selection**: Employees can select the date for their shifts (supporting backfilling), but future dates are prohibited by both frontend `max` attributes and backend validation logic.
