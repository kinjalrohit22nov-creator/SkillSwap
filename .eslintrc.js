module.exports = {
  root: true,
  extends: ["eslint:recommended"],
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      extends: ["plugin:@typescript-eslint/recommended"],
      parser: "@typescript-eslint/parser",
      rules: {
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/explicit-function-return-types": "off",
      },
    },
  ],
};
