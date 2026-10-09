#!/usr/bin/env bash
# Comprueba la sintaxis de todos los archivos PHP del paquete.
# Uso: bash backend-changes/base-api/tests/lint.sh
set -euo pipefail
cd "$(dirname "$0")/../php"
status=0
while IFS= read -r -d '' f; do
  php -l "$f" >/dev/null || status=1
done < <(find . -name '*.php' -print0)
if [ "$status" -eq 0 ]; then echo "OK: sintaxis PHP correcta"; fi
exit "$status"
