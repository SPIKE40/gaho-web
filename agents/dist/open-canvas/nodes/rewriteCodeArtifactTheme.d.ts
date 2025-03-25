import { LangGraphRunnableConfig } from "@langchain/langgraph";
import { OpenCanvasGraphAnnotation, OpenCanvasGraphReturnType } from "../state.js";
export declare const rewriteCodeArtifactTheme: (state: typeof OpenCanvasGraphAnnotation.State, config: LangGraphRunnableConfig) => Promise<OpenCanvasGraphReturnType>;
