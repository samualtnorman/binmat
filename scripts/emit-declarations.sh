#!/bin/sh
set -ex
node_modules/.bin/tsc --project src --emitDeclarationOnly --noEmit false --noCheck
