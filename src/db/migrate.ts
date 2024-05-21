import postgres from "postgres";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

import { env } from "@/env";

const connection = postgres(env.DB_URL, { max: 1 });
const db = drizzle(connection);

const run = async () => {
  await migrate(db, { migrationsFolder: "drizzle" });

  console.log("Migrations applied successfully!");

  await connection.end();

  process.exit();
};

run();
