import { LangGraphRunnableConfig } from "@langchain/langgraph";
import { OpenCanvasGraphAnnotation, OpenCanvasGraphReturnType } from "../state.js";
/**
 * Update an existing artifact based on the user's query.
 */
export declare const updateHighlightedText: (state: typeof OpenCanvasGraphAnnotation.State, config: LangGraphRunnableConfig) => Promise<OpenCanvasGraphReturnType>;
