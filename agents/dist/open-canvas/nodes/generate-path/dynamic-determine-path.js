"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicDeterminePath = void 0;
const prompts_js_1 = require("../../prompts.js");
const utils_js_1 = require("../../../utils.js");
const artifacts_1 = require("@opencanvas/shared/utils/artifacts");
const zod_1 = __importDefault(require("zod"));
const traceable_1 = require("langsmith/traceable");
/**
 * Dynamically determines the path to take using an LLM.
 */
async function dynamicDeterminePathFunc({ state, newMessages, config, }) {
    const currentArtifactContent = state.artifact
        ? (0, artifacts_1.getArtifactContent)(state.artifact)
        : undefined;
    // Call model and decide if we need to respond to a users query, or generate a new artifact
    const formattedPrompt = prompts_js_1.ROUTE_QUERY_PROMPT.replace("{artifactOptions}", currentArtifactContent
        ? prompts_js_1.ROUTE_QUERY_OPTIONS_HAS_ARTIFACTS
        : prompts_js_1.ROUTE_QUERY_OPTIONS_NO_ARTIFACTS)
        .replace("{recentMessages}", state._messages
        .slice(-3)
        .map((message) => `${message.getType()}: ${message.content}`)
        .join("\n\n"))
        .replace("{currentArtifactPrompt}", currentArtifactContent
        ? (0, utils_js_1.formatArtifactContentWithTemplate)(prompts_js_1.CURRENT_ARTIFACT_PROMPT, currentArtifactContent)
        : prompts_js_1.NO_ARTIFACT_PROMPT);
    const artifactRoute = currentArtifactContent
        ? "rewriteArtifact"
        : "generateArtifact";
    const model = await (0, utils_js_1.getModelFromConfig)(config, {
        temperature: 0,
        isToolCalling: true,
    });
    const schema = zod_1.default.object({
        route: zod_1.default
            .enum(["replyToGeneralInput", artifactRoute])
            .describe("The route to take based on the user's query."),
    });
    const modelWithTool = model.bindTools([
        {
            name: "route_query",
            description: "The route to take based on the user's query.",
            schema,
        },
    ], {
        tool_choice: "route_query",
    });
    const contextDocumentMessages = await (0, utils_js_1.createContextDocumentMessages)(config);
    const result = await modelWithTool.invoke([
        ...contextDocumentMessages,
        ...(newMessages.length ? newMessages : []),
        {
            role: "user",
            content: formattedPrompt,
        },
    ]);
    return result.tool_calls?.[0]?.args;
}
exports.dynamicDeterminePath = (0, traceable_1.traceable)(dynamicDeterminePathFunc, {
    name: "dynamic_determine_path",
});
