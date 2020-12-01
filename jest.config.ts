/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
  clearMocks: true,

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ["@testing-library/jest-dom", "./test/jest-setup.ts"],

  // The glob patterns Jest uses to detect test files
  testRegex: ["/test/.*\\.(test|spec)\\.[jt]sx?"],

  // This configuration shows the Jest to the options so one can be passed to the testEnvironment
  testEnvironmentOptions: {
    resources: "usable",
    runScripts: "dangerously",
  },
};
