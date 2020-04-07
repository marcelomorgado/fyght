module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["prettier", "@typescript-eslint"],
  extends: ["eslint:recommended", "prettier", "plugin:@typescript-eslint/recommended"],
  rules: {
    "no-console": "warn",
  },
  overrides: [
    {
      files: ["**/*.ts"],
    },
  ],
};
