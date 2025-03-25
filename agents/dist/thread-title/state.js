"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleGenerationAnnotation = void 0;
const langgraph_1 = require("@langchain/langgraph");
exports.TitleGenerationAnnotation = langgraph_1.Annotation.Root({
    /**
     * The chat history to generate a title for
     */
    ...langgraph_1.MessagesAnnotation.spec,
    /**
     * The artifact that was generated/updated (if any)
     */
    artifact: (langgraph_1.Annotation),
});
