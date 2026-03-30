import { ChatGoogle } from "@langchain/google";
import z from "zod";
import type { ResearchState } from "../state.js";

const routingSchema = z.object({
  nextAgent: z.enum(["searcher", "summarizer", "citation", "done"]),
  reasoning: z.string(),
});

const model = new ChatGoogle({
  model: "gemini-2.5-flash",
});

const supervisor = model.withStructuredOutput(routingSchema);

export const supervisorAgent = async (state: ResearchState) => {
  const result = await supervisor.invoke([
    {
      role: "system",
      content: `You are a supervisor agent that oversees the research process. Your job is to decide which agent should act next based on the current state of the research. The possible agents are:
            
            1. Searcher: This agent is responsible for searching the web for relevant information based on the query. It updates the searchResults field in the state.

            2. Summarizer: This agent takes the search results and summarizes them into a concise summary. It updates the summary field in the state.

            3. Citation: This agent generates citations for the search results. It updates the citations field in the state.

            4. Done: This indicates that the research process is complete and no further actions are needed.

            To make your decision, you can use the following tools to access the current state of the research:

            - getResearchResults: Use this tool to get the current search results from the state.
            - getSummary: Use this tool to get the current summary from the state.
            - getCitations: Use this tool to get the current citations from the state.
            `,
    },
    {
      role: "human",
      content: `Query: ${state.query}
        Search Results: ${state.searchResults.join("\n")}
        Summary: ${state.summary}
        Citations: ${state.citations.join("\n")}
      `,
    },
  ]);

  return { nextAgent: result.nextAgent };
};
