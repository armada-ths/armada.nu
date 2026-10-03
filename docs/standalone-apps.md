# Standalone app rollout

| App    | Directory   | Vercel project          | Production       | Staging branch domain    |
| ------ | ----------- | ----------------------- | ---------------- | ------------------------ |
| Web    | apps/web    | armada-nu (existing ID) | armada.nu        | staging.armada.nu        |
| Photos | apps/photos | armada-photos           | photos.armada.nu | staging.photos.armada.nu |
| Order  | apps/order  | armada-order            | order.armada.nu  | staging.order.armada.nu  |

All projects use main for production and staging for staging. Shared dependencies use workspace:* and one pnpm lockfile. There is no Turborepo. Vercel must include files outside each Root Directory; keep this monorepo setting enabled. Skip unaffected projects is enabled in Terraform.

Each app has its own vercel.json selecting pnpm build from its Root Directory. This overrides the temporary repository-root build:legacy command, which is only for the original Web deployment during migration.

## Environment configuration

Each app has its own .env.example. Copy it to that app's .env.local for development; root .env.local is only read by the temporary legacy app. Web uses port 8000, Photos 8001, Order 8002. Storybook remains at the repository root on 6006.

Set NEXT_PUBLIC_API_URL to https://cms.armada.nu in production and https://staging.cms.armada.nu in previews. Do not append /api/v1. Public variables must be present at build time.

- Photos: NEXT_PUBLIC_RECAPTCHA_SITE_KEY, matching the CMS environment. Test uploads on the fixed staging domain, not arbitrary preview domains.
- Order: EXPO_ACCESS_TOKEN in production/previews; SLACK_ORDER_HOOK_URL in production only; SLACK_ORDER_TEST_HOOK_URL in previews only. Preview/local actions never fall back to the production hook and prefix messages with [STAGING TEST]. Tests and Storybook mock delivery. Configure a dedicated test-channel webhook, not the production webhook under a different name.
- Web: retain CMS, sales, reCAPTCHA, feature flag and revalidation integrations. Order secrets are removed from Web only after the legacy deployment is retired.
- Set ENABLE_EXPERIMENTAL_COREPACK=1 as on the existing project to use the pinned pnpm version.

Values are configured directly in Vercel, never committed. Import existing environment-variable IDs into the matching Terraform resources; empty placeholders and ignore_changes preserve dashboard values. Domain associations remain outside Terraform. DNS belongs to the separate Cloud DNS root.

API origins and ENABLE_EXPERIMENTAL_COREPACK are now shared team variables linked to all three projects. Production uses the production CMS; Preview/Development use staging. The shared definitions are prepared in Vercel and imports.tf adopts them into Terraform. Do not recreate the retired project-local API/Corepack variables. See the [Vercel root README](../infra/terraform/vercel/prod/README.md#shared-environment-variables) for the completed migration and apply checks.

## Phase 1: staging

Preparation completed on 2026-10-03: the two projects exist, their staging branch domains are associated, and API origins, public reCAPTCHA site keys and Corepack settings are configured. `imports.tf` adopts these resources on the next HCP apply. The two staging CNAME records are prepared but not applied. The original Web project/root and production domains are unchanged; no code has been committed, pushed or deployed as part of this preparation.

Before applying, configure Order's sensitive variables in Vercel: EXPO_ACCESS_TOKEN in Production and Preview (separate entries matching Terraform), SLACK_ORDER_HOOK_URL in Production, and SLACK_ORDER_TEST_HOOK_URL in Preview. The existing sensitive values cannot be read back from Vercel; retrieve them from your original secure source. Add their IDs as imports before the HCP apply, following the same pattern as the public variables. Do not substitute blank placeholders for actual secrets. Once imported, retain ignore_changes on values.

1. Publish the workspace changes to staging. Root src/, public/, Next config and tsconfig.legacy.json intentionally remain available; root vercel.json selects build:legacy so the existing root deployment can build during migration.
2. Create/import the new projects and environment definitions using the existing HCP Vercel workspace. Initially keep the existing Root Directory unchanged; do not apply its apps/web change before the staging commit exists. Review the remote plan; do not move production domains yet.
3. Configure environment values. Confirm outside-directory source access, Git integration, main production branch, Node 24, Stockholm region and preview protection.
4. Associate staging.photos.armada.nu and staging.order.armada.nu with their projects and the staging branch. Obtain each required CNAME from Vercel and add it to local.dns_records in infra/terraform/gcp/dns-prod. Never guess the CNAME. Apply through HCP and verify authoritative DNS/TLS.
5. Apply ArmadaCMS staging changes: PHOTO_APP_BASE_URL, CORS, reCAPTCHA domains and PHOTO_RECAPTCHA_HOSTNAMES include staging.photos.armada.nu. Local CORS includes localhost/127.0.0.1:8001. No schema, storage or worker migration is needed.
6. Run frozen install, lint, type-check, unit tests, Storybook interactions and all production builds. Verify Web from apps/web separately before production. Retain previous deployment IDs for rollback.
7. Test Photos CMS link/QR, camera, upload, moderation/SafeSearch, live refresh, slideshow and ZIP on real iPhone/Android too. Production /e/token QR paths remain unchanged. localStorage is preserved on the same origin, not across different staging origins.
8. Test Order missing/invalid/valid tokens, URL cleanup, host-only cookie, opening boundaries, invalid dates, company selection, cart and retry. Confirm direct action calls are denied without cookie/outside hours. Send a labelled staging order and verify receipt in the test channel only.
9. Verify noindex/no-referrer, redacted telemetry on fixed/preview domains, deep links and 404 responses for /photos/** and /exhibitor/order/** on the new Web deployment.

## Phase 2: production and cleanup

Only after staging verification, apply the existing project's apps/web Root Directory change, deploy production apps, move photos.armada.nu from Web to Photos and add order.armada.nu to Order. Use Vercel's domain-specific CNAME recommendations. Distribute new Order links; old main-site cookies do not grant access. Old main-site routes return 404 without redirects once Web is served from apps/web.

Remove the legacy root src/, public/, next.config.mjs, postcss.config.js, components.json, module.d.ts, next-env.d.ts, tsconfig.legacy.json and vercel.json only after cutover verification. Remove build:legacy, legacy-only root runtime dependencies and stale Web order environment resources/values. Preserve per-app equivalents and shared tooling. Update the lockfile and rerun checks. Until then, do not develop features in the legacy copy.

Verify an app-only commit deploys only that project and a shared-package commit deploys all consumers. Actual Git deployment behavior cannot be proven by a local build.

For rollback, restore the previous deployment and domain association together with its matching Root Directory. Do not delete previous deployments during the transition.
