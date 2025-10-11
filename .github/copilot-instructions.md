# Copilot Instructions for mainHelio

## Big Picture Architecture
- **Monorepo structure**: Contains `admin` (React/Vite), `marketing` (React/Vite), and `server` (Laravel PHP) apps. Each is self-contained but shares business logic and data via API endpoints.
- **Frontend**: `admin` and `marketing` are separate React apps, each with its own `components/`, `pages/`, and `services/` directories. They interact with the backend via REST APIs.
- **Backend**: `server` is a Laravel application providing authentication, property management, and other business logic. Database migrations and seeders are in `server/database/`.

## Developer Workflows
- **Frontend (admin/marketing):**
  - Install dependencies: `npm install`
  - Start dev server: `npm run dev`
  - Environment variables (e.g., `GEMINI_API_KEY`) go in `.env.local`.
- **Backend (server):**
  - Install dependencies: `composer install`
  - Run migrations: `php artisan migrate`
  - Start server: `php artisan serve`

## Project-Specific Conventions
- **Services**: API calls are abstracted in `services/` (e.g., `propertyService.ts`). Always use these for backend communication.
- **Components**: UI logic is modularized in `components/`. Shared UI patterns (modals, cards, uploaders) are reused across pages.
- **Type Safety**: Types are defined in `types.ts` and used throughout for props and API responses.
- **State Management**: No global state library; state is managed locally or via React context in each app.

## Integration Points
- **External APIs**: Some features (e.g., video management) integrate with third-party services (see `VIMEO_INTEGRATION.md`).
- **Authentication**: Handled via Laravel backend; frontend uses `authService.ts` for login/logout and token management.
- **Environment Variables**: Sensitive keys (API, etc.) must be set in `.env.local` (frontend) or `.env` (backend).

## Cross-Component Communication
- **Frontend**: Use props and context for data flow. For API data, always go through the relevant service in `services/`.
- **Backend**: Laravel controllers handle requests, route logic, and return JSON responses for frontend consumption.

## Key Files & Directories
- `admin/components/`, `marketing/components/`: UI building blocks
- `admin/services/`, `marketing/services/`: API abstraction
- `server/app/`, `server/routes/`: Laravel business logic and routing
- `server/database/`: Migrations and seeders
- `VIMEO_INTEGRATION.md`: Details on video API integration

## Examples
- To fetch properties: Use `propertyService.ts` in frontend, which calls Laravel API endpoints defined in `server/routes/`.
- To add a new property: Use modal component in frontend, submit via service, backend validates and persists.

---

For unclear or missing conventions, check the relevant `README.md` or ask for clarification.