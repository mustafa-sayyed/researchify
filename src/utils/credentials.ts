import fs from "node:fs/promises";
import { checkFileExist, parseJSONData } from "./fileUtils.js";
import {
	validateCredentials,
	type ResearchifyConfig,
} from "../config/index.js";
import { TavilySearch } from "@langchain/tavily";
import { ChatGroq } from "@langchain/groq";
import { ChatGoogle } from "@langchain/google";
import type { TavilyInvokeInput } from "../tools/webSearch.js";
import { log, spinner } from "@clack/prompts";
import { printLine } from "./printLineSpace.js";
import chalk from "chalk";
import { CREDENTIALS_FILE_PATH } from "./constant.js";

export async function readCredentialsFromFile(): Promise<ResearchifyConfig | null> {
	const exists = await checkFileExist(CREDENTIALS_FILE_PATH);
	if (!exists) return null;
	try {
		const raw = await fs.readFile(CREDENTIALS_FILE_PATH, { encoding: "utf-8" });
		const parsed = await parseJSONData(raw);
		if (!parsed) return null;
		return validateCredentials(parsed);
	} catch {
		return null;
	}
}

export async function validateGroqKeyWorks(key: string): Promise<boolean> {
	const prev = process.env.GROQ_API_KEY;
	process.env.GROQ_API_KEY = key;
	try {
		const model = new ChatGroq({ model: "openai/gpt-oss-20b" });
		const response = await model.invoke([
			{ role: "system", content: "You are a helpful assistant." },
			{ role: "user", content: "Say 'ok' only." },
		]);

		return (
			response &&
			typeof response === "object" &&
			"content" in response &&
			typeof response.content === "string" &&
			response.content.length > 0
		);
	} catch {
		return false;
	} finally {
		process.env.GROQ_API_KEY = prev;
	}
}

export const validateTavilyKeyWorks = async (key: string): Promise<boolean> => {
	try {
		const tavilySearch = new TavilySearch({
			tavilyApiKey: key,
			maxResults: 1,
		});

		const result = await tavilySearch.invoke({
			query: "What is the capital of India?",
		} as unknown as TavilyInvokeInput);

		if (result && result.results && result.results.length > 0) {
			return true;
		}
		return false;
	} catch (err) {
		return false;
	}
};

export async function validateGeminiKeyWorks(key: string): Promise<boolean> {
	const prev = process.env.GOOGLE_API_KEY;
	process.env.GOOGLE_API_KEY = key;
	try {
		const client = new ChatGoogle({
			model: "gemini-2.5-flash",
		});

		const response = await client.invoke([
			{ role: "system", content: "You are a helpful assistant." },
			{ role: "user", content: "Say 'ok' only." },
		]);

		if (
			response &&
			typeof response === "object" &&
			"content" in response &&
			typeof response.content === "string" &&
			response.content.length > 0
		) {
			return true;
		}
		return false;
	} catch {
		return false;
	} finally {
		process.env.GOOGLE_API_KEY = prev;
	}
}

export async function loadCredentialsFromFile(): Promise<ResearchifyConfig | null> {
	const creds = await readCredentialsFromFile();
	if (!creds) return null;

	const s = spinner({
		onCancel: () => {
			log.error("Credential Setup was Cancelled.");
			process.exit(0);
		},
		cancelMessage: chalk.red("Credential Setup was Cancelled."),
	});

	log.info("Found API keys in .researchify/researchify.json.");
	s.start("Validating API Keys...");

	// Validate that each key actually works
	const groqWorks = await validateGroqKeyWorks(creds.GROQ_API_KEY);
	const tavilyWorks = await validateTavilyKeyWorks(creds.TAVILY_API_KEY);
	const geminiWorks = await validateGeminiKeyWorks(creds.GEMINI_API_KEY);

	if (groqWorks && tavilyWorks && geminiWorks) {
		s.stop("All API keys are valid.");
		printLine();
		return creds;
	}

	s.error("One or more API keys in .researchify/researchify.json are invalid.");
	printLine();

	return null;
}
