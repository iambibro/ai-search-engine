import { env } from "@/config/env";
import jwt from "jsonwebtoken";

export async function authMiddleware(
	req: Request,
	next: (req: Request) => Promise<Response>
) {
	const authHeader = req.headers.get("authorization");
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
		});
	}
	const token = authHeader.split(" ")[1] || "";
	try {
		const payload = jwt.verify(token, env.JWT_SECRET);
		// Optionally attach user info to request here if using a framework that supports it
		return await next(req);
	} catch {
		return new Response(JSON.stringify({ error: "Invalid token" }), {
			status: 401,
		});
	}
}
