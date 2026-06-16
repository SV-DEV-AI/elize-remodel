import { streamText } from 'ai';
import { getProvider, ProviderType, ProviderConfig } from '@/lib/providers';

export const maxDuration = 60; // Allow up to 60 seconds for response

export async function POST(req: Request) {
  try {
    const { messages, provider, model, config } = await req.json();

    if (!provider || !model) {
      return new Response('Missing provider or model', { status: 400 });
    }

    let apiKey = config?.apiKey;

    // Fallback to server-side environment variables if the client didn't provide a key
    if (!apiKey) {
      if (provider === 'gemini') {
        apiKey = process.env.gemeni_api_for_elize || process.env.GEMINI_API_KEY;
      } else if (provider === 'openai') {
        apiKey = process.env.OPENAI_API_KEY;
      } else if (provider === 'anthropic') {
        apiKey = process.env.ANTHROPIC_API_KEY;
      }
    }

    if (!apiKey) {
      return new Response(`Missing API key for ${provider}. Please add it in Settings.`, { status: 401 });
    }

    const aiProvider = getProvider(provider as ProviderType, { apiKey });

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
