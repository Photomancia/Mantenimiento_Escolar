#!/usr/bin/env bash
# Pruebas de humo de la API base. Solo hace peticiones GET/POST de lectura:
# no modifica datos. Uso:
#   bash backend-changes/base-api/tests/smoke-test.sh http://localhost:8000/api
#   bash backend-changes/base-api/tests/smoke-test.sh https://TU-DOMINIO/api
# Variable opcional EXPECT_DB=ok exige que la base de datos esté disponible.
set -uo pipefail

BASE="${1:-http://localhost:8000/api}"
fail=0

check() { # descripción, condición
  if eval "$2"; then echo "  OK   $1"; else echo "  FALLO $1"; fail=1; fi
}

echo "API: $BASE"

body=$(curl -s -o /dev/stdout -w '\n%{http_code}' "$BASE/health")
code=$(tail -n1 <<<"$body"); json=$(sed '$d' <<<"$body")
check "GET /health responde 200" '[ "$code" = "200" ]'
check "GET /health devuelve service" 'grep -q "\"service\":\"mantenimiento-escolar-api\"" <<<"$json"'
check "GET /health incluye database" 'grep -Eq "\"database\":\"(ok|unavailable)\"" <<<"$json"'
if [ "${EXPECT_DB:-}" = "ok" ]; then
  check "Base de datos disponible" 'grep -q "\"database\":\"ok\"" <<<"$json"'
fi

ctype=$(curl -s -o /dev/null -w '%{content_type}' "$BASE/health")
check "Content-Type es JSON" '[[ "$ctype" == application/json* ]]'

code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/no-existe")
check "Ruta desconocida responde 404" '[ "$code" = "404" ]'

code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/health")
check "POST /health responde 405" '[ "$code" = "405" ]'

json=$(curl -s "$BASE/no-existe")
check "Error con formato estándar" 'grep -q "\"error\":{\"code\":\"NOT_FOUND\"" <<<"$json"'

if [ "$fail" -eq 0 ]; then echo "Resultado: todas las comprobaciones OK"; else echo "Resultado: HAY FALLOS"; fi
exit "$fail"
