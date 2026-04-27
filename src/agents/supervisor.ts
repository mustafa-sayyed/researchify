import z from "zod";
import type { ResearchState } from "../state.js";
import { ChatGroq } from "@langchain/groq";
import { SUPERVISOR_SYSTEM_PROMPT } from "../prompts.js";

const routingSchema = z.object({
  nextAgent: z.enum(["searcher", "summarizer", "citation", "done"]),
  reasoning: z.string(),
});

const model = new ChatGroq({
  model: "openai/gpt-oss-20b",
});

const supervisorAgent = model.withStructuredOutput(routingSchema);

export const supervisorNode = async (state: ResearchState) => {
  console.log("[SUPERVISOR] Making decision...");
  let result;
  try {
    result = await supervisorAgent.invoke([
      {
        role: "system",
        content: SUPERVISOR_SYSTEM_PROMPT,
      },
      {
        role: "human",
        content: `Query: ${state.query}
        Has Search Results: ${state.searchResults.length > 0}
        Has Summary: ${state.summary.length > 0}
        Has Citations: ${state.citations.length > 0}
      `,
      },
    ]);
  } catch (error) {
    console.error("[SUPERVISOR] Error during decision making:", error);
    return { nextAgent: "done" };
  }

  console.log(`[SUPERVISOR] Decision: ${result.nextAgent} - ${result.reasoning}`);
  return { nextAgent: result.nextAgent };
};
