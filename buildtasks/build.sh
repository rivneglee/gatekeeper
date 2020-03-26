#!/usr/bin/env bash

rm -rf builds
mkdir builds
mkdir builds/express-gatekeeper-core

yarn install
yarn build

cp -r packages/core/build/* builds/express-gatekeeper-core
