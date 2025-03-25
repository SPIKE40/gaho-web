import { ArtifactCodeV3, ArtifactMarkdownV3 } from "@opencanvas/shared/types";
import { OpenCanvasGraphAnnotation } from "../../state.js";
import { z } from "zod";
import { OPTIONALLY_UPDATE_ARTIFACT_META_SCHEMA } from "./schemas.js";
export declare const validateState: (state: typeof OpenCanvasGraphAnnotation.State) => {
    currentArtifactContent: ArtifactMarkdownV3 | ArtifactCodeV3;
    recentHumanMessage: import("@langchain/core/messages", { with: { "resolution-mode": "import" } }).BaseMessage;
};
interface BuildPromptArgs {
    artifactContent: string;
    memoriesAsString: string;
    isNewType: boolean;
    artifactMetaToolCall: z.infer<typeof OPTIONALLY_UPDATE_ARTIFACT_META_SCHEMA>;
}
export declare const buildPrompt: ({ artifactContent, memoriesAsString, isNewType, artifactMetaToolCall, }: BuildPromptArgs) => string;
interface CreateNewArtifactContentArgs {
    artifactType: string;
    state: typeof OpenCanvasGraphAnnotation.State;
    currentArtifactContent: ArtifactCodeV3 | ArtifactMarkdownV3;
    artifactMetaToolCall: z.infer<typeof OPTIONALLY_UPDATE_ARTIFACT_META_SCHEMA>;
    newContent: string;
}
export declare const createNewArtifactContent: ({ artifactType, state, currentArtifactContent, artifactMetaToolCall, newContent, }: CreateNewArtifactContentArgs) => ArtifactCodeV3 | ArtifactMarkdownV3;
export {};
