export const env = {
	JWT_SECRET: process.env.JWT_SECRET || "dev_secret_key",
	DATABASE_URL: process.env.DATABASE_URL || "",
	GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
	GOOGLE_CSE_ID: process.env.GOOGLE_CSE_ID || "",
};
