"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPTIONALLY_UPDATE_ARTIFACT_META_SCHEMA = void 0;
const constants_1 = require("@opencanvas/shared/constants");
const zod_1 = require("zod");
exports.OPTIONALLY_UPDATE_ARTIFACT_META_SCHEMA = zod_1.z
    .object({
    type: zod_1.z
        .enum(["text", "code"])
        .describe("The type of the artifact content."),
    title: zod_1.z
        .string()
        .optional()
        .describe("The new title to give the artifact. ONLY update this if the user is making a request which changes the subject/topic of the artifact."),
    language: zod_1.z
        .enum(constants_1.PROGRAMMING_LANGUAGES.map((lang) => lang.language))
        .describe("The language of the code artifact. This should be populated with the programming language if the user is requesting code to be written, or 'other', in all other cases."),
})
    .describe("Update the artifact meta information, if necessary.");
