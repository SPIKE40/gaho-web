"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graph = exports.reflect = void 0;
const anthropic_1 = require("@langchain/anthropic");
const langgraph_1 = require("@langchain/langgraph");
const state_js_1 = require("./state.js");
const prompts_js_1 = require("./prompts.js");
const zod_1 = require("zod");
const utils_js_1 = require("../utils.js");
const artifacts_1 = require("@opencanvas/shared/utils/artifacts");
const reflect = async (state, config) => {
    const store = (0, utils_js_1.ensureStoreInConfig)(config);
    const assistantId = config.configurable?.open_canvas_assistant_id;
    if (!assistantId) {
        throw new Error("`open_canvas_assistant_id` not found in configurable");
    }
    const memoryNamespace = ["memories", assistantId];
    const memoryKey = "reflection";
    const memories = await store.get(memoryNamespace, memoryKey);
    const memoriesAsString = memories?.value
        ? (0, utils_js_1.formatReflections)(memories.value)
        : "No reflections found.";
    const generateReflectionTool = {
        name: "generate_reflections",
        description: "Generate reflections based on the context provided.",
        schema: zod_1.z.object({
            styleRules: zod_1.z
                .array(zod_1.z.string())
                .describe("The complete new list of style rules and guidelines."),
            content: zod_1.z
                .array(zod_1.z.string())
                .describe("The complete new list of memories/facts about the user."),
        }),
    };
    const model = new anthropic_1.ChatAnthropic({
        model: "claude-3-5-sonnet-20240620",
        temperature: 0,
    }).bindTools([generateReflectionTool], {
        tool_choice: "generate_reflections",
    });
    const currentArtifactContent = state.artifact
        ? (0, artifacts_1.getArtifactContent)(state.artifact)
        : undefined;
    const artifactContent = currentArtifactContent
        ? (0, artifacts_1.isArtifactMarkdownContent)(currentArtifactContent)
            ? currentArtifactContent.fullMarkdown
            : currentArtifactContent.code
        : undefined;
    const formattedSystemPrompt = prompts_js_1.REFLECT_SYSTEM_PROMPT.replace("{artifact}", artifactContent ?? "No artifact found.").replace("{reflections}", memoriesAsString);
    const formattedUserPrompt = prompts_js_1.REFLECT_USER_PROMPT.replace("{conversation}", state.messages
        .map((msg) => `<${msg.getType()}>\n${msg.content}\n</${msg.getType()}>`)
        .join("\n\n"));
    const result = await model.invoke([
        {
            role: "system",
            content: formattedSystemPrompt,
        },
        {
            role: "user",
            content: formattedUserPrompt,
        },
    ]);
    const reflectionToolCall = result.tool_calls?.[0];
    if (!reflectionToolCall) {
        console.error("FAILED TO GENERATE TOOL CALL", result);
        throw new Error("Reflection tool call failed.");
    }
    const newMemories = {
        styleRules: reflectionToolCall.args.styleRules,
        content: reflectionToolCall.args.content,
    };
    await store.put(memoryNamespace, memoryKey, newMemories);
    return {};
};
exports.reflect = reflect;
const builder = new langgraph_1.StateGraph(state_js_1.ReflectionGraphAnnotation)
    .addNode("reflect", exports.reflect)
    .addEdge(langgraph_1.START, "reflect");
exports.graph = builder.compile().withConfig({ runName: "reflection" });
