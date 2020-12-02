module.exports = {
  branches: ["main"],
  repositoryUrl: "git@github.com:WTW-IM/scriptloader-component.git",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "eslint",
        releaseRules: [
          { type: "refactor", release: "patch" },
          { type: "patch", release: "patch" },
        ],
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "eslint",
      },
    ],
    "@semantic-release/changelog",
    "@semantic-release/npm",
    [
      "@semantic-release/github",
      {
        assets: "*.tgz",
      },
    ],
    [
      "@semantic-release/git",
      {
        message:
          "Docs: ${nextRelease.version} [skip ci]\n\n${nextRelease.note}",
      },
    ],
  ],
};
