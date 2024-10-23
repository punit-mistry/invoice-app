import {
  serial,
  pgTable,
  timestamp,
  integer,
  text,
  pgEnum,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
  "open",
  "paid",
  "void",
  "uncollected",
]);

export const Invoice = pgTable("invoices", {
  id: serial("id").primaryKey().notNull(),
  createTs: timestamp("createTs").defaultNow().notNull(),
  status: statusEnum("status").notNull(),
  value: integer("value").notNull(),
  description: text("description").notNull(),
});
