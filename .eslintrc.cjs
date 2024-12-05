// /** @type {import("@types/eslint").Linter.Config} */
// module.exports = {
// 	ignorePatterns: ["node_modules", "dist"],
// 	root: true,
// 	env: {
// 		node: true,
// 	},
// 	// parser: "@typescript-eslint/parser",
// 	plugins: ["unused-imports"],
// 	// plugins: ["@typescript-eslint", "unused-imports"],
// 	extends: [
// 		"eslint:recommended",
// 		"plugin:oxlint/recommended",
// 		"plugin:@typescript-eslint/recommended",
// 		"plugin:prettier/recommended",
// 		"plugin:astro/recommended",
// 		"plugin:astro/jsx-a11y-recommended",
// 	],
// 	rules: {
// 		// "@typescript-eslint/no-var-requires": "warn",
// 		// "@typescript-eslint/no-unused-vars": [
// 		// 	"warn",
// 		// 	{ varsIgnorePattern: "Props", ignoreRestSiblings: true },
// 		// ],
// 		"no-unused-vars": "off",
// 		"unused-imports/no-unused-vars": [
// 			"warn",
// 			{
// 				"vars": "all",
// 				"varsIgnorePattern": "^_",
// 				"args": "after-used",
// 				"argsIgnorePattern": "^_"
// 			}
// 		]

// 	},
// 	overrides: [
// 		{
// 			files: ["*.astro"],
// 			parser: "astro-eslint-parser",
// 			parserOptions: {
// 				parser: "@typescript-eslint/parser",
// 				extraFileExtensions: [".astro"],
// 			},
// 			rules: {
// 				"prettier/prettier": "off",
// 			},
// 		},
// 	],
// };
