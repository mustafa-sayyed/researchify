import { ChatGoogle } from "@langchain/google";
import type { ResearchState } from "../state.js";
import { webSearch } from "../tools.js";
import { AIMessage, createAgent, HumanMessage, SystemMessage } from "langchain";
import { ChatGroq } from "@langchain/groq";

const model = new ChatGoogle({
  model: "gemini-2.5-flash",
});

const searchAgent = createAgent({
  model: new ChatGroq("llama-3.1-8b-instant"),
  tools: [webSearch],
  systemPrompt: `You are a search agent that searches the web for relevant information 
      based on a given query.

      Your task is to provide useful and relevant search results that can help answer the query.
      When you receive a query, you should perform a web search using tools and return the most relevant information you can find.
      Make sure to provide accurate and concise information in your search results.`,
});

// const modelWithTools = model.bindTools([webSearch]);

export async function searcherNode(state: ResearchState) {
  console.log("[SEARCHER] Executing search...");
  let result;
  try {
    result = await searchAgent.invoke({
      messages: [{ role: "human", content: `Query: ${state.query}` }],
    });
  } catch (error) {
    console.error("Error During Search", error);
    return { searchResults: "Failed to Search" };
  }

  console.log(result.messages);

  const lastMessage = result.messages.at(-1)?.content[0];
  return { searchResults: lastMessage };
}
