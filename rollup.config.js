#!node_modules/.bin/rollup --config
import babelPresetEnv from "@babel/preset-env"
import babelPresetTypescript from "@babel/preset-typescript"
import { babel } from "@rollup/plugin-babel"
import nodeResolve from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import { findFiles } from "@samual/lib/findFiles"
import { babelPluginHere } from "babel-plugin-here"
import { cpus } from "os"
import prettier from "rollup-plugin-prettier"

/** @typedef {import("rollup").RollupOptions} RollupOptions */
/** @typedef {import("@babel/preset-env").Options} BabelPresetEnvOptions */

const SOURCE_PATH = "src"

export default findFiles(SOURCE_PATH).then(foundFiles => /** @type {import("rollup").RollupOptions} */ ({
	external: source => !(source.startsWith("/") || source.startsWith(".")),
	input: Object.fromEntries(foundFiles.filter(path => path.endsWith(".ts") && !path.endsWith(".d.ts"))
		.map(path => [ path.slice(SOURCE_PATH.length + 1, -3), path ])
	),
	output: { dir: "dist" },
	plugins: [
		babel({
			babelHelpers: "bundled",
			extensions: [ ".ts" ],
			presets: [
				[ babelPresetEnv, /** @satisfies {BabelPresetEnvOptions} */({ targets: { node: "18.0" } }) ],
				[ babelPresetTypescript, { allowDeclareFields: true, optimizeConstEnums: true } ]
			],
			plugins: [ babelPluginHere() ]
		}),
		nodeResolve({ extensions: [ ".ts" ] }),
		terser({
			compress: { passes: Infinity, unsafe: true, sequences: false },
			maxWorkers: Math.floor(cpus().length / 2),
			mangle: false
		}),
		prettier({
			parser: "espree",
			useTabs: true,
			tabWidth: 4,
			arrowParens: "avoid",
			experimentalTernaries: true,
			printWidth: 120,
			semi: false,
			trailingComma: "none"
		})
	],
	strictDeprecations: true,
	treeshake: { moduleSideEffects: false }
}))
