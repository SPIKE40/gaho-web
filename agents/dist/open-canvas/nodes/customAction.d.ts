import { LangGraphRunnableConfig } from "@langchain/langgraph";
import { OpenCanvasGraphAnnotation, OpenCanvasGraphReturnType } from "../state.js";
export declare const customAction: (state: typeof OpenCanvasGraphAnnotation.State, config: LangGraphRunnableConfig) => Promise<OpenCanvasGraphReturnType>;
