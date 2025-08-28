import React, { useState, useEffect } from 'react';
import { usePWA } from '../hooks/usePWA';

export function PWAInstallBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { 
    canInstall, 
    isIOS, 
    isMobile,
    showInstallPrompt 
  } = usePWA();

  useEffect(() => {
    const dismissedKey = 'pwa-install-dismissed';
    const dismissed = localStorage.getItem(dismissedKey);
    
    if (!dismissed && canInstall) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000); // Show after 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, [canInstall]);

  const handleInstall = async () => {
    const installed = await showInstallPrompt();
    if (installed) {
      setIsVisible(false);
    }
  };

  const handleDismiss = (permanent: boolean = false) => {
    setIsVisible(false);
    setIsDismissed(true);
    
    if (permanent) {
      localStorage.setItem('pwa-install-dismissed', 'true');
    }
  };

  if (!isVisible || isDismissed || !canInstall) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in-top">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl shadow-lg backdrop-blur-md bg-opacity-95 border border-white/20 max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <div className="text-xl">{isMobile ? '📱' : '💻'}</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm">Install Claude Code App</h4>
            <p className="text-xs opacity-90 truncate">
              {isIOS 
                ? "Add to Home Screen for better experience" 
                : "Install for offline access and notifications"
              }
            </p>
          </div>
          <div className="flex items-center gap-1">
            {!isIOS && (
              <button
                onClick={handleInstall}
                className="bg-white text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
              >
                Install
              </button>
            )}
            <button
              onClick={() => handleDismiss(false)}
              className="text-white/70 hover:text-white p-1 transition-colors"
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {isIOS && (
          <div className="mt-2 pt-2 border-t border-white/20">
            <div className="flex items-center gap-2 text-xs opacity-90">
              <span>🔗 Share</span>
              <span>→</span>
              <span>⬇️ Add to Home Screen</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PWAInstallBanner;