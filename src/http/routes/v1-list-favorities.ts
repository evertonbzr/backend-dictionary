import { db } from "@/db/drizzle";
import { favorites, words } from "@/db/schema";
import { redisGet, redisSet } from "@/utils/redis";
import { and, count, desc, eq, ilike } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const querySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
});

export const v1ListFavorites = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { search, limit = 20, page = 1 } = querySchema.parse(req.query);
  const { user } = await req.getCurrentUser();

  const key = `url:${req.originalUrl}`;

  const cached = await redisGet({
    key,
  });

  const milliseconds = reply.elapsedTime;

  if (cached) {
    return reply
      .send(cached)
      .header("x-cache", "HIT")
      .header("x-response-time", milliseconds);
  }

  const baseQuery = db
    .select({
      wordId: favorites.wordId,
      word: words.word,
      cuid: words.cuid,
      createdAt: words.createdAt,
    })
    .from(favorites)
    .rightJoin(words, eq(favorites.wordId, words.id))
    .where(
      and(
        eq(favorites.userId, user.id),
        search ? ilike(words.word, `${search}%`) : undefined
      )
    )
    .orderBy(desc(favorites.id));

  const [wordsCount] = await db
    .select({ count: count() })
    .from(baseQuery.as("baseQuery"));

  const wordsList = await baseQuery.offset((page - 1) * limit).limit(limit);

  const response = {
    result: wordsList.map((word) => ({
      word: word.word,
      added: word.createdAt,
    })),
    totalDocs: wordsCount.count,
    page,
    totalPages: Math.ceil(wordsCount.count / limit),
    hasNext: page * limit < wordsCount.count,
    hasPrev: page > 1,
  };

  await redisSet({
    key,
    data: response,
    cacheTimeSeconds: 10 * 60, // 10 minutes
  });

  reply
    .send(response)
    .header("x-cache", "MISS")
    .header("x-response-time", milliseconds);
};
