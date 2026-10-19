# armada.nu

[![Checks](https://github.com/armada-ths/armada.nu/actions/workflows/ci.yml/badge.svg)](https://github.com/armada-ths/armada.nu/actions/workflows/ci.yml)
[![Chromatic](https://github.com/armada-ths/armada.nu/actions/workflows/chromatic.yml/badge.svg)](https://github.com/armada-ths/armada.nu/actions/workflows/chromatic.yml)
[![CodeQL](https://github.com/armada-ths/armada.nu/actions/workflows/codeql.yml/badge.svg)](https://github.com/armada-ths/armada.nu/actions/workflows/codeql.yml)
[![Web production deployment](https://img.shields.io/github/deployments/armada-ths/armada.nu/Production%20%E2%80%93%20armada-nu?label=web%20production&logo=vercel)](https://vercel.com/thsarmada/armada-nu/deployments)
[![Photos production deployment](https://img.shields.io/github/deployments/armada-ths/armada.nu/Production%20%E2%80%93%20armada-photos?label=photos%20production&logo=vercel)](https://vercel.com/thsarmada/armada-photos/deployments)
[![Order production deployment](https://img.shields.io/github/deployments/armada-ths/armada.nu/Production%20%E2%80%93%20armada-order?label=order%20production&logo=vercel)](https://vercel.com/thsarmada/armada-order/deployments)

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

1. **Clone and install**

   ```bash
   git clone https://github.com/armada-ths/armada.nu.git
   cd armada.nu
   pnpm install --frozen-lockfile
   ```

2. **Configure the apps you want to run**

   ```bash
   cp apps/web/.env.example apps/web/.env.local
   cp apps/photos/.env.example apps/photos/.env.local
   cp apps/order/.env.example apps/order/.env.local
   ```

   Each app loads its own `.env.local`; root environment files are not used. Follow the comments in its `.env.example` and choose a [backend environment](#backend-environments). Photos needs an event link; Order needs a valid access token. Keep tokens and secrets out of source control.

3. **Start development**

   Run `pnpm dev` for Web at <http://localhost:8000>, `pnpm dev:photos` for Photos at <http://localhost:8001>, or `pnpm dev:order` for Order at <http://localhost:8002>. `pnpm dev:all` starts all three.

## VS Code workspace and launches

[`.vscode/`](.vscode/) contains start/stop tasks and browser launches for each app. Choose **Configured CMS**, **Production CMS** or **Local CMS**; the single-repo Local CMS launch expects an already-running backend. Launch variants for the same app share a port, so run one at a time. Stopping a launch also stops its matching VS Code server task, including one started manually.

For frontend and CMS work together, open [`Armada.code-workspace`](Armada.code-workspace) with both repos checked out in the same parent directory. Local compound launches start the selected apps, Admin, backend and Supabase, and stop them together. See the [CMS guide](../ArmadaCMS/README.md) for backend development.

## Scripts

| Command                | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `pnpm dev`             | Start dev server (port 8000)                        |
| `pnpm dev:photos`      | Photos dev server (port 8001)                       |
| `pnpm dev:order`       | Order dev server (port 8002)                        |
| `pnpm dev:all`         | All app dev servers                                 |
| `pnpm build`           | Production builds for all apps                      |
| `pnpm start`           | Start Web production server                         |
| `pnpm storybook`       | Run Storybook (port 6006)                           |
| `pnpm build-storybook` | Build static Storybook output                       |
| `pnpm test`            | Run unit and Storybook tests with Vitest/Playwright |
| `pnpm chromatic`       | Publish Storybook to Chromatic                      |
| `pnpm lint`            | Run ESLint                                          |
| `pnpm type-check`      | Run TypeScript type checking                        |
| `pnpm format`          | Format code with Prettier                           |
| `pnpm format:check`    | Check formatting                                    |

## Storybook

Run `pnpm storybook` to review components at <http://localhost:6006>. Stories live beside components as `*.stories.tsx`, with variants and `play` functions for interactive states. [Chromatic](https://www.chromatic.com/) provides visual regression checks in CI; see the [story guidelines](.github/copilot-instructions.md#storybook-and-chromatic).

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

Each app has its own `src/app`, `src/env.ts`, `public`, Next config and TypeScript config. The repository root owns workspace scripts, the lockfile, Storybook, linting, formatting and CI. Runtime dependencies are declared by their owning app or shared package; root dependencies support development tooling.

## Key Conventions

- Keep application code and environment variables in the owning app; register application variables in its `src/env.ts`. Only client-safe values use `NEXT_PUBLIC_`.
- Reuse UI, fonts and theme tokens from `@armada/shared`. Keep `theme.css` and `colors.ts` synchronized when changing brand colors.
- Web data hooks provide server `fetch*()` functions and client `use*()` hooks. Include cache tags so CMS writes can revalidate content.
- Update Web's sitemap when adding pages, including feature-flag conditions where relevant.

See the [development conventions](.github/copilot-instructions.md#conventions) for integration exceptions, feature flags, component tooling and the [cache-tag inventory](.github/copilot-instructions.md#cache-revalidation).

## CI / CD

GitHub Actions checks linting, types, formatting and unit tests on pull requests and `main`/`staging` pushes. CodeQL scans Actions and JavaScript/TypeScript, while Chromatic checks Storybook interactions and visual changes. Local `pnpm test` runs both unit and Storybook tests; the CI test job runs only the unit project.

Vercel's GitHub integration builds and deploys the three apps independently. `main` targets production, `staging` has fixed preview domains, and other branches receive generated preview URLs. Unaffected projects can skip builds; shared-package changes affect their consumers.

| App    | Production                                   | Staging                                                      |
| ------ | -------------------------------------------- | ------------------------------------------------------------ |
| Web    | [armada.nu](https://armada.nu)               | [staging.armada.nu](https://staging.armada.nu)               |
| Photos | [photos.armada.nu](https://photos.armada.nu) | [staging.photos.armada.nu](https://staging.photos.armada.nu) |
| Order  | [order.armada.nu](https://order.armada.nu)   | [staging.order.armada.nu](https://staging.order.armada.nu)   |

Production custom domains are public; staging and preview deployments use Vercel Authentication. Photos and Order disable indexing in every environment; Web does so outside production. Indexing directives are not access controls.

Actions are SHA-pinned, and [Dependabot](.github/dependabot.yml) opens weekly dependency updates. See the [Terraform overview](infra/terraform/README.md) and [Vercel guide](infra/terraform/vercel/prod/README.md) for project settings, environment ownership and DNS boundaries.

## Backend environments

Set `NEXT_PUBLIC_API_URL` in the owning app's `.env.local` to one of these origins. Do not append `/api/v1`; data hooks add that path themselves.

| Environment | API origin                      |
| ----------- | ------------------------------- |
| Local dev   | `http://localhost:8080`         |
| Staging     | `https://staging.cms.armada.nu` |
| Production  | `https://cms.armada.nu`         |
