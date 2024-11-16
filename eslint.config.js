const parser = require("@typescript-eslint/parser");
const eslintPlugin = require("@typescript-eslint/eslint-plugin");
const prettier = require("prettier");
const eslintPluginPrettier = require("eslint-plugin-prettier");

module.exports = [
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            parser: parser,
            parserOptions: {
                ecmaVersion: 2024,
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": eslintPlugin,
            prettier: eslintPluginPrettier,
        },
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            semi: ["error", "always"],
            indent: ["error", 4],
            "no-console": "error",
            "prettier/prettier": [
                "error",
                {
                    semi: true,
                    singleQuote: false,
                    trailingComma: "es5",
                    tabWidth: 4,
                    printWidth: 90,
                },
            ],
        },
    },
];
