#!/bin/sh

rm -rf docs

mkdir -p docs

echo "ms-docs.nullx.me" > docs/CNAME

npm run build --prefix _docs

mv _docs/dist/* docs/