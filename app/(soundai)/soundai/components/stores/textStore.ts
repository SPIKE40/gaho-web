import { create } from "zustand";

/**
 * 텍스트 입력만 관리하기 위한 전역 상태 저장소 (Store)
 *
 * @description
 * 이 스토어는 성능 최적화를 위해 '텍스트 입력 상태'와 '탭 상태'를 분리하여 관리함.
 * 텍스트 입력 시 불필요한 리렌더링을 방지하기 위해 별도 스토어로 분리했음.
 *
 * @example
 * const { text, setText } = useTextStore();
 */
export const useTextStore = create<{
  text: string;
  setText: (text: string) => void;
}>((set) => ({
  text: "",
  setText: (text) => set({ text }),
}));

// 기존 useInputText는 하위 호환성을 위해 유지하되 새로운 스토어를 사용
import { useTabStore } from "./tabStore";
