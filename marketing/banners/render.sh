#!/bin/sh
# Renders every banner to PNG in English and Spanish.
# SCALE sets the resolution: 4 (default) gives 6000x2000 and 4320x7680 PNGs; 1 gives the base sizes.
# Needs Playwright's headless Chromium: npx playwright install chromium-headless-shell
set -e
SCALE="${SCALE:-4}"
cd "$(dirname "$0")"
CH="${CHROME:-$(ls -d "$HOME"/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell 2>/dev/null | tail -1)}"
[ -x "$CH" ] || { echo "Headless Chromium not found. Set CHROME=/path/to/chrome." >&2; exit 1; }

render() { # page size output
  "$CH" --headless --disable-gpu --hide-scrollbars --allow-file-access-from-files \
    --virtual-time-budget=3000 --force-device-scale-factor="$SCALE" --window-size="$2" --screenshot="$PWD/$3" "file://$PWD/$1" >/dev/null 2>&1
  echo "$3"
}

render "horizontal.html"            1500,500  gullin-banner-horizontal.png
render "horizontal.html?lang=es"    1500,500  gullin-banner-horizontal-es.png
render "vertical.html"              1080,1920 gullin-banner-vertical.png
render "vertical.html?lang=es"      1080,1920 gullin-banner-vertical-es.png
render "explainer.html"             1500,500  gullin-banner-explainer.png
render "explainer.html?lang=es"     1500,500  gullin-banner-explainer-es.png
render "harness-parts.html"         1500,500  gullin-banner-harness-parts.png
render "harness-parts.html?lang=es" 1500,500  gullin-banner-harness-parts-es.png
