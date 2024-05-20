// Desc: Fastify server setup

import Fastify from "fastify";
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

  app.register(require("./routes/health"));
  app.register(require("./routes/routes"));
});
