require('dotenv').config();

/**
 * Central TypeORM configuration.
 * Prefer using process.env.DATABASE_URL if present; otherwise fall back to individual vars.
 * Supports CLI usage (e.g. typeorm migration:generate) if you install the TypeORM CLI locally.
 */

const url = process.env.DATABASE_URL;

// Optional discrete values (used if URL not provided)
const host = process.env.DB_HOST;
const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

module.exports = {
  type: 'postgres',
  ...(url
    ? { url }
    : { host, port, username, password, database }),
  entities: ['dist/**/*.entity{.js,.ts}'],
  migrations: ['dist/migrations/*{.js,.ts}'],
  cli: { migrationsDir: 'src/migrations' },
  ssl: url ? { rejectUnauthorized: false } : undefined,
  synchronize: false,
};
