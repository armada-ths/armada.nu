# English and Swedish

All public apps use next-intl with `/en` and `/sv`, a host-only locale cookie and `Europe/Stockholm`. URL locale wins over cookie, then Accept-Language, then English. Cross-app links include the locale. API and storage routes are excluded from locale middleware; Photos explicitly matches dotted event tokens.

## Editing and checking UI copy

Edit `apps/<app>/src/i18n/messages/en.json` and `sv.json` together. Use complete ICU messages for interpolation and plurals. `packages/shared/src/i18n/types.ts` augments next-intl locales and message keys from the source catalogs. Components share routing, navigation, locale context and per-field CMS fallback in that package.

Run `pnpm lint:i18n` for eloqnt's local catalog checks (including ICU arguments, structure and plural cases), `pnpm type-check` for key/call-site checks, and `pnpm test` for unit and Storybook interaction tests. CI runs catalog lint without translation-service credentials or automatic catalog writes. Storybook's globe toolbar selects English or Swedish using a global NextIntlClientProvider. Add explicit Swedish stories for changed components so Chromatic captures that language too.

The integrations follow the next-intl workflow docs: https://next-intl.dev/docs/workflows. The manual Storybook provider avoids another addon dependency. Crowdin is deferred while two languages and CMS editing cover the current workflow; introduce it when non-developers need to review fixed UI catalogs. Automated AI translation/review and literal extraction are deferred: curated semantic keys and reviewed Swedish copy fit the current design without an extra service or a second message-authoring model.

## CMS and state

CMS publishes original and optional Sv fields. `localizedText` selects a non-blank Swedish value per field and otherwise uses the original. IDs and original grouping/sync keys remain unchanged. An omitted translation preserves its stored value; null, empty or whitespace clears it, including multipart forms. Eventro updates original fields and preserves editorial Swedish translations.

Keep work data above locale segments. `useDraftState` preserves web forms and filters in memory; files must never be serialized into cookies or storage. Order and Photos language controls update the locale in browser history while keeping their controllers mounted. Render error codes in the current locale rather than storing translated error strings.

## Local browser checks

After production builds, `node tests/localization-web.mjs`, `node tests/localization-order.mjs` and `node tests/localization-photos.mjs` verify the localized flows against local fixtures. Build with NEXT_PUBLIC_API_URL=http://127.0.0.1:19080; Photos also uses NEXT_PUBLIC_RECAPTCHA_SITE_KEY=local-fixture. Run the scripts separately because they share a fixture port. The order test mocks delivery before running the real server action; photo verification and API writes stay local.
