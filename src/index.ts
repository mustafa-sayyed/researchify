import "dotenv/config";
import { buildGraph } from "./graph.js";

async function main() {
  console.log("Starting research workflow...");
  const graph = buildGraph();

  const result = await graph.invoke({
    query: "What is AI?",
  });

  console.log("\n=== FINAL REPORT ===");
  console.log(result.finalReport);
  console.log("\nResearch workflow complete.");
}

main().catch(console.error);
