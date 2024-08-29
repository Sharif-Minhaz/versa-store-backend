import globals from "globals";
import pluginJs from "@eslint/js";
import nodePlugin from "eslint-plugin-node";

export default [
	{
		files: ["**/*.js"],
		languageOptions: { sourceType: "commonjs", globals: globals.node },
		plugins: {
			node: nodePlugin,
		},
		extends: ["eslint:recommended", "plugin:node/recommended"],
		rules: {
			"no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
			"node/exports-style": ["error", "module.exports"],
			"node/file-extension-in-import": ["error", "always"],
			"node/prefer-global/buffer": ["error", "always"],
			"node/prefer-global/console": ["error", "always"],
			"node/prefer-global/process": ["error", "always"],
			"node/prefer-global/url-search-params": ["error", "always"],
			"node/prefer-global/url": ["error", "always"],
			"node/prefer-promises/dns": "error",
			"node/prefer-promises/fs": "error",
		},
	},
	pluginJs.configs.recommended,
];
