import { AIContentRequest, AIContentResponse } from '@/types';

export async function generateContent(request: AIContentRequest): Promise<AIContentResponse> {
  const response = await fetch('/api/open/v1/content/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error('AI generation failed');
  return response.json();
}

export async function generateImage(prompt: string): Promise<string> {
  // 图片生成功能待接入外部API后启用
  console.warn('Image generation: no API endpoint configured');
  return '';
}
