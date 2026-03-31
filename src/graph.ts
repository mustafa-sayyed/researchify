import { StateGraph, END } from "@langchain/langgraph";
import { AgentState } from "./state.js";
import { searcherNode } from "./agents/searcher.js";
import { citationNode } from "./agents/citation.js";
import { summarizerNode } from "./agents/summarizer.js";
import { supervisorNode } from "./agents/supervisor.js";

export function buildGraph() {
  const graph = new StateGraph(AgentState)
    .addNode("supervisor", supervisorNode)
    .addNode("searcher", searcherNode)
    .addNode("summarizer", summarizerNode)
    .addNode("citation", citationNode)

    // Always start at supervisor
    .addEdge("__start__", "supervisor")

    // Conditional routing from supervisor
    .addConditionalEdges(
      "supervisor",
      (state) => {
        console.log(`[ROUTING] Next agent: ${state.nextAgent}`);
        return state.nextAgent;
      },
      {
        searcher: "searcher",
        summarizer: "summarizer",
        citation: "citation",
        done: END,
      },
    )

    // All sub-agents report back to supervisor
    .addEdge("searcher", "supervisor")
    .addEdge("summarizer", "supervisor")
    .addEdge("citation", "supervisor");

  return graph.compile();
}
