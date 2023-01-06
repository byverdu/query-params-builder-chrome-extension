#!/bin/bash

rm -rf dist
mkdir dist
cp -rv src/* dist
node ./utils/minify.js
zip -r queryParamsBuilderTab.zip ./dist
