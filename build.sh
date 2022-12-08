rm -rf dist
mkdir dist
cp -rv src/* dist
node ./utils/minify.js