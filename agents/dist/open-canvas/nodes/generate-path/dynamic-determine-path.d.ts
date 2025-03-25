import { OpenCanvasGraphAnnotation } from "../../state.js";
import { LangGraphRunnableConfig } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
interface DynamicDeterminePathParams {
    state: typeof OpenCanvasGraphAnnotation.State;
    newMessages: BaseMessage[];
    config: LangGraphRunnableConfig;
}
/**
 * Dynamically determines the path to take using an LLM.
 */
declare function dynamicDeterminePathFunc({ state, newMessages, config, }: DynamicDeterminePathParams): Promise<{
    route: "rewriteArtifact" | "generateArtifact" | "replyToGeneralInput";
} | undefined>;
export declare const dynamicDeterminePath: import("langsmith/traceable").TraceableFunction<typeof dynamicDeterminePathFunc>;
export {};
