// Path: /auth/signup

import { db } from "@/db/drizzle";
import { words } from "@/db/schema";
import { historic } from "@/db/schema/historic";
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

  reply.send(response);
};
