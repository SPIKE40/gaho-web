import { create } from "zustand";

export interface HistoryItem {
  id: string;
  text: string;
  audioUrl: string;
  voiceName: string;
  avatarUrl: string;
  speed?: number;
  createdAt: string;
}

interface HistoryStore {
  history: HistoryItem[];
  addHistoryItem: (item: Omit<HistoryItem, "id" | "createdAt">) => void;
  removeHistoryItem: (id: string) => void;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  history: [],
  addHistoryItem: (item) =>
    set((state) => ({
      history: [
        {
          ...item,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
        },
        ...state.history,
      ],
    })),
  removeHistoryItem: (id) =>
    set((state) => ({
      history: state.history.filter((item) => item.id !== id),
    })),
}));
