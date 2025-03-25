import { LangGraphRunnableConfig } from "@langchain/langgraph";
import { OpenCanvasGraphAnnotation, OpenCanvasGraphReturnType } from "../../state.js";
/**
 * Generate a new artifact based on the user's query.
 */
export declare const generateArtifact: (state: typeof OpenCanvasGraphAnnotation.State, config: LangGraphRunnableConfig) => Promise<OpenCanvasGraphReturnType>;
