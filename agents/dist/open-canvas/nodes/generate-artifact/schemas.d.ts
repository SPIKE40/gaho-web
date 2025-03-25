import { z } from "zod";
export declare const ARTIFACT_TOOL_SCHEMA: z.ZodObject<{
    type: z.ZodEnum<["code", "text"]>;
    language: z.ZodOptional<z.ZodEnum<[string, ...string[]]>>;
    isValidReact: z.ZodOptional<z.ZodBoolean>;
    artifact: z.ZodString;
    title: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "text" | "code";
    artifact: string;
    title: string;
    language?: string | undefined;
    isValidReact?: boolean | undefined;
}, {
    type: "text" | "code";
    artifact: string;
    title: string;
    language?: string | undefined;
    isValidReact?: boolean | undefined;
}>;
