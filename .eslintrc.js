const baseExtends = [
  "eslint:recommended",
  "plugin:react/recommended",
  "plugin:react-hooks/recommended",
];
const basePlugins = ["react", "react-hooks"];

const tsExtends = [
  ...baseExtends,
  "plugin:@typescript-eslint/eslint-recommended",
  "plugin:@typescript-eslint/recommended",
  "plugin:@typescript-eslint/recommended-requiring-type-checking",
];
const tsPlugins = ["@typescript-eslint", ...basePlugins];

const testExtends = [
  ...tsExtends,
  "plugin:jest/recommended",
  "plugin:jest-dom/recommended",
];
const testPlugins = [...tsPlugins, "jest", "jest-dom"];

module.exports = {
  root: true,
  plugins: basePlugins,
  settings: {
    react: {
      version: "detect",
    },
  },
  extends: baseExtends,
  ignorePatterns: ["dist/**/*"],
  env: { es6: true },
  parserOptions: { ecmaVersion: 2017 },
  overrides: [
    {
      files: ["src/**/*", "./index.ts", "./jest.config.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
      plugins: tsPlugins,
      extends: tsExtends,
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
      plugins: testPlugins,
      env: { "jest/globals": true },
      extends: testExtends,
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./test/tsconfig.json",
      },
    },
  ],
};
