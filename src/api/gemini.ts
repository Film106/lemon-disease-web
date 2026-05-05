import type { DiagnoseResponse, DiseaseClass } from './types';
import { TREATMENTS } from './mock';

// โหมดจำลอง (Mockup) สำหรับพรีเซนต์อาจารย์
export async function geminiDiagnose(image: File, apiKey: string): Promise<DiagnoseResponse> {
  
  // 1. จำลองการหน่วงเวลา 2 วินาที ให้เหมือน AI กำลังประมวลผลรูปภาพจริงๆ
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 2. ส่งข้อมูลจำลองกลับไปที่หน้าเว็บ (กำหนดให้เป็น "โรคแคงเกอร์" เสมอ)
  return {
    decision: 'confident',
    predicted_class: 'citrus_canker', // ระบุว่าเป็นโรคแคงเกอร์
    confidence: 0.95, // ความมั่นใจ 95%
    distribution: {
      citrus_canker: 0.95,
      leaf_miner: 0.02,
      nutrient_deficiency: 0.02,
      healthy: 0.01
    },
    treatment: TREATMENTS['citrus_canker'], // ดึงข้อมูลวิธีรักษาโรคแคงเกอร์มาโชว์
    model_version: 'mock-presentation-mode',
    timestamp: new Date().toISOString(),
  };
}