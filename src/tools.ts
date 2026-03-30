import { tool } from "@langchain/core/tools";
import { TavilySearch } from "@langchain/tavily";
import z from "zod";
import "dotenv/config";
import { AgentState } from "./state.js";

const tavilySearch = new TavilySearch({
  tavilyApiKey: process.env.TAVILY_API_KEY!,
  maxResults: 5,
});

export const webSearch = tool(
  async ({ query }: { query: string }) => {
    return await tavilySearch.invoke({ query });
  },
  {
    name: "webSearch",
    description: "search the web for relevant information for any given query",
    schema: z.object({
      query: z.string().describe("the query to search the web for"),
    }),
  },
);