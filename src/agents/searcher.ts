import "dotenv/config";
import type { ResearchState } from "../state.js";
import { webSearch } from "../tools.js";

export async function searcherNode(state: ResearchState) {
  console.log("[SEARCHER] Executing search...");
  let res;
  try {
    res = await webSearch.invoke({ query: state.query });
  } catch (error) {
    console.error("Error During Search", error);
    return { searchResults: "Failed to Search" };
  }

  console.log(res.results);

  return { searchResults: JSON.stringify(res.results) };
}
