#!/bin/sh
set -ex
knip
tsc
tsc --project src
vitest run
scripts/emit-declarations.sh
tsc --project game-scripts
rollup --config
pnpm hsm golf game-scripts/binmat.ts
pnpm hsm golf game-scripts/binmat_lib.ts
