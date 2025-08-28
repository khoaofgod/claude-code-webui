import React from 'react';
import { usePWA } from '../hooks/usePWA';

interface PWAInstallPromptProps {
  onDismiss?: () => void;
  className?: string;
}

export function PWAInstallPrompt({ onDismiss, className = '' }: PWAInstallPromptProps) {
  const { 
    canInstall, 
    isIOS, 
    isAndroid, 
    isMobile,
    showInstallPrompt, 
    dismissInstallPrompt 
  } = usePWA();

  if (!canInstall) {
    return null;
  }

  const handleInstall = async () => {
    const installed = await showInstallPrompt();
    if (!installed && onDismiss) {
      onDismiss();
    }
  };

  const handleDismiss = () => {
    dismissInstallPrompt();
    if (onDismiss) {
      onDismiss();
    }
  };

  // iOS Safari specific instructions
  if (isIOS) {
    return (
      <div className={`bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-4 rounded-xl shadow-lg backdrop-blur-md bg-opacity-90 border border-white/20 ${className}`}>
        <div className="flex items-start gap-3">
          <div className="text-2xl">📱</div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">Install Claude Code App</h3>
            <p className="text-sm opacity-90 mb-3">
              Install this app on your iPhone for a better experience
            </p>
            <div className="text-sm space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔗</span>
                <span>Tap the Share button</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">⬇️</span>
                <span>Scroll down and tap "Add to Home Screen"</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">✅</span>
                <span>Tap "Add" to install</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Dismiss install prompt"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Android and Desktop Chrome/Edge
  return (
    <div className={`bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-4 rounded-xl shadow-lg backdrop-blur-md bg-opacity-90 border border-white/20 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="text-2xl">{isMobile ? '📱' : '💻'}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">Install Claude Code App</h3>
          <p className="text-sm opacity-90 mb-3">
            {isMobile 
              ? "Install this app on your device for offline access and a native experience"
              : "Install this app on your desktop for quick access and notifications"
            }
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Install App
            </button>
            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white px-3 py-2 rounded-lg transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-white/70 hover:text-white transition-colors"
          aria-label="Dismiss install prompt"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default PWAInstallPrompt;