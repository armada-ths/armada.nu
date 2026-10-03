# armada.nu agent guide

This file exists for cross-agent compatibility. The canonical project instructions live in `.github/copilot-instructions.md`.

Also consult:

- `README.md` for setup, scripts, Storybook, and workspace launches
- `.github/instructions/terraform.instructions.md` when editing `infra/terraform/**`

## Project scope

`armada.nu` is the public website: Next.js App Router + React + TypeScript + Tailwind.

If a task changes API contracts, CMS models, admin resources, or backend auth/upload behavior, also update the sibling `../ArmadaCMS` repo and follow its instructions.

## Fast path

- Run time-consuming scripts such as builds, full test suites, linters, or type checks only when the scope or risk of the changes creates a realistic chance that they will fail and reveal an error; otherwise use targeted, lightweight checks or inspection.
- Use `pnpm` only and target Node 24.x.
- When the validation policy above warrants it, validate with `pnpm lint`, `pnpm type-check`, and `pnpm build`; for UI or story changes also run `pnpm test` and the relevant Storybook check when practical.
- Register application environment variables in the owning app's `src/env.ts`; keep framework/tooling variables and the existing `EXPO_ACCESS_TOKEN` proxy entry-point exception documented.
- Use the existing page primitives in `@armada/shared/Page` for full-page layouts instead of inventing new wrappers.
- Keep shared layout consistent by using the existing page/layout primitives and surrounding patterns instead of inventing new ones.
- When adding or changing API hooks in `apps/web/src/components/shared/hooks/api/`, include the correct cache `tags` so ISR and on-demand revalidation keep working.
- Update `apps/web/src/app/sitemap.ts` when public pages are added, removed, or gated by feature flags.
- Keep `packages/shared/src/theme.css` and `packages/shared/src/colors.ts` in sync when brand colors change.
- Normalize user-supplied external URLs with `normalizeExternalUrl()`.

## Useful examples

- `apps/web/src/components/shared/Page.tsx` for shared page structure
- `apps/web/src/components/shared/hooks/api/` for the server/client data hook pattern
- `apps/web/src/app/exhibitor/actions.ts` for server action flows (Zod → reCAPTCHA → Slack)

Keep this file concise and keep `.github/copilot-instructions.md` as the source of truth.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Workspace applications

The pnpm workspace contains `apps/web` (main website), `apps/photos` (guest photos), `apps/order` (exhibitor orders), and `packages/shared` (`@armada/shared`). Shared theme tokens, fonts, Page, cn and common UI live in that package; do not duplicate them in apps. Web compatibility re-exports are intentional.

- `pnpm dev`: Web on 8000; `pnpm dev:photos`: Photos on 8001; `pnpm dev:order`: Order on 8002; `pnpm dev:all`: all three.
- Each app reads its own `.env.local` and has an `.env.example`. Root environment files are not loaded by workspace apps. Public API origins must be configured for builds too.
- `pnpm build`, `pnpm lint`, `pnpm type-check`, and `pnpm test` cover the workspace. `pnpm exec vitest run --project unit` runs fast unit tests.
- Shared Storybook uses aliases `@/*` (Web), `@photos/*` (Photos), and `@order/*` (Order). Run shadcn tooling from the owning app directory.
- Photos and Order have independent layouts, no main-site CMS layout dependencies, noindex, no-referrer and app-specific telemetry redaction. Web no longer masks retired token routes.
- Order fetches dates/exhibitors with no-store; it does not use the Web revalidation webhook. Order actions validate access, dates and catalogue inputs server-side; unlike the Web sales contact form, they do not use reCAPTCHA.

See [the staged migration runbook](docs/standalone-apps.md) before changing Vercel roots or domains. Root `src/`, `public/` and Next config are a temporary deployment bridge, not the source for new feature work.
