import { createId } from "@paralleldrive/cuid2";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const words = pgTable("words", {
  id: serial("id").primaryKey(),
  cuid: varchar("cuid", { length: 36 }).$defaultFn(() => createId()),
  word: varchar("word", { length: 255 }).notNull(),
  added: timestamp("added").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});
