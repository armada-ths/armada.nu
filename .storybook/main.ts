import path from "node:path"
import type { StorybookConfig } from "@storybook/nextjs-vite"
import tailwindcss from "@tailwindcss/postcss"

const config: StorybookConfig = {
  stories: [
    "../apps/*/src/**/*.mdx",
    "../apps/*/src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-mcp"
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: { nextConfigPath: path.resolve("apps/web/next.config.mjs") }
  },
  viteFinal: async config => ({
    ...config,
    css: {
      ...config.css,
      postcss: { plugins: [tailwindcss()] }
    },
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "@": path.resolve("apps/web/src"),
        "@photos": path.resolve("apps/photos/src"),
        "@order": path.resolve("apps/order/src")
      }
    }
  }),
  staticDirs: ["../apps/web/public"]
}
export default config
