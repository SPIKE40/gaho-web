import { CustomModelConfig, ArtifactCodeV3, ArtifactMarkdownV3, Reflections, ContextDocument, SearchResult } from "@opencanvas/shared/types";
import { BaseStore, LangGraphRunnableConfig } from "@langchain/langgraph";
import { initChatModel } from "langchain/chat_models/universal";
import { AIMessage, BaseMessage, MessageContent, MessageFieldWithRole } from "@langchain/core/messages";
export declare const formatReflections: (reflections: Reflections, extra?: {
    /**
     * Will only include the style guidelines in the output.
     * If this is set to true, you may not specify `onlyContent` as `true`.
     */
    onlyStyle?: boolean;
    /**
     * Will only include the content in the output.
     * If this is set to true, you may not specify `onlyStyle` as `true`.
     */
    onlyContent?: boolean;
}) => string;
export declare const ensureStoreInConfig: (config: LangGraphRunnableConfig) => BaseStore;
export declare function getFormattedReflections(config: LangGraphRunnableConfig): Promise<string>;
export declare const formatArtifactContent: (content: ArtifactMarkdownV3 | ArtifactCodeV3, shortenContent?: boolean) => string;
export declare const formatArtifactContentWithTemplate: (template: string, content: ArtifactMarkdownV3 | ArtifactCodeV3, shortenContent?: boolean) => string;
export declare const getModelConfig: (config: LangGraphRunnableConfig, extra?: {
    isToolCalling?: boolean;
}) => {
    modelName: string;
    modelProvider: string;
    modelConfig?: CustomModelConfig;
    azureConfig?: {
        azureOpenAIApiKey: string;
        azureOpenAIApiInstanceName: string;
        azureOpenAIApiDeploymentName: string;
        azureOpenAIApiVersion: string;
        azureOpenAIBasePath?: string;
    };
    apiKey?: string;
    baseUrl?: string;
};
export declare function optionallyGetSystemPromptFromConfig(config: LangGraphRunnableConfig): string | undefined;
export declare function isUsingO1MiniModel(config: LangGraphRunnableConfig): boolean;
export declare function getModelFromConfig(config: LangGraphRunnableConfig, extra?: {
    temperature?: number;
    maxTokens?: number;
    isToolCalling?: boolean;
}): Promise<ReturnType<typeof initChatModel>>;
export declare function convertPDFToText(base64PDF: string): Promise<string>;
export declare function createContextDocumentMessagesAnthropic(documents: ContextDocument[], options?: {
    nativeSupport: boolean;
}): Promise<({
    type: string;
    source: {
        type: string;
        media_type: string;
        data: string;
    };
    text?: undefined;
} | {
    type: string;
    text: string;
    source?: undefined;
})[]>;
export declare function createContextDocumentMessagesGemini(documents: ContextDocument[]): ({
    type: string;
    data: string;
    text?: undefined;
} | {
    type: string;
    text: string;
    data?: undefined;
})[];
export declare function createContextDocumentMessagesOpenAI(documents: ContextDocument[]): Promise<{
    type: string;
    text: string;
}[]>;
export declare function createContextDocumentMessages(config: LangGraphRunnableConfig, contextDocuments?: ContextDocument[]): Promise<MessageFieldWithRole[]>;
export declare function formatMessages(messages: BaseMessage[]): string;
export declare function createAIMessageFromWebResults(webResults: SearchResult[]): AIMessage;
export declare function getStringFromContent(content: MessageContent): string;
