import React from 'react';

interface LoadingStateProps {
  message?: string;
  variant?: 'default' | 'warming_up';
  fullScreen?: boolean;
}

export function LoadingState({
  message,
  variant = 'default',
  fullScreen = false,
}: LoadingStateProps) {
  const defaultMessages = {
    default: 'กำลังโหลด…',
    warming_up: 'กำลังเตรียมระบบ…',
  };

  const displayMessage = message ?? defaultMessages[variant];

  const content = (
    <div className="flex flex-col items-center gap-4">
      {/* Spinner */}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        {variant === 'warming_up' && (
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-primary/40 animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
        )}
      </div>
      <p className="text-gray-600 text-sm font-medium text-center max-w-xs">{displayMessage}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-bg z-40">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      {content}
    </div>
  );
}
