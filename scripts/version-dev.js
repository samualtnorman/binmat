#!/usr/bin/env node
import { spawnSync } from "child_process"
import * as Semver from "semver"
import packageConfig from "../package.json" assert { type: "json" }

const incrementedVersion = Semver.inc(packageConfig.version || "0.0.0", "patch")
const hash = spawnSync("git", [ "rev-parse", "--short", "HEAD" ], { encoding: "utf8" }).stdout.trim()

spawnSync("pnpm", [ "version", `${incrementedVersion}-${hash}` ], { stdio: "inherit" })
process.exit()
