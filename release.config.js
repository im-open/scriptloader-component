const { execSync } = require("child_process");

const MAIN_BRANCH = "main";

const branchName = execSync("git rev-parse --abbrev-ref HEAD")
  .toString()
  .replace("\n", "");

const getPrereleaseId = () => {
  const currentShaChars = execSync("git rev-parse HEAD").toString();
  const currentSha = currentShaChars.substr(0, 6);

  const tagsOutput = execSync("git ls-remote --tags").toString().split("\n");
  const tags = tagsOutput
    .map((tagString) => {
      const execResult = /\/tags\/(?<tag>.*)$/.exec(tagString);
      if (!execResult) return null;

      return execResult.groups.tag;
    })
    .filter((tag) => tag && tag.includes(branchName))
    .map((tag) => tag.substr(tag.indexOf(branchName)));

  let shaVersion = 0;
  let prereleaseName = `${branchName}-${currentSha}`;

  while (tags.includes(`${prereleaseName}.1`)) {
    shaVersion += 1;
    prereleaseName = `${prereleaseName}-${shaVersion}`;
  }
  prereleaseName = prereleaseName.replace(`${branchName}-`, "");
  const prereleaseId = `\${name}-${prereleaseName}`;
  return prereleaseId;
};

const preId = getPrereleaseId();

const basePlugins = [
  [
    "@semantic-release/commit-analyzer",
    {
      releaseRules: [
        { tag: "Upgrade", release: "patch" },
        { tag: "Refactor", release: "patch" },
        { tag: "Patch", release: "patch" },
      ],
    },
  ],
  "@semantic-release/commit-analyzer",
  "@semantic-release/release-notes-generator",
  "@semantic-release/changelog",
  "@semantic-release/npm",
];

const mainConfig = {
  plugins: [
    ...basePlugins,
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

const branchConfig = {
  plugins: [
    ...basePlugins,
    [
      "@semantic-release/exec",
      {
        successCmd:
          'echo "NEXT_VERSION=${nextRelease.version}" >> $GITHUB_OUTPUT',
      },
    ],
  ],
};

const config = branchName === MAIN_BRANCH ? mainConfig : branchConfig;

module.exports = {
  branches: [
    MAIN_BRANCH,
    { name: branchName, channel: "${name}", prerelease: preId },
  ],
  preset: "eslint",
  repositoryUrl: "git@github.com:WTW-IM/scriptloader-component.git",
  ...config,
};
