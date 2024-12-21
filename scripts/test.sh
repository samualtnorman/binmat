#!/bin/sh
set -ex
knip
tsc
tsc --project src
vitest run
rollup --config
