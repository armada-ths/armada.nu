import { defineConfig } from "@eloqnt/cli"

// Catalog validation complements next-intl's TypeScript checks at call sites.
export default defineConfig({
  messages: {
    path: "./src/i18n/messages",
    locales: ["en", "sv"],
    sourceLocale: "en",
    format: "json"
  }
})
