"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSearchGraphAnnotation = void 0;
const langgraph_1 = require("@langchain/langgraph");
exports.WebSearchGraphAnnotation = langgraph_1.Annotation.Root({
    /**
     * The chat history to search the web for.
     * Will use the latest user message as the query.
     */
    ...langgraph_1.MessagesAnnotation.spec,
    /**
     * The search query.
     */
    query: (langgraph_1.Annotation),
    /**
     * The search results
     */
    webSearchResults: (langgraph_1.Annotation),
    /**
     * Whether or not to search the web based on the user's latest message.
     */
    shouldSearch: (langgraph_1.Annotation),
});
