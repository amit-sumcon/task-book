module.exports = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "type-enum": [
            2,
            "always",
            ["feat", "fix", "docs", "style", "refactor", "test", "chore", "init"],
        ],
        "subject-case": [2, "always", "sentence-case"],
        "header-max-length": [0, "always", 150],
    },
};
