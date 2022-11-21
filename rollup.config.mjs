import { babel } from "@rollup/plugin-babel"
import nodeResolve from "@rollup/plugin-node-resolve"
import { findFiles } from "@samual/lib/findFiles"
import { readFile } from "fs/promises"
import preserveShebang from "rollup-plugin-preserve-shebang"
import { terser } from "rollup-plugin-terser"

const SOURCE_FOLDER = `src`

/** @type {Promise<import("rollup").RollupOptions>} */
export default Promise.all([
	readFile(`./package.json`, { encoding: `utf-8` }).then(JSON.parse),
	findFiles(SOURCE_FOLDER)
]).then(([ packageConfig, foundFiles ]) => ({
	input: Object.fromEntries(
		foundFiles
			.filter(path => path.endsWith(`.ts`) && !path.endsWith(`.d.ts`))
			.map(path => [ path.slice(SOURCE_FOLDER.length + 1, -3), path ])
	),

	output: { dir: `dist`, chunkFileNames: `[name]-.js`, generatedCode: `es2015`, interop: `auto`, compact: true },

	plugins: [
		babel({ babelHelpers: `bundled`, extensions: [ `.ts` ] }),
		nodeResolve({ extensions: [ `.ts` ] }),
		terser({ keep_classnames: true, keep_fnames: true }),
		preserveShebang()
	],

	external: packageConfig.dependencies ?
		Object.keys(packageConfig.dependencies).map(name => new RegExp(`^${name}(?:/|$)`)) :
		undefined,

	preserveEntrySignatures: "allow-extension"
}))
