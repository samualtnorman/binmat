#!/bin/sh
set -ex
tsc
tsc --project src
vitest run
rollup --config
