import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Globe2,
  PhoneCall,
  User,
  Wifi,
  WifiOff,
  Radio,
  SlidersHorizontal,
  Map,
  LayoutDashboard,
  Smartphone,
  Shield,
  Key,
  Type,
  Navigation,
  Target,
  History,
  FileText,
  Download,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguagePack } from '../data/languages';
import { SupportedLanguage, UserRole } from '../types';
import { voiceAlert } from '../services/voiceAlertService';
import { notificationService } from '../services/notificationService';
import { authService } from '../services/authService';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  langPack: LanguagePack;
  onOpenProfile: () => void;
  onOpenHelpline: () => void;
  onOpenNotifications: () => void;
  onOpenVoiceSettings: () => void;
  onOpenMap: () => void;
  onOpenAuthModal?: () => void;
  onOpenEvacuation?: () => void;
  onOpenAccuracy?: () => void;
  onOpenHistorical?: () => void;
  onOpenTechDocs?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOffline: boolean;
  setIsOffline: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  langPack,
  onOpenProfile,
  onOpenHelpline,
  onOpenNotifications,
  onOpenVoiceSettings,
  onOpenMap,
  onOpenAuthModal,
  onOpenEvacuation,
  onOpenAccuracy,
  onOpenHistorical,
  onOpenTechDocs,
  activeTab,
  setActiveTab,
  isOffline,
  setIsOffline,
}) => {
  const [voiceActive, setVoiceActive] = useState(true);
  const [notifActive, setNotifActive] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('CIVILIAN');
  const [fontSize, setFontSize] = useState<'compact' | 'normal' | 'large' | 'xlarge'>('normal');

  useEffect(() => {
    // Check stored font size or default based on screen width
    const storedFont = localStorage.getItem('drishti_font_size') as any;
    if (storedFont && ['compact', 'normal', 'large', 'xlarge'].includes(storedFont)) {
      setFontSize(storedFont);
      document.documentElement.setAttribute('data-font-size', storedFont);
    } else {
      // Auto-detect optimal device font size
      if (window.innerWidth < 640) {
        document.documentElement.setAttribute('data-font-size', 'compact');
        setFontSize('compact');
      } else {
        document.documentElement.setAttribute('data-font-size', 'normal');
        setFontSize('normal');
      }
    }

    const session = authService.getSession();
    if (session) setCurrentRole(session.role);

    const unsubAuth = authService.subscribeSession((s) => {
      setCurrentRole(s ? s.role : 'CIVILIAN');
    });

    return () => unsubAuth();
  }, []);

  const handleSetFontSize = (size: 'compact' | 'normal' | 'large' | 'xlarge') => {
    setFontSize(size);
    document.documentElement.setAttribute('data-font-size', size);
    localStorage.setItem('drishti_font_size', size);
    setFontDropdownOpen(false);
  };

  useEffect(() => {
    setVoiceActive(voiceAlert.isVoiceEnabled());
    setNotifActive(notificationService.isEnabled());

    const unsub = notificationService.subscribe(() => {
      setUnreadCount(notificationService.getUnreadCount());
      setNotifActive(notificationService.isEnabled());
    });
    return () => unsub();
  }, []);

  const toggleVoice = () => {
    const next = !voiceActive;
    voiceAlert.setEnabled(next);
    setVoiceActive(next);
  };

  const toggleNotification = () => {
    const next = !notifActive;
    notificationService.setEnabled(next);
    setNotifActive(next);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner for Emergency / Connectivity Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-3 py-1.5 text-xs text-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
          </span>
          <span className="font-extrabold tracking-wide text-rose-700 uppercase flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-rose-600" />
            DRISHTI Multi-Sensor Early Warning Active
          </span>
          <span className="text-slate-300 hidden md:inline">|</span>
          <span className="text-slate-600 hidden md:inline font-medium">
            NASA GPM / SMAP • IMD Hydromet • Sentinel-1 InSAR • ISRO Bhuvan
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Offline Mode Indicator & Toggle */}
          <button
            id="btn-toggle-offline"
            onClick={() => setIsOffline((prev) => !prev)}
            title="Click to simulate offline / reconnect state"
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 border transition-colors cursor-pointer ${
              isOffline
                ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                : 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
            }`}
          >
            {isOffline ? <WifiOff className="w-3 h-3 text-amber-700" /> : <Wifi className="w-3 h-3 text-emerald-700" />}
            <span>{isOffline ? 'OFFLINE ACTIVE' : 'ONLINE (LIVE)'}</span>
          </button>

          {/* Quick Helpline trigger */}
          <button
            id="btn-nav-emergency-helpline"
            onClick={onOpenHelpline}
            className="flex items-center gap-1 text-rose-700 hover:text-rose-800 font-extrabold bg-rose-50 hover:bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300 transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3 h-3 text-rose-600" />
            <span>SDMA 1070 / NDRF 1078</span>
          </button>

          {/* Quick PDF & System Tech Spec trigger */}
          {onOpenTechDocs && (
            <button
              id="btn-top-tech-docs"
              onClick={onOpenTechDocs}
              className="hidden sm:flex items-center gap-1.5 text-slate-700 hover:text-slate-950 font-extrabold bg-white hover:bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-300 shadow-xs transition-colors cursor-pointer"
              title="View Architecture Specification & Save as PDF"
            >
              <FileText className="w-3 h-3 text-rose-600" />
              <span>System PDF &amp; Tech Spec</span>
            </button>
          )}

          {/* 1-Click Direct Download PDF Link */}
          <a
            id="btn-top-direct-pdf-dl"
            href="/DRISHTI_NER_Architecture_Specification.pdf"
            download="DRISHTI_NER_Architecture_Specification.pdf"
            className="flex items-center gap-1 text-white font-black bg-rose-600 hover:bg-rose-500 px-2.5 py-0.5 rounded-full shadow-xs transition-colors cursor-pointer text-[11px]"
            title="Direct Download: DRISHTI_NER_Architecture_Specification.pdf"
          >
            <Download className="w-3 h-3 text-white" />
            <span>Download PDF</span>
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Regional Identity: DRISHTI */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 via-rose-700 to-amber-600 p-0.5 shadow-md shadow-rose-600/20 flex items-center justify-center text-white font-black text-xl tracking-tighter">
            <span>D</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight flex items-center gap-1.5">
                <span>DRISHTI</span>
              </h1>
              <span className="bg-rose-100 text-rose-800 text-[10.5px] font-black px-2 py-0.5 rounded-full border border-rose-200 uppercase tracking-wide">
                NER Early Warning
              </span>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-200 hidden lg:inline">
                QGIS v3.34
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Disaster Risk Intelligence &amp; Slope Hazard Telemetry (8 North Eastern States)
            </p>
          </div>
        </div>

        {/* Action Controls: Install App Button + View Map Button */}
        <div className="flex items-center gap-2">
          {/* Mobile Install App Button */}
          <PWAInstallButton variant="nav" />

          {/* Dedicated System Tech Spec & PDF Button */}
          {onOpenTechDocs && (
            <button
              id="btn-nav-tech-docs"
              onClick={onOpenTechDocs}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs border border-slate-300 shadow-xs active:scale-95 transition-all cursor-pointer min-h-[36px]"
              title="View System Architecture Specification"
            >
              <FileText className="w-4 h-4 text-rose-600" />
              <span>Tech Spec</span>
            </button>
          )}

          {/* Direct Download PDF Button */}
          <a
            id="btn-nav-download-pdf"
            href="/DRISHTI_NER_Architecture_Specification.pdf"
            download="DRISHTI_NER_Architecture_Specification.pdf"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer min-h-[36px]"
            title="Directly download DRISHTI_NER_Architecture_Specification.pdf"
          >
            <Download className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </a>

          {/* Dedicated Separate Map Button with Map Icon */}
          <button
            id="btn-nav-open-map"
            onClick={onOpenMap}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all border border-rose-300/30 cursor-pointer min-h-[36px]"
            title="Click to view interactive QGIS Landslide Map properly"
          >
            <Map className="w-4 h-4 text-rose-100" />
            <span className="tracking-wide">View Map</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
          </button>
        </div>

        {/* View Tabs (Desktop and Tablets) */}
        <nav className="hidden sm:flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold overflow-x-auto">
          <button
            id="tab-dashboard-view"
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-rose-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            id="tab-telemetry-view"
            onClick={() => setActiveTab('telemetry')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'telemetry'
                ? 'bg-rose-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            Data Telemetry
          </button>
          <button
            id="tab-roads-view"
            onClick={() => setActiveTab('roads')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'roads'
                ? 'bg-rose-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            Roads &amp; Highways
          </button>
          <button
            id="tab-gallery-view"
            onClick={() => setActiveTab('gallery')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-rose-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            Community Photos
          </button>
          <button
            id="tab-report-view"
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'report'
                ? 'bg-amber-600 text-white shadow-xs font-bold'
                : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            + Report Incident
          </button>
        </nav>

        {/* Right Controls: Voice Alert, Notifications, Language Picker, Profile */}
        <div className="flex items-center gap-2">
          {/* Voice Alert Quick Toggle & Settings */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5">
            <button
              id="btn-toggle-voice"
              onClick={toggleVoice}
              title={voiceActive ? 'Voice Alert is ON (Click to Mute)' : 'Voice Alert is MUTED (Click to Turn On)'}
              className={`p-1.5 rounded-lg flex items-center gap-1 text-xs transition-colors cursor-pointer ${
                voiceActive
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
              }`}
            >
              {voiceActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden xl:inline">{voiceActive ? 'Voice Alert' : 'Voice Muted'}</span>
            </button>
            <button
              id="btn-voice-settings"
              onClick={onOpenVoiceSettings}
              title="Voice Alert Settings & Audio Test"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Notification Quick Toggle & Center Bell */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5">
            <button
              id="btn-toggle-notification"
              onClick={toggleNotification}
              title={notifActive ? 'Notifications are ON' : 'Notifications are MUTED'}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                notifActive
                  ? 'text-emerald-700 hover:bg-slate-200'
                  : 'text-slate-400 hover:bg-slate-200 line-through'
              }`}
            >
              {notifActive ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </button>
            <button
              id="btn-open-notifications"
              onClick={onOpenNotifications}
              title="View Notification Center"
              className="relative p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* 28-Languages Selector Dropdown */}
          <div className="relative">
            <button
              id="btn-language-selector"
              onClick={() => setLangDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <Globe2 className="w-3.5 h-3.5 text-amber-600" />
              <span>{currentLanguage}</span>
            </button>

            {langDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 divide-y divide-slate-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-2 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Select Language (28 NER Languages)
                </div>
                <div className="py-1">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.name);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        currentLanguage === lang.name
                          ? 'bg-rose-600 text-white font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <div className="font-semibold flex items-center gap-1.5">
                          <span>{lang.name}</span>
                          <span className="text-[10px] opacity-75 font-normal">({lang.nativeName})</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[190px]">
                          {lang.states.join(', ')}
                        </div>
                      </div>
                      {currentLanguage === lang.name && <span className="text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Font Size Scaler */}
          <div className="relative">
            <button
              id="btn-font-size-toggle"
              onClick={() => setFontDropdownOpen((prev) => !prev)}
              title={`Adjust Font Size for Device (${fontSize})`}
              className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1.5 rounded-xl border border-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <Type className="w-3.5 h-3.5 text-slate-600" />
              <span className="capitalize hidden md:inline text-[11px]">{fontSize}</span>
            </button>

            {fontDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 space-y-1"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Device Font Scaling
                </div>
                <button
                  onClick={() => handleSetFontSize('compact')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    fontSize === 'compact' ? 'bg-rose-600 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>Compact (Mobile)</span>
                  <span className="text-[10px] opacity-75">14px</span>
                </button>
                <button
                  onClick={() => handleSetFontSize('normal')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    fontSize === 'normal' ? 'bg-rose-600 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>Standard (Default)</span>
                  <span className="text-[10px] opacity-75">15.5px</span>
                </button>
                <button
                  onClick={() => handleSetFontSize('large')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    fontSize === 'large' ? 'bg-rose-600 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>Large (Accessible)</span>
                  <span className="text-[10px] opacity-75">17.5px</span>
                </button>
                <button
                  onClick={() => handleSetFontSize('xlarge')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    fontSize === 'xlarge' ? 'bg-rose-600 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>Extra Large (Field)</span>
                  <span className="text-[10px] opacity-75">19.5px</span>
                </button>
              </div>
            )}
          </div>

          {/* Access & Security Gatekeeper / Role Button */}
          {onOpenAuthModal && (
            <button
              id="btn-nav-auth-role"
              onClick={onOpenAuthModal}
              title={`Security Role: ${currentRole}. Click to authenticate with Passkey or switch access.`}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                currentRole === 'DEVELOPER'
                  ? 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100 shadow-xs'
                  : currentRole === 'ADMINISTRATOR'
                  ? 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                  : currentRole === 'OFFICIAL'
                  ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {currentRole === 'DEVELOPER' ? (
                <Key className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
              ) : (
                <Shield className="w-3.5 h-3.5 text-slate-600" />
              )}
              <span className="hidden sm:inline">
                {currentRole === 'DEVELOPER' ? 'Dev SPAIN07AM' : currentRole.charAt(0) + currentRole.slice(1).toLowerCase()}
              </span>
            </button>
          )}

          {/* Citizen Profile Button */}
          <button
            id="btn-open-citizen-profile"
            onClick={onOpenProfile}
            title="Citizen Profile & Registered Location"
            className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
};
