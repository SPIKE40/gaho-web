import { SearchResult } from "@opencanvas/shared/types";
export declare const WebSearchGraphAnnotation: import("@langchain/langgraph").AnnotationRoot<{
    /**
     * The search query.
     */
    query: {
        (): import("@langchain/langgraph").LastValue<string>;
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BinaryOperatorAggregate<string, string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    /**
     * The search results
     */
    webSearchResults: {
        (): import("@langchain/langgraph").LastValue<SearchResult[]>;
        (annotation: import("@langchain/langgraph").SingleReducer<SearchResult[], SearchResult[]>): import("@langchain/langgraph").BinaryOperatorAggregate<SearchResult[], SearchResult[]>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    /**
     * Whether or not to search the web based on the user's latest message.
     */
    shouldSearch: {
        (): import("@langchain/langgraph").LastValue<boolean>;
        (annotation: import("@langchain/langgraph").SingleReducer<boolean, boolean>): import("@langchain/langgraph").BinaryOperatorAggregate<boolean, boolean>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("@langchain/core/messages", { with: { "resolution-mode": "import" } }).BaseMessage[], import("@langchain/langgraph").Messages>;
}>;
export type WebSearchState = typeof WebSearchGraphAnnotation.State;
