"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyToGeneralInput = void 0;
const artifacts_1 = require("@opencanvas/shared/utils/artifacts");
const utils_js_1 = require("../../utils.js");
const prompts_js_1 = require("../prompts.js");
/**
 * Generate responses to questions. Does not generate artifacts.
 */
const replyToGeneralInput = async (state, config) => {
    const smallModel = await (0, utils_js_1.getModelFromConfig)(config);
    const prompt = `You are an AI assistant tasked with responding to the users question.
  
The user has generated artifacts in the past. Use the following artifacts as context when responding to the users question.

You also have the following reflections on style guidelines and general memories/facts about the user to use when generating your response.
<reflections>
{reflections}
</reflections>

{currentArtifactPrompt}`;
    const currentArtifactContent = state.artifact
        ? (0, artifacts_1.getArtifactContent)(state.artifact)
        : undefined;
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
    const formattedPrompt = prompt
        .replace("{reflections}", memoriesAsString)
        .replace("{currentArtifactPrompt}", currentArtifactContent
        ? (0, utils_js_1.formatArtifactContentWithTemplate)(prompts_js_1.CURRENT_ARTIFACT_PROMPT, currentArtifactContent)
        : prompts_js_1.NO_ARTIFACT_PROMPT);
    const contextDocumentMessages = await (0, utils_js_1.createContextDocumentMessages)(config);
    const isO1MiniModel = (0, utils_js_1.isUsingO1MiniModel)(config);
    const response = await smallModel.invoke([
        { role: isO1MiniModel ? "user" : "system", content: formattedPrompt },
        ...contextDocumentMessages,
        ...state._messages,
    ]);
    return {
        messages: [response],
        _messages: [response],
    };
};
exports.replyToGeneralInput = replyToGeneralInput;
