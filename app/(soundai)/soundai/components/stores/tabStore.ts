import { create } from "zustand";

/**
 * 활성 탭만 관리하기 위한 전역 상태 저장소 (Store)
 *
 * @flow
 * 1. 사용자가 탭을 클릭하면 setActiveTab 함수가 호출됨
 * 2. 탭 상태가 변경되면 이 상태를 구독하는 컴포넌트만 리렌더링됨
 *
 * @example
 * const { activeTab, setActiveTab } = useTabStore();
 */

// 탭 종류: InputContainer.tsx에서 사용
// basic: 기본 텍스트 입력 탭
// pro: 프로 기능 탭 (개발 중)
// story: 스토리메이커 탭 (대화 생성)
export const useTabStore = create<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
}>((set) => ({
  activeTab: "basic", // 기본 탭은 basic으로 유지
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
