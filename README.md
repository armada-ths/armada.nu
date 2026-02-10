# armada.nu

The public website for [THS Armada](https://armada.nu) — KTH's and Sweden's largest student career fair.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **UI**: React 19, [shadcn/ui](https://ui.shadcn.com/) (Radix + CVA), some MUI components
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first config)
- **Data fetching**: [TanStack React Query](https://tanstack.com/query), server components with async `fetch*` functions
- **CMS**: [Contentful](https://www.contentful.com/) (preview API in dev, delivery API in prod)
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

## Scripts

| Command      | Description                  |
| ------------ | ---------------------------- |
| `pnpm dev`   | Start dev server (port 8000) |
| `pnpm build` | Production build             |
| `pnpm start` | Start production server      |
| `pnpm lint`  | Run ESLint                   |

## Project Structure

```
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
│   ├── contentful.ts     # Contentful CMS client
│   └── utils.ts          # cn(), date helpers (Luxon)
├── env.ts                # All env vars — add new ones here
└── feature_flags.ts      # Feature flag definitions & defaults
```

## Key Conventions

- **Adding env vars**: Always register them in `src/env.ts`. Use `NEXT_PUBLIC_` prefix for client-safe vars.
- **Data fetching**: Use the dual-export pattern in `src/components/shared/hooks/api/` — `fetch*()` for server components, `use*()` hooks for client components.
- **Feature flags**: Use `await feature("FLAG_NAME")` in server components (see `src/components/shared/feature.ts`).
- **Adding shadcn components**: `npx shadcn@latest add <component>`
- **Adding pages**: Add an entry to `src/app/sitemap.ts`.
- **Brand colors**: Use Tailwind classes like `text-melon-700`, `bg-coconut`, `text-licorice` (defined in `globals.css`).
