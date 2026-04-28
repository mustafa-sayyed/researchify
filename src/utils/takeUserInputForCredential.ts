import * as p from "@clack/prompts";
import chalk from "chalk";
import { saveDataInFile } from "./fileUtils.js";
import { printLine } from "./printLineSpace.js";
import { setConfig } from "../config/index.js";
import {
	validateGeminiKeyWorks,
	validateGroqKeyWorks,
	validateTavilyKeyWorks,
} from "./credentials.js";

type CredentialEntry = {
	key: "GROQ_API_KEY" | "GEMINI_API_KEY" | "TAVILY_API_KEY";
	label: string;
	message: string;
	validate: (value: string) => Promise<boolean>;
};

const credentialEntries = {
	GROQ_API_KEY: {
		key: "GROQ_API_KEY",
		label: "GROQ",
		message: "Enter your GROQ API Key:",
		validate: validateGroqKeyWorks,
	},
	GEMINI_API_KEY: {
		key: "GEMINI_API_KEY",
		label: "Gemini",
		message: "Enter your Gemini API Key:",
		validate: validateGeminiKeyWorks,
	},
	TAVILY_API_KEY: {
		key: "TAVILY_API_KEY",
		label: "Tavily",
		message: "Enter your Tavily API Key:",
		validate: validateTavilyKeyWorks,
	},
} satisfies Record<CredentialEntry["key"], CredentialEntry>;

async function promptAndValidateCredential(entry: CredentialEntry) {
	while (true) {
		const value = await p.text({ message: entry.message });

		if (p.isCancel(value)) {
			p.cancel("Credential setup cancelled.");
			process.exit(0);
		}

		const spinner = p.spinner();
		spinner.start(`Validating ${entry.label} API key...`);

		const isValid = await entry.validate(value);
		if (isValid) {
			spinner.stop(`${entry.label} API key validated.`);
			return value;
		}

		spinner.error(`${entry.label} API key is invalid.`);
		p.log.error(
			`The ${entry.label} API key did not pass validation. Please try again.`,
		);
	}
}

export const takeUserInputForCredentials = async () => {
	p.intro("Let's set up your API credentials for GROQ, Gemini, and Tavily.");

	const res = {
		GROQ_API_KEY: await promptAndValidateCredential(
			credentialEntries.GROQ_API_KEY,
		),
		GEMINI_API_KEY: await promptAndValidateCredential(
			credentialEntries.GEMINI_API_KEY,
		),
		TAVILY_API_KEY: await promptAndValidateCredential(
			credentialEntries.TAVILY_API_KEY,
		),
	};
	setConfig(res);

	printLine(2);

	p.outro("Success! Your credentials have been validated and saved securely.");

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
