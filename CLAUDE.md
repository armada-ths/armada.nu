# armada.nu Claude notes

This file is a compatibility wrapper for non-Copilot agents. The canonical instructions live in `.github/copilot-instructions.md`.

Also check:

- `README.md` for setup, scripts, Storybook, and workspace launches
- `.github/instructions/terraform.instructions.md` for `infra/terraform/**`

## Must-follow rules

- Run time-consuming scripts such as builds, full test suites, linters, or type checks only when the scope or risk of the changes creates a realistic chance that they will fail and reveal an error; otherwise use targeted, lightweight checks or inspection.
- This repo owns the Web, Photos and Order Next.js apps; backend/admin changes belong in `../ArmadaCMS` as well.
- Use `pnpm` only, with Node 24.x.
- When the validation policy above warrants it, validate with `pnpm lint`, `pnpm type-check`, and `pnpm build`; for UI or story work also run `pnpm test` and the relevant Storybook check when practical.
- Add application env vars to the owning app's `src/env.ts`; preserve and document framework/tooling variables and the Order proxy's `EXPO_ACCESS_TOKEN` entry-point exception.
- Reuse `packages/shared/src/Page.tsx` for full-page layout structure.
- Preserve ISR/revalidation by keeping API hook cache tags in sync.
- Update `apps/web/src/app/sitemap.ts` when public routes change.
- Keep `packages/shared/src/theme.css` and `packages/shared/src/colors.ts` aligned when brand colors change.
- Run the documented validation commands and manual page checks when warranted by the scope or risk of the changes.

When in doubt, follow `.github/copilot-instructions.md` over this summary.
