import { ChatGoogle } from "@langchain/google";
import type { ResearchState } from "../state.js";
import { ChatGroq } from "@langchain/groq";

const summarizerAgent = new ChatGroq("llama-3.1-8b-instant");

export async function summarizerNode(state: ResearchState) {
  console.log("[SUMMARIZER] Generating summary...");
  const result = await summarizerAgent.invoke([
    {
      role: "system",
      content: `You are a summarizer agent that summarizes information based on a given query.
      Your task is to provide a concise and accurate summary of the information.
      When you receive a query, you should summarize the relevant information you can find.
      Make sure to provide clear and well-structured summaries.`,
    },
    {
      role: "human",
      content: `Query: ${state.query} \n\n
        Search Results: ${state.searchResults.join("\n\n")}
        `,
    },
  ]);

  const summaryText = String(result.content[0] || "");
  console.log(`[SUMMARIZER] Summary complete: ${summaryText.substring(0, 80)}...`);
  return { summary: summaryText };
}
