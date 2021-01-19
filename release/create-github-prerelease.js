const fs = require("fs-extra");
const path = require("path");

const originalPackage = path.dirname(
  require.resolve("@semantic-release/github")
);
fs.copySync(originalPackage, path.join(__dirname, "github-prerelease"));

const replaceFileText = (file, newFile, ...replaceArgs) => {
  const fileText = fs.readFileSync(file, { encoding: "utf8" });
  const replacedText = fileText.replace(...replaceArgs);
  fs.writeFileSync(newFile, replacedText);
};

replaceFileText(
  path.join(__dirname, "github-prerelease", "lib", "success.js"),
  path.join(__dirname, "github-prerelease", "lib", "new-success.js"),
  "type:pr+is:merged",
  "type:pr+is:open"
);

fs.copySync(
  require.resolve("./success"),
  path.join(__dirname, "github-prerelease", "lib", "success.js")
);
