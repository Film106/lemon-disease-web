import type { DiagnoseResponse, ApiError } from './types';
import { mockDiagnose } from './mock';
import { geminiDiagnose } from './gemini';

export async function diagnose(image: File): Promise<DiagnoseResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  if (apiKey) {
    return geminiDiagnose(image, apiKey);
  }

  if (import.meta.env.DEV) {
    return mockDiagnose(image);
  }

  // Production: forward to own backend
  const formData = new FormData();
  formData.append('image', image);

  const response = await fetch('/api/v1/diagnose', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const err: ApiError = await response.json();
      errorMessage = err.message || err.error || errorMessage;
    } catch {
      // ignore
    }
    if (response.status === 400) throw new Error(`Invalid image: ${errorMessage}`);
    if (response.status === 429) throw new Error('Too many requests. Please wait a moment.');
    if (response.status >= 500) throw new Error(`Server error: ${errorMessage}`);
    throw new Error(errorMessage);
  }

  return response.json() as Promise<DiagnoseResponse>;
}
