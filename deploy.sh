#!/bin/bash

# Stop script with any failed command
set -e

PROJECT_DIR=$1

if [ -z "$PROJECT_DIR" ]; then
  echo "❌ Err: can not find project dir"
  exit 1
fi

echo "================================================="
echo "🚀 Processing deploy: WEDDING APP"
echo "================================================="

cd "$PROJECT_DIR"

echo "➡️ [1/4] Pulling source from git..."
git fetch --all
git reset --hard origin/main

echo "➡️ [2/4] Checking new dependencies..."
yarn install

echo "➡️ [3/4] Building..."
yarn build

echo "➡️ [4/4] Restarting..."
pm2 restart wedding-backend

echo "================================================="
echo "✅ DEPLOY FINISHED"
echo "================================================="