import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';
import storybook from 'eslint-plugin-storybook';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default [
  {
    ignores: [
      'build/*',
      '**/coverage/**',
      'node_modules/*',
      'amplify-codegen-temp/models'
    ]
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021
      },
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.eslint.json'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react,
      'react-hooks': reactHooks,
      prettier,
      storybook,
      import: importPlugin
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import/core-modules': ['@righton/networking']
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      'storybook/await-interactions': 'error',
      'storybook/no-redundant-story-name': 'warn',
      'storybook/use-storybook-expect': 'error',
      'storybook/use-storybook-testing-library': 'error',
      
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/*.stories.*',
            '**/.storybook/**/*.*',
            '@righton/networking/*'
          ],
          peerDependencies: true
        }
      ],
      
      'arrow-body-style': 'off',
      'no-underscore-dangle': 'off',
      'no-console': [
        1,
        {
          allow: ['debug', 'error']
        }
      ]
    }
  }
]; 