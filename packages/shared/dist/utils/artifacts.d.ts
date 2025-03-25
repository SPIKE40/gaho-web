import { Artifact, ArtifactCodeV3, ArtifactMarkdownV3, ArtifactV3 } from "../types.js";
export declare const isArtifactCodeContent: (content: unknown) => content is ArtifactCodeV3;
export declare const isArtifactMarkdownContent: (content: unknown) => content is ArtifactMarkdownV3;
export declare const isDeprecatedArtifactType: (artifact: unknown) => artifact is Artifact;
export declare const getArtifactContent: (artifact: ArtifactV3) => ArtifactCodeV3 | ArtifactMarkdownV3;
