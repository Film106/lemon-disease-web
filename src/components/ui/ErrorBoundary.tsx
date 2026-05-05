import React, { Component, ErrorInfo } from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-6">
          <div className="max-w-sm w-full text-center space-y-6">
            {/* Icon */}
            <div className="mx-auto w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-10 h-10 text-danger"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-gray-900">เกิดข้อผิดพลาด</h1>
              <p className="text-gray-500 text-sm">
                เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาโหลดแอปใหม่
              </p>
              {this.state.error && (
                <p className="text-xs text-gray-400 font-mono bg-gray-50 rounded p-2 text-left break-all mt-4">
                  {this.state.error.message}
                </p>
              )}
            </div>

            <button
              onClick={this.handleReload}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-light transition-colors"
            >
              โหลดใหม่
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
