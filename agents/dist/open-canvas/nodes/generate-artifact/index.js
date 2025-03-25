"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateArtifact = void 0;
const utils_js_1 = require("../../../utils.js");
const schemas_js_1 = require("./schemas.js");
const utils_js_2 = require("./utils.js");
/**
 * Generate a new artifact based on the user's query.
 */
const generateArtifact = async (state, config) => {
    const { modelName } = (0, utils_js_1.getModelConfig)(config, {
        isToolCalling: true,
    });
    const smallModel = await (0, utils_js_1.getModelFromConfig)(config, {
        temperature: 0.5,
        isToolCalling: true,
    });
    const modelWithArtifactTool = smallModel.bindTools([
        {
            name: "generate_artifact",
            description: schemas_js_1.ARTIFACT_TOOL_SCHEMA.description,
            schema: schemas_js_1.ARTIFACT_TOOL_SCHEMA,
        },
    ], {
        tool_choice: "generate_artifact",
    });
    const memoriesAsString = await (0, utils_js_1.getFormattedReflections)(config);
    const formattedNewArtifactPrompt = (0, utils_js_2.formatNewArtifactPrompt)(memoriesAsString, modelName);
    const userSystemPrompt = (0, utils_js_1.optionallyGetSystemPromptFromConfig)(config);
    const fullSystemPrompt = userSystemPrompt
        ? `${userSystemPrompt}\n${formattedNewArtifactPrompt}`
        : formattedNewArtifactPrompt;
    const contextDocumentMessages = await (0, utils_js_1.createContextDocumentMessages)(config);
    const isO1MiniModel = (0, utils_js_1.isUsingO1MiniModel)(config);
    const response = await modelWithArtifactTool.invoke([
        { role: isO1MiniModel ? "user" : "system", content: fullSystemPrompt },
        ...contextDocumentMessages,
        ...state._messages,
    ], { runName: "generate_artifact" });
    const args = response.tool_calls?.[0].args;
    if (!args) {
        throw new Error("No args found in response");
    }
    const newArtifactContent = (0, utils_js_2.createArtifactContent)(args);
    const newArtifact = {
        currentIndex: 1,
        contents: [newArtifactContent],
    };
    return {
        artifact: newArtifact,
    };
};
exports.generateArtifact = generateArtifact;
