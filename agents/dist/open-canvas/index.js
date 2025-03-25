"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graph = void 0;
const langgraph_1 = require("@langchain/langgraph");
const constants_1 = require("@opencanvas/shared/constants");
const customAction_js_1 = require("./nodes/customAction.js");
const index_js_1 = require("./nodes/generate-artifact/index.js");
const generateFollowup_js_1 = require("./nodes/generateFollowup.js");
const index_js_2 = require("./nodes/generate-path/index.js");
const reflect_js_1 = require("./nodes/reflect.js");
const index_js_3 = require("./nodes/rewrite-artifact/index.js");
const rewriteArtifactTheme_js_1 = require("./nodes/rewriteArtifactTheme.js");
const updateArtifact_js_1 = require("./nodes/updateArtifact.js");
const replyToGeneralInput_js_1 = require("./nodes/replyToGeneralInput.js");
const rewriteCodeArtifactTheme_js_1 = require("./nodes/rewriteCodeArtifactTheme.js");
const generateTitle_js_1 = require("./nodes/generateTitle.js");
const updateHighlightedText_js_1 = require("./nodes/updateHighlightedText.js");
const state_js_1 = require("./state.js");
const summarizer_js_1 = require("./nodes/summarizer.js");
const index_js_4 = require("../web-search/index.js");
const utils_js_1 = require("../utils.js");
const routeNode = (state) => {
    if (!state.next) {
        throw new Error("'next' state field not set.");
    }
    return new langgraph_1.Send(state.next, {
        ...state,
    });
};
const cleanState = (_) => {
    return {
        ...constants_1.DEFAULT_INPUTS,
    };
};
// ~ 4 chars per token, max tokens of 75000. 75000 * 4 = 300000
const CHARACTER_MAX = 300000;
function simpleTokenCalculator(state) {
    const totalChars = state._messages.reduce((acc, msg) => {
        if (typeof msg.content !== "string") {
            const allContent = msg.content.flatMap((c) => "text" in c ? c.text : []);
            const totalChars = allContent.reduce((acc, c) => acc + c.length, 0);
            return acc + totalChars;
        }
        return acc + msg.content.length;
    }, 0);
    if (totalChars > CHARACTER_MAX) {
        return "summarizer";
    }
    return langgraph_1.END;
}
/**
 * Conditionally route to the "generateTitle" node if there are only
 * two messages in the conversation. This node generates a concise title
 * for the conversation which is displayed in the thread history.
 */
const conditionallyGenerateTitle = (state) => {
    if (state.messages.length > 2) {
        // Do not generate if there are more than two messages (meaning it's not the first human-AI conversation)
        return simpleTokenCalculator(state);
    }
    return "generateTitle";
};
/**
 * Updates state & routes the graph based on whether or not the web search
 * graph returned any results.
 */
function routePostWebSearch(state) {
    // If there is more than one artifact, then route to the "rewriteArtifact" node. Otherwise, generate the artifact.
    const includesArtifacts = state.artifact?.contents?.length > 1;
    if (!state.webSearchResults?.length) {
        return new langgraph_1.Send(includesArtifacts ? "rewriteArtifact" : "generateArtifact", {
            ...state,
            webSearchEnabled: false,
        });
    }
    // This message is used as a way to reference the web search results in future chats.
    const webSearchResultsMessage = (0, utils_js_1.createAIMessageFromWebResults)(state.webSearchResults);
    return new langgraph_1.Command({
        goto: includesArtifacts ? "rewriteArtifact" : "generateArtifact",
        update: {
            webSearchEnabled: false,
            messages: [webSearchResultsMessage],
            _messages: [webSearchResultsMessage],
        },
    });
}
const builder = new langgraph_1.StateGraph(state_js_1.OpenCanvasGraphAnnotation)
    // Start node & edge
    .addNode("generatePath", index_js_2.generatePath)
    .addEdge(langgraph_1.START, "generatePath")
    // Nodes
    .addNode("replyToGeneralInput", replyToGeneralInput_js_1.replyToGeneralInput)
    .addNode("rewriteArtifact", index_js_3.rewriteArtifact)
    .addNode("rewriteArtifactTheme", rewriteArtifactTheme_js_1.rewriteArtifactTheme)
    .addNode("rewriteCodeArtifactTheme", rewriteCodeArtifactTheme_js_1.rewriteCodeArtifactTheme)
    .addNode("updateArtifact", updateArtifact_js_1.updateArtifact)
    .addNode("updateHighlightedText", updateHighlightedText_js_1.updateHighlightedText)
    .addNode("generateArtifact", index_js_1.generateArtifact)
    .addNode("customAction", customAction_js_1.customAction)
    .addNode("generateFollowup", generateFollowup_js_1.generateFollowup)
    .addNode("cleanState", cleanState)
    .addNode("reflect", reflect_js_1.reflectNode)
    .addNode("generateTitle", generateTitle_js_1.generateTitleNode)
    .addNode("summarizer", summarizer_js_1.summarizer)
    .addNode("webSearch", index_js_4.graph)
    .addNode("routePostWebSearch", routePostWebSearch)
    // Initial router
    .addConditionalEdges("generatePath", routeNode, [
    "updateArtifact",
    "rewriteArtifactTheme",
    "rewriteCodeArtifactTheme",
    "replyToGeneralInput",
    "generateArtifact",
    "rewriteArtifact",
    "customAction",
    "updateHighlightedText",
    "webSearch",
])
    // Edges
    .addEdge("generateArtifact", "generateFollowup")
    .addEdge("updateArtifact", "generateFollowup")
    .addEdge("updateHighlightedText", "generateFollowup")
    .addEdge("rewriteArtifact", "generateFollowup")
    .addEdge("rewriteArtifactTheme", "generateFollowup")
    .addEdge("rewriteCodeArtifactTheme", "generateFollowup")
    .addEdge("customAction", "generateFollowup")
    .addEdge("webSearch", "routePostWebSearch")
    // End edges
    .addEdge("replyToGeneralInput", "cleanState")
    // Only reflect if an artifact was generated/updated.
    .addEdge("generateFollowup", "reflect")
    .addEdge("reflect", "cleanState")
    .addConditionalEdges("cleanState", conditionallyGenerateTitle, [
    langgraph_1.END,
    "generateTitle",
    "summarizer",
])
    .addEdge("generateTitle", langgraph_1.END)
    .addEdge("summarizer", langgraph_1.END);
exports.graph = builder.compile().withConfig({ runName: "open_canvas" });
