import { ArtifactV3 } from "@opencanvas/shared/types";
export declare const ReflectionGraphAnnotation: import("@langchain/langgraph").AnnotationRoot<{
    /**
     * The artifact to reflect on.
     */
    artifact: {
        (): import("@langchain/langgraph").LastValue<ArtifactV3 | undefined>;
        (annotation: import("@langchain/langgraph").SingleReducer<ArtifactV3 | undefined, ArtifactV3 | undefined>): import("@langchain/langgraph").BinaryOperatorAggregate<ArtifactV3 | undefined, ArtifactV3 | undefined>;
        Root: <S extends import("@langchain/langgraph").StateDefinition>(sd: S) => import("@langchain/langgraph").AnnotationRoot<S>;
    };
    messages: import("@langchain/langgraph").BinaryOperatorAggregate<import("@langchain/core/messages", { with: { "resolution-mode": "import" } }).BaseMessage[], import("@langchain/langgraph").Messages>;
}>;
export type ReflectionGraphReturnType = Partial<typeof ReflectionGraphAnnotation.State>;
