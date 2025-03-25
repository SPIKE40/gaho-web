import type { Dispatch, SetStateAction } from "react";
import { type BaseMessage } from "@langchain/core/messages";
type ThinkingAndResponseTokens = {
    thinking: string;
    response: string;
};
/**
 * Extracts thinking and response content from a text string containing XML-style think tags.
 * Designed to handle streaming text where tags might be incomplete.
 *
 * @param text - The input text that may contain <think> tags
 * @returns An object containing:
 *   - thinking: Content between <think> tags, or all content after <think> if no closing tag
 *   - response: All text outside of think tags
 *
 * @example
 * // Complete tags
 * extractThinkingAndResponseTokens('Hello <think>processing...</think>world')
 * // Returns: { thinking: 'processing...', response: 'Hello world' }
 *
 * // Streaming/incomplete tags
 * extractThinkingAndResponseTokens('Hello <think>processing...')
 * // Returns: { thinking: 'processing...', response: 'Hello ' }
 *
 * // No tags
 * extractThinkingAndResponseTokens('Hello world')
 * // Returns: { thinking: '', response: 'Hello world' }
 */
export declare function extractThinkingAndResponseTokens(text: string): ThinkingAndResponseTokens;
type HandleRewriteArtifactThinkingModelParams = {
    newArtifactContent: string;
    setMessages: Dispatch<SetStateAction<BaseMessage[]>>;
    thinkingMessageId: string;
};
/**
 * Handles the rewriting of artifact content by processing thinking tokens and updating messages state.
 * This function extracts thinking and response tokens from the new artifact content, updates the message
 * state with thinking tokens if present, and returns the response content.
 *
 * @param {Object} params - The parameters for handling artifact rewriting
 * @param {string} params.newArtifactContent - The new content to process for the artifact
 * @param {Dispatch<SetStateAction<BaseMessage[]>>} params.setMessages - State setter function for updating messages
 * @param {string} params.thinkingMessageId - Unique identifier for the thinking message to update or create
 * @returns {string} The extracted response content from the artifact
 */
export declare function handleRewriteArtifactThinkingModel({ newArtifactContent, setMessages, thinkingMessageId, }: HandleRewriteArtifactThinkingModelParams): string;
export declare function isThinkingModel(model: string): boolean;
export {};
