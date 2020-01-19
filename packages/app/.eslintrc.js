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
      version: "detect" // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // default to latest and warns if missing
      // It will default to "detect" in the future
    }
  },
  plugins: ["react", "jest", "@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jest/recommended"
  ],
  globals: {
    react: true
  },
  rules: {
    quotes: [2, "double"],
    "react/jsx-filename-extension": [2, { extensions: [".tsx"] }]
  }
};
