"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertContextDocumentToHumanMessage = convertContextDocumentToHumanMessage;
exports.fixMisFormattedContextDocMessage = fixMisFormattedContextDocMessage;
const uuid_1 = require("uuid");
const utils_js_1 = require("../../../utils.js");
const messages_1 = require("@langchain/core/messages");
const constants_1 = require("@opencanvas/shared/constants");
/**
 * Checks for context documents in a human message, and if found, converts
 * them to a human message with the proper content format.
 */
async function convertContextDocumentToHumanMessage(messages, config) {
    const lastMessage = messages[messages.length - 1];
    const documents = lastMessage?.additional_kwargs?.documents;
    if (!documents?.length) {
        return undefined;
    }
    const contextMessages = await (0, utils_js_1.createContextDocumentMessages)(config, documents);
    return new messages_1.HumanMessage({
        id: (0, uuid_1.v4)(),
        content: [
            ...contextMessages.flatMap((m) => typeof m.content !== "string" ? m.content : []),
        ],
        additional_kwargs: {
            [constants_1.OC_HIDE_FROM_UI_KEY]: true,
        },
    });
}
async function fixMisFormattedContextDocMessage(message, config) {
    if (typeof message.content === "string") {
        return undefined;
    }
    const { modelProvider } = (0, utils_js_1.getModelConfig)(config);
    const newMsgId = (0, uuid_1.v4)();
    let changesMade = false;
    if (modelProvider === "openai") {
        const newContentPromises = message.content.map(async (m) => {
            if (m.type === "document" &&
                m.source.type === "base64" &&
                m.source.data) {
                changesMade = true;
                // Anthropic format
                return {
                    type: "text",
                    text: await (0, utils_js_1.convertPDFToText)(m.source.data),
                };
            }
            else if (m.type === "application/pdf") {
                changesMade = true;
                // Gemini format
                return {
                    type: "text",
                    text: await (0, utils_js_1.convertPDFToText)(m.data),
                };
            }
            return m;
        });
        const newContent = await Promise.all(newContentPromises);
        if (changesMade) {
            return [
                new messages_1.RemoveMessage({ id: message.id || "" }),
                new messages_1.HumanMessage({ ...message, id: newMsgId, content: newContent }),
            ];
        }
    }
    else if (modelProvider === "anthropic") {
        const newContent = message.content.map((m) => {
            if (m.type === "application/pdf") {
                changesMade = true;
                // Gemini format
                return {
                    type: "document",
                    source: {
                        type: "base64",
                        media_type: m.type,
                        data: m.data,
                    },
                };
            }
            return m;
        });
        if (changesMade) {
            return [
                new messages_1.RemoveMessage({ id: message.id || "" }),
                new messages_1.HumanMessage({ ...message, id: newMsgId, content: newContent }),
            ];
        }
    }
    else if (modelProvider === "google-genai") {
        const newContent = message.content.map((m) => {
            if (m.type === "document") {
                changesMade = true;
                // Anthropic format
                return {
                    type: "application/pdf",
                    data: m.source.data,
                };
            }
            return m;
        });
        if (changesMade) {
            return [
                new messages_1.RemoveMessage({ id: message.id || "" }),
                new messages_1.HumanMessage({ ...message, id: newMsgId, content: newContent }),
            ];
        }
    }
    return undefined;
}
