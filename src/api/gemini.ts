import type { DiagnoseResponse, DiseaseClass } from './types';
import { TREATMENTS } from './mock';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const SYSTEM_PROMPT = `You are an expert plant pathologist specialising in citrus diseases in Thailand.
Analyse the provided leaf image and return ONLY a valid JSON object — no markdown, no code blocks, no extra text.

Required JSON structure:
{
  "decision": "confident" | "uncertain" | "invalid_input",
  "predicted_class": "citrus_canker" | "leaf_miner" | "nutrient_deficiency" | "healthy" | null,
  "confidence": <number 0.0–1.0> | null,
  "distribution": {
    "citrus_canker": <number 0.0–1.0>,
    "leaf_miner": <number 0.0–1.0>,
    "nutrient_deficiency": <number 0.0–1.0>,
    "healthy": <number 0.0–1.0>
  }
}

Rules:
- "confident": confidence >= 0.65 and image clearly shows a single leaf.
- "uncertain": image is a leaf but disease cannot be confidently identified.
- "invalid_input": image is not a citrus/lemon leaf at all.
- All four distribution values must sum to exactly 1.0.
- When decision is "uncertain" or "invalid_input", set predicted_class and confidence to null.`;

function fileToBase64(file: File): Promise<{ data: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const commaIdx = dataUrl.indexOf(',');
      const mimeType = dataUrl.slice(5, dataUrl.indexOf(';'));
      const data = dataUrl.slice(commaIdx + 1);
      resolve({ data, mimeType });
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

function stripMarkdown(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
}

interface GeminiPartial {
  decision: 'confident' | 'uncertain' | 'invalid_input';
  predicted_class: DiseaseClass | null;
  confidence: number | null;
  distribution: Record<DiseaseClass, number>;
}

interface GeminiApiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: { message?: string; code?: number };
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
            { text: 'Diagnose this leaf image now.' },
          ],
        },
      ],
      generationConfig: {
        response_mime_type: 'application/json',
        temperature: 0.1,
      },
    }),
  });

  const json = await response.json() as GeminiApiResponse;

  if (!response.ok || json.error) {
    throw new Error(json.error?.message ?? `Gemini API error ${response.status}`);
  }

  const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Empty response from Gemini');

  let parsed: GeminiPartial;
  try {
    parsed = JSON.parse(stripMarkdown(rawText));
  } catch {
    throw new Error(`Could not parse Gemini response: ${rawText.slice(0, 200)}`);
  }

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
