import { babel } from "@rollup/plugin-babel"
import nodeResolve from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import { findFiles } from "@samual/lib/findFiles"
import MagicString from "magic-string"
import { cpus } from "os"
import packageConfig from "./package.json" assert { type: "json" }

const SOURCE_FOLDER = "src"

const externalDependencies = []

if ("dependencies" in packageConfig)
	externalDependencies.push(...Object.keys(packageConfig.dependencies))

if ("optionalDependencies" in packageConfig)
	externalDependencies.push(...Object.keys(packageConfig.optionalDependencies))

export default findFiles(SOURCE_FOLDER).then(foundFiles => /** @type {import("rollup").RollupOptions} */ ({
	input: Object.fromEntries(
		foundFiles
			.filter(path => path.endsWith(".ts") && !path.endsWith(".d.ts"))
			.map(path => [ path.slice(SOURCE_FOLDER.length + 1, -3), path ])
	),
	output: { dir: "dist", chunkFileNames: "[name]-.js", generatedCode: "es2015", interop: "auto", compact: true },
	plugins: [
		babel({
			babelHelpers: "bundled",
			extensions: [ ".ts" ]
		}),
		nodeResolve({ extensions: [ ".ts" ] }),
		terser(/** @type {Parameters<typeof terser>[0] & { maxWorkers: number }} */ ({
			keep_classnames: true,
			keep_fnames: true,
			compress: { passes: Infinity },
			maxWorkers: Math.floor(cpus().length / 2)
		})),
		{
			name: "rollup-plugin-shebang",
			renderChunk(code, { fileName }) {
				if (!fileName.startsWith("bin/"))
					return undefined

				const magicString = new MagicString(code).prepend("#!/usr/bin/env node\n")

				return { code: magicString.toString(), map: magicString.generateMap({ hires: true }) }
			}
		}
	],
	external:
		source => externalDependencies.some(dependency => source == dependency || source.startsWith(`${dependency}/`)),
	preserveEntrySignatures: "allow-extension"
}))
