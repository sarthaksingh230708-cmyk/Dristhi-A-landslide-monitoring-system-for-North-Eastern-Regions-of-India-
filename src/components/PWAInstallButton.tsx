import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle, Share, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'nav' | 'hero' | 'floating' | 'banner';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'nav',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already installed, hide prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 5000);
      }
    } else {
      // If browser doesn't expose beforeinstallprompt directly (e.g. iOS Safari, Firefox, or already prompted), show helpful guide
      setShowGuideModal(true);
    }
  };

  // Nav bar compact button
  if (variant === 'nav') {
    return (
      <>
        <button
          id="btn-nav-install-pwa"
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-900/20 active:scale-95 transition-all cursor-pointer border border-emerald-400/40 ${className}`}
          title="Install DRISHTI App on your mobile device"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-100" />
          <span className="hidden sm:inline">Install Mobile App</span>
          <span className="sm:hidden">Install</span>
          <span className="flex h-1.5 w-1.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-300"></span>
          </span>
        </button>

        {showGuideModal && <InstallGuideModal isIOS={isIOS} onClose={() => setShowGuideModal(false)} />}
      </>
    );
  }

  // Hero Card button (Dashboard hero)
  if (variant === 'hero') {
    return (
      <>
        <button
          id="btn-hero-install-pwa"
          onClick={handleInstallClick}
          className={`w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-xl shadow-emerald-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5 border border-emerald-400/30 cursor-pointer ${className}`}
        >
          <Smartphone className="w-5 h-5 text-emerald-200" />
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-100">PWA Mobile App</div>
            <div className="text-xs sm:text-sm font-extrabold text-white">Install on Mobile</div>
          </div>
        </button>

        {showGuideModal && <InstallGuideModal isIOS={isIOS} onClose={() => setShowGuideModal(false)} />}
      </>
    );
  }

  // Banner style
  return (
    <>
      <div
        id="banner-install-pwa"
        className={`bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 text-slate-800 p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <span>Install DRISHTI on Your Phone</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                OFFLINE READY
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Access emergency sirens, road statuses, and disaster maps instantly from your mobile home screen.
            </p>
          </div>
        </div>

        <button
          onClick={handleInstallClick}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all flex-shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Install App Now</span>
        </button>
      </div>

      {showGuideModal && <InstallGuideModal isIOS={isIOS} onClose={() => setShowGuideModal(false)} />}
    </>
  );
};

// Modal providing step-by-step installation instructions for Android, iPhone/iPad, and desktop browsers
function InstallGuideModal({ isIOS, onClose }: { isIOS: boolean; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 relative text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Install DRISHTI App</h3>
            <p className="text-xs text-slate-500">Add to your device home screen for instant alerts</p>
          </div>
        </div>

        {isIOS ? (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
              <Share className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-bold mb-1">Step 1: Open Safari Share Menu</strong>
                Tap the <strong className="text-slate-900">Share</strong> icon at the bottom of your Safari screen.
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
              <PlusSquare className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-bold mb-1">Step 2: Add to Home Screen</strong>
                Scroll down the share sheet options and tap <strong className="text-slate-900">&quot;Add to Home Screen&quot;</strong>.
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-bold mb-1">Step 3: Launch from Home Screen</strong>
                Tap <strong className="text-slate-900">Add</strong> in the top right. DRISHTI will appear as a standalone app with offline sirens!
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
              <Download className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-bold mb-1">Quick Mobile Install (Android / Chrome)</strong>
                Tap the <strong>three vertical dots (⋮)</strong> at the top right of your browser, then select <strong className="text-emerald-800">&quot;Install app&quot;</strong> or <strong className="text-emerald-800">&quot;Add to Home screen&quot;</strong>.
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-start gap-2.5">
              <Smartphone className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-bold mb-1">Why install DRISHTI?</strong>
                <ul className="list-disc pl-4 space-y-1 mt-1 text-slate-600">
                  <li>Full-screen offline access without browser address bars</li>
                  <li>Instant audio voice sirens for landslide warnings</li>
                  <li>One-tap SOS SMS and emergency helplines</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-5 w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
