import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'

export default defineConfigWithVueTs(
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', 'build-scripts/**'],
  },
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    rules: {
      // The library deliberately uses `any` for generic option/model values
      // (DuSelect, DuSearch, DuTable accept arbitrary user data).
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/multi-word-component-names': 'off',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // Stories are example fixtures: unused render args are part of the Storybook signature.
    files: ['**/*.stories.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'vue/return-in-computed-property': 'off',
    },
  },
  {
    // The Vite plugin and packaging scripts report progress on stdout by design.
    files: ['plugin-vite.ts', 'scripts/**'],
    rules: {
      'no-console': 'off',
    },
  },
)
