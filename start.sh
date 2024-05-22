#!/bin/sh
# Resolve o IP do host do banco de dados e do redis
DB_IP=$(getent hosts database | awk '{ print $1 }')
REDIS_IP=$(getent hosts redis | awk '{ print $1 }')


DB_PASSWORD=${DB_PASSWORD}
DATABASE_URL="postgres://postgres:${DB_PASSWORD}@${DB_IP}:5432/postgres"
REDIS_URL="redis://${REDIS_IP}:6379"

export DB_URL=$DATABASE_URL
export REDIS_URI=$REDIS_URL

node dist/db/migrate.js && node dist/db/seed.js

exec "$@"
