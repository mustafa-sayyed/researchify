#!/usr/bin/env node

import dotenv from "dotenv";
dotenv.config({
	path: "./.env",
	quiet: true,
});
import { loadCredentials } from "./utils/ensureCredentials.js";
import { logError } from "./utils/logger.js";
import { printResearchify } from "./utils/printRsearchify.js";
import { program } from "commander";
import { startRsearch } from "./researchWorkflow.js";

program
	.name("researchify")
	.description(
		"Your AI Research Assistant. Ask it to research any topic and get a comprehensive report with all the relevant information, links, and resources.",
	)
	.version("1.0.0")
	.showHelpAfterError();

program
	.command("setup")
	.description("Setup your credentials for Researchify")
	.action(async () => {
		printResearchify();
		await loadCredentials(true);
	});

program
	.command("start")
	.description("Start the research workflow")
	.action(async () => {
		printResearchify();
		await loadCredentials(false);
		await startRsearch();
	});

// Show help when no command is provided
if (process.argv.length === 2) {
	program.help();
}

program.parse();

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
