import { checkIsCredentialsAlreadyExist } from "./credentials.js";
import { validateCredentials } from "../config/index.js";
import { takeUserInputForCredentials } from "./takeUserInputForCredential.js";
import chalk from "chalk";

export async function ensureCredentialsPresent() {
	// 1. If provided via env
	const isEnvExist = validateCredentials(process.env);
	if (isEnvExist) {
		console.log(
			chalk.green("Using credentials found in environment variables."),
		);
		return;
	}

	// 2. Check in the file, already exist or not
	const isAlreadyExist = await checkIsCredentialsAlreadyExist();
	if (isAlreadyExist) {
		console.log(
			chalk.green("Using credentials from .researchify/researchify.json."),
		);
		return;
	}

	// 3. Prompt user to enter credentials
	await takeUserInputForCredentials();
}
