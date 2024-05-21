import { db } from "@/db/drizzle";
import { historic, words } from "@/db/schema";
import { redisGet, redisSet } from "@/utils/redis";
import { and, count, eq, gt, ilike } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const querySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().optional(),
  cursor: z.string().optional(),
});

export const v1ListHistoric = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { search, limit = 20, cursor } = querySchema.parse(req.query);
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

  const idQuery = db.select({ id: words.id }).from(words).limit(1);

  if (cursor) {
    idQuery.where(eq(words.cuid, cursor));
  }

  const [{ id }] = await idQuery;

  const baseQuery = db
    .select({
      wordId: historic.wordId,
      word: words.word,
      cuid: words.cuid,
      seenAt: historic.createdAt,
      createdAt: words.createdAt,
    })
    .from(historic)
    .rightJoin(words, eq(historic.wordId, words.id))
    .where(
      and(
        eq(historic.userId, user.id),
        search ? ilike(words.word, `${search}%`) : undefined,
        id === 1 ? undefined : gt(words.id, id)
      )
    );

  const previousId = id - (limit - 1);

  const previousQuery = db.select({ cuid: words.cuid }).from(words).limit(1);

  let previousCuid = null;

  if (previousId >= 1) {
    const [word] = await previousQuery.where(eq(words.id, previousId));
    if (word?.cuid) {
      previousCuid = word.cuid;
    }
  }

  const [wordsCount] = await db
    .select({ count: count() })
    .from(baseQuery.as("baseQuery"));

  const wordsList = await baseQuery.limit(limit);

  const next =
    wordsList.length > 0 ? wordsList[wordsList.length - 1].cuid : null;

  const response = {
    result: wordsList.map((word) => ({
      word: word.word,
      added: word.createdAt,
      seenAt: word.seenAt,
    })),
    totalDocs: wordsCount.count,
    previous: previousCuid,
    next,
    hasNext: !!next,
    hasPrev: !!previousCuid,
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
