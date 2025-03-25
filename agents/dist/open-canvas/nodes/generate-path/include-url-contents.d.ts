import { HumanMessage } from "@langchain/core/messages";
/**
 * Runs if a URL is found in the input message.
 * It calls an LLM to determine whether or not the user explicitly
 * requested the contents of the URL be included in the prompt.
 * If the LLM determines the user does want this, it will scrape
 * the contents using FireCrawl. Else, it continues as normal.
 */
declare function includeURLContentsFunc(message: HumanMessage, urls: string[]): Promise<HumanMessage | undefined>;
export declare const includeURLContents: import("langsmith/traceable").TraceableFunction<typeof includeURLContentsFunc>;
export {};
