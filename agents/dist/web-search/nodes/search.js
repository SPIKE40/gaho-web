"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = search;
const exa_js_1 = __importDefault(require("exa-js"));
const exa_1 = require("@langchain/exa");
async function search(state) {
    const exaClient = new exa_js_1.default(process.env.EXA_API_KEY || "");
    const retriever = new exa_1.ExaRetriever({
        client: exaClient,
        searchArgs: {
            filterEmptyResults: true,
            numResults: 5,
        },
    });
    const query = state.messages[state.messages.length - 1].content;
    const results = await retriever.invoke(query);
    return {
        webSearchResults: results,
    };
}
