import "dotenv/config";
import { buildGraph } from "./graph.js";

async function main() {
  const graph = buildGraph();

  const result = await graph.invoke({
    query: "What are the latest developments in quantum computing in 2025?",
  });

  console.log("\n=== FINAL REPORT ===\n");
  console.log(result.finalReport);
}

main().catch(console.error);
