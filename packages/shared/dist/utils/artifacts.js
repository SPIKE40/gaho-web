"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArtifactContent = exports.isDeprecatedArtifactType = exports.isArtifactMarkdownContent = exports.isArtifactCodeContent = void 0;
const isArtifactCodeContent = (content) => {
    return !!(typeof content === "object" &&
        content &&
        "type" in content &&
        content.type === "code");
};
exports.isArtifactCodeContent = isArtifactCodeContent;
const isArtifactMarkdownContent = (content) => {
    return !!(typeof content === "object" &&
        content &&
        "type" in content &&
        content.type === "text");
};
exports.isArtifactMarkdownContent = isArtifactMarkdownContent;
const isDeprecatedArtifactType = (artifact) => {
    return !!(typeof artifact === "object" &&
        artifact &&
        "currentContentIndex" in artifact &&
        typeof artifact.currentContentIndex === "number");
};
exports.isDeprecatedArtifactType = isDeprecatedArtifactType;
const getArtifactContent = (artifact) => {
    if (!artifact) {
        throw new Error("No artifact found.");
    }
    const currentContent = artifact.contents.find((a) => a.index === artifact.currentIndex);
    if (!currentContent) {
        return artifact.contents[artifact.contents.length - 1];
    }
    return currentContent;
};
exports.getArtifactContent = getArtifactContent;
