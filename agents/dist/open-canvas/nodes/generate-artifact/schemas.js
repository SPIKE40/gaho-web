"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARTIFACT_TOOL_SCHEMA = void 0;
const constants_1 = require("@opencanvas/shared/constants");
const zod_1 = require("zod");
exports.ARTIFACT_TOOL_SCHEMA = zod_1.z.object({
    type: zod_1.z
        .enum(["code", "text"])
        .describe("The content type of the artifact generated."),
    language: zod_1.z
        .enum(constants_1.PROGRAMMING_LANGUAGES.map((lang) => lang.language))
        .optional()
        .describe("The language/programming language of the artifact generated.\n" +
        "If generating code, it should be one of the options, or 'other'.\n" +
        "If not generating code, the language should ALWAYS be 'other'."),
    isValidReact: zod_1.z
        .boolean()
        .optional()
        .describe("Whether or not the generated code is valid React code. Only populate this field if generating code."),
    artifact: zod_1.z.string().describe("The content of the artifact to generate."),
    title: zod_1.z
        .string()
        .describe("A short title to give to the artifact. Should be less than 5 words."),
});
