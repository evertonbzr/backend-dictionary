import { FastifyInstance } from "fastify";
import { v1DeleteFavorite } from "./v1-delete-favorite";
import { v1FavoriteWord } from "./v1-favorite-word";
import { v1GetWord } from "./v1-get-word";
import { v1ListEntries } from "./v1-list-entries";
import { v1Me } from "./v1-me";
import { v1SignIn } from "./v1-sign-in";
import { v1SignUp } from "./v1-sign-up";

export default (fastify: FastifyInstance, opts: any, done: any) => {
  fastify.post("/auth/signup", v1SignUp);
  fastify.post("/auth/signin", v1SignIn);
  fastify.get("/me", v1Me);
  fastify.get("/entries/en", v1ListEntries);
  fastify.get("/entries/en/:word", v1GetWord);
  fastify.post("/entries/en/:word/favorite", v1FavoriteWord);
  fastify.delete("/entries/en/:word/unfavorite", v1DeleteFavorite);
  done();
};
