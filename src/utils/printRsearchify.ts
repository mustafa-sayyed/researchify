import chalk from "chalk";
import { printLine } from "./printLineSpace.js";
import figlet from "figlet";

export const printResearchify = () => {
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
};
