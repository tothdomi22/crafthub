import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactPlugin from "eslint-plugin-react";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import prettierPlugin from "eslint-plugin-prettier";
import prettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Ignore patterns
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/dist/**",
      "**/build/**",
      "**/.git/**",
      "**/*.log",
      "**/.vercel/**",
      "**/.env*",
      "**/public/**",
      "**/.cache/**",
      "**/coverage/**",
      "**/dogsquare_api/**",
      "**/scripts/**",
      "**/terraform/**",
      "**/tests/**",
      "**/*.py",
      "**/*.yaml",
      "**/*.yml",
      "**/uv.lock",
      "**/pyproject.toml",
      "**/be.Dockerfile",
      "**/docker-compose.yml",
    ],
  },

  // Base configurations
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,

  // Main configuration
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "writable",
        JSX: "writable",
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@next/next": nextPlugin,
      "@typescript-eslint": tseslint.plugin,
      prettier: prettierPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",

      // React rules
      "react/react-in-jsx-scope": "off", // Not needed in Next.js 13+
      "react/prop-types": "off", // Using TypeScript for prop validation

      // Prettier
      "prettier/prettier": "error",
    },
  },

  // Prettier config should be last
  prettier,
];
