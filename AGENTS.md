# armada.nu agent guide

This file exists for cross-agent compatibility. The canonical project instructions live in `.github/copilot-instructions.md`.

Also consult:

- `README.md` for setup, scripts, Storybook, and workspace launches
- `.github/instructions/terraform.instructions.md` when editing `infra/terraform/**`

## Project scope

`armada.nu` is the public website: Next.js App Router + React + TypeScript + Tailwind.

If a task changes API contracts, CMS models, admin resources, or backend auth/upload behavior, also update the sibling `../ArmadaCMS` repo and follow its instructions.

## Fast path

- Use `pnpm` only and target Node 24.x.
- Validate with `pnpm lint`, `pnpm type-check`, and `pnpm build`; for UI or story changes also run `pnpm test` and the relevant Storybook check when practical.
- Register every frontend environment variable in `src/env.ts`.
- Use the existing page primitives in `src/components/shared/Page.tsx` for full-page layouts instead of inventing new wrappers.
- Keep shared layout consistent by using the existing page/layout primitives and surrounding patterns instead of inventing new ones.
- When adding or changing API hooks in `src/components/shared/hooks/api/`, include the correct cache `tags` so ISR and on-demand revalidation keep working.
- Update `src/app/sitemap.ts` when public pages are added, removed, or gated by feature flags.
- Keep `src/app/globals.css` and `src/lib/colors.ts` in sync when brand colors change.
- Normalize user-supplied external URLs with `normalizeExternalUrl()`.

## Useful examples

- `src/components/shared/Page.tsx` for shared page structure
- `src/components/shared/hooks/api/` for the server/client data hook pattern
- `src/app/exhibitor/actions.ts` for server action flows (Zod → reCAPTCHA → Slack)

Keep this file concise and keep `.github/copilot-instructions.md` as the source of truth.
