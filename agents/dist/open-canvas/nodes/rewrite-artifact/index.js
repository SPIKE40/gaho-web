"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewriteArtifact = void 0;
const uuid_1 = require("uuid");
const update_meta_js_1 = require("./update-meta.js");
const utils_js_1 = require("./utils.js");
const utils_js_2 = require("../../../utils.js");
const artifacts_1 = require("@opencanvas/shared/utils/artifacts");
const messages_1 = require("@langchain/core/messages");
const thinking_1 = require("@opencanvas/shared/utils/thinking");
const rewriteArtifact = async (state, config) => {
    const { modelName } = (0, utils_js_2.getModelConfig)(config);
    const smallModelWithConfig = (await (0, utils_js_2.getModelFromConfig)(config)).withConfig({
        runName: "rewrite_artifact_model_call",
    });
    const memoriesAsString = await (0, utils_js_2.getFormattedReflections)(config);
    const { currentArtifactContent, recentHumanMessage } = (0, utils_js_1.validateState)(state);
    const artifactMetaToolCall = await (0, update_meta_js_1.optionallyUpdateArtifactMeta)(state, config);
    const artifactType = artifactMetaToolCall.type;
    const isNewType = artifactType !== currentArtifactContent.type;
    const artifactContent = (0, artifacts_1.isArtifactMarkdownContent)(currentArtifactContent)
        ? currentArtifactContent.fullMarkdown
        : currentArtifactContent.code;
    const formattedPrompt = (0, utils_js_1.buildPrompt)({
        artifactContent,
        memoriesAsString,
        isNewType,
        artifactMetaToolCall,
    });
    const userSystemPrompt = (0, utils_js_2.optionallyGetSystemPromptFromConfig)(config);
    const fullSystemPrompt = userSystemPrompt
        ? `${userSystemPrompt}\n${formattedPrompt}`
        : formattedPrompt;
    const contextDocumentMessages = await (0, utils_js_2.createContextDocumentMessages)(config);
    const isO1MiniModel = (0, utils_js_2.isUsingO1MiniModel)(config);
    const newArtifactResponse = await smallModelWithConfig.invoke([
        { role: isO1MiniModel ? "user" : "system", content: fullSystemPrompt },
        ...contextDocumentMessages,
        recentHumanMessage,
    ]);
    let thinkingMessage;
    let artifactContentText = newArtifactResponse.content;
    if ((0, thinking_1.isThinkingModel)(modelName)) {
        const { thinking, response } = (0, thinking_1.extractThinkingAndResponseTokens)(artifactContentText);
        thinkingMessage = new messages_1.AIMessage({
            id: `thinking-${(0, uuid_1.v4)()}`,
            content: thinking,
        });
        artifactContentText = response;
    }
    const newArtifactContent = (0, utils_js_1.createNewArtifactContent)({
        artifactType,
        state,
        currentArtifactContent,
        artifactMetaToolCall,
        newContent: artifactContentText,
    });
    return {
        artifact: {
            ...state.artifact,
            currentIndex: state.artifact.contents.length + 1,
            contents: [...state.artifact.contents, newArtifactContent],
        },
        messages: [...(thinkingMessage ? [thinkingMessage] : [])],
        _messages: [...(thinkingMessage ? [thinkingMessage] : [])],
    };
};
exports.rewriteArtifact = rewriteArtifact;
