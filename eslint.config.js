import js from "@eslint/js";
import unusedImports from "eslint-plugin-unused-imports";
import oxlint from "eslint-plugin-oxlint";
// import tseslint from "typescript-eslint";
// import prettierConfig from "eslint-config-prettier";

export default [
    js.configs.recommended,
    // ...tseslint.configs.recommended,
    // prettierConfig,
    {
        files: ["**/*.js", "**/*.ts", "**/*.mjs", "**/*.cjs"],
        plugins: {
            "unused-imports": unusedImports,
            oxlint: oxlint
        },
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            // parser: tseslint.parser,
            parserOptions: {
                project: true,
            },
        },
        rules: {
            // ESLint rules
            "no-unused-vars": "off",
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": [
                "off",
                {
                    vars: "all",
                    varsIgnorePattern: "^_",
                    args: "after-used",
                    argsIgnorePattern: "^_"
                }
            ],
            // Oxlint rules
            "oxlint/no-unused-vars": "off",
            "oxlint/no-unused-imports": "off"
        }
    },
    {
        files: ["*.astro"],
        plugins: {
            astro: "astro"
        },
        rules: {
            "prettier/prettier": "off"
        }
    }
];