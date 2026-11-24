#!/bin/sh
cd "$(dirname "$0")" || exit 1
if ! command -v node >/dev/null 2>&1; then
 echo 'Install Node.js 18+ from https://nodejs.org/ and run this file again.'
 exit 1
fi
node backend/server.js
