"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryGenerator = queryGenerator;
const date_fns_1 = require("date-fns");
const anthropic_1 = require("@langchain/anthropic");
const utils_js_1 = require("../../utils.js");
const QUERY_GENERATOR_PROMPT = `You're a helpful AI assistant tasked with writing a query to search the web.
You're provided with a list of messages between a user and an AI assistant.
The most recent message from the user is the one you should update to be a more search engine friendly query.

Try to keep the new query as similar to the message as possible, while still being search engine friendly.

Here is the conversation between the user and the assistant, in order of oldest to newest:

<conversation>
{conversation}
</conversation>

<additional_context>
{additional_context}
</additional_context>

Respond ONLY with the search query, and nothing else.`;
async function queryGenerator(state) {
    const model = new anthropic_1.ChatAnthropic({
        model: "claude-3-5-sonnet-latest",
        temperature: 0,
    });
    const additionalContext = `The current date is ${(0, date_fns_1.format)(new Date(), "PPpp")}`;
    const formattedMessages = (0, utils_js_1.formatMessages)(state.messages);
    const formattedPrompt = QUERY_GENERATOR_PROMPT.replace("{conversation}", formattedMessages).replace("{additional_context}", additionalContext);
    const response = await model.invoke([["user", formattedPrompt]]);
    return {
        query: response.content,
    };
}
