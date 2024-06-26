// Path: /auth/signup

import { db } from "@/db/drizzle";
import { favorites, words } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const paramsSchema = z.object({
  word: z.string(),
});

export const v1FavoriteWord = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { getCurrentUser } = req;

  const { word } = paramsSchema.parse(req.params);
  const { user } = await getCurrentUser();

  const baseQuery = db
    .select({
      word: words.word,
      cuid: words.cuid,
      added: words.added,
      id: words.id,
    })
    .from(words)
    .where(eq(words.word, word))
    .limit(1);

  const wordResult = await baseQuery;

  if (wordResult.length === 0) {
    return reply.status(400).send({
      message: "Word not found",
    });
  }

  const [wordData] = wordResult;

  const existingFavorite = await db.query.favorites.findFirst({
    where() {
      return and(
        eq(favorites.userId, user.id),
        eq(favorites.wordId, wordData.id)
      );
    },
  });

  if (existingFavorite) {
    return reply.status(200).send({
      message: "Word already favorited",
    });
  }

  const wordFavorite = await db.insert(favorites).values({
    userId: user.id,
    wordId: wordData.id,
  });

  const response = {
    result: {
      favorite: true,
    },
  };

  reply.send(response);
};
