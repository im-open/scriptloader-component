const eslintConfig = require("commitlint-config-eslint");
const eslintTypes = eslintConfig.rules["type-enum"][2];
module.exports = {
  extends: ["eslint"],
  rules: {
    "type-enum": [2, "always", [...eslintTypes, "Refactor", "Patch"]],
  },
};
