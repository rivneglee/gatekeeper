module.exports = {
  roots: [
    "./tests"
  ],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  testRegex: "(/tests/.*.(test|spec)).(jsx?|tsx?)$",
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
