import { ProgrammingLanguageOptions } from "./types.js";
export declare const OC_SUMMARIZED_MESSAGE_KEY = "__oc_summarized_message";
export declare const OC_HIDE_FROM_UI_KEY = "__oc_hide_from_ui";
export declare const OC_WEB_SEARCH_RESULTS_MESSAGE_KEY = "__oc_web_search_results_message";
export declare const CONTEXT_DOCUMENTS_NAMESPACE: string[];
export declare const DEFAULT_INPUTS: {
    highlightedCode: undefined;
    highlightedText: undefined;
    next: undefined;
    language: undefined;
    artifactLength: undefined;
    regenerateWithEmojis: undefined;
    readingLevel: undefined;
    addComments: undefined;
    addLogs: undefined;
    fixBugs: undefined;
    portLanguage: undefined;
    customQuickActionId: undefined;
    webSearchEnabled: undefined;
    webSearchResults: undefined;
};
export declare const PROGRAMMING_LANGUAGES: Array<{
    language: ProgrammingLanguageOptions;
    label: string;
}>;
