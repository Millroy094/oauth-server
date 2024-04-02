#!/bin/bash

SOURCE_DIR="."

BACKEND_SOURCE_DIR="$SOURCE_DIR/packages/backend"

(cd $SOURCE_DIR && pnpm -r install && pnpm -r run build)

#Prepare backend
(cp "$BACKEND_SOURCE_DIR/package.json" "$BACKEND_SOURCE_DIR/build")
(cp "$BACKEND_SOURCE_DIR/package-lock.json" "$BACKEND_SOURCE_DIR/build")
(cd "$BACKEND_SOURCE_DIR/build" && npm ci --production)

