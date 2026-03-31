import type { ResearchState } from "../state.js";
import { ChatGroq } from "@langchain/groq";

const citationAgent = new ChatGroq("llama-3.1-8b-instant");

export async function citationNode(state: ResearchState) {
  console.log("[CITATION] Generating citations...");
  const result = await citationAgent.invoke([
    {
      role: "system",
      content: `You are a citation agent that generates citations for sources based on a given query.
      Your task is to provide accurate and properly formatted citations of the Search Results.
      Make sure to provide clear and well-structured citations.`,
    },
    {
      role: "human",
      content: `Query: ${state.query} \n\n
        Search Results: ${state.searchResults.join("\n\n")}
        `,
    },
  ]);

  const citations = (result.content as string).split("\n").filter((line) => line.trim().length > 0);

  const finalReport = `## Research Report\n\n### Summary\n${state.summary}\n\n### Sources\n${citations.join("\n")}`;

  console.log(`[CITATION] Generated ${citations.length} citations`);
  return { citations, finalReport };
}
