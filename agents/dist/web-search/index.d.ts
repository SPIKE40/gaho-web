export declare const graph: import("@langchain/langgraph").CompiledStateGraph<import("@langchain/langgraph").StateType<{
    query: {
        (): import("@langchain/langgraph").LastValue<string>;
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BinaryOperatorAggregate<string, string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    webSearchResults: {
        (): import("@langchain/langgraph").LastValue<import("@opencanvas/shared/types").SearchResult[]>;
        (annotation: import("@langchain/langgraph").SingleReducer<import("@opencanvas/shared/types").SearchResult[], import("@opencanvas/shared/types").SearchResult[]>): import("@langchain/langgraph").BinaryOperatorAggregate<import("@opencanvas/shared/types").SearchResult[], import("@opencanvas/shared/types").SearchResult[]>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    shouldSearch: {
        (): import("@langchain/langgraph").LastValue<boolean>;
        (annotation: import("@langchain/langgraph").SingleReducer<boolean, boolean>): import("@langchain/langgraph").BinaryOperatorAggregate<boolean, boolean>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("@langchain/core/messages", { with: { "resolution-mode": "import" } }).BaseMessage[], import("@langchain/langgraph").Messages>;
}>, import("@langchain/langgraph").UpdateType<{
    query: {
        (): import("@langchain/langgraph").LastValue<string>;
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BinaryOperatorAggregate<string, string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    webSearchResults: {
        (): import("@langchain/langgraph").LastValue<import("@opencanvas/shared/types").SearchResult[]>;
        (annotation: import("@langchain/langgraph").SingleReducer<import("@opencanvas/shared/types").SearchResult[], import("@opencanvas/shared/types").SearchResult[]>): import("@langchain/langgraph").BinaryOperatorAggregate<import("@opencanvas/shared/types").SearchResult[], import("@opencanvas/shared/types").SearchResult[]>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    shouldSearch: {
        (): import("@langchain/langgraph").LastValue<boolean>;
        (annotation: import("@langchain/langgraph").SingleReducer<boolean, boolean>): import("@langchain/langgraph").BinaryOperatorAggregate<boolean, boolean>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("@langchain/core/messages", { with: { "resolution-mode": "import" } }).BaseMessage[], import("@langchain/langgraph").Messages>;
}>, "search" | "queryGenerator" | "__start__" | "classifyMessage", {
    query: {
        (): import("@langchain/langgraph").LastValue<string>;
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BinaryOperatorAggregate<string, string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    webSearchResults: {
        (): import("@langchain/langgraph").LastValue<import("@opencanvas/shared/types").SearchResult[]>;
        (annotation: import("@langchain/langgraph").SingleReducer<import("@opencanvas/shared/types").SearchResult[], import("@opencanvas/shared/types").SearchResult[]>): import("@langchain/langgraph").BinaryOperatorAggregate<import("@opencanvas/shared/types").SearchResult[], import("@opencanvas/shared/types").SearchResult[]>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    shouldSearch: {
        (): import("@langchain/langgraph").LastValue<boolean>;
        (annotation: import("@langchain/langgraph").SingleReducer<boolean, boolean>): import("@langchain/langgraph").BinaryOperatorAggregate<boolean, boolean>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("@langchain/core/messages", { with: { "resolution-mode": "import" } }).BaseMessage[], import("@langchain/langgraph").Messages>;
}, {
    query: {
        (): import("@langchain/langgraph").LastValue<string>;
        (annotation: import("@langchain/langgraph").SingleReducer<string, string>): import("@langchain/langgraph").BinaryOperatorAggregate<string, string>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    webSearchResults: {
        (): import("@langchain/langgraph").LastValue<import("@opencanvas/shared/types").SearchResult[]>;
        (annotation: import("@langchain/langgraph").SingleReducer<import("@opencanvas/shared/types").SearchResult[], import("@opencanvas/shared/types").SearchResult[]>): import("@langchain/langgraph").BinaryOperatorAggregate<import("@opencanvas/shared/types").SearchResult[], import("@opencanvas/shared/types").SearchResult[]>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    shouldSearch: {
        (): import("@langchain/langgraph").LastValue<boolean>;
        (annotation: import("@langchain/langgraph").SingleReducer<boolean, boolean>): import("@langchain/langgraph").BinaryOperatorAggregate<boolean, boolean>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("@langchain/core/messages", { with: { "resolution-mode": "import" } }).BaseMessage[], import("@langchain/langgraph").Messages>;
}, import("@langchain/langgraph").StateDefinition>;
