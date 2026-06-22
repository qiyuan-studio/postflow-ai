import { AIContentRequest, AIContentResponse } from '@/types';

export async function generateContent(request: AIContentRequest): Promise<AIContentResponse> {
  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error('AI generation failed');
  return response.json();
}

export async function generateImage(prompt: string): Promise<string> {
  const response = await fetch('/api/ai/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) throw new Error('Image generation failed');
  const data = await response.json();
  return data.url;
}
