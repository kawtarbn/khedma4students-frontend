module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'react-app',
    'react-app/jest'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Allow unused variables as warnings, not errors
    'no-unused-vars': 'warn',
    // Allow unnecessary escapes as warnings
    'no-useless-escape': 'warn',
    // Allow console logs for debugging
    'no-console': 'warn'
  }
};
