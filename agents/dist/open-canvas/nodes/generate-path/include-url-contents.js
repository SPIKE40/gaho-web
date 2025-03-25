"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.includeURLContents = void 0;
const firecrawl_1 = require("@langchain/community/document_loaders/web/firecrawl");
const messages_1 = require("@langchain/core/messages");
const universal_1 = require("langchain/chat_models/universal");
const traceable_1 = require("langsmith/traceable");
const zod_1 = __importDefault(require("zod"));
const PROMPT = `You're an advanced AI assistant.
You have been tasked with analyzing the user's message and determining if the user wants the contents of the URL included in their message included in their prompt.
You should ONLY answer 'true' if it is explicitly clear the user included the URL in their message so that its contents would be included in the prompt, otherwise, answer 'false'

Here is the user's message:
<message>
{message}
</message>

Now, given their message, determine whether or not they want the contents of that webpage to be included in the prompt.`;
const schema = zod_1.default
    .object({
    shouldIncludeUrlContents: zod_1.default
        .boolean()
        .describe("Whether or not to include the contents of the URL in the prompt."),
})
    .describe("Whether or not the user's message indicates the contents of the URL should be included in the prompt.");
async function fetchUrlContentsFunc(url) {
    const loader = new firecrawl_1.FireCrawlLoader({
        url,
        mode: "scrape",
        params: {
            formats: ["markdown"],
        },
    });
    const docs = await loader.load();
    return {
        url,
        pageContent: docs[0]?.pageContent || "",
    };
}
const fetchUrlContents = (0, traceable_1.traceable)(fetchUrlContentsFunc, {
    name: "fetch_url_contents",
});
/**
 * Runs if a URL is found in the input message.
 * It calls an LLM to determine whether or not the user explicitly
 * requested the contents of the URL be included in the prompt.
 * If the LLM determines the user does want this, it will scrape
 * the contents using FireCrawl. Else, it continues as normal.
 */
async function includeURLContentsFunc(message, urls) {
    try {
        const prompt = message.content;
        const model = (await (0, universal_1.initChatModel)("gemini-2.0-flash", {
            modelProvider: "google-genai",
            temperature: 0,
        })).bindTools([
            {
                name: "determine_include_url_contents",
                description: schema.description,
                schema,
            },
        ], {
            tool_choice: "determine_include_url_contents",
        });
        const formattedPrompt = PROMPT.replace("{message}", prompt);
        const result = await model.invoke([["user", formattedPrompt]]);
        const args = result.tool_calls?.[0].args;
        const shouldIncludeUrlContents = args?.shouldIncludeUrlContents;
        if (!shouldIncludeUrlContents) {
            return undefined;
        }
        const urlContents = await Promise.all(urls.map(fetchUrlContents));
        let transformedPrompt = prompt;
        for (const { url, pageContent } of urlContents) {
            transformedPrompt = transformedPrompt.replace(url, `<page-contents url="${url}">
  ${pageContent}
  </page-contents>`);
        }
        return new messages_1.HumanMessage({
            ...message,
            content: transformedPrompt,
        });
    }
    catch (e) {
        console.error("Failed to handle included URLs", e);
        return undefined;
    }
}
exports.includeURLContents = (0, traceable_1.traceable)(includeURLContentsFunc, {
    name: "include_url_contents",
});
