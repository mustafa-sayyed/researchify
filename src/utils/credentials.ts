import fs from "node:fs/promises";
import { checkFileExist, parseJSONData } from "./fileUtils.js";
import { validateCredentials } from "../config/index.js";
import type { ResearchifyConfig } from "../config/index.js";
import { TavilySearch } from "@langchain/tavily";
import { ChatGroq } from "@langchain/groq";

const CREDENTIALS_FILE = ".researchify/researchify.json";

export async function readCredentialsFromFile(): Promise<ResearchifyConfig | null> {
	const exists = await checkFileExist(CREDENTIALS_FILE);
	if (!exists) return null;
	try {
		const raw = await fs.readFile(CREDENTIALS_FILE, { encoding: "utf-8" });
		const parsed = await parseJSONData(raw);
		if (!parsed) return null;
		return validateCredentials(parsed);
	} catch {
		return null;
	}
}

async function validateGroqKeyWorks(key: string): Promise<boolean> {
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

async function validateTavilyKeyWorks(key: string): Promise<boolean> {
	try {
		const tool = new TavilySearch({ tavilyApiKey: key, maxResults: 1 });
		const result = await tool.invoke("What is the capital of France?");

		const parsedResult =
			typeof result === "string" ? JSON.parse(result) : result;
            
		if (parsedResult && parsedResult.length > 0) {
			return true;
		}
		return false;
	} catch {
		return false;
	}
}

async function validateGeminiKeyWorks(key: string): Promise<boolean> {
	const prev = process.env.GOOGLE_API_KEY;
	process.env.GOOGLE_API_KEY = key;
	try {
		const { ChatGoogle } = await import("@langchain/google");
		const client = new ChatGoogle({
			model: "gemini-2.0-flash",
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

export async function checkIsCredentialsAlreadyExist(): Promise<boolean> {
	const creds = await readCredentialsFromFile();
	if (!creds) return false;

	// Validate that each key actually works
	const groqWorks = await validateGroqKeyWorks(creds.GROQ_API_KEY);
	const tavilyWorks = await validateTavilyKeyWorks(creds.TAVILY_API_KEY);
	const geminiWorks = await validateGeminiKeyWorks(creds.GEMINI_API_KEY);

	return groqWorks && tavilyWorks && geminiWorks;
}
