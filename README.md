# armada.nu

[![Checks](https://github.com/armada-ths/armada.nu/actions/workflows/ci.yml/badge.svg)](https://github.com/armada-ths/armada.nu/actions/workflows/ci.yml)
[![Chromatic](https://github.com/armada-ths/armada.nu/actions/workflows/chromatic.yml/badge.svg)](https://github.com/armada-ths/armada.nu/actions/workflows/chromatic.yml)
[![Production deployment](https://img.shields.io/github/deployments/armada-ths/armada.nu/Production?label=production&logo=vercel)](https://github.com/armada-ths/armada.nu/deployments/Production)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Farmada.nu&label=armada.nu)](https://armada.nu)
[![Last commit](https://img.shields.io/github/last-commit/armada-ths/armada.nu)](https://github.com/armada-ths/armada.nu/commits)
[![Open issues](https://img.shields.io/github/issues/armada-ths/armada.nu)](https://github.com/armada-ths/armada.nu/issues)
[![License: MIT](https://img.shields.io/github/license/armada-ths/armada.nu)](https://github.com/armada-ths/armada.nu/blob/main/license.txt)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript 5.9](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js 24](https://img.shields.io/badge/Node.js-24-5FA04E?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![pnpm 11](https://img.shields.io/badge/pnpm-11-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Storybook 10](https://img.shields.io/badge/Storybook-10-FF4785?logo=storybook&logoColor=white)](https://storybook.js.org/)

The Web, Photos and Exhibitor Order applications for [THS Armada](https://armada.nu) — KTH's and Sweden's largest student career fair.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [VS Code workspace and launches](#vs-code-workspace-and-launches)
- [Scripts](#scripts)
- [Storybook](#storybook)
- [Project Structure](#project-structure)
- [Key Conventions](#key-conventions)
- [CI / CD](#ci--cd)
- [Backend environments](#backend-environments)

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **UI**: React 19, [shadcn/ui](https://ui.shadcn.com/) (Radix + CVA)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first config)
- **Data fetching**: [TanStack React Query](https://tanstack.com/query), server components with async `fetch*` functions
- **Backend API**: [ArmadaCMS](https://github.com/armada-ths/ArmadaCMS) (Go REST API)
- **Deployment**: [Vercel](https://vercel.com/)

## Prerequisites

- [Node.js 24.x](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (pinned version via `packageManager` in `package.json`)

## Getting Started

1. **Clone the repo**

   ```bash
   git clone https://github.com/armada-ths/armada.nu.git
   cd armada.nu
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp apps/web/.env.example apps/web/.env.local
   cp apps/photos/.env.example apps/photos/.env.local
   cp apps/order/.env.example apps/order/.env.local
   ```

   Fill in the values you need. Not all variables are required — see the comments in each app's `.env.example` for details.

4. **Start the dev server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:8000](http://localhost:8000).

## VS Code workspace and launches

This repo includes shared VS Code configuration for both single-repo and multi-repo workflows.

### Single-repo config

In `.vscode/` you will find:

- `tasks.json` — tasks for starting the public site against the configured, production, or local CMS, plus formatting, linting, type-checking, builds, and Storybook
- `launch.json` — browser launches that state which CMS environment their development server uses

### Multi-repo workspace

If you work on both the public site and the CMS together, open:

- `Armada.code-workspace`

That workspace opens:

- `armada.nu`
- `../ArmadaCMS`

and includes these compound launches:

- `Workspace: Open Public Site (Production CMS)`
- `Workspace: Open Public Site + Admin UI (Local Backend + Supabase)`
- `Workspace: Open Admin UI (Local Backend + Supabase)`

This requires you to have both repos checked out in the same parent directory.

## Scripts

| Command                | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `pnpm dev`             | Start dev server (port 8000)                        |
| `pnpm dev:photos`      | Photos dev server (port 8001)                       |
| `pnpm dev:order`       | Order dev server (port 8002)                        |
| `pnpm dev:all`         | All app dev servers                                 |
| `pnpm build`           | Production builds for all apps                      |
| `pnpm start`           | Start production server                             |
| `pnpm storybook`       | Run Storybook (port 6006)                           |
| `pnpm build-storybook` | Build static Storybook output                       |
| `pnpm test`            | Run unit and Storybook tests with Vitest/Playwright |
| `pnpm chromatic`       | Publish Storybook to Chromatic                      |
| `pnpm lint`            | Run ESLint                                          |
| `pnpm type-check`      | Run TypeScript type checking                        |
| `pnpm format`          | Format code with Prettier                           |
| `pnpm format:check`    | Check formatting                                    |

## Storybook

This repo uses [Storybook](https://storybook.js.org/) to build and review UI components in isolation. Story files live next to components and use the `*.stories.tsx` naming convention. Prefer multiple story variants and `play` functions for interactive states. The repo also integrates with [Chromatic](https://www.chromatic.com/) for visual regression testing via CI — see the [CI / CD](#ci--cd) section.

## Project Structure

```text
apps/
├── web/                  # Main website; public pages and ISR
├── photos/               # Guest camera/upload/gallery and privacy
└── order/                # Access-gated exhibitor ordering
packages/shared/src/      # Brand theme, fonts, Page, cn, telemetry and common UI
.storybook/               # One component explorer / Chromatic project
infra/terraform/          # Vercel settings and separate Cloud DNS state
```

Each app has its own `src/app`, `src/env.ts`, `public`, Next config and TypeScript config. Root `src` and `public` temporarily preserve the old deployment during the two-phase cutover; do not edit them for new features.

## Key Conventions

- **Adding env vars**: Register application variables in the owning app's `src/env.ts` unless they must be read directly by framework entry points. `EXPO_ACCESS_TOKEN` belongs only to the Order app; `FLAGS_SECRET`, `ENABLE_EXPERIMENTAL_COREPACK`, and `CHROMATIC_PROJECT_TOKEN` are consumed by their respective tooling. Use the `NEXT_PUBLIC_` prefix only for client-safe values.
- **Data fetching**: Use the dual-export pattern in `apps/web/src/components/shared/hooks/api/` — `fetch*()` for server components, `use*()` hooks for client components.
- **Feature flags**: Use `await feature("FLAG_NAME")` in server components (see `apps/web/src/components/shared/feature.ts`). Default values are fetched from ArmadaCMS (`/api/v1/featureflags`), with Vercel flag cookie overrides applied.
- **Adding shadcn components**: `pnpm dlx shadcn@latest add <component>`
- **Adding pages**: Add an entry to `apps/web/src/app/sitemap.ts`. If the page is gated by a feature flag, the sitemap conditionally includes it.
- **Cache revalidation**: The site uses ISR with on-demand revalidation. Each data hook sets `next: { revalidate: 86400, tags: ["<tag>"] }`. The CMS triggers `POST /api/revalidate` after write operations to purge specific cache tags instantly. See the [tag inventory in copilot-instructions.md](.github/copilot-instructions.md#cache-revalidation) for the full list.
- **Analytics**: Vercel Analytics and Speed Insights are loaded in the root layout. Use `TrackedLink` from `apps/web/src/components/shared/TrackedLink.tsx` for user-interaction tracking.
- **Brand colors**:
  - Prefer semantic Tailwind classes like `text-melon`, `bg-coconut`, `text-licorice` (from `packages/shared/src/theme.css`).
  - Runtime JS/TS color values live in `packages/shared/src/colors.ts` (`HEX_COLORS`).
  - `packages/shared/src/theme.css` and `packages/shared/src/colors.ts` are a paired source of truth and must be kept in sync when adding/changing color values.
  - Avoid hardcoded hex values in `apps/web/src/**/*.{ts,tsx,js,jsx}`; add/reuse constants in `packages/shared/src/colors.ts`.

## CI / CD

CI is handled by GitHub Actions and CD by Vercel's GitHub integration.

### GitHub Actions (CI)

Repository checks live in `.github/workflows/`:

- `ci.yml` — checks lint, types, formatting, unit/Storybook tests and a build matrix for all three apps on main/staging pushes and pull requests.
- `chromatic.yml` — runs on every push; builds Storybook and uploads it to Chromatic for visual regression testing. PRs get a Chromatic status check with visual diffs. `CHROMATIC_PROJECT_TOKEN` is stored as a GitHub secret — do not commit it to the repo. The `autoAcceptChanges: main` option auto-approves baseline updates on the `main` branch.

Both workflows cancel superseded runs for the same branch or pull request and use
job timeouts so stale checks do not consume runner capacity indefinitely.

### Vercel (CD)

Deployments are handled automatically by Vercel's GitHub integration:

- Every push to `main` triggers a **production deployment** to [armada.nu](https://armada.nu).
- Every push to `staging` triggers a **preview deployment** to [staging.armada.nu](https://staging.armada.nu).
- Pull requests from branches other than `main`/`staging` trigger **preview deployments** with unique Vercel URLs.
- Preview deployments are protected by Vercel Deployment Protection. The staging CMS sends `VERCEL_AUTOMATION_BYPASS_SECRET` when it calls the staging/preview revalidation endpoint.
- Core Vercel project settings and application-specific environment-variable definitions are managed in the `vercel/prod` Terraform root. Vercel domain objects and deployments are not managed there. Google Cloud DNS is authoritative for `armada.nu` and is managed separately in the `gcp/dns-prod` root with DNSSEC enabled; Websupport remains the registrar and its NS/DS settings are manual. See [`infra/terraform/README.md`](infra/terraform/README.md) for the ownership boundaries.

## Backend environments

Set `NEXT_PUBLIC_API_URL` in `apps/web/.env.local` to point the dev server at a different backend:

`NEXT_PUBLIC_API_URL` is the backend origin. Do not append `/api/v1`; the data
hooks add that path themselves.

| Environment | API origin                      |
| ----------- | ------------------------------- |
| Local dev   | `http://localhost:8080`         |
| Staging     | `https://staging.cms.armada.nu` |
| Production  | `https://cms.armada.nu`         |

## Workspace applications

The pnpm workspace contains `apps/web` (main website), `apps/photos` (guest photos), `apps/order` (exhibitor orders), and `packages/shared` (`@armada/shared`). Shared theme tokens, fonts, Page, cn and common UI live in that package; do not duplicate them in apps. Web compatibility re-exports are intentional.

- `pnpm dev`: Web on 8000; `pnpm dev:photos`: Photos on 8001; `pnpm dev:order`: Order on 8002; `pnpm dev:all`: all three.
- Each app reads its own `.env.local` and has an `.env.example`. Root environment files are not loaded by workspace apps. Public API origins must be configured for builds too.
- `pnpm build`, `pnpm lint`, `pnpm type-check`, and `pnpm test` cover the workspace. `pnpm exec vitest run --project unit` runs fast unit tests.
- Shared Storybook uses aliases `@/*` (Web), `@photos/*` (Photos), and `@order/*` (Order). Run shadcn tooling from the owning app directory.
- Photos and Order have independent layouts, no main-site CMS layout dependencies, noindex, no-referrer and app-specific telemetry redaction. Web no longer masks retired token routes.
- Order fetches dates/exhibitors with no-store; it does not use the Web revalidation webhook. Order actions validate access, dates and catalogue inputs server-side; unlike the Web sales contact form, they do not use reCAPTCHA.

See [the staged migration runbook](docs/standalone-apps.md) before changing Vercel roots or domains. Root `src/`, `public/` and Next config are a temporary deployment bridge, not the source for new feature work.
