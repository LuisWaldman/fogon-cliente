// eslint.config.js
import eslintPluginVue from 'eslint-plugin-vue'
import pluginPrettier from 'eslint-plugin-prettier'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

/** @type {import("eslint").Linter.FlatConfig} */
export default [
  {
    ignores: ['dist', 'node_modules', 'dev-dist'],
  },
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      vue: eslintPluginVue,
      prettier: pluginPrettier,
    },
    rules: {
      'vue/no-multiple-template-root': 'off',
      camelcase: 'error',
      'prettier/prettier': ['error', { singleQuote: true, semi: false }],
    },
  },
]
