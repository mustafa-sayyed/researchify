import { StateGraph, END, MemorySaver } from "@langchain/langgraph";
import { AgentState } from "./state.js";
import { searcherNode } from "./agents/searcher.js";
import { citationNode } from "./agents/citation.js";
import { summarizerNode } from "./agents/summarizer.js";
import { supervisorNode } from "./agents/supervisor.js";

const checkpointer = new MemorySaver();

export const buildGraph = () => {
	const agentGraph = new StateGraph(AgentState)
		.addNode("searcher", searcherNode)
		.addNode("summarizer", summarizerNode)
		.addNode("citation", citationNode)
		.addNode("supervisor", supervisorNode)
		.addEdge("__start__", "supervisor")
		.addConditionalEdges("supervisor", (state) => {
			if (state.nextAgent === "done") {
				return END;
			}

			return state.nextAgent;
		})
		.addEdge("searcher", "supervisor")
		.addEdge("citation", "supervisor")
		.addEdge("summarizer", "supervisor");

	return agentGraph.compile({
		checkpointer,
	});
}
