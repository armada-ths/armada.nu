<!--
Guidance for AI coding agents working on the public armada.nu site.
Keep this focused on the Next.js app in this folder; backend/admin guidance lives in ArmadaCMS/.github/copilot-instructions.md.
-->

# armada.nu — Copilot instructions

See `README.md` for setup and scripts. Do not duplicate ArmadaCMS backend/admin guidance here; if a task touches the Go API or React-Admin app, also follow `../../ArmadaCMS/.github/copilot-instructions.md`.

## Architecture

This folder is the public website: **Next.js 16 App Router + React 19 + TypeScript + Tailwind CSS v4**, deployed on Vercel.

- Content comes from **ArmadaCMS** (`NEXT_PUBLIC_API_URL`). Production API: `https://cms.armada.nu`; staging API: `https://staging.cms.armada.nu`. To use the staging backend locally, set `NEXT_PUBLIC_API_URL=https://staging.cms.armada.nu` in `.env.local`.
- Server-side integrations such as Slack webhooks and reCAPTCHA verification live in `actions.ts` files with `"use server"`.
- Styling and theme tokens are defined in `src/app/globals.css`; there is **no** `tailwind.config.ts`.

## Build and validation

- Use **pnpm** only (`packageManager` is pinned in `package.json`), with **Node 22.x**.
- Main commands:
  - `pnpm dev` — Next.js dev server on port `8000`
  - `pnpm build`
  - `pnpm lint`
  - `pnpm type-check`
- There is no automated test suite configured; validate changes with the relevant command plus manual page checks.

## Cache revalidation

The site uses **ISR + on-demand revalidation** to keep content fresh without full rebuilds:

- **Baseline**: the root layout sets `revalidate: 86400` (24 h). Individual data hooks inherit this.
- **Cache tags**: every `fetch*()` call in `src/components/shared/hooks/api/` includes a `tags` array (e.g. `tags: ["events"]`). These tags are the revalidation unit.
- **On-demand purge**: `POST /api/revalidate` (`src/app/api/revalidate/route.ts`) accepts `{ tag, secret }`, validates `REVALIDATION_SECRET`, and calls `revalidateTag(tag, { expire: 0 })`. The CMS fires this automatically after write operations.
- **Tag inventory** (must stay in sync between Next.js hooks and Go controllers):

  | Tag | Next.js hook | CMS controller |
  |-----|-------------|---------------|
  | `blog-posts` | `useBlogPosts` | `BlogpostController` |
  | `events` | `useEvents` | `EventController` |
  | `exhibitors` | `useExhibitors` | `ExhibitorController` |
  | `highlight-cards` | `useHighlightCards` | `HighlightCardController` |
  | `dates` | `useDates` | — (no CMS revalidation yet) |
  | `organization` | `useOrganization` | — |
  | `recruitment` | `useRecruitment` | — |
  | `employments` | `useExhibitors` (`fetchEmployments`) | — |
  | `industries` | `useExhibitors` (`fetchIndustries`) | — |
  | `programs` | `useExhibitors` (`fetchPrograms`) | — |

- When adding a new data hook, include a `tags` array. When adding CMS revalidation for that resource, pass the same tag string to the audit helper's `revalidateTags` variadic argument.

## Conventions

- **Env vars:** every frontend env var must be registered in `src/env.ts`. `NEXT_PUBLIC_*` is client-safe; everything else stays server-only.
- **Routing/layout:** routes live under `src/app/`. Prefer colocated route-specific components in `_components/`; shared UI belongs in `src/components/ui/` or `src/components/shared/`.
- **Shared layout primitives:** use `Page.Boundary`, `Page.Header`, and `Page.Background` from `src/components/shared/Page.tsx` for consistent page structure.
- **Data fetching:** API hooks in `src/components/shared/hooks/api/` follow a dual-export pattern: `fetch*()` for server components and `use*()` for client components. Each hook sets `next: { revalidate: 86400, tags: ["<tag>"] }` for ISR and on-demand revalidation (see *Cache revalidation* above). Hooks accept an `options?: RequestInit` parameter that allows callers to merge or override `next` settings.
- **Client-side state:** React Query (`@tanstack/react-query`) is configured in `src/app/providers.tsx` with `staleTime: 60_000` (1 min). Client-side `use*()` hooks wrap the server-side `fetch*()` in `useQuery`.
- **Feature flags:** definitions live in `src/feature_flags.ts`; read flags with `await feature("FLAG_NAME")` from `src/components/shared/feature.ts`. Defined flags: `EVENT_PAGE`, `MAP_PAGE`, `AT_FAIR_PAGE`, `EXHIBITOR_PACKAGES`, `EXHIBITOR_EVENTS`, `EXHIBITOR_PAGE`, `STUDENT_RECRUITMENT_PAGE`, `EXHIBITOR_MAIN_PAGE`, `EXHIBITOR_TIMELINE_PAGE`, `EXHIBITOR_SIGNUP_PAGE`, `ABOUT_PAGE`, `ABOUT_TEAM_PAGE`, `ARMADA_BLOG_PAGE`. Flag overrides come from Vercel flag cookies (`vercel-flag-overrides`). `FLAGS_SECRET` is required for Vercel's flag evaluation infrastructure (managed in Vercel dashboard, not `src/env.ts`). All flags default to `true` if the CMS fetch fails.
- **Sitemap and flags:** `src/app/sitemap.ts` conditionally includes routes based on their feature flag — if a flag is `false`, the route is omitted from the sitemap.
- **Dates/times:** use Luxon helpers from `src/lib/utils.ts`; event times are normalized to `Europe/Stockholm`.
- **SVGs/images:** `next.config.mjs` enables SVG component imports (`@svgr/webpack`) and whitelists remote image hosts. `*.svg?url` imports as a static asset URL; bare `*.svg` imports as a React component. Update that file when adding new remote image domains.
- **Site metadata:** if you add or remove public pages, update `src/app/sitemap.ts`.
- **Server-side actions:** form submissions and external integrations use `actions.ts` files colocated with routes (e.g., `src/app/exhibitor/actions.ts`). Pattern: Zod validation → reCAPTCHA verification via `RECAPTCHA_SECRET_KEY` → Slack webhook via `SLACK_*_HOOK_URL`. Follow this pattern when adding form-to-server flows.
- **Routes:** main sections are `about/` (with `team/`), `blog/`, `exhibitor/` (with `events/`, `order/`, `packages/`, `signup/`, `timeline/`), and `student/` (with `at-the-fair/`, `events/`, `exhibitors/`, `map/`, `recruitment/`). Legacy paths redirect 301 to these locations.
- **Analytics/tracking:** Vercel Analytics (`@vercel/analytics`) and Speed Insights are loaded in the root layout. Use `TrackedLink` from `src/components/shared/TrackedLink.tsx` (wraps Next.js `Link` + calls `track()`) for user-interaction tracking. CMS-driven tracking via `HighlightCard.ctaEventName`.
- **Exhibitor order flow:** the `/exhibitor/order/*` route is gated by `src/proxy.ts` — a cookie-based access check using `EXPO_ACCESS_TOKEN`. See that file for details.
- **URL normalization:** use `normalizeExternalUrl()` from `src/lib/externalUrl.ts` when rendering user-supplied URLs (adds `https://` if missing, rejects non-http schemes).

## UI and styling notes

- Tailwind v4 uses a **CSS-first** setup in `src/app/globals.css`.
- Brand tokens are defined with `@theme`; prefer classes such as `text-melon`, `bg-coconut`, and `text-licorice` over ad hoc colors.
- Color values are intentionally split across **two files that must stay in sync**:
  - `src/app/globals.css` — CSS/Tailwind theme tokens (`--color-*`) used by utility classes and CSS variables.
  - `src/lib/colors.ts` — shared TypeScript runtime hex constants (`HEX_COLORS`, `COUNTDOWN_CONFETTI_COLORS`) for JS/TS contexts (MUI `sx`, SVG props, scripts, metadata/manifest values, etc.).
- If you add or change a brand color value, update both files in the same change and keep naming aligned (for example `--color-grapefruit` ↔ `HEX_COLORS.grapefruit`).
- Avoid introducing raw hex literals directly in `src/**/*.{ts,tsx,js,jsx}`; define/reuse entries in `src/lib/colors.ts` instead.
- Fonts are defined in `src/app/layout.tsx` and `src/app/globals.css`; use the existing font utility classes (`font-bebas-neue`, `font-lato`, `font-inter`).
- `shadcn/ui` is configured via `components.json`, with utilities such as `cn()` in `src/lib/utils.ts`. Some pages also use `@mui/material`; match the surrounding pattern rather than mixing UI approaches unnecessarily.

## Integration boundaries and pitfalls

- Keep public-site changes in this repo. If a task requires changing API contracts, CMS models, admin resources, or backend auth/upload behavior, make the corresponding update in `ArmadaCMS/` and follow its instruction file.
- On Windows, if the folder was moved or renamed and installed packages suddenly fail with `MODULE_NOT_FOUND`, delete `node_modules` and run `pnpm install` again; pnpm junctions can retain old absolute paths.
