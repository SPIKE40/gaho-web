import { z } from "zod";
export declare const OPTIONALLY_UPDATE_ARTIFACT_META_SCHEMA: z.ZodObject<{
    type: z.ZodEnum<["text", "code"]>;
    title: z.ZodOptional<z.ZodString>;
    language: z.ZodEnum<[string, ...string[]]>;
}, "strip", z.ZodTypeAny, {
    type: "text" | "code";
    language: string;
    title?: string | undefined;
}, {
    type: "text" | "code";
    language: string;
    title?: string | undefined;
}>;
