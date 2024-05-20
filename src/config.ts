import { env } from "./env";

const nodeEnv = env.NODE_ENV;
const isDevelopment: boolean = !env.NODE_ENV || nodeEnv === "development";
const isProduction: boolean = nodeEnv === "production";

const appName = "backend-dictionary";

const development = {
  name: appName,
  port: 3000,
  isDevelopment,
  isProduction,
  jwtSecret: env.JWT_SECRET,
  redis: {
    uri: env.REDIS_URI,
  },
};

const production = {
  name: appName,
  port: 3000,
  isDevelopment,
  isProduction,
  jwtSecret: env.JWT_SECRET,
  redis: {
    uri: env.REDIS_URI,
  },
};

const configMap: any = {
  development,
  production,
};

export const appConfig: typeof production = configMap[nodeEnv];

appConfig.port =
  typeof process.env.PORT === "undefined"
    ? appConfig.port
    : Number(process.env.PORT);
