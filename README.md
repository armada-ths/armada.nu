# armada.nu

The public website for [THS Armada](https://armada.nu) — KTH's and Sweden's largest student career fair.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **UI**: React 19, [shadcn/ui](https://ui.shadcn.com/) (Radix + CVA), some MUI components
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first config)
- **Data fetching**: [TanStack React Query](https://tanstack.com/query), server components with async `fetch*` functions
- **Backend API**: [ArmadaCMS](https://github.com/armada-ths/ArmadaCMS) (Go REST API)
- **Deployment**: [Vercel](https://vercel.com/)

## Prerequisites

- [Node.js 22.x](https://nodejs.org/)
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

| Command      | Description                  |
| ------------ | ---------------------------- |
| `pnpm dev`   | Start dev server (port 8000) |
| `pnpm build` | Production build             |
| `pnpm start` | Start production server      |
| `pnpm lint`  | Run ESLint                   |

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
- **Adding pages**: Add an entry to `src/app/sitemap.ts`.
- **Brand colors**: Use Tailwind classes like `text-melon-700`, `bg-coconut`, `text-licorice` (defined in `globals.css`).

## Infrastructure as code

Vercel project configuration is managed with Terraform:

- [`infra/terraform/vercel/prod/README.md`](infra/terraform/vercel/prod/README.md) — workspace setup, import bootstrap, and env var lifecycle

Use that document as the canonical source for infrastructure specifics rather than duplicating them here.

## Backend environments

| Environment | API base URL                           | Admin UI                               |
| ----------- | -------------------------------------- | -------------------------------------- |
| Local dev   | `http://localhost:8080/api/v1`         | `http://localhost:5173`                |
| Staging     | `https://staging.cms.armada.nu/api/v1` | `https://staging.cms.armada.nu/admin/` |
| Production  | `https://cms.armada.nu/api/v1`         | `https://cms.armada.nu/admin/`         |

To point the local Next.js dev server at one of these environments, set
`NEXT_PUBLIC_API_URL` in `.env.local`.
