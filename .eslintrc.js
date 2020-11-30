module.exports = {
  root: true,
  plugins: ["react", "react-hooks"],
  settings: {
    react: {
      version: "detect",
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist/**/*"],
  overrides: [
    {
      files: ["src/**/*", "./index.ts", "./jest.config.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
      plugins: ["@typescript-eslint", "react", "react-hooks"],
      extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      rules: {
        "@typescript-eslint/no-empty-interface": 0,
      },
    },
    {
      files: "**/*.ts?(x)",
      rules: {
        "react/prop-types": "off",
      },
    },
    {
      files: ["./*.js"],
      env: { node: true },
    },
    {
      files: ["./test/*"],
      plugins: [
        "@typescript-eslint",
        "react",
        "react-hooks",
        "jest",
        "jest-dom",
      ],
      env: { "jest/globals": true },
      extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:jest/recommended",
        "plugin:jest-dom/recommended",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./test/tsconfig.json",
      },
    },
  ],
};
