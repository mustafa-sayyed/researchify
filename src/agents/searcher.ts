import { ChatGoogle } from "@langchain/google";
import type { ResearchState } from "../state.js";
import { webSearch } from "../tools.js";
import { createAgent } from "langchain";

const searcherAgent = createAgent({
  model: new ChatGoogle("gemini-2.5-flash"),
  tools: [webSearch],
});

export async function searcherNode(state: ResearchState) {
  const result = await searcherAgent.invoke({
    messages: [
      {
        role: "system",
        content: `You are a search agent that searches the web for relevant information based on a given query.
      Your task is to provide useful and relevant search results that can help answer the query.
      When you receive a query, you should perform a web search using tools and return the most relevant information you can find.
      Make sure to provide accurate and concise information in your search results.`,
      },
      {
        role: "human",
        content: `Query: ${state.query}`,
      },
    ],
  });

  if(result.messages.at(-1)?.type === "ai") {
    return { searchResults: [result.messages.at(-1)?.text]}
  }
}
