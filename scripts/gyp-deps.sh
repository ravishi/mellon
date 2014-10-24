#!/bin/bash
MELLON_NPM_BIN="$(npm bin)"
cd ./node_modules/gwend/node_modules/sqlite3
PATH="$(npm bin):$MELLON_NPM_BIN:$PATH" node-pre-gyp build --runtime=node-webkit --target=0.10.5
