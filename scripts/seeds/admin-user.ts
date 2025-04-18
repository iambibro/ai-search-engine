import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { user } from "@/models/user";
import { env } from "@/config/env";

if (!env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is not set");
}
if (!env.JWT_SECRET) {
	throw new Error("JWT_SECRET environment variable is not set");
}
const JWT_SECRET = env.JWT_SECRET;

const db = drizzle(env.DATABASE_URL);

async function seed() {
	// Seed a default user
	const email = "admin@admin.com";
	const password = "admin123";
	const name = "Admin";
	const hashed = await hash(password, 10);

	// Insert user only if not exists
	const existing = await db.select().from(user).where(eq(user.email, email));
	let userId;
	if (existing.length === 0) {
		const inserted = await db
			.insert(user)
			.values({ email, password: hashed, name })
			.returning();
		userId = inserted?.[0]?.id;
		console.log("Seed user created:", email);
	} else {
		userId = existing[0]?.id;
		console.log("Seed user already exists:", email);
	}

	// Create a JWT token for the user
	const jwt = await import("jsonwebtoken");
	const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "7d" });

	// Ensure drizzle directory exists and write token to token.txt
	const dir = "./scripts/seeds";
	if (!existsSync(dir)) {
		mkdirSync(dir);
	}
	writeFileSync(`${dir}/token.txt`, token);
	console.log(`JWT token for admin user written to ${dir}/token.txt`);
}

seed().catch((e) => {
	console.error(e);
	process.exit(1);
});
