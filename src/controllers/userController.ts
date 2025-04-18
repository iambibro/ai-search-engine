import { env } from "@/config/env";
import { db } from "@/lib/database";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerUserSchema, loginUserSchema } from "@/validators/user";
import { user as userModel } from "@/models/user";
import { eq } from "drizzle-orm";

export async function registerUser(req: Request) {
	const body = await req.json();
	const parseResult = registerUserSchema.safeParse(body);
	if (!parseResult.success) {
		return new Response(
			JSON.stringify({
				error: "Invalid input",
				details: parseResult.error.flatten(),
			}),
			{ status: 400 }
		);
	}
	const { email, password, name } = parseResult.data;
	const existing = await db
		.select()
		.from(userModel)
		.where(eq(userModel.email, email));
	if (existing.length > 0) {
		return new Response(
			JSON.stringify({ error: "Email already registered." }),
			{ status: 409 }
		);
	}
	const hashed = await hash(password, 10);
	const inserted = await db
		.insert(userModel)
		.values({ email, password: hashed, name })
		.returning();
	const createdUser = inserted[0];
	if (!createdUser) {
		return new Response(JSON.stringify({ error: "Failed to create user." }), {
			status: 500,
		});
	}
	return new Response(
		JSON.stringify({
			id: createdUser.id,
			email: createdUser.email,
			name: createdUser.name,
		}),
		{ status: 201 }
	);
}

export async function loginUser(req: Request) {
	const body = await req.json();
	const parseResult = loginUserSchema.safeParse(body);
	if (!parseResult.success) {
		return new Response(
			JSON.stringify({
				error: "Invalid input",
				details: parseResult.error.flatten(),
			}),
			{ status: 400 }
		);
	}
	const { email, password } = parseResult.data;
	const users = await db
		.select()
		.from(userModel)
		.where(eq(userModel.email, email));
	const user = users[0];
	if (!user) {
		return new Response(JSON.stringify({ error: "Invalid credentials." }), {
			status: 401,
		});
	}
	const valid = await compare(password, user.password);
	if (!valid) {
		return new Response(JSON.stringify({ error: "Invalid credentials." }), {
			status: 401,
		});
	}
	const token = jwt.sign(
		{ userId: user.id, email: user.email },
		env.JWT_SECRET,
		{ expiresIn: "7d" }
	);
	return new Response(JSON.stringify({ token }), { status: 200 });
}
