"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateArtifact = void 0;
const artifacts_1 = require("@opencanvas/shared/utils/artifacts");
const utils_js_1 = require("../../utils.js");
const prompts_js_1 = require("../prompts.js");
/**
 * Update an existing artifact based on the user's query.
 */
const updateArtifact = async (state, config) => {
    const { modelProvider, modelName } = (0, utils_js_1.getModelConfig)(config);
    let smallModel;
    if (modelProvider.includes("openai") || modelName.includes("3-5-sonnet")) {
        // Custom model is intelligent enough for updating artifacts
        smallModel = await (0, utils_js_1.getModelFromConfig)(config, {
            temperature: 0,
        });
    }
    else {
        // Custom model is not intelligent enough for updating artifacts
        smallModel = await (0, utils_js_1.getModelFromConfig)({
            ...config,
            configurable: {
                customModelName: "gpt-4o",
            },
        }, {
            temperature: 0,
        });
    }
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
    if (!(0, artifacts_1.isArtifactCodeContent)(currentArtifactContent)) {
        throw new Error("Current artifact content is not markdown");
    }
    if (!state.highlightedCode) {
        throw new Error("Can not partially regenerate an artifact without a highlight");
    }
    // Highlighted text is present, so we need to update the highlighted text.
    const start = Math.max(0, state.highlightedCode.startCharIndex - 500);
    const end = Math.min(currentArtifactContent.code.length, state.highlightedCode.endCharIndex + 500);
    const beforeHighlight = currentArtifactContent.code.slice(start, state.highlightedCode.startCharIndex);
    const highlightedText = currentArtifactContent.code.slice(state.highlightedCode.startCharIndex, state.highlightedCode.endCharIndex);
    const afterHighlight = currentArtifactContent.code.slice(state.highlightedCode.endCharIndex, end);
    const formattedPrompt = prompts_js_1.UPDATE_HIGHLIGHTED_ARTIFACT_PROMPT.replace("{highlightedText}", highlightedText)
        .replace("{beforeHighlight}", beforeHighlight)
        .replace("{afterHighlight}", afterHighlight)
        .replace("{reflections}", memoriesAsString);
    const recentHumanMessage = state._messages.findLast((message) => message.getType() === "human");
    if (!recentHumanMessage) {
        throw new Error("No recent human message found");
    }
    const contextDocumentMessages = await (0, utils_js_1.createContextDocumentMessages)(config);
    const isO1MiniModel = (0, utils_js_1.isUsingO1MiniModel)(config);
    const updatedArtifact = await smallModel.invoke([
        { role: isO1MiniModel ? "user" : "system", content: formattedPrompt },
        ...contextDocumentMessages,
        recentHumanMessage,
    ]);
    const entireTextBefore = currentArtifactContent.code.slice(0, state.highlightedCode.startCharIndex);
    const entireTextAfter = currentArtifactContent.code.slice(state.highlightedCode.endCharIndex);
    const entireUpdatedContent = `${entireTextBefore}${updatedArtifact.content}${entireTextAfter}`;
    const newArtifactContent = {
        ...currentArtifactContent,
        index: state.artifact.contents.length + 1,
        code: entireUpdatedContent,
    };
    const newArtifact = {
        ...state.artifact,
        currentIndex: state.artifact.contents.length + 1,
        contents: [...state.artifact.contents, newArtifactContent],
    };
    return {
        artifact: newArtifact,
    };
};
exports.updateArtifact = updateArtifact;
