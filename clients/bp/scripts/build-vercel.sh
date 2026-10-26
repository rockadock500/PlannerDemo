#!/usr/bin/env bash
# Copies the bp planner into the static Vercel site that serves taums.vercel.app.
# The demo folder is self-contained (data included), so it is copied as-is to
# client/demo/planner/BP/. Deploy afterwards with:
#   cd ~/Desktop/Freemans/copilot-demo-vercel && npx vercel@latest deploy --prod --yes
# That folder also serves the Freemans demo and BP Intelligence v2: always deploy the whole folder.
set -euo pipefail

SRC="$(cd "$(dirname "$0")/../demo" && pwd)"
SITE="${VERCEL_SITE:-$HOME/Desktop/Freemans/copilot-demo-vercel}"
DEST="$SITE/client/demo/planner/BP"

if [ ! -f "$SITE/vercel.json" ]; then
  echo "Vercel site not found at $SITE (set VERCEL_SITE)." >&2
  exit 1
fi

mkdir -p "$DEST"
rsync -a --delete --exclude ".DS_Store" "$SRC/" "$DEST/"
echo "Copied $SRC -> $DEST"
