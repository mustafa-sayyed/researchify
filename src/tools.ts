import { tool } from "langchain";
import { TavilySearch } from "@langchain/tavily";
import z from "zod";
import "dotenv/config";

const tavilySearch = new TavilySearch({
  tavilyApiKey: process.env.TAVILY_API_KEY!,
  maxResults: 3,
});

const webSearchInputSchema = z.object({
  query: z.string().describe("the query to search the web for"),
});

type TavilyInvokeInput = Parameters<(typeof tavilySearch)["invoke"]>[0];

export const webSearch = tool(
  async (input: z.infer<typeof webSearchInputSchema>) => {
    // LangChain's Tavily tool types come from zod/v3; app schema is zod/v4.
    return await tavilySearch.invoke(input as unknown as TavilyInvokeInput);
  },
  {
    name: "webSearch",
    description: "search the web for relevant information for any given query",
    schema: webSearchInputSchema,
  },
);