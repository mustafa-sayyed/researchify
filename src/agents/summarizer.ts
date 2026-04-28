import type { ResearchState } from "../state.js";
import { ChatGroq } from "@langchain/groq";
import { SUMMARISER_SYSTEM_PROMPT } from "../prompts.js";
import { getConfig } from "../config/index.js";

const summarizerAgent = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: getConfig().GROQ_API_KEY,
});

export async function summarizerNode(state: ResearchState) {
  console.log("[SUMMARIZER] Generating summary...");

  let result;
  try {
    result = await summarizerAgent.invoke([
      {
        role: "system",
        content: SUMMARISER_SYSTEM_PROMPT,
      },
      {
        role: "human",
        content: `Query: ${state.query} \n\n
        Search Results: ${state.searchResults.join("\n\n")}
        `,
      },
    ]);
  } catch (error) {
    console.error("[SUMMARIZER] Error during summary generation:", error);
    return { summary: "Failed to generate summary" };
  }

  console.log("[SUMMARIZER] Summary generated:", result.content);
  const summary = result.content;
  return { summary };
}
