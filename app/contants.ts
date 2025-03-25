export const MIDM_API_URL = "";

export const failErrMessage = "(응답에 실패하였습니다.)";

export const emptyErrMessage = "(응답 내용이 비어 있습니다.)";

export const privacyErrMessage = "(개인정보가 검출된 응답입니다.)";

export const RESULTCODE_OK = "0000";

export const USER = "user";

export const ASSISTANT = "assistant";

export const LANGGRAPH_API_URL =
  process.env.LANGGRAPH_API_URL ?? "http://localhost:54367";
// v2 is tied to the 'open-canvas-prod' deployment.
export const ASSISTANT_ID_COOKIE = "oc_assistant_id_v2";
// export const ASSISTANT_ID_COOKIE = "oc_assistant_id";
export const HAS_ASSISTANT_COOKIE_BEEN_SET = "has_oc_assistant_id_been_set";

export const OC_HAS_SEEN_CUSTOM_ASSISTANTS_ALERT =
  "oc_has_seen_custom_assistants_alert";
export const WEB_SEARCH_RESULTS_QUERY_PARAM = "webSearchResults";

export const ALLOWED_AUDIO_TYPES = new Set([
  "audio/mp3",
  "audio/mp4",
  "audio/mpeg",
  "audio/mpga",
  "audio/m4a",
  "audio/wav",
  "audio/webm",
]);
export const ALLOWED_AUDIO_TYPE_ENDINGS = [
  ".mp3",
  ".mpga",
  ".m4a",
  ".wav",
  ".webm",
];
export const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/mpeg",
  "video/webm",
]);
export const ALLOWED_VIDEO_TYPE_ENDINGS = [".mp4", ".mpeg", ".webm"];

export const CHAT_COLLAPSED_QUERY_PARAM = "chatCollapsed";
