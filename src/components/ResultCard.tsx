import React from 'react';
import { useTranslation } from 'react-i18next';
import type { DiagnoseResponse } from '../api/types';
import { ProbabilityBars } from './ProbabilityBars';
import { TreatmentCard } from './TreatmentCard';

interface ResultCardProps {
  result: DiagnoseResponse;
  thumbnailUrl?: string;
}

const DISEASE_BADGE_COLORS: Record<string, string> = {
  citrus_canker: 'bg-danger/10 text-danger',
  leaf_miner: 'bg-warning/10 text-warning',
  nutrient_deficiency: 'bg-secondary/10 text-secondary',
  healthy: 'bg-primary/10 text-primary',
};

export function ResultCard({ result, thumbnailUrl }: ResultCardProps) {
  const { t } = useTranslation();

  if (result.decision === 'invalid_input') {
    return (
      <div className="flex flex-col lg:flex-row gap-6">
        {thumbnailUrl && (
          <div className="w-full lg:w-1/2 aspect-video rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
            <img src={thumbnailUrl} alt="Uploaded" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 rounded-2xl bg-gray-50 border border-gray-200 p-6 text-center space-y-3 flex flex-col items-center justify-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-800">{t('result.invalid_title')}</h2>
          <p className="text-sm text-gray-500">{t('result.invalid_desc')}</p>
        </div>
      </div>
    );
  }

  if (result.decision === 'uncertain') {
    return (
      <div className="flex flex-col lg:flex-row gap-6">
        {thumbnailUrl && (
          <div className="w-full lg:w-1/2 aspect-video rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
            <img src={thumbnailUrl} alt="Uploaded" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 space-y-4">
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-warning" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-amber-800">{t('result.uncertain_title')}</h2>
            <p className="text-sm text-amber-700">{t('result.uncertain_desc')}</p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-gray-900">{t('result.distribution_title')}</h3>
            <ProbabilityBars distribution={result.distribution} predicted={result.predicted_class} />
          </div>
        </div>
      </div>
    );
  }

  // Confident result — two-column on lg+
  const cls = result.predicted_class!;
  const badgeColor = DISEASE_BADGE_COLORS[cls] ?? 'bg-gray-100 text-gray-700';
  const confidence = result.confidence ?? 0;

  return (
    <div className="flex flex-col lg:flex-row lg:items-start gap-6">

      {/* Left column: image + summary + bars */}
      <div className="flex flex-col gap-4 lg:flex-1">
        {thumbnailUrl && (
          <div className="w-full aspect-video rounded-2xl overflow-hidden bg-gray-100">
            <img src={thumbnailUrl} alt="Diagnosed leaf" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Diagnosis summary */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-bold text-gray-900 text-lg">{t('result.confident_title')}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeColor}`}>
              {t(`disease.${cls}`)}
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('result.confidence')}</span>
              <span className="font-bold text-gray-900 tabular-nums">{Math.round(confidence * 100)}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${Math.round(confidence * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-900">{t('result.distribution_title')}</h3>
          <ProbabilityBars distribution={result.distribution} predicted={cls} />
        </div>
      </div>

      {/* Right column: treatment */}
      {result.treatment && (
        <div className="lg:flex-1">
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-gray-900">{t('result.treatment_title')}</h3>
            <TreatmentCard treatment={result.treatment} />
          </div>
        </div>
      )}
    </div>
  );
}
