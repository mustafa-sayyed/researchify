import chalk from "chalk";
import { CITATION_SYSTEM_PROMPT } from "../prompts.js";
import type { ResearchState } from "../state.js";
import { ChatGroq } from "@langchain/groq";
import { getConfig } from "../config/index.js";

const citationAgent = new ChatGroq({
	model: "llama-3.3-70b-versatile",
	apiKey: getConfig().GROQ_API_KEY,
});

export async function citationNode(state: ResearchState) {
	console.log("[CITATION] Generating citations...");
	const result = await citationAgent.invoke([
		{
			role: "system",
			content: CITATION_SYSTEM_PROMPT,
		},
		{
			role: "human",
			content: `Query: ${state.query} \n\n
        Search Results: ${state.searchResults.join("\n\n")}
        `,
		},
	]);

	const citations = result.content;

	const finalReport = `${chalk.bold.greenBright("## Research Report")}
  \n\n${chalk.bold.magenta("### Summary")}\n
  ${state.summary}
  \n\n${chalk.bold.yellow("### Sources")}\n
  ${citations}
  `;

	console.log(`[CITATION] Generated ${citations.length} citations`);
	return { citations, finalReport };
}
