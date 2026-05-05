export type DiseaseClass = 'citrus_canker' | 'leaf_miner' | 'nutrient_deficiency' | 'healthy';

export type Decision = 'confident' | 'uncertain' | 'invalid_input';

export interface TreatmentAgent {
  agent: string;
  rate: string;
  interval: string;
  notes: string;
}

export interface Treatment {
  class: DiseaseClass;
  summary_th: string;
  summary_en: string;
  immediate_steps: string[];
  treatment: TreatmentAgent[];
  when_to_escalate: string;
  safety: string[];
}

export interface DiagnoseResponse {
  decision: Decision;
  predicted_class: DiseaseClass | null;
  confidence: number | null;
  distribution: Record<DiseaseClass, number>;
  treatment: Treatment | null;
  model_version: string;
  timestamp: string;
}

export interface ApiError {
  error: string;
  message: string;
}

export interface HistoryRecord {
  id: string;
  createdAt: string;
  thumbnailDataUrl: string;
  result: DiagnoseResponse;
}
