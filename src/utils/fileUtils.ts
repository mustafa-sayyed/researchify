import fs from "node:fs/promises";
import { logError } from "./logger.js";

export const saveDataInFile = async (
	filePath: string,
	data: Record<string, any>,
) => {
	await ensureDirectoryExist();
	const isFileExists = await checkFileExist(filePath);
	if (!isFileExists) {
		await writeDataInFile(filePath, data);
	} else {
		await appendDataInFile(filePath, data);
	}
};

// check that .researchify directory exist, if not then create it
export const ensureDirectoryExist = async () => {
	try {
		await fs.access(".researchify");
	} catch (error) {
		await fs.mkdir(".researchify");
	}
};

// Check a file exist or not
export const checkFileExist = async (filepath: string): Promise<boolean> => {
	try {
		await fs.access(filepath);
		return true;
	} catch (error) {
		return false;
	}
};

export const appendDataInFile = async (
	filePath: string,
	data: Record<string, any>,
) => {
	try {
		const existingData = await fs.readFile(filePath, {
			encoding: "utf-8",
			flag: "",
		});
		const jsonData = await parseJSONData(existingData);
		if (jsonData) {
			data = { ...jsonData, ...data };
		}
		await fs.writeFile(filePath, JSON.stringify(data, null, 2));
	} catch (error) {
		if ((error as any).code === "ENOENT") {
			await writeDataInFile(filePath, data);
		}
		logError("Error appending data to file: ", error);
	}
};

export const writeDataInFile = async (
	filePath: string,
	data: Record<string, any>,
) => {
	try {
		await fs.writeFile(filePath, JSON.stringify(data, null, 2));
	} catch (error) {
		logError("Error writing data to file: ", error);
	}
};

// parse JSON data from file safely
export const parseJSONData = async (
	data: string,
): Promise<Record<string, any> | null> => {
	try {
		return JSON.parse(data);
	} catch (error) {
		logError("Error parsing JSON data: ", error);
		return null;
	}
};
