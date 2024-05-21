import { appConfig } from "@/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres(appConfig.dbUrl);

export const db = drizzle(client, { schema });