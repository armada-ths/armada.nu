// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook"

import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"
import pluginReact from "eslint-plugin-react"

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { ignores: [".next/*"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn"
    }
  },
  ...storybook.configs["flat/recommended"]
]
