import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { db } from "@/lib/database";
import { sql } from "drizzle-orm";

export const handleContextSearch = async (req: Request): Promise<Response> => {
	try {
		const url = new URL(req.url);
		const query = url.searchParams.get("query");
		const limit = parseInt(url.searchParams.get("limit") || "5");

		if (!query) {
			return new Response(
				JSON.stringify({ error: "Missing 'query' parameter" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		// Generate embedding for the search query
		const embeddings = new GoogleGenerativeAIEmbeddings({
			modelName: "embedding-001",
		});

		const queryEmbedding = await embeddings.embedQuery(query);

		// Search in both content and analysis vectors using Drizzle ORM and pgvector
		const [contentResults, analysisResults] = await Promise.all([
			db.execute(sql`
				SELECT 
					id,
					url,
					query,
					webContent,
					analysis,
					contentVector,
					analysisVector,
					createdAt,
					updatedAt,
					(contentVector <-> ${JSON.stringify(queryEmbedding)}) AS similarity
				FROM "SearchResult"
				ORDER BY similarity ASC
				LIMIT ${limit}
			`),
			db.execute(sql`
				SELECT 
					id,
					url,
					query,
					webContent,
					analysis,
					contentVector,
					analysisVector,
					createdAt,
					updatedAt,
					(analysisVector <-> ${JSON.stringify(queryEmbedding)}) AS similarity
				FROM "SearchResult"
				ORDER BY similarity ASC
				LIMIT ${limit}
			`),
		]);

		// Combine and process results
		const model = new ChatGoogleGenerativeAI({
			model: "gemini-1.5-flash",
			temperature: 0.7,
		});

		const prompt = ChatPromptTemplate.fromMessages([
			[
				"system",
				"You are an AI assistant. Based on the search results provided, generate a comprehensive response to the user's query. Include relevant information from both web content and analysis.",
			],
			["human", `Query: {query}\n\nSearch Results: {results}`],
		]);

		const chain = prompt.pipe(model).pipe(new StringOutputParser());

		const summary = await chain.invoke({
			query,
			results: JSON.stringify({ contentResults, analysisResults }),
		});

		return new Response(
			JSON.stringify({
				summary,
				contentResults,
				analysisResults,
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);
	} catch (error) {
		console.error("Error in handleContextSearch:", error);
		if (error instanceof Error) {
			return new Response(
				JSON.stringify({ error: error.message || "Internal server error" }),
				{
					status: 500,
					headers: { "Content-Type": "application/json" },
				}
			);
		}
		return new Response(JSON.stringify({ error: "Unknown error occurred" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};
