"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graph = exports.generateTitle = void 0;
const langgraph_1 = require("@langchain/langgraph");
const langgraph_sdk_1 = require("@langchain/langgraph-sdk");
const openai_1 = require("@langchain/openai");
const zod_1 = require("zod");
const artifacts_1 = require("@opencanvas/shared/utils/artifacts");
const prompts_js_1 = require("./prompts.js");
const state_js_1 = require("./state.js");
const generateTitle = async (state, config) => {
    const threadId = config.configurable?.open_canvas_thread_id;
    if (!threadId) {
        throw new Error("open_canvas_thread_id not found in configurable");
    }
    const generateTitleTool = {
        name: "generate_title",
        description: "Generate a concise title for the conversation.",
        schema: zod_1.z.object({
            title: zod_1.z.string().describe("The generated title for the conversation."),
        }),
    };
    const model = new openai_1.ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0,
    }).bindTools([generateTitleTool], {
        tool_choice: "generate_title",
    });
    const currentArtifactContent = state.artifact
        ? (0, artifacts_1.getArtifactContent)(state.artifact)
        : undefined;
    const artifactContent = currentArtifactContent
        ? (0, artifacts_1.isArtifactMarkdownContent)(currentArtifactContent)
            ? currentArtifactContent.fullMarkdown
            : currentArtifactContent.code
        : undefined;
    const artifactContext = artifactContent
        ? `An artifact was generated during this conversation:\n\n${artifactContent}`
        : "No artifact was generated during this conversation.";
    const formattedUserPrompt = prompts_js_1.TITLE_USER_PROMPT.replace("{conversation}", state.messages
        .map((msg) => `<${msg.getType()}>\n${msg.content}\n</${msg.getType()}>`)
        .join("\n\n")).replace("{artifact_context}", artifactContext);
    const result = await model.invoke([
        {
            role: "system",
            content: prompts_js_1.TITLE_SYSTEM_PROMPT,
        },
        {
            role: "user",
            content: formattedUserPrompt,
        },
    ]);
    const titleToolCall = result.tool_calls?.[0];
    if (!titleToolCall) {
        console.error("FAILED TO GENERATE TOOL CALL", result);
        throw new Error("Title generation tool call failed.");
    }
    const langGraphClient = new langgraph_sdk_1.Client({
        apiUrl: `http://localhost:${process.env.PORT}`,
    });
    // Update thread metadata with the generated title
    await langGraphClient.threads.update(threadId, {
        metadata: {
            thread_title: titleToolCall.args.title,
        },
    });
    return {};
};
exports.generateTitle = generateTitle;
const builder = new langgraph_1.StateGraph(state_js_1.TitleGenerationAnnotation)
    .addNode("title", exports.generateTitle)
    .addEdge(langgraph_1.START, "title");
exports.graph = builder.compile().withConfig({ runName: "thread_title" });
