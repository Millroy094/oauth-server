#!/bin/bash

SOURCE_DIR="."

BACKEND_SOURCE_DIR="$SOURCE_DIR/packages/backend"

(cd $SOURCE_DIR && pnpm -r install && pnpm -r run build)

#Prepare backend
(cp "$BACKEND_SOURCE_DIR/package.json" "$SOURCE_DIR/build")
(cp "$BACKEND_SOURCE_DIR/node_modules" "$SOURCE_DIR/build")

