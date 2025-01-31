#!/bin/bash

set -o errexit

main() {
  init_user_and_db
}

init_user_and_db() {
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE ROLE "$DB_USER" WITH PASSWORD '$DB_PASSWORD' LOGIN CREATEDB;
    CREATE DATABASE "$DB_NAME";
    GRANT ALL PRIVILEGES ON DATABASE "$DB_NAME" TO "$DB_USER";

    \c "$DB_NAME";
    CREATE SCHEMA "$DB_SCHEMA_NAME";
    GRANT ALL PRIVILEGES ON SCHEMA "$DB_SCHEMA_NAME" TO "$DB_USER";
    ALTER ROLE "$DB_USER" SET search_path TO "$DB_SCHEMA_NAME", public;
EOSQL
}

main "$@"