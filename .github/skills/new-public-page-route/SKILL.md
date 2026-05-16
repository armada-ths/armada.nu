---
name: new-public-page-route
description: "Create or update an armada.nu public page or route. Use for Next.js App Router pages, route-specific components, shared page layout primitives, feature-flagged routes, sitemap updates, API-hook wiring, server actions, Storybook coverage, and armada.nu pages that depend on ArmadaCMS content."
argument-hint: "[route path] [data source?] [feature flag?] [form?]"
---

# New Public Page or Route

Use this skill when adding a public-facing route in `armada.nu` or substantially restructuring an existing page.

## Before You Start

- Read `README.md` and `.github/copilot-instructions.md` first; they are the canonical source.
- Reuse existing patterns instead of inventing new route scaffolding.
- Start from these examples:
  - `src/components/shared/Page.tsx`
  - `src/components/shared/hooks/api/`
  - `src/app/exhibitor/actions.ts`
  - `src/app/sitemap.ts`

## Gather Decisions Up Front

Confirm these details before editing files:

1. Final route path under `src/app/`.
2. Whether the page is public all the time or gated by a feature flag.
3. Whether it fetches ArmadaCMS data, static data, or no data.
4. Whether it includes forms or server-side integrations.
5. Whether it introduces new shared UI or only route-local UI.
6. Whether the change also requires an ArmadaCMS update.

## Procedure

### 1. Create the route structure

1. Add the route under `src/app/` using App Router conventions.
2. Keep route-specific UI in a colocated `_components/` directory when the page needs more than a tiny inline component.
3. Put reusable UI in `src/components/shared/` or `src/components/ui/` instead of burying it in the route.

### 2. Use the shared page layout

1. Prefer `Page.Boundary`, `Page.Header`, and `Page.Background` from `src/components/shared/Page.tsx` for full-page structure.
2. Match the surrounding design system instead of introducing one-off wrappers.
3. Use existing font and color tokens rather than raw values.

### 3. Handle data the project way

If the page fetches ArmadaCMS or other server data:

1. Add or extend a hook in `src/components/shared/hooks/api/`.
2. Follow the dual-export pattern:
   - `fetch*()` for server components
   - `use*()` for client components
3. Include `next: { revalidate: 86400, tags: ["tag-name"] }` on fetches that should participate in ISR and on-demand revalidation.
4. If you add a new tag, make sure the sibling `ArmadaCMS` repo uses the same exact tag string for write-time revalidation.

### 4. Add feature flags and sitemap entries when needed

If the page is feature-gated:

1. Define or reuse the flag in `src/feature_flags.ts`.
2. Read it using `await feature("FLAG_NAME")` from `src/components/shared/feature.ts`.
3. Update `src/app/sitemap.ts` so the route is only included when the flag is enabled.

If the page is public and indexable:

1. Add the route to `src/app/sitemap.ts`.
2. Pick sensible `changeFrequency` and `priority` values that match nearby routes.

### 5. Use server actions for form flows

If the page submits forms or talks to external services:

1. Create or extend a colocated `actions.ts` file with `"use server"`.
2. Follow the established pattern:
   - Zod schema validation
   - reCAPTCHA verification
   - Slack webhook or other external integration
3. Register any new frontend environment variables in `src/env.ts`.
4. If the route requires new secrets and no local env file exists, create the local env file with placeholders before asking the user to wire real values.

### 6. Keep shared branding and safety rules intact

1. Normalize user-supplied URLs with `normalizeExternalUrl()`.
2. If you add or change brand colors, update both:
   - `src/app/globals.css`
   - `src/lib/colors.ts`
3. Avoid raw hex values in TS/TSX files.
4. Match the existing choice between shadcn/ui and MUI based on surrounding code instead of mixing both arbitrarily.

### 7. Add stories for UI work

If the task adds or materially changes reusable UI:

1. Create or update a colocated `*.stories.tsx` file.
2. Use `@storybook/nextjs-vite` for `Meta` and `StoryObj`.
3. Use `storybook/test` for `fn`, `expect`, and `userEvent`.
4. Add meaningful variants and a `play` function when interaction coverage matters.

## Branching Rules

### If the page is mostly static

- Keep it server-rendered and avoid unnecessary client components.
- Skip React Query unless the page truly needs client-side interactivity.

### If the page depends on ArmadaCMS data

- Put the fetch logic in `src/components/shared/hooks/api/` rather than directly in the page component.
- Use the correct cache tag so ArmadaCMS revalidation continues to work.

### If the page introduces reusable UI

- Promote reusable pieces into `src/components/shared/` or `src/components/ui/`.
- Back them with Storybook stories instead of leaving the behavior visible only through the page.

### If the page requires backend contract changes

- Update `../ArmadaCMS` in the same task, following the instructions in `.github/skills/new-cms-resource/SKILL.md`.
- If ArmadaCMS is not available, mock the API response in `src/components/shared/hooks/api/` and clearly mark it with a TODO to replace with the real API call later.

## Completion Checklist

Do not consider the route done until you have checked all relevant items:

- Route exists in `src/app/` with the right colocated structure.
- Shared layout uses `Page.*` primitives where appropriate.
- Data hooks live in `src/components/shared/hooks/api/` when data fetching is involved.
- ISR `tags` are configured for cacheable CMS-backed data.
- Feature flags are wired when the route is gated.
- `src/app/sitemap.ts` is updated for public routes.
- `actions.ts` follows the Zod → reCAPTCHA → integration pattern when forms are involved.
- New environment variables are registered in `src/env.ts`.
- Shared UI stories exist for reusable components.
- Cross-repo changes are made in `../ArmadaCMS` when API contracts changed, if practical in the same task.

## Validation

Run the checks that match the change:

- `pnpm lint`
- `pnpm type-check`
- `pnpm build`
- For UI/story work: `pnpm test` and `pnpm build-storybook` when practical

Also do a manual page check in the browser.

## Common Pitfalls

- Adding a public page and forgetting `src/app/sitemap.ts`.
- Creating a new CMS-backed fetch without a `tags` array.
- Adding frontend env vars without registering them in `src/env.ts`.
- Updating only `src/app/globals.css` or only `src/lib/colors.ts` when changing brand colors.
- Mixing UI systems inconsistently instead of matching nearby code.
- Putting route-specific implementation details into shared components too early, or shared logic into route-local folders too late.
