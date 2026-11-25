#!/bin/sh
# Mac/Linux optional launcher. Node.js LTS is required; no npm install needed.
set -eu
DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
cd "$DIR"
node server/index.js &
PID=$!
sleep 2
if command -v open >/dev/null 2>&1; then open 'http://127.0.0.1:4173'; elif command -v xdg-open >/dev/null 2>&1; then xdg-open 'http://127.0.0.1:4173'; else echo 'Open http://127.0.0.1:4173'; fi
wait "$PID"
