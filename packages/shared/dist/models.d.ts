import { CustomModelConfig, ModelConfigurationParams } from "./types.js";
declare const AZURE_MODELS: ModelConfigurationParams[];
declare const OPENAI_MODELS: ModelConfigurationParams[];
/**
 * Ollama model names _MUST_ be prefixed with `"ollama-"`
 */
declare const OLLAMA_MODELS: {
    name: string;
    label: string;
    config: {
        provider: string;
        temperatureRange: {
            min: number;
            max: number;
            default: number;
            current: number;
        };
        maxTokens: {
            min: number;
            max: number;
            default: number;
            current: number;
        };
    };
    isNew: boolean;
}[];
declare const ANTHROPIC_MODELS: {
    name: string;
    label: string;
    config: {
        provider: string;
        temperatureRange: {
            min: number;
            max: number;
            default: number;
            current: number;
        };
        maxTokens: {
            min: number;
            max: number;
            default: number;
            current: number;
        };
    };
    isNew: boolean;
}[];
declare const FIREWORKS_MODELS: ModelConfigurationParams[];
declare const GROQ_MODELS: ModelConfigurationParams[];
declare const GEMINI_MODELS: ModelConfigurationParams[];
export declare const LANGCHAIN_USER_ONLY_MODELS: string[];
export declare const TEMPERATURE_EXCLUDED_MODELS: string[];
export declare const NON_STREAMING_TOOL_CALLING_MODELS: string[];
export declare const NON_STREAMING_TEXT_MODELS: string[];
export declare const THINKING_MODELS: string[];
export declare const ALL_MODELS: ModelConfigurationParams[];
type OPENAI_MODEL_NAMES = (typeof OPENAI_MODELS)[number]["name"];
type ANTHROPIC_MODEL_NAMES = (typeof ANTHROPIC_MODELS)[number]["name"];
type FIREWORKS_MODEL_NAMES = (typeof FIREWORKS_MODELS)[number]["name"];
type GEMINI_MODEL_NAMES = (typeof GEMINI_MODELS)[number]["name"];
type AZURE_MODEL_NAMES = (typeof AZURE_MODELS)[number]["name"];
type OLLAMA_MODEL_NAMES = (typeof OLLAMA_MODELS)[number]["name"];
type GROQ_MODEL_NAMES = (typeof GROQ_MODELS)[number]["name"];
export type ALL_MODEL_NAMES = OPENAI_MODEL_NAMES | ANTHROPIC_MODEL_NAMES | FIREWORKS_MODEL_NAMES | GEMINI_MODEL_NAMES | AZURE_MODEL_NAMES | OLLAMA_MODEL_NAMES | GROQ_MODEL_NAMES;
export declare const DEFAULT_MODEL_NAME: ALL_MODEL_NAMES;
export declare const DEFAULT_MODEL_CONFIG: CustomModelConfig;
export {};
