import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required to run migrations.");

const sql = neon(databaseUrl);
const migration = await readFile(join(process.cwd(), "migrations/0001_identity_workspace.sql"), "utf8");
const statements = migration.split(/;\s*(?:\n|$)/).map(statement => statement.trim()).filter(Boolean);
for (const statement of statements) await sql.query(statement);
console.log(`Applied ${statements.length} migration statements.`);
