// Path: /auth/signup

import { db } from "@/db/drizzle";
import { words } from "@/db/schema";
import { historic } from "@/db/schema/historic";
import { redisGet, redisSet } from "@/utils/redis";
import { eq } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const paramsSchema = z.object({
  word: z.string(),
});

export const v1GetWord = async (req: FastifyRequest, reply: FastifyReply) => {
  const { getCurrentUser } = req;
  const { word } = paramsSchema.parse(req.params);

  const { user } = await getCurrentUser();

  const key = `url:${req.originalUrl}`;

  const cached = await redisGet<any>({
    key,
  });

  const milliseconds = reply.elapsedTime;

  if (cached) {
    const { wordId } = cached as any;

    await db.insert(historic).values({
      userId: user.id,
      wordId: wordId,
    });

    return reply
      .send({
        ...cached,
        wordId: undefined,
      })
      .header("x-cache", "HIT")
      .header("x-response-time", milliseconds);
  }

  const wordFound = await db.query.words.findFirst({
    columns: {
      id: true,
      word: true,
      cuid: true,
      added: true,
    },
    where() {
      return eq(words.word, word);
    },
  });

  if (!wordFound) {
    return reply.status(400).send({
      message: "Word not found",
    });
  }

  await db.insert(historic).values({
    userId: user.id,
    wordId: wordFound.id,
  });

  const response = {
    result: {
      ...wordFound,
      id: undefined,
    },
  };

  await redisSet({
    key,
    data: { ...response, wordId: wordFound.id },
    cacheTimeSeconds: 10 * 60, // 10 minutes
  });

  reply.send(response);
};
