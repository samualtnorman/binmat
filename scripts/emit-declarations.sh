#!/bin/sh
set -ex
tsc --project src --emitDeclarationOnly --noEmit false
