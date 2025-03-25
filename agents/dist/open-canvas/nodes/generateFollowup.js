"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFollowup = void 0;
const utils_js_1 = require("../../utils.js");
const artifacts_1 = require("@opencanvas/shared/utils/artifacts");
const utils_js_2 = require("../../utils.js");
const prompts_js_1 = require("../prompts.js");
/**
 * Generate a followup message after generating or updating an artifact.
 */
const generateFollowup = async (state, config) => {
    const smallModel = await (0, utils_js_1.getModelFromConfig)(config, {
        maxTokens: 250,
        // We say tool calling is true here because that'll cause it to use a small model
        isToolCalling: true,
    });
    const store = (0, utils_js_2.ensureStoreInConfig)(config);
    const assistantId = config.configurable?.assistant_id;
    if (!assistantId) {
        throw new Error("`assistant_id` not found in configurable");
    }
    const memoryNamespace = ["memories", assistantId];
    const memoryKey = "reflection";
    const memories = await store.get(memoryNamespace, memoryKey);
    const memoriesAsString = memories?.value
        ? (0, utils_js_2.formatReflections)(memories.value, {
            onlyContent: true,
        })
        : "No reflections found.";
    const currentArtifactContent = state.artifact
        ? (0, artifacts_1.getArtifactContent)(state.artifact)
        : undefined;
    const artifactContent = currentArtifactContent
        ? (0, artifacts_1.isArtifactMarkdownContent)(currentArtifactContent)
            ? currentArtifactContent.fullMarkdown
            : currentArtifactContent.code
        : undefined;
    const formattedPrompt = prompts_js_1.FOLLOWUP_ARTIFACT_PROMPT.replace("{artifactContent}", artifactContent || "No artifacts generated yet.")
        .replace("{reflections}", memoriesAsString)
        .replace("{conversation}", state._messages
        .map((msg) => `<${msg.getType()}>\n${msg.content}\n</${msg.getType()}>`)
        .join("\n\n"));
    // TODO: Include the chat history as well.
    const response = await smallModel.invoke([
        { role: "user", content: formattedPrompt },
    ]);
    return {
        messages: [response],
        _messages: [response],
    };
};
exports.generateFollowup = generateFollowup;
