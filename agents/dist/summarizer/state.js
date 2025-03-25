"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummarizerGraphAnnotation = void 0;
const langgraph_1 = require("@langchain/langgraph");
exports.SummarizerGraphAnnotation = langgraph_1.Annotation.Root({
    /**
     * The chat history to reflect on.
     */
    ...langgraph_1.MessagesAnnotation.spec,
    /**
     * The original thread ID to use to update the message state.
     */
    threadId: (langgraph_1.Annotation),
});
