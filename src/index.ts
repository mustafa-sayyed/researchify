import "dotenv/config";
import { buildGraph } from "./graph.js";
import figlet from "figlet";
import chalk from "chalk";
import { printLine } from "./utils/printLineSpace.js";
import inquirer from "inquirer";

async function main() {
	printLine(2);

	console.log(
		chalk.magenta.bold(
			figlet.textSync("Multi Agent Research Assitant", {
				horizontalLayout: "controlled smushing",
			}),
		),
	);

	printLine(2);

	const res = await inquirer.prompt([
		{
			type: "input",
			name: "reasearchTopic",
			message: "Topic to Research:",
		},
	]);

	printLine();
	console.log(chalk.magentaBright(`You asked for: ${res.reasearchTopic}`));
	printLine();


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

main().catch(console.error);
