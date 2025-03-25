"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectionGraphAnnotation = void 0;
const langgraph_1 = require("@langchain/langgraph");
exports.ReflectionGraphAnnotation = langgraph_1.Annotation.Root({
    /**
     * The chat history to reflect on.
     */
    ...langgraph_1.MessagesAnnotation.spec,
    /**
     * The artifact to reflect on.
     */
    artifact: (langgraph_1.Annotation),
});
