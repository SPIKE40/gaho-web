"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graph = void 0;
const langgraph_1 = require("@langchain/langgraph");
const state_js_1 = require("./state.js");
const search_js_1 = require("./nodes/search.js");
const query_generator_js_1 = require("./nodes/query-generator.js");
const classify_message_js_1 = require("./nodes/classify-message.js");
function searchOrEndConditional(state) {
    if (state.shouldSearch) {
        return "queryGenerator";
    }
    return langgraph_1.END;
}
const builder = new langgraph_1.StateGraph(state_js_1.WebSearchGraphAnnotation)
    .addNode("classifyMessage", classify_message_js_1.classifyMessage)
    .addNode("queryGenerator", query_generator_js_1.queryGenerator)
    .addNode("search", search_js_1.search)
    .addEdge(langgraph_1.START, "classifyMessage")
    .addConditionalEdges("classifyMessage", searchOrEndConditional, [
    "queryGenerator",
    langgraph_1.END,
])
    .addEdge("queryGenerator", "search")
    .addEdge("search", langgraph_1.END);
exports.graph = builder.compile();
exports.graph.name = "Web Search Graph";
