import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import prettier from 'eslint-config-prettier';

export default [
  // Ignore generated and external folders
  { ignores: ['node_modules/**', 'dist/**', 'coverage/**'] },

  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript recommended rules (no type-aware for speed and simplicity)
  ...tseslint.configs.recommended,

  // Project-specific rules for TS files
  {
    files: ['**/*.ts'],
    plugins: { prettier: eslintPluginPrettier },
    rules: {
      // Surface formatting issues as warnings
      'prettier/prettier': 'warn',

      // Example rule preferences (tune as desired)
      'no-unused-vars': 'off', // superseded by @typescript-eslint/no-unused-vars
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // Disable rules that conflict with Prettier formatting
  prettier,
];
