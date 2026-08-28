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

- Use **pnpm** only (`packageManager` is pinned in `package.json`), with **Node 24.x**.
- Main commands:
  - `pnpm dev` — Next.js dev server on port `8000`
  - `pnpm build`
  - `pnpm lint`
  - `pnpm type-check`
- Use the relevant validation for the change: `pnpm lint`, `pnpm type-check`, `pnpm build`, and for UI or Storybook work also `pnpm test` / `pnpm build-storybook` as needed. Manual page checks are still expected.

## Cache revalidation

The site uses **ISR + on-demand revalidation** to keep content fresh without full rebuilds:

- **Baseline**: the root layout sets `revalidate: 86400` (24 h). Individual data hooks inherit this.
- **Cache tags**: every `fetch*()` call in `src/components/shared/hooks/api/` includes a `tags` array (e.g. `tags: ["events"]`). These tags are the revalidation unit.
- **On-demand purge**: `POST /api/revalidate` (`src/app/api/revalidate/route.ts`) accepts `{ tag, secret }`, validates `REVALIDATION_SECRET`, and calls `revalidateTag(tag, { expire: 0 })`. The CMS fires this automatically after write operations.
- **Tag inventory** (must stay in sync between Next.js hooks and Go controllers):

  | Tag               | Next.js hook                         | CMS controller                          |
  | ----------------- | ------------------------------------ | --------------------------------------- |
  | `blog-posts`      | `useBlogPosts`                       | `BlogpostController`                    |
  | `events`          | `useEvents`                          | `EventController`                       |
  | `exhibitors`      | `useExhibitors`                      | `ExhibitorController`                   |
  | `highlight-cards` | `useHighlightCards`                  | `HighlightCardController`               |
  | `dates`           | `useDates`                           | `FairDateController` / Eventro sync     |
  | `organization`    | `useOrganization`                    | Team/profile/Eventro member controllers |
  | `recruitment`     | `useRecruitment`                     | Recruitment controllers / Eventro sync  |
  | `employments`     | `useExhibitors` (`fetchEmployments`) | `EmploymentController` / Eventro sync   |
  | `industries`      | `useExhibitors` (`fetchIndustries`)  | `IndustryController` / Eventro sync     |
  | `programs`        | `useExhibitors` (`fetchPrograms`)    | `ProgramController` / Eventro sync      |
  | `feature-flags`   | `fetchFeatureFlags`                  | `FeatureFlagController`                 |

- When adding a new data hook, include a `tags` array. When adding CMS revalidation for that resource, pass the same tag string to the audit helper's `revalidateTags` variadic argument.

## Conventions

- **Env vars:** application env vars should be registered in `src/env.ts`. `EXPO_ACCESS_TOKEN` is currently read directly by `src/proxy.ts` and `src/app/exhibitor/order/page.tsx`; framework/tooling variables such as `FLAGS_SECRET`, `ENABLE_EXPERIMENTAL_COREPACK`, and `CHROMATIC_PROJECT_TOKEN` also stay outside the helper. `NEXT_PUBLIC_*` is client-safe; everything else stays server-only.
- **Routing/layout:** routes live under `src/app/`. Prefer colocated route-specific components in `_components/`; shared UI belongs in `src/components/ui/` or `src/components/shared/`.
- **Shared layout primitives:** use `Page.Boundary`, `Page.Header`, and `Page.Background` from `src/components/shared/Page.tsx` for consistent page structure.
- **Data fetching:** API hooks in `src/components/shared/hooks/api/` follow a dual-export pattern: `fetch*()` for server components and `use*()` for client components. Each hook sets `next: { revalidate: 86400, tags: ["<tag>"] }` for ISR and on-demand revalidation (see _Cache revalidation_ above). Hooks accept an `options?: RequestInit` parameter that allows callers to merge or override `next` settings.
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
  - `src/lib/colors.ts` — shared TypeScript runtime hex constants (`HEX_COLORS`, `COUNTDOWN_CONFETTI_COLORS`) for JS/TS contexts (SVG props, scripts, metadata/manifest values, etc.).
- If you add or change a brand color value, update both files in the same change and keep naming aligned (for example `--color-grapefruit` ↔ `HEX_COLORS.grapefruit`).
- Avoid introducing raw hex literals directly in `src/**/*.{ts,tsx,js,jsx}`; define/reuse entries in `src/lib/colors.ts` instead.
- Fonts are defined in `src/app/layout.tsx` and `src/app/globals.css`; use the existing font utility classes (`font-bebas-neue`, `font-lato`, `font-inter`).
- `shadcn/ui` is configured via `components.json`, with utilities such as `cn()` in `src/lib/utils.ts`. Reuse the existing primitives and surrounding Tailwind patterns for UI work.

## Storybook and Chromatic

**When writing or modifying UI components:**

1. Always create or update a corresponding story file (`ComponentName.stories.tsx`).
2. Use imports from `@storybook/nextjs-vite` for `Meta` and `StoryObj`; use `storybook/test` for `fn`, `expect`, `userEvent`.
3. Write interaction tests in the `play` function to cover key user flows (clicks, form inputs, assertions).
4. Add multiple story variants to cover different states (default, disabled, loading, error, etc.).
5. Use `tags: ["autodocs"]` to auto-generate documentation.
6. Validate changes locally first with Storybook and the relevant local checks before relying on CI.

**Preferred validation flow:**

- Use local Storybook (`pnpm storybook`) while developing to review the component quickly.
- Use local Storybook builds/tests first; this is faster for iteration than pushing changes just to inspect Chromatic output.
- Treat Chromatic as the PR/CI visual regression gate, not the primary feedback loop during development.

**Chromatic checks on pull requests:**

- Every push triggers `chromatic.yml`, which builds Storybook and uploads to Chromatic for visual regression testing.
- PR checks will show a Chromatic status (pass/fail). Click the link to view visual diffs in the Chromatic dashboard.
- If visual changes are intentional, approve them in Chromatic; if not, fix the component and re-push.
- The Chromatic project token (`CHROMATIC_PROJECT_TOKEN`) is a GitHub secret — do not add it to the repo.

**Story guidelines:**

- Keep stories focused on single components and their variants.
- Mock external dependencies (data fetching, navigation, external libs) using Storybook mocks.
- Use realistic prop values and meaningful labels so behaviors are observable.
- Avoid redundant stories that show the same logic — cover distinct states and business logic instead.
- If a story test fails, fix it immediately — do not commit failing tests.

## MCP configuration (`.vscode/mcp.json`)

- This repo and `ArmadaCMS/` are often opened together in one multi-root workspace. VS Code merges MCP servers from **all active scopes** (user `mcp.json`, the `.code-workspace` file, and every folder's `.vscode/mcp.json`). If the **same server name** appears in more than one active scope, VS Code logs `WARN Overwriting mcp server '<name>'` and re-collects on every change, which can spin into an **infinite collection loop** that freezes the renderer (~1 Hz whole-window stutter).
- **Every MCP server name must be unique across all simultaneously-open scopes.** Suffix folder-scoped servers with the repo, e.g. `ESLint (armada.nu)` / `ESLint (ArmadaCMS)`, `markitdown (armada.nu)` / `markitdown (ArmadaCMS)`. Do not reuse a bare name (`ESLint`, `microsoft/markitdown`, `Chromatic`) that also exists in the other repo, the user config, or the workspace file.
- Diagnose suspected loops via `Developer: Toggle Developer Tools` → Console: a line repeating roughly once per second is the tell.

## Cleanup discipline

- When an approach fails, remove every artifact it produced — files created, config keys added, lockfile edits — before finishing the prompt. Do not leave dead configs, unused files, or failed workarounds in the codebase.

## Integration boundaries and pitfalls

- Keep public-site changes in this repo. If a task requires changing API contracts, CMS models, admin resources, or backend auth/upload behavior, make the corresponding update in `ArmadaCMS/` and follow its instruction file.
- On Windows, if the folder was moved or renamed and installed packages suddenly fail with `MODULE_NOT_FOUND`, delete `node_modules` and run `pnpm install` again; pnpm junctions can retain old absolute paths.

<!-- mermaid-ai-skills:start -->

## Mermaid Diagrams

When the user asks to create, edit, or visualize a diagram, follow the
instructions in `.github/instructions/mermaid.instructions.md`.

<!-- mermaid-ai-skills:end -->
