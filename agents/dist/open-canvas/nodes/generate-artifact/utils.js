"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArtifactContent = exports.formatNewArtifactPrompt = void 0;
const prompts_js_1 = require("../../prompts.js");
const formatNewArtifactPrompt = (memoriesAsString, modelName) => {
    return prompts_js_1.NEW_ARTIFACT_PROMPT.replace("{reflections}", memoriesAsString).replace("{disableChainOfThought}", modelName.includes("claude")
        ? "\n\nIMPORTANT: Do NOT preform chain of thought beforehand. Instead, go STRAIGHT to generating the tool response. This is VERY important."
        : "");
};
exports.formatNewArtifactPrompt = formatNewArtifactPrompt;
const createArtifactContent = (toolCall) => {
    const artifactType = toolCall?.type;
    if (artifactType === "code") {
        return {
            index: 1,
            type: "code",
            title: toolCall?.title,
            code: toolCall?.artifact,
            language: toolCall?.language,
        };
    }
    return {
        index: 1,
        type: "text",
        title: toolCall?.title,
        fullMarkdown: toolCall?.artifact,
    };
};
exports.createArtifactContent = createArtifactContent;
