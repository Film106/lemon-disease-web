import React from 'react';
import { useTranslation } from 'react-i18next';
import type { DiseaseClass } from '../api/types';

interface ProbabilityBarsProps {
  distribution: Record<DiseaseClass, number>;
  predicted: DiseaseClass | null;
}

const CLASS_ORDER: DiseaseClass[] = [
  'citrus_canker',
  'leaf_miner',
  'nutrient_deficiency',
  'healthy',
];

const CLASS_COLORS: Record<DiseaseClass, string> = {
  citrus_canker: 'bg-danger',
  leaf_miner: 'bg-warning',
  nutrient_deficiency: 'bg-secondary',
  healthy: 'bg-primary',
};

export function ProbabilityBars({ distribution, predicted }: ProbabilityBarsProps) {
  const { t } = useTranslation();

  const sorted = CLASS_ORDER.slice().sort(
    (a, b) => (distribution[b] ?? 0) - (distribution[a] ?? 0)
  );

  return (
    <div className="space-y-3">
      {sorted.map((cls) => {
        const pct = Math.round((distribution[cls] ?? 0) * 100);
        const isTop = cls === predicted;

        return (
          <div key={cls} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className={`font-medium ${isTop ? 'text-gray-900' : 'text-gray-600'}`}>
                {t(`disease.${cls}`)}
              </span>
              <span className={`font-bold tabular-nums ${isTop ? 'text-gray-900' : 'text-gray-500'}`}>
                {pct}%
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${CLASS_COLORS[cls]} ${isTop ? 'opacity-100' : 'opacity-50'}`}
                style={{ width: `${pct}%` }}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${t(`disease.${cls}`)}: ${pct}%`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
