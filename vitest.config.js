import { babel } from "@rollup/plugin-babel"
import { babelPluginHere } from "babel-plugin-here"

/** @type {import("vitest/config").UserConfig} */ export default {
	test: { includeSource: [ "src/**/*.ts" ] },
	plugins: [ babel({ babelHelpers: "bundled", extensions: [ ".ts" ], plugins: [ babelPluginHere() ] }) ]
}
