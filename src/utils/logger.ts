import chalk from "chalk";

export const logError = (message: string, error?: unknown) => {
	console.log(
		chalk.red(`${message}:`, error instanceof Error ? error.message : error),
	);
};

export const logInfo = (message: string) => {
	console.log(chalk.blue(message));
};

export const logSuccess = (message: string) => {
	console.log(chalk.green(message));
};
