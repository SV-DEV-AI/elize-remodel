import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from 'ai';

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

export interface ChatHistoryState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  addSession: (session: ChatSession) => void;
  updateSession: (id: string, messages: Message[]) => void;
  deleteSession: (id: string) => void;
  setCurrentSession: (id: string | null) => void;
  clearHistory: () => void;
}

export const useChatHistory = create<ChatHistoryState>()(
  persist(
    (set) => ({
      sessions: [],
      currentSessionId: null,
      addSession: (session) =>
        set((state) => ({
          sessions: [session, ...state.sessions],
          currentSessionId: session.id,
        })),
      updateSession: (id, messages) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, messages, updatedAt: Date.now() } : s
          ),
        })),
      deleteSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
          currentSessionId: state.currentSessionId === id ? null : state.currentSessionId,
        })),
      setCurrentSession: (id) => set({ currentSessionId: id }),
      clearHistory: () => set({ sessions: [], currentSessionId: null }),
    }),
    {
      name: 'elize-chat-history',
    }
  )
);
