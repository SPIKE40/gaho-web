"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionallyUpdateArtifactMeta = optionallyUpdateArtifactMeta;
const utils_js_1 = require("../../../utils.js");
const artifacts_1 = require("@opencanvas/shared/utils/artifacts");
const prompts_js_1 = require("../../prompts.js");
const schemas_js_1 = require("./schemas.js");
const utils_js_2 = require("../../../utils.js");
async function optionallyUpdateArtifactMeta(state, config) {
    const toolCallingModel = (await (0, utils_js_1.getModelFromConfig)(config, {
        isToolCalling: true,
    }))
        .withStructuredOutput(schemas_js_1.OPTIONALLY_UPDATE_ARTIFACT_META_SCHEMA, {
        name: "optionallyUpdateArtifactMeta",
    })
        .withConfig({ runName: "optionally_update_artifact_meta" });
    const memoriesAsString = await (0, utils_js_2.getFormattedReflections)(config);
    const currentArtifactContent = state.artifact
        ? (0, artifacts_1.getArtifactContent)(state.artifact)
        : undefined;
    if (!currentArtifactContent) {
        throw new Error("No artifact found");
    }
    const optionallyUpdateArtifactMetaPrompt = prompts_js_1.GET_TITLE_TYPE_REWRITE_ARTIFACT.replace("{artifact}", (0, utils_js_1.formatArtifactContent)(currentArtifactContent, true)).replace("{reflections}", memoriesAsString);
    const recentHumanMessage = state._messages.findLast((message) => message.getType() === "human");
    if (!recentHumanMessage) {
        throw new Error("No recent human message found");
    }
    const isO1MiniModel = (0, utils_js_1.isUsingO1MiniModel)(config);
    const optionallyUpdateArtifactResponse = await toolCallingModel.invoke([
        {
            role: isO1MiniModel ? "user" : "system",
            content: optionallyUpdateArtifactMetaPrompt,
        },
        recentHumanMessage,
    ]);
    return optionallyUpdateArtifactResponse;
}
