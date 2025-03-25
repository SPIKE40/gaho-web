"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewriteCodeArtifactTheme = void 0;
const uuid_1 = require("uuid");
const thinking_1 = require("@opencanvas/shared/utils/thinking");
const artifacts_1 = require("@opencanvas/shared/utils/artifacts");
const utils_js_1 = require("../../utils.js");
const prompts_js_1 = require("../prompts.js");
const messages_1 = require("@langchain/core/messages");
const rewriteCodeArtifactTheme = async (state, config) => {
    const { modelName } = (0, utils_js_1.getModelConfig)(config);
    const smallModel = await (0, utils_js_1.getModelFromConfig)(config);
    const currentArtifactContent = state.artifact
        ? (0, artifacts_1.getArtifactContent)(state.artifact)
        : undefined;
    if (!currentArtifactContent) {
        throw new Error("No artifact found");
    }
    if (!(0, artifacts_1.isArtifactCodeContent)(currentArtifactContent)) {
        throw new Error("Current artifact content is not code");
    }
    let formattedPrompt = "";
    if (state.addComments) {
        formattedPrompt = prompts_js_1.ADD_COMMENTS_TO_CODE_ARTIFACT_PROMPT;
    }
    else if (state.portLanguage) {
        let newLanguage = "";
        switch (state.portLanguage) {
            case "typescript":
                newLanguage = "TypeScript";
                break;
            case "javascript":
                newLanguage = "JavaScript";
                break;
            case "cpp":
                newLanguage = "C++";
                break;
            case "java":
                newLanguage = "Java";
                break;
            case "php":
                newLanguage = "PHP";
                break;
            case "python":
                newLanguage = "Python";
                break;
            case "html":
                newLanguage = "HTML";
                break;
            case "sql":
                newLanguage = "SQL";
                break;
        }
        formattedPrompt = prompts_js_1.PORT_LANGUAGE_CODE_ARTIFACT_PROMPT.replace("{newLanguage}", newLanguage);
    }
    else if (state.addLogs) {
        formattedPrompt = prompts_js_1.ADD_LOGS_TO_CODE_ARTIFACT_PROMPT;
    }
    else if (state.fixBugs) {
        formattedPrompt = prompts_js_1.FIX_BUGS_CODE_ARTIFACT_PROMPT;
    }
    else {
        throw new Error("No theme selected");
    }
    // Insert the code into the artifact placeholder in the prompt
    formattedPrompt = formattedPrompt.replace("{artifactContent}", currentArtifactContent.code);
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
    const newArtifactContent = {
        index: state.artifact.contents.length + 1,
        type: "code",
        title: currentArtifactContent.title,
        // Ensure the new artifact's language is updated, if necessary
        language: state.portLanguage || currentArtifactContent.language,
        code: artifactContentText,
    };
    const newArtifact = {
        ...state.artifact,
        currentIndex: state.artifact.contents.length + 1,
        contents: [...state.artifact.contents, newArtifactContent],
    };
    return {
        artifact: newArtifact,
        messages: [...(thinkingMessage ? [thinkingMessage] : [])],
        _messages: [...(thinkingMessage ? [thinkingMessage] : [])],
    };
};
exports.rewriteCodeArtifactTheme = rewriteCodeArtifactTheme;
