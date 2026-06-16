import { streamText } from 'ai';
import { getProvider, ProviderType, ProviderConfig } from '@/lib/providers';

export const maxDuration = 60; // Allow up to 60 seconds for response

export async function POST(req: Request) {
  try {
    const { messages, provider, model, config } = await req.json();

    if (!provider || !model) {
      return new Response('Missing provider or model', { status: 400 });
    }

    if (!config || !config.apiKey) {
      return new Response(`Missing API key for ${provider}`, { status: 401 });
    }

    const aiProvider = getProvider(provider as ProviderType, config as ProviderConfig);

    const result = await streamText({
      // @ts-ignore - Provider mismatch between ai v3 and latest provider SDKs
      model: aiProvider(model),
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(error.message || 'Internal Server Error', { status: 500 });
  }
}
