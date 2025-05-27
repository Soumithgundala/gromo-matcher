import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] }, // Global ignore for the 'dist' directory

  // 1. Configuration for your FRONTEND (React) files
  {
    files: ['src/**/*.{js,jsx}'], // Target frontend files
    languageOptions: {
      ecmaVersion: 2020, // Or 'latest'
      globals: {
        ...globals.browser, // Browser globals for frontend
      },
      parserOptions: {
        ecmaVersion: 'latest', // Use 'latest' for parser options
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Add any other specific frontend rules here
    },
  },

  // 2. Configuration for your BACKEND (Node.js) files
  {
    files: ["openai-backend/**/*.js"], // Target backend files
    languageOptions: {
      ecmaVersion: 2020, // Or 'latest' depending on your Node.js version
      globals: {
        ...globals.node, // Node.js globals for backend
      },
      parserOptions: {
        ecmaVersion: 'latest', // Use 'latest' for parser options
        sourceType: 'commonjs', // Crucial for 'require'
      },
    },
    // No React plugins or rules needed here
    rules: {
      ...js.configs.recommended.rules, // Basic recommended rules
      // Optional: Add specific rules for Node.js, e.g.:
      'no-console': 'off', // Allow console.log in backend
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Adjust for backend
    },
  },
];