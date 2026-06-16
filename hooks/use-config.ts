import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProviderType } from '@/lib/providers';

export interface AppConfig {
  openaiKey: string;
  anthropicKey: string;
  geminiKey: string;
  provider: ProviderType;
  model: string;
}

interface ConfigState {
  config: AppConfig;
  setConfig: (config: Partial<AppConfig>) => void;
}

export const useConfig = create<ConfigState>()(
  persist(
    (set) => ({
      config: {
        openaiKey: '',
        anthropicKey: '',
        geminiKey: '',
        provider: 'gemini',
        model: 'gemini-3.5-flash',
      },
      setConfig: (newConfig) =>
        set((state) => ({ config: { ...state.config, ...newConfig } })),
    }),
    {
      name: 'elize-config-storage',
    }
  )
);
