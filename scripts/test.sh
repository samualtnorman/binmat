#!/bin/sh
set -ex
node_modules/.bin/knip
node_modules/.bin/tsc
node_modules/.bin/tsc --project src
node_modules/.bin/vitest run
node_modules/.bin/scripts/emit-declarations.sh
node_modules/.bin/tsc --project game-scripts
node_modules/.bin/rollup --config
node_modules/.bin/hsm golf game-scripts/binmat.ts
node_modules/.bin/hsm golf game-scripts/binmat_lib.ts
