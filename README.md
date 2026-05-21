# armada.nu

The public website for [THS Armada](https://armada.nu) — KTH's and Sweden's largest student career fair.

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
- **UI**: React 19, [shadcn/ui](https://ui.shadcn.com/) (Radix + CVA), some MUI components
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
   cp .env.example .env.local
   ```

   Fill in the values you need. Not all variables are required — see the comments in `.env.example` for details.

4. **Start the dev server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:8000](http://localhost:8000).

## VS Code workspace and launches

This repo includes shared VS Code configuration for both single-repo and multi-repo workflows.

### Single-repo config

In `.vscode/` you will find:

- `tasks.json` — shared tasks for `dev`, `lint`, `type-check`, and `build`
- `launch.json` — browser launches that use the shared dev tasks

### Multi-repo workspace

If you work on both the public site and the CMS together, open:

- `Armada.code-workspace`

That workspace opens:

- `armada.nu`
- `../ArmadaCMS`

and includes compound launches such as:

- `✅ Frontend + Prod CMS`
- `✅ Full Stack Local (Docker)`

This requires you to have both repos checked out in the same parent directory.

## Scripts

| Command                | Description                   |
| ---------------------- | ----------------------------- |
| `pnpm dev`             | Start dev server (port 8000)  |
| `pnpm build`           | Production build              |
| `pnpm start`           | Start production server       |
| `pnpm storybook`       | Run Storybook (port 6006)     |
| `pnpm build-storybook` | Build static Storybook output |
| `pnpm lint`            | Run ESLint                    |
| `pnpm type-check`      | Run TypeScript type checking  |
| `pnpm format`          | Format code with Prettier     |
| `pnpm format:check`    | Check formatting              |

## Storybook

This repo uses [Storybook](https://storybook.js.org/) to build and review UI components in isolation. Story files live next to components and use the `*.stories.tsx` naming convention. Prefer multiple story variants and `play` functions for interactive states. The repo also integrates with [Chromatic](https://www.chromatic.com/) for visual regression testing via CI — see the [CI / CD](#ci--cd) section.

## Project Structure

```text
src/
├── app/                  # Next.js App Router pages
│   ├── _components/      # Landing page components
│   ├── about/            # /about routes
│   ├── exhibitor/        # /exhibitor routes
│   ├── student/          # /student routes
│   ├── globals.css       # Tailwind v4 theme & global styles
│   ├── layout.tsx        # Root layout (fonts, metadata)
│   └── page.tsx          # Homepage
├── components/
│   ├── shared/           # Shared components (Page, NavigationMenu, Footer, hooks)
│   └── ui/               # shadcn/ui primitives
├── lib/
│   └── utils.ts          # cn(), date helpers (Luxon)
├── env.ts                # All env vars — add new ones here
└── feature_flags.ts      # Feature flag definitions & CMS-backed defaults
```

## Key Conventions

- **Adding env vars**: Always register them in `src/env.ts`. Use `NEXT_PUBLIC_` prefix for client-safe vars.
- **Data fetching**: Use the dual-export pattern in `src/components/shared/hooks/api/` — `fetch*()` for server components, `use*()` hooks for client components.
- **Feature flags**: Use `await feature("FLAG_NAME")` in server components (see `src/components/shared/feature.ts`). Default values are fetched from ArmadaCMS (`/api/v1/featureflags`), with Vercel flag cookie overrides applied.
- **Adding shadcn components**: `npx shadcn@latest add <component>`
- **Adding pages**: Add an entry to `src/app/sitemap.ts`. If the page is gated by a feature flag, the sitemap conditionally includes it.
- **Cache revalidation**: The site uses ISR with on-demand revalidation. Each data hook sets `next: { revalidate: 86400, tags: ["<tag>"] }`. The CMS triggers `POST /api/revalidate` after write operations to purge specific cache tags instantly. See the [tag inventory in copilot-instructions.md](.github/copilot-instructions.md#cache-revalidation) for the full list.
- **Analytics**: Vercel Analytics and Speed Insights are loaded in the root layout. Use `TrackedLink` from `src/components/shared/TrackedLink.tsx` for user-interaction tracking.
- **Brand colors**:
  - Prefer semantic Tailwind classes like `text-melon`, `bg-coconut`, `text-licorice` (from `src/app/globals.css`).
  - Runtime JS/TS color values live in `src/lib/colors.ts` (`HEX_COLORS`).
  - `src/app/globals.css` and `src/lib/colors.ts` are a paired source of truth and must be kept in sync when adding/changing color values.
  - Avoid hardcoded hex values in `src/**/*.{ts,tsx,js,jsx}`; add/reuse constants in `src/lib/colors.ts`.

## CI / CD

CI is handled by GitHub Actions and CD by Vercel's GitHub integration.

### GitHub Actions (CI)

Repository checks live in `.github/workflows/`:

- `ci.yml` — runs on push to `main`/`staging` and on pull requests; runs `pnpm lint`, `pnpm type-check`, and `pnpm format:check` as separate jobs.
- `chromatic.yml` — runs on every push; builds Storybook and uploads it to Chromatic for visual regression testing. PRs get a Chromatic status check with visual diffs. `CHROMATIC_PROJECT_TOKEN` is stored as a GitHub secret — do not commit it to the repo. The `autoAcceptChanges: main` option auto-approves baseline updates on the `main` branch.
- `codeql.yml` — runs on push to `main`/`staging`, PRs, and on a weekly schedule; CodeQL security analysis covering JavaScript/TypeScript and Actions workflows.

### Vercel (CD)

Deployments are handled automatically by Vercel's GitHub integration:

- Every push to `main` triggers a **production deployment** to [armada.nu](https://armada.nu).
- Every push to `staging` triggers a **preview deployment** to [staging.armada.nu](https://staging.armada.nu).
- Pull requests from branches other than `main`/`staging` trigger **preview deployments** with unique Vercel URLs.
- Preview deployments are protected by Vercel Deployment Protection; `VERCEL_AUTOMATION_BYPASS_SECRET` is used by the CMS to send cache revalidation requests to preview/staging deployments.
- Vercel project configuration (env vars, domain settings, etc.) is managed with Terraform — see [`infra/terraform/vercel/prod/README.md`](infra/terraform/vercel/prod/README.md) for details.

## Backend environments

Set `NEXT_PUBLIC_API_URL` in `.env.local` to point the dev server at a different backend:

| Environment | API base URL                           |
| ----------- | -------------------------------------- |
| Local dev   | `http://localhost:8080/api/v1`         |
| Staging     | `https://staging.cms.armada.nu/api/v1` |
| Production  | `https://cms.armada.nu/api/v1`         |
