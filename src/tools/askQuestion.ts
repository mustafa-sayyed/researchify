import inquirer from "inquirer";
import { tool } from "langchain";
import z from "zod";

const questionNameSchema = z
	.string()
	.describe(
		"A unique name for this question, used for referencing the answer in later questions.",
	);

const questionTextSchema = z
	.string()
	.describe("The question you want to ask the user.");

const baseQuestionSchema = z.object({
	name: questionNameSchema,
	question: questionTextSchema,
});

const inputQuestionSchema = baseQuestionSchema.extend({
	type: z.literal("input"),
});

const selectQuestionSchema = baseQuestionSchema.extend({
	type: z.literal("select"),
	choices: z.array(z.string()).describe("The choices for the select question."),
});

const confirmQuestionSchema = baseQuestionSchema.extend({
	type: z.literal("confirm"),
});

const askQuestionSchema = z.array(
	z.union([inputQuestionSchema, selectQuestionSchema, confirmQuestionSchema]),
);

export type AskQuestionInput = z.infer<typeof askQuestionSchema>;

type PromptQuestion =
	| {
			type: "input";
			name: string;
			message: string;
	  }
	| {
			type: "confirm";
			name: string;
			message: string;
	  }
	| {
			type: "select";
			name: string;
			message: string;
			choices: string[];
	  };

export const askQuestion = tool(
	async (input: AskQuestionInput) => {
		const prompts: PromptQuestion[] = input.map((question): PromptQuestion => {
			switch (question.type) {
				case "input":
					return {
						type: "input",
						name: question.name,
						message: question.question,
					};
				case "confirm":
					return {
						type: "confirm",
						name: question.name,
						message: question.question,
					};
				case "select":
					return {
						type: "select",
						name: question.name,
						message: question.question,
						choices: question.choices,
					};
			}
		});

		const res = await inquirer.prompt(prompts);

		return res;
	},
	{
		name: "askQuestion",
		description:
			"Ask a question to the user. Supported question types are input, select, and confirm. Input expects free text, select provides multiple choices, and confirm expects a yes/no answer.",
		schema: askQuestionSchema,
	},
);
