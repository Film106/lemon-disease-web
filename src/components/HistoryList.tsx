import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { HistoryRecord } from '../api/types';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { IconButton } from './ui/IconButton';

interface HistoryListProps {
  records: HistoryRecord[];
  onDelete: (id: string) => void;
  onSelect: (record: HistoryRecord) => void;
}

function formatDate(iso: string, lang: string) {
  return new Intl.DateTimeFormat(lang === 'th' ? 'th-TH' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

interface HistoryRowProps {
  record: HistoryRecord;
  onDelete: (id: string) => void;
  onSelect: (record: HistoryRecord) => void;
  lang: string;
}

function HistoryRow({ record, onDelete, onSelect, lang }: HistoryRowProps) {
  const { t } = useTranslation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const cls = record.result.predicted_class;
  const confidence = record.result.confidence;
  const decision = record.result.decision;

  const badgeText =
    decision === 'invalid_input'
      ? t('result.invalid_title')
      : decision === 'uncertain'
      ? t('result.uncertain_title')
      : cls
      ? t(`disease.${cls}`)
      : '—';

  const badgeColor =
    decision === 'invalid_input'
      ? 'bg-gray-100 text-gray-600'
      : decision === 'uncertain'
      ? 'bg-amber-100 text-amber-700'
      : cls === 'healthy'
      ? 'bg-primary/10 text-primary'
      : 'bg-danger/10 text-danger';

  return (
    <>
      <div
        className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-primary/20 hover:shadow-md transition-all cursor-pointer group"
        onClick={() => onSelect(record)}
      >
        {/* Thumbnail */}
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
          <img
            src={record.thumbnailDataUrl}
            alt="leaf thumbnail"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${badgeColor}`}>
              {badgeText}
            </span>
            {confidence !== null && (
              <span className="text-xs text-gray-400 tabular-nums">
                {Math.round(confidence * 100)}%
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 truncate">{formatDate(record.createdAt, lang)}</p>
        </div>

        {/* Delete button */}
        <IconButton
          label={t('common.delete')}
          variant="danger"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setConfirmOpen(true);
          }}
          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </IconButton>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={t('history.confirm_delete_title')}
        message={t('history.confirm_delete_message')}
        confirmLabel={t('common.delete')}
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete(record.id);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

export function HistoryList({ records, onDelete, onSelect }: HistoryListProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <HistoryRow
          key={record.id}
          record={record}
          onDelete={onDelete}
          onSelect={onSelect}
          lang={lang}
        />
      ))}
    </div>
  );
}
