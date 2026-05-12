import { set } from "zod";
import { setConfig, validateCredentials } from "../config/index.js";
import { loadCredentialsFromFile } from "./credentials.js";
import { logError, logSuccess } from "./logger.js";
import { takeUserInputForCredentials } from "./takeUserInputForCredential.js";
import { printLine } from "./printLineSpace.js";

export async function loadCredentials(takeInput = true): Promise<void> {
	// 1. If provided via env
	const envCredentials = validateCredentials(process.env);
	if (envCredentials) {
		setConfig(envCredentials);
		logSuccess("Using credentials found in environment variables.", true);
		return;
	}

	// 2. Check in the file, already exist or not
	const credentials = await loadCredentialsFromFile();
	if (credentials) {
		setConfig(credentials);
		logSuccess("Using credentials from .researchify/researchify.json.", true);
		return;
	}

	// 3. Prompt user to enter credentials
	if (takeInput) {
		await takeUserInputForCredentials();
	} else {
		logError("No credentials found. Please run 'researchify setup' to enter your API keys.");
		return process.exit(0);
	}
}
