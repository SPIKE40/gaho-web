"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewriteArtifactTheme = void 0;
const uuid_1 = require("uuid");
const thinking_1 = require("@opencanvas/shared/utils/thinking");
const artifacts_1 = require("@opencanvas/shared/utils/artifacts");
const utils_js_1 = require("../../utils.js");
const prompts_js_1 = require("../prompts.js");
const messages_1 = require("@langchain/core/messages");
const rewriteArtifactTheme = async (state, config) => {
    const { modelName } = (0, utils_js_1.getModelConfig)(config);
    const smallModel = await (0, utils_js_1.getModelFromConfig)(config);
    const store = (0, utils_js_1.ensureStoreInConfig)(config);
    const assistantId = config.configurable?.assistant_id;
    if (!assistantId) {
        throw new Error("`assistant_id` not found in configurable");
    }
    const memoryNamespace = ["memories", assistantId];
    const memoryKey = "reflection";
    const memories = await store.get(memoryNamespace, memoryKey);
    const memoriesAsString = memories?.value
        ? (0, utils_js_1.formatReflections)(memories.value)
        : "No reflections found.";
    const currentArtifactContent = state.artifact
        ? (0, artifacts_1.getArtifactContent)(state.artifact)
        : undefined;
    if (!currentArtifactContent) {
        throw new Error("No artifact found");
    }
    if (!(0, artifacts_1.isArtifactMarkdownContent)(currentArtifactContent)) {
        throw new Error("Current artifact content is not markdown");
    }
    let formattedPrompt = "";
    if (state.language) {
        formattedPrompt = prompts_js_1.CHANGE_ARTIFACT_LANGUAGE_PROMPT.replace("{newLanguage}", state.language).replace("{artifactContent}", currentArtifactContent.fullMarkdown);
    }
    else if (state.readingLevel && state.readingLevel !== "pirate") {
        let newReadingLevel = "";
        switch (state.readingLevel) {
            case "child":
                newReadingLevel = "elementary school student";
                break;
            case "teenager":
                newReadingLevel = "high school student";
                break;
            case "college":
                newReadingLevel = "college student";
                break;
            case "phd":
                newReadingLevel = "PhD student";
                break;
        }
        formattedPrompt = prompts_js_1.CHANGE_ARTIFACT_READING_LEVEL_PROMPT.replace("{newReadingLevel}", newReadingLevel).replace("{artifactContent}", currentArtifactContent.fullMarkdown);
    }
    else if (state.readingLevel && state.readingLevel === "pirate") {
        formattedPrompt = prompts_js_1.CHANGE_ARTIFACT_TO_PIRATE_PROMPT.replace("{artifactContent}", currentArtifactContent.fullMarkdown);
    }
    else if (state.artifactLength) {
        let newLength = "";
        switch (state.artifactLength) {
            case "shortest":
                newLength = "much shorter than it currently is";
                break;
            case "short":
                newLength = "slightly shorter than it currently is";
                break;
            case "long":
                newLength = "slightly longer than it currently is";
                break;
            case "longest":
                newLength = "much longer than it currently is";
                break;
        }
        formattedPrompt = prompts_js_1.CHANGE_ARTIFACT_LENGTH_PROMPT.replace("{newLength}", newLength).replace("{artifactContent}", currentArtifactContent.fullMarkdown);
    }
    else if (state.regenerateWithEmojis) {
        formattedPrompt = prompts_js_1.ADD_EMOJIS_TO_ARTIFACT_PROMPT.replace("{artifactContent}", currentArtifactContent.fullMarkdown);
    }
    else {
        throw new Error("No theme selected");
    }
    formattedPrompt = formattedPrompt.replace("{reflections}", memoriesAsString);
    const newArtifactValues = await smallModel.invoke([
        { role: "user", content: formattedPrompt },
    ]);
    let thinkingMessage;
    let artifactContentText = newArtifactValues.content;
    if ((0, thinking_1.isThinkingModel)(modelName)) {
        const { thinking, response } = (0, thinking_1.extractThinkingAndResponseTokens)(artifactContentText);
        thinkingMessage = new messages_1.AIMessage({
            id: `thinking-${(0, uuid_1.v4)()}`,
            content: thinking,
        });
        artifactContentText = response;
    }
    const newArtifact = {
        ...state.artifact,
        currentIndex: state.artifact.contents.length + 1,
        contents: [
            ...state.artifact.contents,
            {
                ...currentArtifactContent,
                index: state.artifact.contents.length + 1,
                fullMarkdown: artifactContentText,
            },
        ],
    };
    return {
        artifact: newArtifact,
        messages: [...(thinkingMessage ? [thinkingMessage] : [])],
        _messages: [...(thinkingMessage ? [thinkingMessage] : [])],
    };
};
exports.rewriteArtifactTheme = rewriteArtifactTheme;
