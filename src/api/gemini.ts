import type { DiagnoseResponse, DiseaseClass } from './types';
import { TREATMENTS } from './mock';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const SYSTEM_PROMPT = `You are an expert plant pathologist specialising in citrus diseases in Thailand.
Analyse the provided leaf image and return a JSON object — no markdown, no extra text, only valid JSON.

Required structure:
{
  "decision": "confident" | "uncertain" | "invalid_input",
  "predicted_class": "citrus_canker" | "leaf_miner" | "nutrient_deficiency" | "healthy" | null,
  "confidence": <number 0–1> | null,
  "distribution": {
    "citrus_canker": <number 0–1>,
    "leaf_miner": <number 0–1>,
    "nutrient_deficiency": <number 0–1>,
    "healthy": <number 0–1>
  }
}

Rules:
- Use "confident" when confidence ≥ 0.65 and the image clearly shows a single leaf.
- Use "uncertain" when the image is a leaf but you cannot confidently identify the disease.
- Use "invalid_input" when the image is not a citrus/lemon leaf at all.
- distribution values must sum to exactly 1.0.
- When decision is "uncertain" or "invalid_input", set predicted_class and confidence to null.`;

function fileToBase64(file: File): Promise<{ data: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // Strip the "data:<mime>;base64," prefix — Gemini wants raw base64
      const [header, data] = dataUrl.split(',');
      const mimeType = header.replace('data:', '').replace(';base64', '');
      resolve({ data, mimeType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface GeminiPartial {
  decision: 'confident' | 'uncertain' | 'invalid_input';
  predicted_class: DiseaseClass | null;
  confidence: number | null;
  distribution: Record<DiseaseClass, number>;
}

export async function geminiDiagnose(image: File, apiKey: string): Promise<DiagnoseResponse> {
  const { data, mimeType } = await fileToBase64(image);

  const response = await fetch(`${GEMINI_BASE}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: SYSTEM_PROMPT },
            { inline_data: { mime_type: mimeType, data } },
            { text: 'Diagnose this leaf.' },
          ],
        },
      ],
      generationConfig: {
        response_mime_type: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(err.error?.message ?? `Gemini API error ${response.status}`);
  }

  const data2 = await response.json() as {
    candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
  };
  const content = data2.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) throw new Error('Empty response from Gemini');

  const parsed: GeminiPartial = JSON.parse(content);

  return {
    decision: parsed.decision,
    predicted_class: parsed.predicted_class,
    confidence: parsed.confidence,
    distribution: parsed.distribution,
    treatment:
      parsed.decision === 'confident' && parsed.predicted_class
        ? TREATMENTS[parsed.predicted_class]
        : null,
    model_version: 'gemini-2.5-flash',
    timestamp: new Date().toISOString(),
  };
}
