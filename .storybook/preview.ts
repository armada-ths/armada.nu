import type { Preview } from "@storybook/nextjs-vite"
import { sb } from "storybook/test"

import "../src/app/globals.css"

sb.mock(import("@vercel/analytics"), { spy: true })

const preview: Preview = {
  parameters: {
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
      viewports: {
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
