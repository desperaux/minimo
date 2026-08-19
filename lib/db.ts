import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let database: NeonQueryFunction<false, false> | undefined;

export function getDatabase() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured.");
  database ??= neon(url);
  return database;
}
