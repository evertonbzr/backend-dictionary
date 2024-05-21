import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";
import { words } from "./words";

export const historic = pgTable("historic", {
  id: serial("id").primaryKey(),
  wordId: integer("word_id")
    .references(() => words.id, {
      onDelete: "set null",
    })
    .notNull(),
  userId: text("user_id")
    .references(() => users.id, {
      onDelete: "set null",
    })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const historicRelations = relations(historic, ({ one }) => ({
  user: one(users, {
    fields: [historic.userId],
    references: [users.id],
  }),
  word: one(words, {
    fields: [historic.wordId],
    references: [words.id],
  }),
}));
