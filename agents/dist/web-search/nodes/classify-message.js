"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyMessage = classifyMessage;
const anthropic_1 = require("@langchain/anthropic");
const zod_1 = __importDefault(require("zod"));
const CLASSIFIER_PROMPT = `You're a helpful AI assistant tasked with classifying the user's latest message.
The user has enabled web search for their conversation, however not all messages should be searched.

Analyze their latest message in isolation and determine if it warrants a web search to include additional context.

<message>
{message}
</message>`;
const classificationSchema = zod_1.default
    .object({
    shouldSearch: zod_1.default
        .boolean()
        .describe("Whether or not to search the web based on the user's latest message."),
})
    .describe("The classification of the user's latest message.");
async function classifyMessage(state) {
    const model = new anthropic_1.ChatAnthropic({
        model: "claude-3-5-sonnet-latest",
        temperature: 0,
    }).withStructuredOutput(classificationSchema, {
        name: "classify_message",
    });
    const latestMessageContent = state.messages[state.messages.length - 1]
        .content;
    const formattedPrompt = CLASSIFIER_PROMPT.replace("{message}", latestMessageContent);
    const response = await model.invoke([["user", formattedPrompt]]);
    return {
        shouldSearch: response.shouldSearch,
    };
}
