import type { DiagnoseResponse, ApiError } from './types';
import { mockDiagnose } from './mock';

export async function diagnose(image: File): Promise<DiagnoseResponse> {
  if (import.meta.env.DEV) {
    return mockDiagnose(image);
  }

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
      // ignore parse errors
    }

    if (response.status === 400) {
      throw new Error(`Invalid image: ${errorMessage}`);
    } else if (response.status === 429) {
      throw new Error('Too many requests. Please wait a moment and try again.');
    } else if (response.status >= 500) {
      throw new Error(`Server error: ${errorMessage}`);
    } else {
      throw new Error(errorMessage);
    }
  }

  return response.json() as Promise<DiagnoseResponse>;
}
