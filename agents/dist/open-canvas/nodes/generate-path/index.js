"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePath = generatePath;
const urls_1 = require("@opencanvas/shared/utils/urls");
const dynamic_determine_path_js_1 = require("./dynamic-determine-path.js");
const documents_js_1 = require("./documents.js");
const utils_js_1 = require(".././../../utils.js");
const include_url_contents_js_1 = require("./include-url-contents.js");
function extractURLsFromLastMessage(messages) {
    const recentMessage = messages[messages.length - 1];
    const recentMessageContent = (0, utils_js_1.getStringFromContent)(recentMessage.content);
    const messageUrls = (0, urls_1.extractUrls)(recentMessageContent);
    return messageUrls;
}
/**
 * Routes to the proper node in the graph based on the user's query.
 */
async function generatePath(state, config) {
    const { _messages } = state;
    const newMessages = [];
    const docMessage = await (0, documents_js_1.convertContextDocumentToHumanMessage)(_messages, config);
    const existingDocMessage = newMessages.find((m) => Array.isArray(m.content) &&
        m.content.some((c) => c.type === "document" || c.type === "application/pdf"));
    if (docMessage) {
        newMessages.push(docMessage);
    }
    else if (existingDocMessage) {
        const fixedMessages = await (0, documents_js_1.fixMisFormattedContextDocMessage)(existingDocMessage, config);
        if (fixedMessages) {
            newMessages.push(...fixedMessages);
        }
    }
    if (state.highlightedCode) {
        return {
            next: "updateArtifact",
            ...(newMessages.length
                ? { messages: newMessages, _messages: newMessages }
                : {}),
        };
    }
    if (state.highlightedText) {
        return {
            next: "updateHighlightedText",
            ...(newMessages.length
                ? { messages: newMessages, _messages: newMessages }
                : {}),
        };
    }
    if (state.language ||
        state.artifactLength ||
        state.regenerateWithEmojis ||
        state.readingLevel) {
        return {
            next: "rewriteArtifactTheme",
            ...(newMessages.length
                ? { messages: newMessages, _messages: newMessages }
                : {}),
        };
    }
    if (state.addComments ||
        state.addLogs ||
        state.portLanguage ||
        state.fixBugs) {
        return {
            next: "rewriteCodeArtifactTheme",
            ...(newMessages.length
                ? { messages: newMessages, _messages: newMessages }
                : {}),
        };
    }
    if (state.customQuickActionId) {
        return {
            next: "customAction",
            ...(newMessages.length
                ? { messages: newMessages, _messages: newMessages }
                : {}),
        };
    }
    if (state.webSearchEnabled) {
        return {
            next: "webSearch",
            ...(newMessages.length
                ? { messages: newMessages, _messages: newMessages }
                : {}),
        };
    }
    // Check if any URLs are in the latest message. If true, determine if the contents should be included
    // inline in the prompt, and if so, scrape the contents and update the prompt.
    const messageUrls = extractURLsFromLastMessage(state._messages);
    let updatedMessageWithContents = undefined;
    if (messageUrls.length) {
        updatedMessageWithContents = await (0, include_url_contents_js_1.includeURLContents)(state._messages[state._messages.length - 1], messageUrls);
    }
    // Update the internal message list with the new message, if one was generated
    const newInternalMessageList = updatedMessageWithContents
        ? state._messages.map((m) => {
            if (m.id === updatedMessageWithContents.id) {
                return updatedMessageWithContents;
            }
            else {
                return m;
            }
        })
        : state._messages;
    const routingResult = await (0, dynamic_determine_path_js_1.dynamicDeterminePath)({
        state: {
            ...state,
            _messages: newInternalMessageList,
        },
        newMessages,
        config,
    });
    const route = routingResult?.route;
    if (!route) {
        throw new Error("Route not found");
    }
    // Create the messages object including the new messages if any
    const messages = newMessages.length
        ? {
            messages: newMessages,
            _messages: [...newInternalMessageList, ...newMessages],
        }
        : {
            _messages: newInternalMessageList,
        };
    return {
        next: route,
        ...messages,
    };
}
