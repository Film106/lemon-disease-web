import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraError, setCameraError] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setCameraReady(true);
      }
    } catch {
      setCameraError(true);
    }
  }, []);

  useEffect(() => {
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
      startCamera();
    } else {
      setCameraError(true);
    }
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [startCamera]);

  const captureFromCamera = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `leaf-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
      },
      'image/jpeg',
      0.9
    );
  }, [onCapture]);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onCapture(file);
      }
    },
    [onCapture]
  );

  return (
    <div className="relative w-full">
      {!cameraError ? (
        <div className="relative w-full overflow-hidden rounded-2xl bg-black aspect-[3/4]">
          {/* Live video */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Leaf-shaped SVG overlay guide */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg viewBox="0 0 220 300" className="w-48 h-64 drop-shadow-lg">
              <path
                d="M110 20 C160 40, 200 100, 195 165 C190 225, 155 275, 110 285 C65 275, 30 225, 25 165 C20 100, 60 40, 110 20Z"
                fill="none"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="3"
                strokeDasharray="10,6"
              />
            </svg>
          </div>

          {/* Camera not ready overlay */}
          {!cameraReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div className="w-full aspect-[3/4] rounded-2xl bg-gray-100 flex flex-col items-center justify-center gap-4 p-6">
          <svg viewBox="0 0 24 24" className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
          </svg>
          <div className="text-center">
            <p className="font-semibold text-gray-700">{t('capture.camera_error')}</p>
            <p className="text-sm text-gray-500 mt-1">{t('capture.camera_error_desc')}</p>
          </div>
        </div>
      )}

      {/* Hidden canvas for snapshot */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Capture button (only when camera works) */}
      {!cameraError && (
        <div className="flex justify-center mt-6">
          <button
            onClick={captureFromCamera}
            disabled={!cameraReady}
            aria-label={t('capture.capture_button')}
            className="w-20 h-20 rounded-full bg-white border-4 border-primary shadow-xl flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50"
          >
            <div className="w-14 h-14 rounded-full bg-primary" />
          </button>
        </div>
      )}

      {/* Upload from gallery */}
      <div className="flex justify-center mt-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="gallery-upload"
        />
        <label
          htmlFor="gallery-upload"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary/30 text-primary font-semibold text-sm cursor-pointer hover:bg-primary/5 transition-colors min-h-[44px]"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          {t('capture.upload_button')}
        </label>
      </div>
    </div>
  );
}
