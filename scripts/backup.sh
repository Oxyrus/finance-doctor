#!/bin/bash
# Daily SQLite backup script
# Runs via cron at 2am daily

BACKUP_DIR="/backups"
DB_PATH="/data/finance.db"
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/finance-$DATE.db"
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Copy database file (SQLite handles concurrent reads safely)
if [ -f "$DB_PATH" ]; then
    cp "$DB_PATH" "$BACKUP_FILE"
    echo "$(date): Backup created: $BACKUP_FILE"
else
    echo "$(date): ERROR: Database file not found at $DB_PATH"
    exit 1
fi

# Remove backups older than retention period
find "$BACKUP_DIR" -name "finance-*.db" -type f -mtime +$RETENTION_DAYS -delete
echo "$(date): Old backups cleaned (>$RETENTION_DAYS days)"

# Verify backup file exists and has size > 0
if [ -s "$BACKUP_FILE" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "$(date): Backup successful. Size: $BACKUP_SIZE"
    exit 0
else
    echo "$(date): ERROR: Backup file is empty or missing"
    exit 1
fi