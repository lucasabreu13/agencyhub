#!/bin/bash
# =============================================================
# AgencyHub - Backup completo do banco PostgreSQL no Render
# Execute via Git Bash no Windows:
#   bash backup-render-db.sh
# =============================================================

# --- CONFIGURAÇÃO ---
# postgresql://agencyhub_db_user:N3B4xm3bxfv7CUCNKGX0p4MYhSEUHimN@dpg-d6o3ssh4tr6s73cdhb8g-a.ohio-postgres.render.com/agencyhub_db
# Formato: postgres://USER:PASSWORD@HOST:PORT/DATABASE
RENDER_DB_URL="postgresql://SEU_USER:SUA_SENHA@SEU_HOST.render.com:5432/SEU_DATABASE"

BACKUP_FILE="agencyhub_backup_$(date +%Y%m%d_%H%M%S).sql"

echo "======================================================="
echo "  AgencyHub - Backup PostgreSQL (Render)"
echo "======================================================="
echo ""
echo "Arquivo de saída: $BACKUP_FILE"
echo ""

# Verifica se pg_dump está disponível
if ! command -v pg_dump &> /dev/null; then
  echo "ERRO: pg_dump não encontrado."
  echo "Instale o PostgreSQL client:"
  echo "  Windows: https://www.postgresql.org/download/windows/"
  echo "  Ou via Chocolatey: choco install postgresql"
  exit 1
fi

echo "Iniciando backup..."
echo ""

# Dump completo: schema + dados + enums + sequências
pg_dump \
  "$RENDER_DB_URL" \
  --no-owner \
  --no-acl \
  --verbose \
  --format=plain \
  --encoding=UTF8 \
  --file="$BACKUP_FILE"

if [ $? -eq 0 ]; then
  SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
  echo ""
  echo "======================================================="
  echo "  BACKUP CONCLUIDO COM SUCESSO!"
  echo "  Arquivo: $BACKUP_FILE"
  echo "  Tamanho: $SIZE"
  echo "======================================================="
else
  echo ""
  echo "ERRO: Falha ao gerar o backup. Verifique a URL de conexão."
  exit 1
fi
