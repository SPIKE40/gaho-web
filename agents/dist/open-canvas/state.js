"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenCanvasGraphAnnotation = void 0;
const langgraph_1 = require("@langchain/langgraph");
const constants_1 = require("@opencanvas/shared/constants");
function isSummaryMessage(msg) {
    if (typeof msg !== "object" || Array.isArray(msg) || !msg)
        return false;
    if (!("additional_kwargs" in msg) && !("kwargs" in msg))
        return false;
    if ("additional_kwargs" in msg &&
        msg.additional_kwargs?.[constants_1.OC_SUMMARIZED_MESSAGE_KEY] === true) {
        return true;
    }
    if ("kwargs" in msg &&
        msg.kwargs?.additional_kwargs?.[constants_1.OC_SUMMARIZED_MESSAGE_KEY] === true) {
        return true;
    }
    return false;
}
exports.OpenCanvasGraphAnnotation = langgraph_1.Annotation.Root({
    /**
     * The full list of messages in the conversation.
     */
    ...langgraph_1.MessagesAnnotation.spec,
    /**
     * The list of messages passed to the model. Can include summarized messages,
     * and others which are NOT shown to the user.
     */
    _messages: (0, langgraph_1.Annotation)({
        reducer: (state, update) => {
            const latestMsg = Array.isArray(update)
                ? update[update.length - 1]
                : update;
            if (isSummaryMessage(latestMsg)) {
                // The state list has been updated by a summary message. Clear the existing state messages.
                return (0, langgraph_1.messagesStateReducer)([], update);
            }
            return (0, langgraph_1.messagesStateReducer)(state, update);
        },
        default: () => [],
    }),
    /**
     * The part of the artifact the user highlighted. Use the `selectedArtifactId`
     * to determine which artifact the highlight belongs to.
     */
    highlightedCode: (langgraph_1.Annotation),
    /**
     * The highlighted text. This includes the markdown blocks which the highlighted
     * text belongs to, along with the entire plain text content of highlight.
     */
    highlightedText: (langgraph_1.Annotation),
    /**
     * The artifacts that have been generated in the conversation.
     */
    artifact: (langgraph_1.Annotation),
    /**
     * The next node to route to. Only used for the first routing node/conditional edge.
     */
    next: (langgraph_1.Annotation),
    /**
     * The language to translate the artifact to.
     */
    language: (langgraph_1.Annotation),
    /**
     * The length of the artifact to regenerate to.
     */
    artifactLength: (langgraph_1.Annotation),
    /**
     * Whether or not to regenerate with emojis.
     */
    regenerateWithEmojis: (langgraph_1.Annotation),
    /**
     * The reading level to adjust the artifact to.
     */
    readingLevel: (langgraph_1.Annotation),
    /**
     * Whether or not to add comments to the code artifact.
     */
    addComments: (langgraph_1.Annotation),
    /**
     * Whether or not to add logs to the code artifact.
     */
    addLogs: (langgraph_1.Annotation),
    /**
     * The programming language to port the code artifact to.
     */
    portLanguage: (langgraph_1.Annotation),
    /**
     * Whether or not to fix bugs in the code artifact.
     */
    fixBugs: (langgraph_1.Annotation),
    /**
     * The ID of the custom quick action to use.
     */
    customQuickActionId: (langgraph_1.Annotation),
    /**
     * Whether or not to search the web for additional context.
     */
    webSearchEnabled: (langgraph_1.Annotation),
    /**
     * The search results to include in context.
     */
    webSearchResults: (langgraph_1.Annotation),
});
