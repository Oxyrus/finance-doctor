import tseslint from 'typescript-eslint'

export default tseslint.config({
  files: ['src/**/*.ts'],
  ignores: ['dist/**', 'node_modules/**', '*.config.ts', '*.config.js'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: './tsconfig.json'
    }
  },
  plugins: {
    '@typescript-eslint': tseslint.plugin
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'error'
  }
})
