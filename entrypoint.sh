#!/bin/sh
set -eu
mkdir -p "$DATA_DIR"
chown node:node "$DATA_DIR"
chmod 700 "$DATA_DIR"
exec gosu node node /app/portal/server.mjs

