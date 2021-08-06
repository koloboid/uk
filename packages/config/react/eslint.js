module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./src/tsconfig.json",
        ecmaVersion: 2018,
        sourceType: "module",
    },
    rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/camelcase": "off",
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": [
            "error",
            { functions: false, classes: false, enums: false, typedefs: false },
        ],
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    extends: ["plugin:react/recommended", "plugin:@typescript-eslint/recommended"],
};
