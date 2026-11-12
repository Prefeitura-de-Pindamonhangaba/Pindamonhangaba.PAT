import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const vacancies = pgTable(
  "vacancies",
  {
    id: uuid().defaultRandom().primaryKey(),
    occupation: varchar({ length: 200 }).notNull(),
    openings: integer().notNull(),
    education: varchar({ length: 200 }).notNull().default(""),
    experience: varchar({ length: 200 }).notNull().default(""),
    notes: varchar({ length: 1000 }).notNull().default(""),
    filled: boolean().notNull().default(false),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [check("vacancies_positive_openings", sql`${table.openings} > 0`)],
);

export const publication = pgTable(
  "publication",
  {
    id: integer().primaryKey(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => [check("publication_singleton", sql`${table.id} = 1`)],
);

export type Vacancy = typeof vacancies.$inferSelect;
