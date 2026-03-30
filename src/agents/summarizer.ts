import { ChatGoogle } from "@langchain/google";
import type { ResearchState } from "../state.js";

const summarizerAgent = new ChatGoogle("gemini-2.5-flash");

export async function summarizerNode(state: ResearchState) {
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

  return { summary: result.content[0] };
}
