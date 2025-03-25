import { LangGraphRunnableConfig } from "@langchain/langgraph";
import { BaseMessage, HumanMessage, RemoveMessage } from "@langchain/core/messages";
/**
 * Checks for context documents in a human message, and if found, converts
 * them to a human message with the proper content format.
 */
export declare function convertContextDocumentToHumanMessage(messages: BaseMessage[], config: LangGraphRunnableConfig): Promise<HumanMessage | undefined>;
export declare function fixMisFormattedContextDocMessage(message: HumanMessage, config: LangGraphRunnableConfig): Promise<(HumanMessage | RemoveMessage)[] | undefined>;
