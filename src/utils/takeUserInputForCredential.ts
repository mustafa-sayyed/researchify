import * as p from "@clack/prompts";
import { saveDataInFile } from "./fileUtils.js";
import { printLine } from "./printLineSpace.js";
import chalk from "chalk";

export const takeUserInputForCredentials = async () => {
	p.intro("Let's set up your API credentials for GROQ, Gemini, and Tavily.");
	const res = await p.group({
		GROQ_API_KEY: () => p.text({ message: "Enter your GROQ API Key:" }),
		GEMINI_API_KEY: () => p.text({ message: "Enter your Gemini API Key:" }),
		TAVILY_API_KEY: () => p.text({ message: "Enter your Tavily API Key:" }),
	});
	p.outro("Success!, Your credentials have been saved securely.");

	printLine(2);

	p.box(
		"Your credentials have been saved securely in the .researchify directory. You can update them anytime by running this setup again.",
		"",
		{
			rounded: true,
			formatBorder: (text) => chalk.green(text),
			contentAlign: "center",
			titlePadding: 2,
			contentPadding: 6,
		},
	);

	printLine(2);

	await saveDataInFile(".researchify/researchify.json", res);
};
