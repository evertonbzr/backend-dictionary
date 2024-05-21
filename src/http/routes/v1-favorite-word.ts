// Path: /auth/signup

import { db } from "@/db/drizzle";
import { words } from "@/db/schema";
import { eq } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const paramsSchema = z.object({
  word: z.string(),
});

export const v1FavoriteWord = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { word } = paramsSchema.parse(req.params);

  const baseQuery = db
    .select({ word: words.word, cuid: words.cuid, added: words.added })
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

  const response = {
    result: wordData,
  };

  reply.send(response);
};
