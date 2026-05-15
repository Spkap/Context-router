import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";

function loadLocalEnv() {
  try {
    const raw = readFileSync(".env", "utf8");

    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
        continue;
      }

      const [key, ...valueParts] = trimmed.split("=");
      process.env[key] ??= valueParts.join("=");
    }
  } catch {
    // Local env file is optional in CI when DATABASE_URL is set directly.
  }
}

function splitStatements(sql) {
  return sql
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
}

loadLocalEnv();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run migrations.");
}

const sql = neon(process.env.DATABASE_URL);
const migrationDir = join(process.cwd(), "migrations");
const files = readdirSync(migrationDir)
  .filter((file) => file.endsWith(".sql"))
  .sort();

for (const file of files) {
  const statements = splitStatements(readFileSync(join(migrationDir, file), "utf8"));

  for (const statement of statements) {
    await sql.query(statement);
  }

  console.log(`Applied ${file}`);
}
