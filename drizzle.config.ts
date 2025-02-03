import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  tablesFilter: ["cryptostats_*"],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
