#!/usr/bin/env node
import Braces from "braces"
import { readFileSync, writeFileSync } from "fs"
import * as Path from "path"

const target = process.argv[2]

if (!target) {
	console.error(`Missing target`)
	process.exit(1)
}

const extensionLength = Path.extname(target).length
const enumName = Path.basename(target).slice(0, -extensionLength)

const members = readFileSync(target, { encoding: "utf8" })
	.trim()
	.replace(/\n\n+/g, `\n`)
	.replace(/\n\t+/g, ``)
	.replace(/\n\t*}/g, `}`)
	.split("\n")
	.flatMap(name => Braces.expand(name))
	.filter(Boolean)

const code = `\
declare enum ${enumName}Enum {\n\t${members.join(`,\n\t`)}\n}

export type ${enumName} = ${enumName}Enum
export type ${enumName}Name = keyof typeof ${enumName}Enum

export namespace ${enumName} {
${members.map(name =>
	`\texport type ${name} = ${enumName}Enum.${name}`
).join(`\n`)}
}

export const ${enumName} = {
${members.map((name, index) => `\t${name}: ${index + 1} as ${enumName}.${name},`).join(`\n`)}
} as const

export const ${enumName}sToNames: Readonly<Record<number, string>> = {
${members.map((name, index) => `\t${index + 1}: "${name}",`).join(`\n`)}
}
`

const outFile = `${target.slice(0, -extensionLength)}.ts`

writeFileSync(outFile, code)
console.log(`Wrote ${members.length} enum members to ${outFile}`)
process.exit()
