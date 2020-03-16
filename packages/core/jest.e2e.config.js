module.exports = {
  roots: [
    "./e2e"
  ],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  testRegex: "(/e2e/.*.(test|spec)).(jsx?|tsx?)$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  coveragePathIgnorePatterns: [
    "(tests/.*.mock).(jsx?|tsx?)$"
  ],
  verbose: true
};
