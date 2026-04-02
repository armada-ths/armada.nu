<!--
Guidance for AI coding agents working on the public armada.nu site.
Keep this focused on the Next.js app in this folder; backend/admin guidance lives in ArmadaCMS/.github/copilot-instructions.md.
-->

# armada.nu — Copilot instructions

See `README.md` for setup and scripts. Do not duplicate ArmadaCMS backend/admin guidance here; if a task touches the Go API or React-Admin app, also follow `../../ArmadaCMS/.github/copilot-instructions.md`.

## Architecture

This folder is the public website: **Next.js 16 App Router + React 19 + TypeScript + Tailwind CSS v4**, deployed on Vercel.

- Content comes from **ArmadaCMS** (`NEXT_PUBLIC_API_URL`) and **Contentful** (`src/lib/contentful.ts`).
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

## Conventions

- **Env vars:** every frontend env var must be registered in `src/env.ts`. `NEXT_PUBLIC_*` is client-safe; everything else stays server-only.
- **Routing/layout:** routes live under `src/app/`. Prefer colocated route-specific components in `_components/`; shared UI belongs in `src/components/ui/` or `src/components/shared/`.
- **Shared layout primitives:** use `Page.Boundary`, `Page.Header`, and `Page.Background` from `src/components/shared/Page.tsx` for consistent page structure.
- **Data fetching:** API hooks in `src/components/shared/hooks/api/` follow a dual-export pattern: `fetch*()` for server components and `use*()` for client components.
- **Feature flags:** definitions live in `src/feature_flags.ts`; read flags with `await feature("FLAG_NAME")` from `src/components/shared/feature.ts`. Preview overrides come from `FEATURE_FLAG_PREVIEW_OVERRIDES_JSON` plus Vercel flag cookies.
- **Dates/times:** use Luxon helpers from `src/lib/utils.ts`; event times are normalized to `Europe/Stockholm`.
- **SVGs/images:** `next.config.mjs` enables SVG component imports and whitelists remote image hosts. Update that file when adding new remote image domains.
- **Site metadata:** if you add or remove public pages, update `src/app/sitemap.ts`.

## UI and styling notes

- Tailwind v4 uses a **CSS-first** setup in `src/app/globals.css`.
- Brand tokens are defined with `@theme`; prefer classes such as `text-melon-700`, `bg-coconut`, and `text-licorice` over ad hoc colors.
- Fonts are defined in `src/app/layout.tsx` and `src/app/globals.css`; use the existing font utility classes (`font-bebas-neue`, `font-lato`, `font-inter`).
- `shadcn/ui` is configured via `components.json`, with utilities such as `cn()` in `src/lib/utils.ts`. Some pages also use `@mui/material`; match the surrounding pattern rather than mixing UI approaches unnecessarily.

## Integration boundaries and pitfalls

- Keep public-site changes in this repo. If a task requires changing API contracts, CMS models, admin resources, or backend auth/upload behavior, make the corresponding update in `ArmadaCMS/` and follow its instruction file.
- On Windows, if the folder was moved or renamed and installed packages suddenly fail with `MODULE_NOT_FOUND`, delete `node_modules` and run `pnpm install` again; pnpm junctions can retain old absolute paths.
