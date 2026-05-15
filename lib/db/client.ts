import { neon } from "@neondatabase/serverless";

let cachedSql: ReturnType<typeof neon> | null = null;

export class DatabaseConfigError extends Error {
  constructor() {
    super("DATABASE_URL is not configured.");
    this.name = "DatabaseConfigError";
  }
}

export function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new DatabaseConfigError();
  }

  cachedSql ??= neon(process.env.DATABASE_URL);
  return cachedSql;
}
