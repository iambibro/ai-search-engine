import { describe, it, expect } from "bun:test";

import { handleGenerate } from "../controllers/generateControllers";

// Mock Request object
function createMockRequest(query: string, url: string) {
	const searchUrl = `http://localhost/api/generate?query=${encodeURIComponent(
		query
	)}&url=${encodeURIComponent(url)}`;
	return { url: searchUrl } as Request;
}

describe("handleGenerate", () => {
	it("should return analysis and webContent for valid input", async () => {
		const query = "Tell me some historical facts about siliguri";
		const url = "https://en.wikipedia.org/wiki/Siliguri";
		const req = createMockRequest(query, url);

		const response = await handleGenerate(req);
		expect(response).toBeInstanceOf(Response);
		const data = await response.json();
		expect(data).toHaveProperty("webContent");
		expect(data).toHaveProperty("analysis");
		expect(typeof data.webContent).toBe("string");
		expect(typeof data.analysis).toBe("string");
		// You can add more specific checks here if you want
	});

	it("should return 400 for missing query", async () => {
		const url = "https://en.wikipedia.org/wiki/Siliguri";
		const req = createMockRequest("", url);
		const response = await handleGenerate(req);
		expect(response.status).toBe(400);
	});

	it("should return 400 for missing url", async () => {
		const query = "Tell me some historical facts about siliguri";
		const req = createMockRequest(query, "");
		const response = await handleGenerate(req);
		expect(response.status).toBe(400);
	});
});
