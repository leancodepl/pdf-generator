const nx = require("@nx/eslint-plugin")
const leancode = require("@leancodepl/eslint-config")

module.exports = [
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/javascript"],
  ...leancode.imports,
  ...leancode.base,
  ...leancode.baseReact,
  ...leancode.a11y,
  {
    ignores: ["**/dist", "**/node_modules"],
  },
]
