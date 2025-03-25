"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizer = summarizer;
const langgraph_sdk_1 = require("@langchain/langgraph-sdk");
async function summarizer(state, config) {
    if (!config.configurable?.thread_id) {
        throw new Error("Missing thread_id in summarizer config.");
    }
    const client = new langgraph_sdk_1.Client({
        apiUrl: `http://localhost:${process.env.PORT}`,
    });
    const { thread_id } = await client.threads.create();
    await client.runs.create(thread_id, "summarizer", {
        input: {
            messages: state._messages,
            threadId: config.configurable.thread_id,
        },
    });
    return {};
}
