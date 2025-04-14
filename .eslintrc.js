module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Disable unused vars errors for test components that intentionally create errors
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_'
    }],
    // Allow ts-expect-error and ts-ignore in test files
    '@typescript-eslint/ban-ts-comment': 'off'
  },
  overrides: [
    {
      // Further relax rules specifically for testing components
      files: [
        '**/error-test.tsx',
        '**/advanced-error-test.tsx',
        '**/direct-test.tsx',
        '**/performance-test.tsx'
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/ban-ts-comment': 'off'
      }
    }
  ]
}; 