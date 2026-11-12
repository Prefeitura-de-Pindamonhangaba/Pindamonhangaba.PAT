import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getEnv } from "../env";

let database: ReturnType<typeof drizzle> | undefined;
export function db() {
  return (database ??= drizzle(
    postgres(getEnv().DATABASE_URL, { max: 5, connect_timeout: 5 }),
  ));
}
