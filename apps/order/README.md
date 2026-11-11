# Exhibitor Order app

The shared access link opens ordering for Gold exhibitors. Anyone with the link can select an eligible company. ArmadaCMS checks eligibility, opening hours, and item availability at submission.

The form refreshes the catalogue while visible and when the page regains focus. A submission with an unknown outcome can be retried in the same tab using the original order key, including after a reload. Confirmation means the order was saved. ArmadaCMS handles Slack separately.

## Local development

Copy [`.env.example`](.env.example) to `.env.local` and set `NEXT_PUBLIC_API_URL`, `EXPO_ACCESS_TOKEN`, and `LOUNGE_ORDER_TEST_SUBMISSION_SECRET`. Match the submission secret to the CMS test credential. Local and preview orders are test orders. Production uses the separate `LOUNGE_ORDER_SUBMISSION_SECRET`.

From the repository root, run `pnpm dev:order` and open `http://localhost:8002/?access=<EXPO_ACCESS_TOKEN>` with your local token. The CMS environment needs a catalogue, an eligible exhibitor, and an open ordering window to accept a new order.

## Tests

Run `pnpm exec vitest run --project unit apps/order/src/lib` for unit tests and `pnpm exec vitest run --project storybook apps/order/src/components/order` for the Order component interactions.
