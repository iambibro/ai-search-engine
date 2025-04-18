import { serve } from "bun";
import { handleGenerate } from "./controllers/generateControllers";
import { handleSearch } from "./controllers/aiSearchControllers";
import { registerUser, loginUser } from "./controllers/userController";
import { authMiddleware } from "./middleware/authMiddleware";
import { handleContextSearch } from "./controllers/contextSearchControllers";

serve({
	port: 5050,
	fetch(req) {
		const url = new URL(req.url);

		// Handle CORS preflight requests
		if (req.method === "OPTIONS") {
			return new Response(null, {
				status: 204,
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type",
				},
			});
		}

		// Handle root endpoint
		if (req.method === "GET" && url.pathname === "/") {
			return new Response("Welcome to AI Search Engine API", {
				status: 200,
				headers: {
					"Content-Type": "text/plain",
					"Access-Control-Allow-Origin": "*",
				},
			});
		}

		// User registration
		if (req.method === "POST" && url.pathname === "/register") {
			return registerUser(req);
		}
		// User login
		if (req.method === "POST" && url.pathname === "/login") {
			return loginUser(req);
		}

		// Protected generate endpoint
		if (req.method === "GET" && url.pathname === "/generate") {
			return authMiddleware(req, handleGenerate);
		}

		// Protected search endpoint
		if (req.method === "GET" && url.pathname === "/search") {
			return authMiddleware(req, handleSearch);
		}

		// Protected context search endpoint
		if (req.method === "GET" && url.pathname === "/context-search") {
			return authMiddleware(req, handleContextSearch);
		}

		// Handle 404 for all other routes
		return new Response(JSON.stringify({ error: "Not Found" }), {
			status: 404,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
		});
	},
});
