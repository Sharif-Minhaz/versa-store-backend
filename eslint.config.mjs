import globals from "globals";
import pluginJs from "@eslint/js";
import nodePluginJs from "eslint-plugin-node";

export default [
	{
		files: ["**/*.js"],
		languageOptions: { sourceType: "commonjs" },
		plugins: { node: nodePluginJs },
	},
	{ languageOptions: { globals: globals.node } },
	pluginJs.configs.recommended,
	{
		rules: {
			"no-process-env": "off",
			"no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
			"node/no-missing-import": "error",
		},
	},
];
