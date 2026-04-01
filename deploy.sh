#!/bin/bash
echo "Building..."
npx vercel build --prod 2>&1 | tail -3
echo "Deploying..."
DEPLOY_OUT=$(npx vercel deploy --prebuilt --prod 2>&1)
URL=$(echo "$DEPLOY_OUT" | grep "Production:" | head -1 | awk '{print $2}' | sed 's|https://||' | tr -d '[:space:]')
echo "Aliasing $URL..."
npx vercel alias set "$URL" wwtd-tool.vercel.app
echo "Done! Live at https://wwtd-tool.vercel.app"
