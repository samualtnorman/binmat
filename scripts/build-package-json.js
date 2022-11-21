import findFiles from "@samual/lib/findFiles"
import { readFile, writeFile } from "fs/promises"

const packageJSON = JSON.parse(await readFile(`package.json`, { encoding: `utf-8` }))

delete packageJSON.private
delete packageJSON.scripts
packageJSON.bin = {}

for (let name of await findFiles(`dist`)) {
	name = `.${name.slice(4)}`

	if (name.startsWith(`./bin/`) && name.endsWith(`.js`)) {
		packageJSON.bin[name.slice(6, -3)] = name

		continue
	}
}

writeFile(`dist/package.json`, JSON.stringify(packageJSON, undefined, `\t`))
