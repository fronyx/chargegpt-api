import { DataSource } from 'typeorm';

const datasource = new DataSource({
    "type": "postgres",
    "host": process.env.DB_HOST ?? "localhost",
    "port": Number(process.env.DB_PORT ?? 5432),
    "username": process.env.DB_USER ?? "postgres",
    "password": process.env.DB_PASSWORD ?? "replace-me",
    "database": process.env.DB_NAME ?? "main",
    "entities": [
        "src/shared/database/entities/crawling/*.entity{.ts,.js}"
    ],
    "migrationsTableName": "migration",
    "migrations": [
        "src/shared/database/migration/crawling/*.ts"
    ],
    "ssl": false,
});

datasource.initialize();

export default datasource; 
