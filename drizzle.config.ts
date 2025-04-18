import { env } from "@/config/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/models",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL!,
	},
});
