import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllRecords, deleteRecord, clearAllRecords } from '../history/db';
import { useUIStore } from '../store/ui';
import type { HistoryRecord } from '../api/types';
import { HistoryList } from '../components/HistoryList';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { LoadingState } from '../components/ui/LoadingState';
import { IconButton } from '../components/ui/IconButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { ToastContainer } from '../components/ui/Toast';
import type { ToastVariant } from '../components/ui/Toast';
import { ResultCard } from '../components/ResultCard';

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

export default function History() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setCurrentResult } = useUIStore();

  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const { data: records, isPending } = useQuery({
    queryKey: ['history'],
    queryFn: getAllRecords,
    staleTime: 1000 * 30,
  });

  const handleDelete = async (id: string) => {
    await deleteRecord(id);
    queryClient.invalidateQueries({ queryKey: ['history'] });
    addToast(t('history.deleted_toast'), 'success');
  };

  const handleClearAll = async () => {
    await clearAllRecords();
    queryClient.invalidateQueries({ queryKey: ['history'] });
    setClearDialogOpen(false);
    addToast(t('history.cleared_toast'), 'success');
  };

  const handleSelectRecord = (record: HistoryRecord) => {
    setSelectedRecord(record);
  };

  const handleViewInResult = () => {
    if (!selectedRecord) return;
    setCurrentResult(selectedRecord.result);
    navigate('/result');
  };

  const hasRecords = (records?.length ?? 0) > 0;

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 pt-safe pt-4 pb-2">
        <IconButton label="Back" variant="ghost" onClick={() => navigate('/')}>
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </IconButton>
        <h1 className="font-bold text-gray-900 text-lg flex-1">{t('history.title')}</h1>
        {hasRecords && (
          <button
            onClick={() => setClearDialogOpen(true)}
            className="text-sm text-danger font-semibold px-3 py-2 rounded-lg hover:bg-danger/10 transition-colors min-h-[44px]"
          >
            {t('history.clear_all')}
          </button>
        )}
      </header>

      <main className="flex-1 px-4 pb-8 pt-2">
        {isPending && <LoadingState />}

        {!isPending && !hasRecords && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-600">{t('history.empty_title')}</p>
              <p className="text-sm text-gray-400 mt-1">{t('history.empty_desc')}</p>
            </div>
            <SecondaryButton onClick={() => navigate('/capture')}>
              {t('home.diagnose_button')}
            </SecondaryButton>
          </div>
        )}

        {!isPending && hasRecords && records && (
          <HistoryList
            records={records}
            onDelete={handleDelete}
            onSelect={handleSelectRecord}
          />
        )}
      </main>

      {/* Selected record drawer / modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-40 flex flex-col">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedRecord(null)}
          />
          {/* Bottom sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-bg rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 flex-shrink-0">
              <h2 className="font-bold text-gray-900">{t('result.title')}</h2>
              <button
                onClick={() => setSelectedRecord(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
              >
                ✕
              </button>
            </div>
            {/* Content */}
            <div className="overflow-y-auto px-5 pb-6 flex-1">
              <ResultCard
                result={selectedRecord.result}
                thumbnailUrl={selectedRecord.thumbnailDataUrl}
              />
            </div>
            {/* Action */}
            <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
              <SecondaryButton fullWidth onClick={handleViewInResult}>
                {t('result.title')} →
              </SecondaryButton>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={clearDialogOpen}
        title={t('history.confirm_clear_title')}
        message={t('history.confirm_clear_message')}
        confirmLabel={t('history.clear_all')}
        onConfirm={handleClearAll}
        onCancel={() => setClearDialogOpen(false)}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
