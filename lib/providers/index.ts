import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export type ProviderType = 'openai' | 'anthropic' | 'gemini';

export interface ProviderConfig {
  apiKey: string;
}

export const getProvider = (provider: ProviderType, config: ProviderConfig) => {
  if (!config.apiKey) {
    throw new Error(`API key for ${provider} is missing.`);
  }

  switch (provider) {
    case 'openai':
      return createOpenAI({
        apiKey: config.apiKey,
      });
    case 'anthropic':
      return createAnthropic({
        apiKey: config.apiKey,
      });
    case 'gemini':
      return createGoogleGenerativeAI({
        apiKey: config.apiKey,
      });
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
};
