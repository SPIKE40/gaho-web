"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customAction = void 0;
const artifacts_1 = require("@opencanvas/shared/utils/artifacts");
const utils_js_1 = require("../../utils.js");
const quick_actions_1 = require("@opencanvas/shared/prompts/quick-actions");
const formatMessages = (messages) => messages
    .map((msg) => `<${msg.getType()}>\n${msg.content}\n</${msg.getType()}>`)
    .join("\n");
const customAction = async (state, config) => {
    if (!state.customQuickActionId) {
        throw new Error("No custom quick action ID found.");
    }
    const smallModel = await (0, utils_js_1.getModelFromConfig)(config, {
        temperature: 0.5,
    });
    const store = (0, utils_js_1.ensureStoreInConfig)(config);
    const assistantId = config.configurable?.assistant_id;
    const userId = config.configurable?.supabase_user_id;
    if (!assistantId) {
        throw new Error("`assistant_id` not found in configurable");
    }
    if (!userId) {
        throw new Error("`user.id` not found in configurable");
    }
    const customActionsNamespace = ["custom_actions", userId];
    const actionsKey = "actions";
    const memoryNamespace = ["memories", assistantId];
    const memoryKey = "reflection";
    const [customActionsItem, memories] = await Promise.all([
        store.get(customActionsNamespace, actionsKey),
        store.get(memoryNamespace, memoryKey),
    ]);
    if (!customActionsItem?.value) {
        throw new Error("No custom actions found.");
    }
    const customQuickAction = customActionsItem.value[state.customQuickActionId];
    if (!customQuickAction) {
        throw new Error(`No custom quick action found from ID ${state.customQuickActionId}`);
    }
    const currentArtifactContent = state.artifact
        ? (0, artifacts_1.getArtifactContent)(state.artifact)
        : undefined;
    let formattedPrompt = `<custom-instructions>\n${customQuickAction.prompt}\n</custom-instructions>`;
    if (customQuickAction.includeReflections && memories?.value) {
        const memoriesAsString = (0, utils_js_1.formatReflections)(memories.value);
        const reflectionsPrompt = quick_actions_1.REFLECTIONS_QUICK_ACTION_PROMPT.replace("{reflections}", memoriesAsString);
        formattedPrompt += `\n\n${reflectionsPrompt}`;
    }
    if (customQuickAction.includePrefix) {
        formattedPrompt = `${quick_actions_1.CUSTOM_QUICK_ACTION_ARTIFACT_PROMPT_PREFIX}\n\n${formattedPrompt}`;
    }
    if (customQuickAction.includeRecentHistory) {
        const formattedConversationHistory = quick_actions_1.CUSTOM_QUICK_ACTION_CONVERSATION_CONTEXT.replace("{conversation}", formatMessages(state._messages.slice(-5)));
        formattedPrompt += `\n\n${formattedConversationHistory}`;
    }
    const artifactContent = (0, artifacts_1.isArtifactMarkdownContent)(currentArtifactContent)
        ? currentArtifactContent.fullMarkdown
        : currentArtifactContent?.code;
    formattedPrompt += `\n\n${quick_actions_1.CUSTOM_QUICK_ACTION_ARTIFACT_CONTENT_PROMPT.replace("{artifactContent}", artifactContent || "No artifacts generated yet.")}`;
    const newArtifactValues = await smallModel.invoke([
        { role: "user", content: formattedPrompt },
    ]);
    if (!currentArtifactContent) {
        console.error("No current artifact content found.");
        return {};
    }
    const newArtifactContent = {
        ...currentArtifactContent,
        index: state.artifact.contents.length + 1,
        ...((0, artifacts_1.isArtifactMarkdownContent)(currentArtifactContent)
            ? { fullMarkdown: newArtifactValues.content }
            : { code: newArtifactValues.content }),
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
exports.customAction = customAction;
