// Desc: Fastify server setup

import Fastify from "fastify";
import { ZodError } from "zod";
import { appConfig } from "../config";
import { initRedis } from "../db/redis";

const app = Fastify({
  logger: false,
  ignoreTrailingSlash: true,
});

app.register(require("@fastify/formbody"));

app.register(require("@fastify/cors"), {
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
  origin: (origin: any, cb: any) => {
    cb(null, true);
  },
});

app.register(require("@fastify/jwt"), {
  secret: appConfig.jwtSecret,
});

app.register(require("@fastify/cookie"), {
  hook: "onRequest",
});

Promise.all([initRedis()]).then(() => {
  app.listen(
    {
      port: appConfig.port,
      host: "0.0.0.0",
    },
    (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    }
  );

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      reply.status(400).send({
        message: "Validation error",
        stack: error.errors,
      });
    } else if (error instanceof Fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
      reply.send(error);
    } else {
      // fastify will use parent error handler to handle this
      reply.send(error);
    }
  });

  app.register(require("./routes/health"));
  app.register(require("./routes/routes"));
});
