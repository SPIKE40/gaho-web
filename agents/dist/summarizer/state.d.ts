export declare const SummarizerGraphAnnotation: import("@langchain/langgraph").AnnotationRoot<{
    /**
     * The original thread ID to use to update the message state.
     */
    threadId: {
        (): import("@langchain/langgraph").LastValue<string>;
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BinaryOperatorAggregate<string, string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("@langchain/core/messages", { with: { "resolution-mode": "import" } }).BaseMessage[], import("@langchain/langgraph").Messages>;
}>;
export type SummarizeState = typeof SummarizerGraphAnnotation.State;
export type SummarizeGraphReturnType = Partial<SummarizeState>;
