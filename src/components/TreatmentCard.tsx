import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Treatment } from '../api/types';
import { useUIStore } from '../store/ui';

interface TreatmentCardProps {
  treatment: Treatment;
}

export function TreatmentCard({ treatment }: TreatmentCardProps) {
  const { t } = useTranslation();
  const { language } = useUIStore();

  const summary = language === 'th' ? treatment.summary_th : treatment.summary_en;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <p className="text-gray-700 leading-relaxed">{summary}</p>

      {/* Immediate steps */}
      {treatment.immediate_steps.length > 0 && (
        <section>
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-warning/20 text-warning flex items-center justify-center text-xs font-bold">!</span>
            {t('treatment.immediate_steps')}
          </h3>
          <ul className="space-y-2">
            {treatment.immediate_steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Treatment agents table */}
      {treatment.treatment.length > 0 && (
        <section>
          <h3 className="font-bold text-gray-900 mb-3">{t('treatment.treatment_agents')}</h3>
          <div className="overflow-x-auto -mx-4">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr className="bg-primary/5">
                  <th className="text-left px-4 py-2 font-semibold text-gray-700">{t('treatment.agent')}</th>
                  <th className="text-left px-4 py-2 font-semibold text-gray-700">{t('treatment.rate')}</th>
                  <th className="text-left px-4 py-2 font-semibold text-gray-700">{t('treatment.interval')}</th>
                  <th className="text-left px-4 py-2 font-semibold text-gray-700">{t('treatment.notes')}</th>
                </tr>
              </thead>
              <tbody>
                {treatment.treatment.map((agent, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">{agent.agent}</td>
                    <td className="px-4 py-2 text-gray-700">{agent.rate}</td>
                    <td className="px-4 py-2 text-gray-700 whitespace-nowrap">{agent.interval}</td>
                    <td className="px-4 py-2 text-gray-600 text-xs">{agent.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* When to escalate */}
      {treatment.when_to_escalate && (
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            {t('treatment.when_to_escalate')}
          </h3>
          <p className="text-sm text-amber-700">{treatment.when_to_escalate}</p>
        </section>
      )}

      {/* Safety notes */}
      {treatment.safety.length > 0 && (
        <section className="bg-red-50 border border-red-100 rounded-xl p-4">
          <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            {t('treatment.safety')}
          </h3>
          <ul className="space-y-1.5">
            {treatment.safety.map((note, i) => (
              <li key={i} className="text-sm text-red-700 flex gap-2">
                <span className="text-red-400 flex-shrink-0">•</span>
                {note}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
