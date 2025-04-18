//
import { GoogleCustomSearch } from "@langchain/community/tools/google_custom_search";


export const handleSearch = async (req: Request): Promise<any> => {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("query");

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Missing 'query' parameter" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Initialize Google Custom Search tool
    const searchTool = new GoogleCustomSearch({
      apiKey: process.env.GOOGLE_API_KEY,
      googleCSEId: process.env.GOOGLE_CSE_ID,
    });

    // Execute the search
    const searchResults = await searchTool.call(query);

    return new Response(JSON.stringify({ results: searchResults }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ error: error.message || "Internal server error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }
};
