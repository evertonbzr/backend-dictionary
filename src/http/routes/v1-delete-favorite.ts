// Path: /auth/signup

import { db } from "@/db/drizzle";
import { favorites, words } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const paramsSchema = z.object({
  word: z.string(),
});

export const v1DeleteFavorite = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { getCurrentUser } = req;

  const { word } = paramsSchema.parse(req.params);
  const { user } = await getCurrentUser();

  const wordFound = await db.query.words.findFirst({
    where: () => eq(words.word, word),
  });

  if (!wordFound) {
    return reply.status(400).send({
      message: "Word not found",
    });
  }

  const existingFavorite = await db.query.favorites.findFirst({
    where() {
      return and(
        eq(favorites.userId, user.id),
        eq(favorites.wordId, wordFound.id)
      );
    },
  });

  if (!existingFavorite) {
    return reply.status(200).send({
      message: "Word not favorited",
    });
  }

  const wordFavorite = await db
    .delete(favorites)
    .where(
      and(eq(favorites.userId, user.id), eq(favorites.wordId, wordFound.id))
    )
    .returning({
      id: favorites.id,
    });

  const response = {
    result: {
      delete: !!wordFavorite,
    },
  };

  reply.send(response);
};
