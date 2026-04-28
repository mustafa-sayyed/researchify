import chalk from "chalk";
import { printLine } from "./printLineSpace.js";

export const logError = (message: string, error?: unknown) => {
	console.log(
		chalk.red(`${message}`, error instanceof Error ? error.message : error),
	);
	printLine()
};

export const logInfo = (message: string) => {
	console.log(chalk.blue(message));
};

export const logSuccess = (message: string, shouldPrintLine = false) => {
	console.log(chalk.green(message));
	if (shouldPrintLine) {
		printLine();
	}
};
