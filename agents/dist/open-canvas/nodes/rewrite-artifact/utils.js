"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewArtifactContent = exports.buildPrompt = exports.validateState = void 0;
const artifacts_1 = require("@opencanvas/shared/utils/artifacts");
const prompts_js_1 = require("../../prompts.js");
const validateState = (state) => {
    const currentArtifactContent = state.artifact
        ? (0, artifacts_1.getArtifactContent)(state.artifact)
        : undefined;
    if (!currentArtifactContent) {
        throw new Error("No artifact found");
    }
    const recentHumanMessage = state._messages.findLast((message) => message.getType() === "human");
    if (!recentHumanMessage) {
        throw new Error("No recent human message found");
    }
    return { currentArtifactContent, recentHumanMessage };
};
exports.validateState = validateState;
const buildMetaPrompt = (artifactMetaToolCall) => {
    const titleSection = artifactMetaToolCall?.title && artifactMetaToolCall?.type !== "code"
        ? `And its title is (do NOT include this in your response):\n${artifactMetaToolCall.title}`
        : "";
    return prompts_js_1.OPTIONALLY_UPDATE_META_PROMPT.replace("{artifactType}", artifactMetaToolCall?.type).replace("{artifactTitle}", titleSection);
};
const buildPrompt = ({ artifactContent, memoriesAsString, isNewType, artifactMetaToolCall, }) => {
    const metaPrompt = isNewType ? buildMetaPrompt(artifactMetaToolCall) : "";
    return prompts_js_1.UPDATE_ENTIRE_ARTIFACT_PROMPT.replace("{artifactContent}", artifactContent)
        .replace("{reflections}", memoriesAsString)
        .replace("{updateMetaPrompt}", metaPrompt);
};
exports.buildPrompt = buildPrompt;
const getLanguage = (artifactMetaToolCall, currentArtifactContent // Replace 'any' with proper type
) => artifactMetaToolCall?.language ||
    ((0, artifacts_1.isArtifactCodeContent)(currentArtifactContent)
        ? currentArtifactContent.language
        : "other");
const createNewArtifactContent = ({ artifactType, state, currentArtifactContent, artifactMetaToolCall, newContent, }) => {
    const baseContent = {
        index: state.artifact.contents.length + 1,
        title: artifactMetaToolCall?.title || currentArtifactContent.title,
    };
    if (artifactType === "code") {
        return {
            ...baseContent,
            type: "code",
            language: getLanguage(artifactMetaToolCall, currentArtifactContent),
            code: newContent,
        };
    }
    return {
        ...baseContent,
        type: "text",
        fullMarkdown: newContent,
    };
};
exports.createNewArtifactContent = createNewArtifactContent;
