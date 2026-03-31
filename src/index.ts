import "dotenv/config";
import { buildGraph } from "./graph.js";
import chalk from "chalk"

async function main() {
  console.log("Starting research workflow...");
  const graph = buildGraph();

  const result = await graph.invoke({
    query: "What is MCP ?, explain in detail what are developments in it, and what is the future of it ?",
  });

  console.log(chalk.bold.blueBright("\n\n=== FINAL REPORT ===\n\n"));
  console.log(result.finalReport);
  console.log(chalk.green("\nResearch workflow complete."));
}

main().catch(console.error);
