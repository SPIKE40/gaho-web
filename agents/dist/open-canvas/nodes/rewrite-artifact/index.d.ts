import { OpenCanvasGraphAnnotation, OpenCanvasGraphReturnType } from "../../state.js";
import { LangGraphRunnableConfig } from "@langchain/langgraph";
export declare const rewriteArtifact: (state: typeof OpenCanvasGraphAnnotation.State, config: LangGraphRunnableConfig) => Promise<OpenCanvasGraphReturnType>;
