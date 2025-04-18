import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { WebBrowser } from "langchain/tools/webbrowser";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { db } from "@/lib/database";
import { searchResult as searchResultModel } from "@/models/searchResult";

export const handleGenerate = async (req: Request): Promise<any> => {
	try {
		const url = new URL(req.url);
		const query = url.searchParams.get("query");
		const searchUrl = url.searchParams.get("url");

		if (!query || !searchUrl) {
			return new Response(
				JSON.stringify({ error: "Missing 'query' or 'url' parameter" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		const model = new ChatGoogleGenerativeAI({
			model: "gemini-1.5-flash",
			temperature: 0.7,
		});

		const embeddings = new GoogleGenerativeAIEmbeddings({
			modelName: "embedding-001",
		});

		// Initialize web browser tool
		const browser = new WebBrowser({ model, embeddings });

		// Search the webpage
		const searchResult = await browser.invoke(`"${searchUrl}","${query}"`);

		// Process the search results with the model
		const prompt = ChatPromptTemplate.fromMessages([
			[
				"system",
				"You are an AI assistant. Analyze this web search result and provide a clear, concise response:",
			],
			["human", "{searchResult}"],
		]);

		const chain = prompt.pipe(model).pipe(new StringOutputParser());
		const result = await chain.invoke({ searchResult });

		// Generate embeddings for storage
		const contentEmbedding = await embeddings.embedQuery(searchResult);
		const analysisEmbedding = await embeddings.embedQuery(result);

		// Store in database
		await db.insert(searchResultModel).values({
			url: searchUrl,
			query,
			webContent: searchResult,
			analysis: result,
			contentVector: contentEmbedding,
			analysisVector: analysisEmbedding,
		});

		return new Response(
			JSON.stringify({
				webContent: searchResult,
				analysis: result,
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);
	} catch (error) {
		console.error("Error in handleGenerate:", error);
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
