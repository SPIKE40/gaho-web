import { ArtifactCodeV3, ArtifactMarkdownV3 } from "@opencanvas/shared/types";
import { z } from "zod";
import { ARTIFACT_TOOL_SCHEMA } from "./schemas.js";
export declare const formatNewArtifactPrompt: (memoriesAsString: string, modelName: string) => string;
export declare const createArtifactContent: (toolCall: z.infer<typeof ARTIFACT_TOOL_SCHEMA>) => ArtifactCodeV3 | ArtifactMarkdownV3;
