import { FastifyInstance } from "fastify";
import { v1SignIn } from "./v1-sign-in";
import { v1SignUp } from "./v1-sign-up";

export default (fastify: FastifyInstance, opts: any, done: any) => {
  fastify.post("/auth/signup", v1SignUp);
  fastify.post("/auth/signin", v1SignIn);
  done();
};
