#!/usr/bin/env node

import dotenv from "dotenv";
dotenv.config({
	path: "./.env",
	quiet: true,
});
import figlet from "figlet";
import chalk from "chalk";
import { printLine } from "./utils/printLineSpace.js";
import inquirer from "inquirer";
import { loadCredentials } from "./utils/ensureCredentials.js";
import { logError } from "./utils/logger.js";

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

async function main() {
	printLine(2);

	console.log(
		chalk.magenta(
			figlet.textSync("Rsearchify", {
				horizontalLayout: "default",
				font: "Coder Mini",
			}),
		),
	);
	console.log(
		chalk.magenta(
			"Your AI Research Assistant. Ask it to research any topic and get a comprehensive report with all the relevant information, links, and resources.",
		),
	);

	printLine(2);

	await loadCredentials();

	await startRsearch();
}

main().catch(console.error);

process.on("SIGINT", () => {
	logError("\nProcess interrupted. Exiting...");
	process.exit(0);
});

process.on("SIGTERM", () => {
	logError("\nProcess terminated. Exiting...");
	process.exit(0);
});

process.on("unhandledRejection", (err) => {
	logError("Error: ", err);
	logError("An unexpected error occurred. Exiting...");
	process.exit(0);
});
process.on("uncaughtException", (err) => {
	logError("Error: ", err);
	logError("An unexpected error occurred. Exiting...");
	process.exit(0);
});
