// this file will be copied two folders deeper
const { isNil, uniqBy, flatten } = require("lodash");
const pFilter = require("p-filter");
const issueParser = require("issue-parser");
const resolveConfig = require("@semantic-release/github/lib/resolve-config");
const getClient = require("@semantic-release/github/lib/resolve-config");
const parseGithubUrl = require("@semantic-release/github/lib/parse-github-url");
const getSearchQueries = require("@semantic-release/github/lib/get-search-queries");
const success = require("./new-success");

module.exports = async (pluginConfig, context) => {
  const {
    options: { repositoryUrl },
    commits,
    logger,
  } = context;
  const {
    githubToken,
    githubUrl,
    githubApiPathPrefix,
    proxy,
    successComment,
  } = resolveConfig(pluginConfig, context);
  const github = getClient({
    githubToken,
    githubUrl,
    githubApiPathPrefix,
    proxy,
  });
  const [owner, repo] = (
    await github.repos.get(parseGithubUrl(repositoryUrl))
  ).data.full_name.split("/");

  if (successComment === false) {
    logger.log("Skipping old comment deletion.");
  } else {
    const parser = issueParser(
      "github",
      githubUrl ? { hosts: [githubUrl] } : {}
    );
    const shas = commits.map(({ hash }) => hash);

    const searchQueries = getSearchQueries(
      `repo:${owner}/${repo}+type:pr+is:merged`,
      shas
    ).map(
      async (q) => (await github.search.issuesAndPullRequests({ q })).data.items
    );

    const prs = await pFilter(
      uniqBy(flatten(await Promise.all(searchQueries)), "number"),
      async ({ number }) =>
        (
          await github.pulls.listCommits({ owner, repo, pull_number: number })
        ).data.find(({ sha }) => shas.includes(sha)) ||
        shas.includes(
          (await github.pulls.get({ owner, repo, pull_number: number })).data
            .merge_commit_sha
        )
    );

    // Parse the release commits message and PRs body to find resolved issues/PRs via comment keyworkds
    const issues = [
      ...prs.map((pr) => pr.body),
      ...commits.map((commit) => commit.message),
    ].reduce((issues, message) => {
      return message
        ? issues.concat(
            parser(message)
              .actions.close.filter(
                (action) =>
                  isNil(action.slug) || action.slug === `${owner}/${repo}`
              )
              .map((action) => ({ number: Number.parseInt(action.issue, 10) }))
          )
        : issues;
    }, []);

    await Promise.all(
      uniqBy([...prs, ...issues], "number").map(async (issue) => {
        try {
          const comments = { owner, repo, issue_number: issue.number };
          const foundComments = (
            await github.issues.listComments(comments)
          ).filter((comment) => comment.user.login === "im-pipeline-bot");

          for (let c in foundComments) {
            await github.issues.deleteComment({
              owner,
              repo,
              comment_id: c.id,
            });
            logger.log("Removed comment %c from issue #%d", c.id, issue.number);
          }
        } catch (error) {
          if (error.status === 403) {
            logger.error(
              "Not allowed to delete a comment to the issue #%d.",
              issue.number
            );
          } else if (error.status === 404) {
            logger.error(
              "Failed to delete a comment to the issue #%d as it doesn't exist.",
              issue.number
            );
          } else {
            logger.error(
              "Failed to delete a comment to the issue #%d.",
              issue.number
            );
          }
        }
      })
    );
  }

  await success(pluginConfig, context);
};
