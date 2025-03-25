import { create } from "zustand";

// 음성 정보를 위한 인터페이스
export interface Voice {
  speaker_group: string;
  speaker_name: string;
  age_group: string;
  gender: string;
  style: string;
  speaker_code: number;
  processing_type: string;
  avatar_url?: string;
}

// 선택된 음성을 관리하기 위한 전역 상태
export const useSelectedVoice = create<{
  selectedVoice: Voice | null;
  setSelectedVoice: (voice: Voice | null) => void;
}>((set) => ({
  selectedVoice: null,
  setSelectedVoice: (voice) => set({ selectedVoice: voice }),
}));
