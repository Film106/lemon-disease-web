import type { DiagnoseResponse, DiseaseClass, Treatment } from './types';

const TREATMENTS: Record<DiseaseClass, Treatment> = {
  citrus_canker: {
    class: 'citrus_canker',
    summary_th:
      'โรคแคงเกอร์ของส้ม เกิดจากแบคทีเรีย Xanthomonas citri subsp. citri ทำให้เกิดรอยนูนบนใบและผล ระบาดได้เร็วโดยเฉพาะในช่วงฝนตก',
    summary_en:
      'Citrus canker is caused by the bacterium Xanthomonas citri subsp. citri, producing raised lesions on leaves and fruit. It spreads rapidly, especially during rainy seasons.',
    immediate_steps: [
      'ตัดและเผาทำลายส่วนที่ติดเชื้อทันที',
      'ฉีดพ่นสารทองแดง (คอปเปอร์ออกซีคลอไรด์) บริเวณรอบต้น',
      'หลีกเลี่ยงการตัดแต่งในช่วงฝนตก',
      'ฆ่าเชื้ออุปกรณ์ทุกครั้งหลังใช้งาน',
    ],
    treatment: [
      {
        agent: 'Copper oxychloride 85% WP',
        rate: '30–40 g / น้ำ 20 ล.',
        interval: 'ทุก 7–10 วัน',
        notes: 'ฉีดให้ทั่วใบทั้งด้านบนและล่าง',
      },
      {
        agent: 'Kasugamycin 2% SL',
        rate: '20 ml / น้ำ 20 ล.',
        interval: 'ทุก 14 วัน',
        notes: 'สลับกับสารทองแดงเพื่อป้องกันการดื้อยา',
      },
    ],
    when_to_escalate:
      'หากรอยโรคลุกลามเกิน 30% ของใบหรือพบบนผล ควรแจ้งเจ้าหน้าที่ส่งเสริมการเกษตรทันที',
    safety: [
      'สวมถุงมือและหน้ากากเมื่อฉีดพ่น',
      'ห้ามฉีดพ่นในช่วงลมแรงหรือฝนตก',
      'ล้างมือและอาบน้ำหลังสัมผัสสารเคมี',
    ],
  },
  leaf_miner: {
    class: 'leaf_miner',
    summary_th:
      'หนอนชอนใบ (Phyllocnistis citrella) เป็นแมลงศัตรูขนาดเล็ก ตัวหนอนจะชอนไชอยู่ใต้ผิวใบ ทำให้ใบงอ ม้วน และแคระแกรน โดยเฉพาะในยอดอ่อน',
    summary_en:
      'Citrus leafminer (Phyllocnistis citrella) is a tiny moth pest whose larvae tunnel under the leaf surface, causing characteristic silvery mines, leaf curling, and stunted growth especially in new flushes.',
    immediate_steps: [
      'ตัดใบที่เสียหายและทำลายทิ้ง',
      'หลีกเลี่ยงการใส่ปุ๋ยไนโตรเจนมากเกินไปซึ่งกระตุ้นยอดอ่อน',
      'ปล่อยแตนเบียน Cirrospilus หรือ Pnigalio เป็นศัตรูธรรมชาติ',
    ],
    treatment: [
      {
        agent: 'Spinosad 12% SC',
        rate: '20 ml / น้ำ 20 ล.',
        interval: 'ทุก 7 วัน ช่วงแตกยอดอ่อน',
        notes: 'มีประสิทธิภาพสูงและปลอดภัยต่อแมลงมีประโยชน์',
      },
      {
        agent: 'Imidacloprid 70% WG',
        rate: '2–3 g / น้ำ 20 ล.',
        interval: 'ทุก 14 วัน',
        notes: 'ใช้ในกรณีระบาดรุนแรง ระวังผึ้งและแมลงผสมเกสร',
      },
    ],
    when_to_escalate:
      'หากพบว่ายอดอ่อนมากกว่า 50% ถูกทำลาย หรือเกิดซ้ำต่อเนื่องเกิน 3 รุ่น ให้ปรึกษาผู้เชี่ยวชาญ',
    safety: [
      'Spinosad ค่อนข้างปลอดภัยต่อมนุษย์ แต่ต้องล้างมือหลังใช้',
      'Imidacloprid เป็นพิษต่อผึ้ง ห้ามฉีดในช่วงดอกบาน',
      'เก็บสารเคมีให้พ้นมือเด็ก',
    ],
  },
  nutrient_deficiency: {
    class: 'nutrient_deficiency',
    summary_th:
      'ขาดธาตุอาหาร โดยเฉพาะธาตุเหล็ก (Fe) สังกะสี (Zn) หรือแมกนีเซียม (Mg) ทำให้ใบเหลืองในลักษณะต่างกัน การแก้ไขที่ถูกต้องต้องวิเคราะห์ดินและใบก่อน',
    summary_en:
      'Nutrient deficiency — commonly iron (Fe), zinc (Zn), or magnesium (Mg) — causes characteristic yellowing patterns. Correct diagnosis requires soil and leaf analysis before treatment.',
    immediate_steps: [
      'เก็บตัวอย่างดินและใบส่งวิเคราะห์',
      'ปรับ pH ดินให้อยู่ในช่วง 6.0–6.5 หากจำเป็น',
      'ฉีดพ่นทางใบด้วยธาตุอาหารเสริมชั่วคราวเพื่อบรรเทาอาการ',
    ],
    treatment: [
      {
        agent: 'เหล็ก EDTA (Fe-EDTA) 13%',
        rate: '30–50 ml / น้ำ 20 ล.',
        interval: 'ทุก 2 สัปดาห์ จนกว่าอาการดีขึ้น',
        notes: 'ฉีดช่วงเช้าหรือเย็น หลีกเลี่ยงแดดจัด',
      },
      {
        agent: 'สังกะสีซัลเฟต (ZnSO4) 21%',
        rate: '20 g / น้ำ 20 ล.',
        interval: 'ทุก 3 สัปดาห์',
        notes: 'อย่าผสมกับสารทองแดง',
      },
      {
        agent: 'แมกนีเซียมซัลเฟต (MgSO4)',
        rate: '100–150 g / น้ำ 20 ล.',
        interval: 'ทุก 2–3 สัปดาห์',
        notes: 'ปลอดภัยและราคาถูก เหมาะกับขาด Mg',
      },
    ],
    when_to_escalate:
      'หากอาการไม่ดีขึ้นภายใน 4–6 สัปดาห์หลังแก้ไข ควรส่งตัวอย่างวิเคราะห์ซ้ำและปรึกษานักวิชาการเกษตร',
    safety: [
      'ธาตุอาหารเสริมค่อนข้างปลอดภัย แต่ควรสวมถุงมือ',
      'ห้ามใช้สารในปริมาณสูงกว่าคำแนะนำเพราะอาจเป็นพิษกับพืช',
    ],
  },
  healthy: {
    class: 'healthy',
    summary_th: 'ใบมะนาวมีสุขภาพดี ไม่พบสัญญาณของโรคหรือแมลงศัตรูพืช',
    summary_en: 'Lemon leaf appears healthy. No signs of disease or pest damage detected.',
    immediate_steps: ['ดูแลรักษาตามปกติ', 'ให้น้ำและปุ๋ยอย่างเหมาะสม', 'ตรวจสอบสม่ำเสมอทุก 1–2 สัปดาห์'],
    treatment: [],
    when_to_escalate: 'หากพบความผิดปกติในภายหลัง กลับมาตรวจซ้ำ',
    safety: [],
  },
};

const MOCK_DISTRIBUTIONS: Record<string, Record<DiseaseClass, number>> = {
  confident_citrus_canker: {
    citrus_canker: 0.91,
    leaf_miner: 0.05,
    nutrient_deficiency: 0.03,
    healthy: 0.01,
  },
  confident_leaf_miner: {
    citrus_canker: 0.04,
    leaf_miner: 0.88,
    nutrient_deficiency: 0.05,
    healthy: 0.03,
  },
  confident_nutrient_deficiency: {
    citrus_canker: 0.02,
    leaf_miner: 0.06,
    nutrient_deficiency: 0.87,
    healthy: 0.05,
  },
  confident_healthy: {
    citrus_canker: 0.02,
    leaf_miner: 0.03,
    nutrient_deficiency: 0.04,
    healthy: 0.91,
  },
  uncertain: {
    citrus_canker: 0.32,
    leaf_miner: 0.28,
    nutrient_deficiency: 0.25,
    healthy: 0.15,
  },
  invalid_input: {
    citrus_canker: 0.1,
    leaf_miner: 0.1,
    nutrient_deficiency: 0.1,
    healthy: 0.7,
  },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockDiagnose(_image: File): Promise<DiagnoseResponse> {
  await delay(1500);

  const params = new URLSearchParams(window.location.search);
  const mockParam = params.get('mock');

  if (mockParam === 'uncertain') {
    return {
      decision: 'uncertain',
      predicted_class: 'citrus_canker',
      confidence: 0.32,
      distribution: MOCK_DISTRIBUTIONS.uncertain,
      treatment: null,
      model_version: 'mock-v1.0',
      timestamp: new Date().toISOString(),
    };
  }

  if (mockParam === 'invalid') {
    return {
      decision: 'invalid_input',
      predicted_class: null,
      confidence: null,
      distribution: MOCK_DISTRIBUTIONS.invalid_input,
      treatment: null,
      model_version: 'mock-v1.0',
      timestamp: new Date().toISOString(),
    };
  }

  // Default: confident result — cycle based on Date
  const classes: DiseaseClass[] = ['citrus_canker', 'leaf_miner', 'nutrient_deficiency', 'healthy'];
  const mockClass = mockParam && classes.includes(mockParam as DiseaseClass)
    ? (mockParam as DiseaseClass)
    : 'citrus_canker';

  const distKey = `confident_${mockClass}`;
  const distribution = MOCK_DISTRIBUTIONS[distKey] ?? MOCK_DISTRIBUTIONS.confident_citrus_canker;

  return {
    decision: 'confident',
    predicted_class: mockClass,
    confidence: distribution[mockClass],
    distribution,
    treatment: TREATMENTS[mockClass],
    model_version: 'mock-v1.0',
    timestamp: new Date().toISOString(),
  };
}
