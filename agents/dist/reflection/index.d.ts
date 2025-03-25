import { type LangGraphRunnableConfig } from "@langchain/langgraph";
import { ReflectionGraphAnnotation, ReflectionGraphReturnType } from "./state.js";
export declare const reflect: (state: typeof ReflectionGraphAnnotation.State, config: LangGraphRunnableConfig) => Promise<ReflectionGraphReturnType>;
export declare const graph: import("@langchain/langgraph").CompiledStateGraph<import("@langchain/langgraph").StateType<{
    artifact: {
        (): import("@langchain/langgraph").LastValue<import("@opencanvas/shared/types").ArtifactV3 | undefined>;
        (annotation: import("@langchain/langgraph").SingleReducer<import("@opencanvas/shared/types").ArtifactV3 | undefined, import("@opencanvas/shared/types").ArtifactV3 | undefined>): import("@langchain/langgraph").BinaryOperatorAggregate<import("@opencanvas/shared/types").ArtifactV3 | undefined, import("@opencanvas/shared/types").ArtifactV3 | undefined>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("@langchain/core/messages", { with: { "resolution-mode": "import" } }).BaseMessage[], import("@langchain/langgraph").Messages>;
}>, import("@langchain/langgraph").UpdateType<{
    artifact: {
        (): import("@langchain/langgraph").LastValue<import("@opencanvas/shared/types").ArtifactV3 | undefined>;
        (annotation: import("@langchain/langgraph").SingleReducer<import("@opencanvas/shared/types").ArtifactV3 | undefined, import("@opencanvas/shared/types").ArtifactV3 | undefined>): import("@langchain/langgraph").BinaryOperatorAggregate<import("@opencanvas/shared/types").ArtifactV3 | undefined, import("@opencanvas/shared/types").ArtifactV3 | undefined>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("@langchain/core/messages", { with: { "resolution-mode": "import" } }).BaseMessage[], import("@langchain/langgraph").Messages>;
}>, "__start__" | "reflect", {
    artifact: {
        (): import("@langchain/langgraph").LastValue<import("@opencanvas/shared/types").ArtifactV3 | undefined>;
        (annotation: import("@langchain/langgraph").SingleReducer<import("@opencanvas/shared/types").ArtifactV3 | undefined, import("@opencanvas/shared/types").ArtifactV3 | undefined>): import("@langchain/langgraph").BinaryOperatorAggregate<import("@opencanvas/shared/types").ArtifactV3 | undefined, import("@opencanvas/shared/types").ArtifactV3 | undefined>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("@langchain/core/messages", { with: { "resolution-mode": "import" } }).BaseMessage[], import("@langchain/langgraph").Messages>;
}, {
    artifact: {
        (): import("@langchain/langgraph").LastValue<import("@opencanvas/shared/types").ArtifactV3 | undefined>;
        (annotation: import("@langchain/langgraph").SingleReducer<import("@opencanvas/shared/types").ArtifactV3 | undefined, import("@opencanvas/shared/types").ArtifactV3 | undefined>): import("@langchain/langgraph").BinaryOperatorAggregate<import("@opencanvas/shared/types").ArtifactV3 | undefined, import("@opencanvas/shared/types").ArtifactV3 | undefined>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("@langchain/core/messages", { with: { "resolution-mode": "import" } }).BaseMessage[], import("@langchain/langgraph").Messages>;
}, import("@langchain/langgraph").StateDefinition>;
