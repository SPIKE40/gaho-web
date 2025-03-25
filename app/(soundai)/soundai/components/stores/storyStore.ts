import { create } from "zustand";
import { Voice } from "./voiceStore";

// 대화 대사 라인 정의
export interface DialogueLine {
  id: string;
  text: string;
  voice: Voice | null;
}

// 대화 데이터를 관리하기 위한 전역 상태
export const useStoryStore = create<{
  dialogueLines: DialogueLine[];
  addLine: () => string;
  updateLine: (id: string, text: string) => void;
  updateVoice: (id: string, voice: Voice) => void;
  removeLine: (id: string) => void;
  clearLines: () => void;
}>((set) => ({
  dialogueLines: [],

  // 새 대사 라인 추가
  addLine: () => {
    const newLineId = `line-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    // console.log("storyStore: 새 라인 생성 시작, ID:", newLineId);

    set((state) => {
      // console.log("storyStore: 기존 라인 수:", state.dialogueLines.length);
      const newState = {
        dialogueLines: [
          ...state.dialogueLines,
          {
            id: newLineId,
            text: "",
            voice: null,
          },
        ],
      };
      // console.log(
      //   "storyStore: 업데이트 후 라인 수:",
      //   newState.dialogueLines.length
      // );
      return newState;
    });

    // console.log("storyStore: 새 라인 생성 완료");
    return newLineId;
  },

  // 대사 텍스트 업데이트
  updateLine: (id, text) =>
    set((state) => ({
      dialogueLines: state.dialogueLines.map((line) =>
        line.id === id ? { ...line, text } : line
      ),
    })),

  // 대사에 음성 할당
  updateVoice: (id, voice) =>
    set((state) => ({
      dialogueLines: state.dialogueLines.map((line) =>
        line.id === id ? { ...line, voice } : line
      ),
    })),

  // 대사 라인 삭제
  removeLine: (id) =>
    set((state) => ({
      dialogueLines: state.dialogueLines.filter((line) => line.id !== id),
    })),

  // 모든 대사 라인 초기화
  clearLines: () => set({ dialogueLines: [] }),
}));
