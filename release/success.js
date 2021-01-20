const { isNil, uniqBy, flatten } = require("lodash");
const pFilter = require("p-filter");
const issueParser = require("issue-parser");
const debug = require("debug")("semantic-release:github-prerelease");

const resolveConfig = require("@semantic-release/github/lib/resolve-config");
const getClient = require("@semantic-release/github/lib/get-client");
const parseGithubUrl = require("@semantic-release/github/lib/parse-github-url");
const getSearchQueries = require("@semantic-release/github/lib/get-search-queries");

// these files will be copied two folders deeper
const success = require("./new-success");

const ghGet = async (ghResult) => {
  const res = await ghResult;
  return (res && res.data) || res;
};

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
  const github = getClient(
    {
      githubToken,
      githubUrl,
      githubApiPathPrefix,
      proxy,
    },
    context
  );
  const { login } = await ghGet(github.users.getAuthenticated());
  const [owner, repo] = (
    await ghGet(github.repos.get(parseGithubUrl(repositoryUrl)))
  ).full_name.split("/");

  if (successComment === false) {
    logger.log("Skipping old comment deletion.");
  } else {
    const parser = issueParser(
      "github",
      githubUrl ? { hosts: [githubUrl] } : {}
    );
    const shas = commits.map(({ hash }) => hash);

    const searchQueries = getSearchQueries(
      `repo:${owner}/${repo}+type:pr+is:open`,
      shas
    ).map(
      async (q) =>
        (await ghGet(github.search.issuesAndPullRequests({ q }))).items
    );

    const prs = await pFilter(
      uniqBy(flatten(await Promise.all(searchQueries)), "number"),
      async ({ number }) =>
        (
          await ghGet(
            github.pulls.listCommits({ owner, repo, pull_number: number })
          )
        ).find(({ sha }) => shas.includes(sha)) ||
        shas.includes(
          (await ghGet(github.pulls.get({ owner, repo, pull_number: number })))
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

    const allIssues = uniqBy([...prs, ...issues], "number");
    await Promise.all(
      allIssues.map(async (issue) => {
        try {
          const comments = { owner, repo, issue_number: issue.number };
          const allComments = await ghGet(github.issues.listComments(comments));
          const targetComments = allComments.filter(
            (comment) => comment.user.login === login
          );

          await Promise.all(
            targetComments.map(async (c) => {
              await github.issues.deleteComment({
                owner,
                repo,
                comment_id: c.id,
              });
              logger.log(
                "Removed comment %s from issue #%d",
                c.id,
                issue.number
              );
            })
          );
        } catch (error) {
          debug("got an error deleting a comment", error);
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
