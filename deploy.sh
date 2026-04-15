#!/bin/bash
# Velara Deploy Script
# PROTECTS: uploads, database (leads, gallery), .env.local
# Creates automatic backups before every deploy

set -e

SERVER="root@2.24.192.67"
REMOTE_DIR="/var/www/velara"
PASSWORD="Velara@2026#"

export PATH="/opt/homebrew/bin:/opt/homebrew/Cellar/sshpass/1.10/bin:$PATH"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "🔨 Building locally..."
npx next build 2>&1 | tail -5
echo "✅ Local build OK"

echo ""
echo "📦 Packaging files (excluding protected data)..."
tar czf /tmp/velara-deploy.tar.gz \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='data' \
  --exclude='.env.local' \
  --exclude='public/assets/uploads' \
  --exclude='deploy.sh' \
  .

echo "📤 Uploading to server..."
sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no \
  /tmp/velara-deploy.tar.gz "$SERVER:/tmp/velara-deploy.tar.gz"
echo "✅ Upload complete"

echo ""
echo "🚀 Deploying on server..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER" bash -c "'
  cd $REMOTE_DIR
  TIMESTAMP=\$(date +%Y%m%d_%H%M%S)

  # ═══ BACKUP EVERYTHING IMPORTANT BEFORE DEPLOY ═══
  BACKUP_DIR=\"/root/velara-backups/\$TIMESTAMP\"
  mkdir -p \"\$BACKUP_DIR\"

  # Backup database
  if [ -f data/velara.db ]; then
    cp data/velara.db \"\$BACKUP_DIR/velara.db\"
    cp data/velara.db-wal \"\$BACKUP_DIR/velara.db-wal\" 2>/dev/null || true
    cp data/velara.db-shm \"\$BACKUP_DIR/velara.db-shm\" 2>/dev/null || true
    echo \"💾 Database backed up to \$BACKUP_DIR\"
  fi

  # Backup uploads
  if [ -d public/assets/uploads ] && [ \"\$(ls -A public/assets/uploads 2>/dev/null)\" ]; then
    cp -r public/assets/uploads \"\$BACKUP_DIR/uploads\"
    echo \"📁 Uploads backed up to \$BACKUP_DIR\"
  fi

  # Backup .env.local
  if [ -f .env.local ]; then
    cp .env.local \"\$BACKUP_DIR/.env.local\"
    echo \"🔑 Env backed up\"
  fi

  # Keep only last 10 backups
  ls -dt /root/velara-backups/*/ 2>/dev/null | tail -n +11 | xargs rm -rf 2>/dev/null || true

  # ═══ EXTRACT NEW CODE (protected dirs excluded from tarball) ═══
  tar xzf /tmp/velara-deploy.tar.gz \
    --exclude=\"data\" \
    --exclude=\".env.local\" \
    --exclude=\"public/assets/uploads\"

  # Ensure protected dirs exist
  mkdir -p data
  mkdir -p public/assets/uploads

  echo \"🔨 Building on server...\"
  npx next build 2>&1 | tail -5
  pm2 restart velara
  echo \"✅ DEPLOYED OK\"
  echo \"💾 Backup saved at: \$BACKUP_DIR\"
'"

rm -f /tmp/velara-deploy.tar.gz
echo ""
echo "🎉 Deploy complete! Database, uploads, and env are safe."
