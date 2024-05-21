import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";
import { words } from "./words";

export const favorites = pgTable("favorites", {
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

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  word: one(words, {
    fields: [favorites.wordId],
    references: [words.id],
  }),
}));
