import { z } from "zod";

const researchifyConfigSchema = z.object({
	GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is required"),
	GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
	TAVILY_API_KEY: z.string().min(1, "TAVILY_API_KEY is required"),
});

export type ResearchifyConfig = z.infer<typeof researchifyConfigSchema>;

export const validateCredentials = (config: NodeJS.ProcessEnv | unknown) => {
	const result = researchifyConfigSchema.safeParse(config);
	return result.success ? result.data : null;
};

let config: ResearchifyConfig;

export const setConfig = (newConfig: ResearchifyConfig) => {
	config = newConfig;
};

export const getConfig = (): ResearchifyConfig => {
	return config;
};
