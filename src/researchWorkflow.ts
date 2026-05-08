import chalk from "chalk";
import { printLine } from "./utils/printLineSpace.js";
import { logError } from "./utils/logger.js";
import inquirer from "inquirer";

async function startRsearch() {
	const res = await inquirer
		.prompt([
			{
				type: "input",
				name: "reasearchTopic",
				message: "Topic to Research:",
			},
		])
		.catch((err) => {
			logError("\nError taking user input", err);
			logError("Exiting...");
			process.exit(0);
		});
	printLine();
	console.log(chalk.magentaBright(`You asked for: ${res.reasearchTopic}`));
	printLine();

	// Dynamic Import after taking all required inputs from user
	const { buildGraph } = await import("./graph.js");

	const graph = buildGraph();

	console.log("Starting research workflow...");
	const result = await graph.invoke(
		{
			query: res.reasearchTopic,
		},
		{
			configurable: {
				thread_id: "1",
			},
		},
	);

	console.log(chalk.bold.blueBright("\n\n=== FINAL REPORT ===\n\n"));
	console.log(result.finalReport);
	console.log(chalk.green("\nResearch workflow complete."));
}

export { startRsearch };
