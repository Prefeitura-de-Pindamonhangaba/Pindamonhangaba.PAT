import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const sessions = pgTable(
  "sessions",
  {
    digest: text().primaryKey(),
    subject: text().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("sessions_expiration_idx").on(table.expiresAt)],
);
