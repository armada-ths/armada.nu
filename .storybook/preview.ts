import orderEn from "../apps/order/src/i18n/messages/en.json"
import orderSv from "../apps/order/src/i18n/messages/sv.json"
import { createElement } from "react"
import { NextIntlClientProvider } from "../packages/shared/src/i18n/client"
import en from "../apps/web/src/i18n/messages/en.json"
import sv from "../apps/web/src/i18n/messages/sv.json"
import orderEn from "../apps/order/src/i18n/messages/en.json"
import orderSv from "../apps/order/src/i18n/messages/sv.json"
import photosEn from "../apps/photos/src/i18n/messages/en.json"
import photosSv from "../apps/photos/src/i18n/messages/sv.json"
import type { Preview } from "@storybook/nextjs-vite"
import { sb } from "storybook/test"

import "./styles.css"

sb.mock(import("@vercel/analytics"), { spy: true })

const preview: Preview = {
  globalTypes: {
    locale: {
      description: "Language",
      toolbar: {
        icon: "globe",
        items: [
          { value: "en", title: "English" },
          { value: "sv", title: "Svenska" }
        ]
      }
    }
  },
  initialGlobals: { locale: "en" },
  decorators: [
    (Story, context) =>
      createElement(
        NextIntlClientProvider,
        {
          locale: context.globals.locale ?? "en",
          messages:
            context.globals.locale === "sv"
<<<<<<< HEAD
              ? { ...sv, ...orderSv }
              : { ...en, ...orderEn },
=======
              ? {
                  ...sv,
                  ...orderSv,
                  ...photosSv,
                  Common: sv.Common,
                  Metadata: sv.Metadata
                }
              : {
                  ...en,
                  ...orderEn,
                  ...photosEn,
                  Common: en.Common,
                  Metadata: en.Metadata
                },
>>>>>>> issue-295-phase-1-i18n
          timeZone: "Europe/Stockholm",
          children: createElement(Story)
        },
        createElement(Story)
      )
  ],
  parameters: {
    nextjs: { appDirectory: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo"
    },

    // Viewport presets matching the site's Tailwind breakpoints
    viewport: {
      options: {
        mobile: {
          name: "Mobile (390px)",
          styles: { width: "390px", height: "844px" }
        },
        xs: {
          name: "Mobile L / xs (470px)",
          styles: { width: "470px", height: "900px" }
        },
        tablet: {
          name: "Tablet / md (768px)",
          styles: { width: "768px", height: "1024px" }
        },
        desktop: {
          name: "Desktop / xl (1280px)",
          styles: { width: "1280px", height: "900px" }
        },
        widescreen: {
          name: "Widescreen / 2xl (1536px)",
          styles: { width: "1536px", height: "900px" }
        }
      }
    }
  }
}

export default preview
