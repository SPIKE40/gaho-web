"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractUrls = extractUrls;
/**
 * Extracts all URLs from a given string
 * @param text The string to extract URLs from
 * @returns Array of URLs found in the text
 */
function extractUrls(text) {
    const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    const urls = new Set();
    // First replace all markdown links with spaces to avoid double-matching
    const processedText = text.replace(markdownLinkRegex, (match, _, url) => {
        urls.add(url);
        return " ".repeat(match.length); // Replace with spaces to preserve string length
    });
    // Then look for any remaining plain URLs in the text
    const plainUrlRegex = /https?:\/\/[^\s<\]]+(?:[^<.,:;"'\]\s)]|(?=\s|$))/g;
    const plainUrls = processedText.match(plainUrlRegex) || [];
    plainUrls.forEach((url) => urls.add(url));
    return Array.from(urls);
}
