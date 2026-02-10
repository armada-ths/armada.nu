<!--
Guidance for AI coding agents working on the armada.nu monorepo.
Keep this short, actionable, and grounded in files and patterns actually present in the repo.
-->

# armada.nu — Copilot instructions

## Architecture overview

Two independent services in one workspace:

1. **Public site** (`armada.nu/`) — Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4. Deployed on Vercel.
2. **ArmadaCMS** (`ArmadaCMS/`) — Go REST API (Gorilla Mux, GORM, Postgres) + React-Admin frontend (Vite). The Go server serves the admin SPA at `/admin/` and exposes REST API at `/api/v1`. Deployed via Docker on AWS.

Data flow: Public site fetches from ArmadaCMS API (`NEXT_PUBLIC_API_URL`) and from Contentful CMS. Server actions (`"use server"`) handle Slack webhook integrations.

## Developer workflows

- **Public site**: pnpm (pinned via `packageManager`), Node 22.x.
  - `pnpm dev` — starts Next.js on port 8000.
  - `pnpm build` / `pnpm lint` (ESLint via `eslint .`).
- **ArmadaCMS backend**: `go run main.go` (port 8080) or `docker compose up`. Auto-migrates models on startup via `db.DB.AutoMigrate(...)` in `main.go`.
- **ArmadaCMS admin frontend** (`ArmadaCMS/frontend/`): npm-based Vite app. `npm run dev` for dev, `npm run build` outputs to `frontend/dist` which the Go server serves.
- **Tests**: no test framework is configured in either project. Verify changes manually via `pnpm dev` / `go run main.go`.

## Project-specific patterns

### Frontend (Next.js)

- **Path alias**: `@/*` maps to `./src/*` (tsconfig `paths`).
- **Page structure**: route segments under `src/app/`. Per-route components go in `_components/` colocated folders. Shared UI lives in `src/components/ui/` (shadcn/ui, Radix primitives) and `src/components/shared/`.
- **UI library**: shadcn/ui configured via `components.json` — uses Radix + `class-variance-authority` + `cn()` from `src/lib/utils.ts`. Also uses some `@mui/material` components. Add new shadcn components via `npx shadcn@latest add <component>`.
- **Styling**: Tailwind v4 via CSS-first config in `src/app/globals.css` (no `tailwind.config.ts`). Brand colors defined as `@theme` variables: `--color-melon-700` (#00d790), `--color-licorice` (#2d2d2c), `--color-coconut` (#fff0d9), `--color-grapefruit` (#e73953), `--color-pineapple` (#f7b519). Use these via Tailwind classes like `text-melon-700`, `bg-coconut`.
- **Fonts**: `Inter`, `Bebas Neue`, `Lato` loaded via `next/font/google` in `layout.tsx` + custom `@font-face` in `globals.css`. Use `font-bebas-neue`, `font-lato`, `font-inter` classes.
- **Data fetching from API**: hooks in `src/components/shared/hooks/api/` — each exports a `fetch*` async function (for server components) and a `use*` React Query hook (for client components). Example: `fetchExhibitors()` / `useExhibitors()` in `useExhibitors.tsx`.
- **Contentful**: `src/lib/contentful.ts` — uses preview API in development, delivery API in production (switched by `NODE_ENV`).
- **Feature flags**: defined in `src/feature_flags.ts`, resolved with Vercel `flags` SDK overrides in `src/components/shared/feature.ts`. Use `await feature("FLAG_NAME")` in server components. Flags: `EVENT_PAGE`, `MAP_PAGE`, `AT_FAIR_PAGE`, `EXHIBITOR_SIGNUP`, `EXHIBITOR_PACKAGES`, `EXHIBITOR_EVENTS`.
- **Server actions**: `"use server"` functions in `actions.ts` files (e.g., `src/app/exhibitor/actions.ts`). Used for Slack webhooks and reCAPTCHA verification.
- **Compound components**: `Page.Boundary`, `Page.Header`, `Page.Background` in `src/components/shared/Page.tsx` — use these for consistent layout.
- **SVG imports**: configured in `next.config.mjs` — `import Logo from './logo.svg'` renders as component, `import url from './logo.svg?url'` returns URL string.
- **Images**: `next.config.mjs` whitelists remote patterns for S3 buckets (`armada-ais-files`, `armada-cms-files`) and `app.eventro.se`. Add new domains there when needed.
- **Dates**: all date handling uses Luxon `DateTime`, timezone locked to `Europe/Stockholm`. See helpers in `src/lib/utils.ts`.

### Backend (ArmadaCMS)

- **Route pattern**: `main.go` splits into `publicAPI` and `protectedAPI` subrouters — public routes need no auth, protected routes use Bearer token via `auth.Middleware`.
- **Controller pattern**: each controller in `Controllers/` reads from `db.DB` (GORM global), JSON-encodes response. Supports react-admin style pagination via `Content-Range` headers and `ParseListParams`.
- **Models**: `models/` — GORM structs with JSON tags (camelCase). Many-to-many relations (e.g., `Exhibitor` ↔ `Industry`) use GORM's `many2many` tag.
- **File uploads**: controllers use `multipart/form-data`; files uploaded to AWS S3 via helpers in `utils/aws_s3.go`.
- **Admin frontend**: React-Admin v5 with `ra-data-simple-rest` data provider customized in `frontend/src/dataProvider.ts`. Auth via JWT stored in `localStorage`.

## Environment variables

- **All frontend env vars** must be registered in `src/env.ts`. Do not invent new ones without adding them there.
- `NEXT_PUBLIC_*` vars are client-safe; others (`RECAPTCHA_SECRET_KEY`, `SLACK_*_HOOK_URL`, Contentful tokens) are server-only.
- Backend env vars: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSLMODE` (see `ArmadaCMS/db/connect.go`).

## PR checklist

- Run `pnpm dev` — verify no TypeScript errors, pages render.
- Run `pnpm lint` — fix any ESLint issues.
- If backend changes: run `go run main.go` in `ArmadaCMS/`, check `/health` and affected `/api/v1` endpoints.
- If adding/removing env vars: update `src/env.ts` (frontend) or document for backend.
- If adding a new page: add entry to `src/app/sitemap.ts`.
