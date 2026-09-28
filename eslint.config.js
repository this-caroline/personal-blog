import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import astro from "eslint-plugin-astro";
import importPlugin from "eslint-plugin-import-x";
import unusedImports from "eslint-plugin-unused-imports";
import typescriptEslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: [".astro/", "dist/", "node_modules/"],
  },
  eslint.configs.recommended,
  ...typescriptEslint.configs.strictTypeChecked,
  ...typescriptEslint.configs.stylisticTypeChecked,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "unused-imports": unusedImports,
    },
    settings: {
      "import-x/resolver-next": [],
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      complexity: ["warn", { max: 12 }],
      curly: ["error", "all"],
      eqeqeq: ["error", "always", { null: "ignore" }],
      "import-x/no-cycle": "error",
      "import-x/no-unresolved": "off",
      "import-x/order": [
        "error",
        {
          alphabetize: { order: "asc", caseInsensitive: true },
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "type",
          ],
          "newlines-between": "always",
        },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-else-return": "error",
      "no-useless-return": "error",
      "prefer-const": "error",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  ...astro.configs["flat/recommended"],
  {
    files: ["**/*.astro"],
    rules: {
      "@typescript-eslint/no-confusing-void-expression": "off",
      "import-x/no-unresolved": "off",
      "import-x/order": "off",
    },
  },
);
