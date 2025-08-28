import { useState, useEffect } from 'react';

export interface PWAInstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface UsePWAReturn {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  canInstall: boolean;
  installPrompt: PWAInstallPrompt | null;
  showInstallPrompt: () => Promise<boolean>;
  dismissInstallPrompt: () => void;
  isServiceWorkerReady: boolean;
}

export function usePWA(): UsePWAReturn {
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null);
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);
  
  // Detect device type
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isMobile = isIOS || isAndroid || /Mobile/.test(navigator.userAgent);
  
  // Detect if app is running in standalone mode (already installed)
  const isStandalone = 
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://');
  
  // Check if PWA is installable
  const isInstallable = installPrompt !== null || (isIOS && !isStandalone);
  
  // Check if already installed
  const isInstalled = isStandalone;
  
  // Can install if installable and not installed
  const canInstall = isInstallable && !isInstalled;

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          setIsServiceWorkerReady(true);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Listen for beforeinstallprompt event (Chrome/Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as PWAInstallPrompt);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setInstallPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const showInstallPrompt = async (): Promise<boolean> => {
    if (!installPrompt) {
      return false;
    }

    try {
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;
      
      if (result.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setInstallPrompt(null);
        return true;
      } else {
        console.log('User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
      return false;
    }
  };

  const dismissInstallPrompt = () => {
    setInstallPrompt(null);
  };

  return {
    isInstallable,
    isInstalled,
    isStandalone,
    isMobile,
    isIOS,
    isAndroid,
    canInstall,
    installPrompt,
    showInstallPrompt,
    dismissInstallPrompt,
    isServiceWorkerReady,
  };
}