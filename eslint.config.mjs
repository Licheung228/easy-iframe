import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default tseslint.config(
  {
    ignores: ['**/node_modules/**', '**/dist/**'],
  },
  {
    name: 'main',
    files: ['src/**/*.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2022,
        project: ['./tsconfig.json'],
      },
      globals: {
        ...globals.es2021,
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'no-useless-escape': 'error',
      'no-undef': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/consistent-type-imports': 'error', // 要求 import 类型时，必须使用 type 关键字
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      // '@typescript-eslint/no-non-null-assertion': 'error', // 可以使用 "!" 强制表明值非空
      '@typescript-eslint/explicit-module-boundary-types': 'error', // 函数必须显式返回类型
      '@typescript-eslint/no-explicit-any': 'off', // 是否允许any
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/no-empty-function': 'error',
    },
  },
)
