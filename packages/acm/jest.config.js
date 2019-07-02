module.exports = {
    roots: [
        "./tests"
    ],
    transform: {
        '^.+\\.(js|jsx)?$': 'babel-jest'
    },
    moduleFileExtensions: [
        "js",
        "json"
    ],
    testRegex: "(/tests/.*.(test|spec)).(js?)$",
    transformIgnorePatterns: [
        '/node_modules/'
    ],
    coveragePathIgnorePatterns: [
        "(tests/.*.mock).(js?)$"
    ],
};
