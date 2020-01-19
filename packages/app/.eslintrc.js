module.exports = {
  env: {
    browser: true,
    es6: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  settings: {
    react: {
      version: "16.12"
    }
  },
  plugins: ["react", "prettier", "jest", "@typescript-eslint", "react-hooks"],
  extends: [
    "eslint:recommended",
    "prettier",
    "prettier/react",
    "plugin:react/recommended",
    "plugin:jest/recommended"
  ],
  globals: {
    react: true
  },
  rules: {
    "react/jsx-filename-extension": [2, { extensions: [".tsx"] }],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
};
