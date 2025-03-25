import { LangGraphRunnableConfig } from "@langchain/langgraph";
import { OpenCanvasGraphAnnotation, OpenCanvasGraphReturnType } from "../../state.js";
/**
 * Routes to the proper node in the graph based on the user's query.
 */
export declare function generatePath(state: typeof OpenCanvasGraphAnnotation.State, config: LangGraphRunnableConfig): Promise<OpenCanvasGraphReturnType>;
