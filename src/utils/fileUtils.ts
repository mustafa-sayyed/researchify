import chalk from "chalk";
import fs from "node:fs/promises";

export const saveDataInFile = async (
	filePath: string,
	data: Record<string, any>,
) => {
	await ensureDirectoryExist();
	await checkFileExist(filePath);
	await appendDataInFile(filePath, data);
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
		const existingData = await fs.readFile(filePath, "utf-8");
		const jsonData = await parseJSONData(existingData);
		if (jsonData) {
			data = { ...jsonData, ...data };
		}
		await fs.writeFile(filePath, JSON.stringify(data, null, 2));
	} catch (error) {
		console.error(chalk.red("Error appending data to file: "), error);
	}
};

// parse JSON data from file safely
export const parseJSONData = async (
	data: string,
): Promise<Record<string, any> | null> => {
	try {
		return JSON.parse(data);
	} catch (error) {
		console.error(chalk.red("Error parsing JSON data: "), error);
		return null;
	}
};
