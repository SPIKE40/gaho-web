import { LangGraphRunnableConfig } from "@langchain/langgraph";
import { OpenCanvasGraphAnnotation } from "../../state.js";
import { OPTIONALLY_UPDATE_ARTIFACT_META_SCHEMA } from "./schemas.js";
import { z } from "zod";
export declare function optionallyUpdateArtifactMeta(state: typeof OpenCanvasGraphAnnotation.State, config: LangGraphRunnableConfig): Promise<z.infer<typeof OPTIONALLY_UPDATE_ARTIFACT_META_SCHEMA>>;
