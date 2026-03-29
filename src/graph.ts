import { ReducedValue, StateSchema } from "@langchain/langgraph";
import z from "zod";

export const AgentState = new StateSchema({
  query: z.string().default(""),
  searchResults: new ReducedValue(
    z.array(z.string()).default(() => []),
    {
      reducer: (prev, curr) => [...prev, ...curr],
    },
  ),
  summary: z.string().default(""),
  citations: new ReducedValue(
    z.array(z.string()).default(() => []),
    {
      reducer: (prev, curr) => [...prev, ...curr],
    },
  ),
  finalReport: z.string().default(""),
  nextAgent: z.string().default("searcher"),
});

export type ResearchState = typeof AgentState.State;
