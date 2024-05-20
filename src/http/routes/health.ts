import { appConfig } from "@/config";
import { FastifyInstance } from "fastify";
const podFullName: string =
  [process.env.K8S_POD_NAME, process.env.K8S_POD_IP, process.env.K8S_NODE_NAME]
    .filter((e) => e)
    .join("_") || appConfig.name;

const sigState: any = {
  sigTerm: false,
  sgiKill: false,
  preStop: false,
  sigTermTime: undefined,
  sgiKillTime: undefined,
};

process.on("SIGTERM", function onSigterm() {
  sigState.sigTerm = true;
  sigState.sigTermTime = Date().toString();
});

process.on("SIGILL", function onSigterm() {
  sigState.sgiKill = true;
  sigState.sgiKillTime = Date().toString();
});

const v1Healthz = (fastify: FastifyInstance, opts: any, done: any) => {
  fastify.get("/v1-healthz/", async (req, reply) => {
    reply.status(200);
    reply.send({ success: true, podFullName, sigState, runtime: "node" });
  });
  done();
};

export default v1Healthz;
