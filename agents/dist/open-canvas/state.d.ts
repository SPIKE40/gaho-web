import { BaseMessage, BaseMessageLike } from "@langchain/core/messages";
import { ArtifactLengthOptions, LanguageOptions, ProgrammingLanguageOptions, ReadingLevelOptions, CodeHighlight, ArtifactV3, TextHighlight, SearchResult } from "@opencanvas/shared/types";
export type Messages = Array<BaseMessage | BaseMessageLike> | BaseMessage | BaseMessageLike;
export declare const OpenCanvasGraphAnnotation: import("@langchain/langgraph").AnnotationRoot<{
    /**
     * The list of messages passed to the model. Can include summarized messages,
     * and others which are NOT shown to the user.
     */
    _messages: import("@langchain/langgraph").BinaryOperatorAggregate<BaseMessage[], Messages>;
    /**
     * The part of the artifact the user highlighted. Use the `selectedArtifactId`
     * to determine which artifact the highlight belongs to.
     */
    highlightedCode: {
        (): import("@langchain/langgraph").LastValue<CodeHighlight | undefined>;
        (annotation: import("@langchain/langgraph").SingleReducer<CodeHighlight | undefined, CodeHighlight | undefined>): import("@langchain/langgraph").BinaryOperatorAggregate<CodeHighlight | undefined, CodeHighlight | undefined>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    /**
     * The highlighted text. This includes the markdown blocks which the highlighted
     * text belongs to, along with the entire plain text content of highlight.
     */
    highlightedText: {
        (): import("@langchain/langgraph").LastValue<TextHighlight | undefined>;
        (annotation: import("@langchain/langgraph").SingleReducer<TextHighlight | undefined, TextHighlight | undefined>): import("@langchain/langgraph").BinaryOperatorAggregate<TextHighlight | undefined, TextHighlight | undefined>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    /**
     * The artifacts that have been generated in the conversation.
     */
    artifact: {
        (): import("@langchain/langgraph").LastValue<ArtifactV3>;
        (annotation: import("@langchain/langgraph").SingleReducer<ArtifactV3, ArtifactV3>): import("@langchain/langgraph").BinaryOperatorAggregate<ArtifactV3, ArtifactV3>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    /**
     * The next node to route to. Only used for the first routing node/conditional edge.
     */
    next: {
        (): import("@langchain/langgraph").LastValue<string | undefined>;
        (annotation: import("@langchain/langgraph").SingleReducer<string | undefined, string | undefined>): import("@langchain/langgraph").BinaryOperatorAggregate<string | undefined, string | undefined>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    /**
     * The language to translate the artifact to.
     */
    language: {
        (): import("@langchain/langgraph").LastValue<LanguageOptions | undefined>;
        (annotation: import("@langchain/langgraph").SingleReducer<LanguageOptions | undefined, LanguageOptions | undefined>): import("@langchain/langgraph").BinaryOperatorAggregate<LanguageOptions | undefined, LanguageOptions | undefined>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    /**
     * The length of the artifact to regenerate to.
     */
    artifactLength: {
        (): import("@langchain/langgraph").LastValue<ArtifactLengthOptions | undefined>;
        (annotation: import("@langchain/langgraph").SingleReducer<ArtifactLengthOptions | undefined, ArtifactLengthOptions | undefined>): import("@langchain/langgraph").BinaryOperatorAggregate<ArtifactLengthOptions | undefined, ArtifactLengthOptions | undefined>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    /**
     * Whether or not to regenerate with emojis.
     */
    regenerateWithEmojis: {
        (): import("@langchain/langgraph").LastValue<boolean | undefined>;
        (annotation: import("@langchain/langgraph").SingleReducer<boolean | undefined, boolean | undefined>): import("@langchain/langgraph").BinaryOperatorAggregate<boolean | undefined, boolean | undefined>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    /**
     * The reading level to adjust the artifact to.
     */
    readingLevel: {
        (): import("@langchain/langgraph").LastValue<ReadingLevelOptions | undefined>;
        (annotation: import("@langchain/langgraph").SingleReducer<ReadingLevelOptions | undefined, ReadingLevelOptions | undefined>): import("@langchain/langgraph").BinaryOperatorAggregate<ReadingLevelOptions | undefined, ReadingLevelOptions | undefined>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    /**
     * Whether or not to add comments to the code artifact.
     */
    addComments: {
        (): import("@langchain/langgraph").LastValue<boolean | undefined>;
        (annotation: import("@langchain/langgraph").SingleReducer<boolean | undefined, boolean | undefined>): import("@langchain/langgraph").BinaryOperatorAggregate<boolean | undefined, boolean | undefined>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    /**
     * Whether or not to add logs to the code artifact.
     */
    addLogs: {
        (): import("@langchain/langgraph").LastValue<boolean | undefined>;
        (annotation: import("@langchain/langgraph").SingleReducer<boolean | undefined, boolean | undefined>): import("@langchain/langgraph").BinaryOperatorAggregate<boolean | undefined, boolean | undefined>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    /**
     * The programming language to port the code artifact to.
     */
    portLanguage: {
        (): import("@langchain/langgraph").LastValue<ProgrammingLanguageOptions | undefined>;
        (annotation: import("@langchain/langgraph").SingleReducer<ProgrammingLanguageOptions | undefined, ProgrammingLanguageOptions | undefined>): import("@langchain/langgraph").BinaryOperatorAggregate<ProgrammingLanguageOptions | undefined, ProgrammingLanguageOptions | undefined>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    /**
     * Whether or not to fix bugs in the code artifact.
     */
    fixBugs: {
        (): import("@langchain/langgraph").LastValue<boolean | undefined>;
        (annotation: import("@langchain/langgraph").SingleReducer<boolean | undefined, boolean | undefined>): import("@langchain/langgraph").BinaryOperatorAggregate<boolean | undefined, boolean | undefined>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    /**
     * The ID of the custom quick action to use.
     */
    customQuickActionId: {
        (): import("@langchain/langgraph").LastValue<string | undefined>;
        (annotation: import("@langchain/langgraph").SingleReducer<string | undefined, string | undefined>): import("@langchain/langgraph").BinaryOperatorAggregate<string | undefined, string | undefined>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    /**
     * Whether or not to search the web for additional context.
     */
    webSearchEnabled: {
        (): import("@langchain/langgraph").LastValue<boolean | undefined>;
        (annotation: import("@langchain/langgraph").SingleReducer<boolean | undefined, boolean | undefined>): import("@langchain/langgraph").BinaryOperatorAggregate<boolean | undefined, boolean | undefined>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    /**
     * The search results to include in context.
     */
    webSearchResults: {
        (): import("@langchain/langgraph").LastValue<SearchResult[] | undefined>;
        (annotation: import("@langchain/langgraph").SingleReducer<SearchResult[] | undefined, SearchResult[] | undefined>): import("@langchain/langgraph").BinaryOperatorAggregate<SearchResult[] | undefined, SearchResult[] | undefined>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<BaseMessage[], import("@langchain/langgraph").Messages>;
}>;
export type OpenCanvasGraphReturnType = Partial<typeof OpenCanvasGraphAnnotation.State>;
