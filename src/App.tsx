import React, { useState, useEffect } from 'react';
import {
  Map as MapIcon,
  Activity,
  Car,
  Camera,
  PlusCircle,
  PhoneCall,
  Wifi,
  WifiOff,
  AlertTriangle,
  Info,
  Shield,
  Layers,
  Sparkles,
  LayoutDashboard,
  Smartphone,
  FileText,
  Download,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { MyLocationAlertBanner } from './components/MyLocationAlertBanner';
import { DashboardOverview } from './components/DashboardOverview';
import { MapModal } from './components/MapModal';
import { TelemetryPanel } from './components/TelemetryPanel';
import { RoadConnectivityBoard } from './components/RoadConnectivityBoard';
import { PublicPhotoFeed } from './components/PublicPhotoFeed';
import { CitizenIncidentReporting } from './components/CitizenIncidentReporting';
import { CitizenProfileModal } from './components/CitizenProfileModal';
import { HelplineDirectory } from './components/HelplineDirectory';
import { VoiceAlertModal } from './components/VoiceAlertModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { AuthGatekeeperModal } from './components/AuthGatekeeperModal';
import { EvacuationRouteTrajectoryModal } from './components/EvacuationRouteTrajectoryModal';
import { PredictionAccuracyFeedbackModal } from './components/PredictionAccuracyFeedbackModal';
import { HistoricalAnalysisMap } from './components/HistoricalAnalysisMap';
import { TechnicalDocumentationModal } from './components/TechnicalDocumentationModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { citizenService } from './services/citizenService';
import { voiceAlert } from './services/voiceAlertService';
import { notificationService } from './services/notificationService';
import { CitizenProfile, SupportedLanguage, HazardZone } from './types';
import { TRANSLATIONS, getLanguagePack } from './data/languages';
import { NER_HAZARD_ZONES } from './data/nerData';

export default function App() {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('English');
  const [profile, setProfile] = useState<CitizenProfile>(citizenService.getProfile());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'telemetry' | 'roads' | 'gallery' | 'report'>('dashboard');

  // Modals state
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isHelplineModalOpen, setIsHelplineModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEvacuationModalOpen, setIsEvacuationModalOpen] = useState(false);
  const [isAccuracyModalOpen, setIsAccuracyModalOpen] = useState(false);
  const [isHistoricalModalOpen, setIsHistoricalModalOpen] = useState(false);
  const [isTechDocsModalOpen, setIsTechDocsModalOpen] = useState(false);
  const [mapInitialState, setMapInitialState] = useState<string>('ALL');

  const handleOpenMapWithState = (stateName?: string) => {
    setMapInitialState(stateName || 'ALL');
    setIsMapModalOpen(true);
  };

  // Network online/offline state
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Selected Zone for telemetry inspection
  const [inspectedZone, setInspectedZone] = useState<HazardZone | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubProfile = citizenService.subscribeProfile((updatedProfile) => {
      setProfile(updatedProfile);
      if (updatedProfile.preferredLanguage) {
        setCurrentLang(updatedProfile.preferredLanguage as SupportedLanguage);
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubProfile();
    };
  }, []);

  const langPack = getLanguagePack(currentLang);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS['English'];

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLang(lang);
    citizenService.updateProfile({ preferredLanguage: lang });
  };

  const handleZoneSelectFromMap = (zone: HazardZone) => {
    setInspectedZone(zone);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-rose-500 selection:text-white pb-20 sm:pb-12">
      {/* Top Main Navigation Bar */}
      <Navbar
        currentLanguage={currentLang}
        onLanguageChange={handleLanguageChange}
        langPack={langPack}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenHelpline={() => setIsHelplineModalOpen(true)}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        onOpenVoiceSettings={() => setIsVoiceModalOpen(true)}
        onOpenMap={() => setIsMapModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenEvacuation={() => setIsEvacuationModalOpen(true)}
        onOpenAccuracy={() => setIsAccuracyModalOpen(true)}
        onOpenHistorical={() => setIsHistoricalModalOpen(true)}
        onOpenTechDocs={() => setIsTechDocsModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={(t) => setActiveTab(t as any)}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 space-y-6">
        {/* Offline Banner alert if internet is disconnected */}
        {isOffline && (
          <div className="bg-amber-50 border-2 border-amber-300 text-amber-950 px-4 py-3 rounded-2xl flex items-center justify-between text-xs animate-in fade-in shadow-xs">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Offline Operation Mode Active:</strong> All voice sirens, emergency contacts, offline notifications, and local cached data remain 100% accessible without internet.
              </span>
            </div>
            <button
              onClick={() => setIsHelplineModalOpen(true)}
              className="bg-amber-600 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-amber-700 ml-2 flex-shrink-0 cursor-pointer"
            >
              Offline SOS SMS
            </button>
          </div>
        )}

        {/* User-Specific Registered Location Alert Banner */}
        <MyLocationAlertBanner
          profile={profile}
          langPack={langPack}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenHelpline={() => setIsHelplineModalOpen(true)}
        />

        {/* Tab Navigation Controls (Clean Light Styling) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              id="tab-btn-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>DRISHTI Dashboard</span>
            </button>

            {/* Dedicated Separate Map Button in Tabs Bar */}
            <button
              id="tab-btn-open-map-proper"
              onClick={() => setIsMapModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:from-purple-500 hover:via-rose-500 hover:to-amber-500 text-white shadow-md shadow-rose-600/20 hover:scale-[1.02] active:scale-95 transition-all border border-rose-300/30 cursor-pointer"
              title="Click to view full interactive QGIS Landslide Map properly"
            >
              <MapIcon className="w-4 h-4 text-emerald-200 animate-pulse" />
              <span>Open QGIS Map</span>
              <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
            </button>

            <button
              id="tab-btn-telemetry"
              onClick={() => setActiveTab('telemetry')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'telemetry'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>NASA &amp; IMD Telemetry</span>
            </button>

            <button
              id="tab-btn-roads"
              onClick={() => setActiveTab('roads')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'roads'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>{t.roadConnectivity}</span>
            </button>

            <button
              id="tab-btn-gallery"
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{t.publicGallery}</span>
            </button>

            <button
              id="tab-btn-report"
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'report'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.reportIncident}</span>
            </button>
          </div>

          <button
            id="tab-btn-quick-sos-help"
            onClick={() => setIsHelplineModalOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-black transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
            <span>Emergency Contacts</span>
          </button>
        </div>

        {/* Tab 1: DRISHTI Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <DashboardOverview
            onOpenMap={handleOpenMapWithState}
            profile={profile}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenHelpline={() => setIsHelplineModalOpen(true)}
            onOpenEvacuation={() => setIsEvacuationModalOpen(true)}
            onOpenAccuracy={() => setIsAccuracyModalOpen(true)}
            onOpenHistorical={() => setIsHistoricalModalOpen(true)}
            onOpenTechDocs={() => setIsTechDocsModalOpen(true)}
          />
        )}

        {/* Tab 2: NASA, IMD, Sentinel-1 InSAR Scientific Telemetry */}
        {activeTab === 'telemetry' && <TelemetryPanel />}

        {/* Tab 3: Vital Road & Lifeline Highway Status Board */}
        {activeTab === 'roads' && <RoadConnectivityBoard />}

        {/* Tab 4: Citizen Community Photo Feed & Field Reports */}
        {activeTab === 'gallery' && (
          <PublicPhotoFeed onNavigateReport={() => setActiveTab('report')} />
        )}

        {/* Tab 5: Citizen Incident Reporting & Photo Upload Form */}
        {activeTab === 'report' && (
          <div className="space-y-4">
            <CitizenIncidentReporting
              profile={profile}
              onReportSubmitted={() => setActiveTab('gallery')}
              isOffline={isOffline}
            />
          </div>
        )}
      </main>

      {/* Desktop / Tablet Informational Footer */}
      <footer className="hidden sm:block mt-auto bg-slate-50 border-t border-slate-200 px-4 py-3.5 text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-black text-slate-900">
              <Shield className="w-4 h-4 text-rose-600" />
              DRISHTI • NER Landslide Early Warning
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] text-slate-600">
              Assam • Arunachal Pradesh • Meghalaya • Manipur • Mizoram • Nagaland • Tripura • Sikkim
            </span>
          </div>

          <div className="flex items-center gap-3">
            <PWAInstallButton variant="nav" />
            <button
              id="btn-footer-tech-docs"
              onClick={() => setIsTechDocsModalOpen(true)}
              className="bg-white hover:bg-slate-100 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border border-slate-300 shadow-xs transition-colors cursor-pointer"
              title="View Architecture Specification"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              <span>Tech Spec</span>
            </button>
            <a
              id="btn-footer-download-pdf"
              href="/DRISHTI_NER_Architecture_Specification.pdf"
              download="DRISHTI_NER_Architecture_Specification.pdf"
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title="Direct Download: DRISHTI_NER_Architecture_Specification.pdf"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Download PDF</span>
            </a>
            <button
              id="btn-footer-helpline"
              onClick={() => setIsHelplineModalOpen(true)}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>24x7 Helplines (1070 / 112)</span>
            </button>
          </div>
        </div>
      </footer>

      {/* DEDICATED MOBILE BOTTOM NAVIGATION BAR (Fixed at bottom for easy thumb access on mobile) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-bottom">
        {/* Mobile Tab: Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[56px] min-h-[48px] transition-all cursor-pointer ${
            activeTab === 'dashboard' ? 'text-rose-600 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-bold">DRISHTI</span>
        </button>

        {/* Mobile Tab: Open Map (Center Highlight) */}
        <button
          onClick={() => setIsMapModalOpen(true)}
          className="flex flex-col items-center justify-center -mt-4 p-2 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-600/30 min-w-[56px] min-h-[52px] border-2 border-white cursor-pointer active:scale-95 transition-all"
        >
          <MapIcon className="w-5 h-5 animate-pulse" />
          <span className="text-[10px] font-black mt-0.5">Map</span>
        </button>

        {/* Mobile Tab: Telemetry */}
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[56px] min-h-[48px] transition-all cursor-pointer ${
            activeTab === 'telemetry' ? 'text-rose-600 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-bold">Telemetry</span>
        </button>

        {/* Mobile Tab: Roads */}
        <button
          onClick={() => setActiveTab('roads')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[56px] min-h-[48px] transition-all cursor-pointer ${
            activeTab === 'roads' ? 'text-rose-600 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Car className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-bold">Roads</span>
        </button>

        {/* Mobile Tab: Report */}
        <button
          onClick={() => setActiveTab('report')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[56px] min-h-[48px] transition-all cursor-pointer ${
            activeTab === 'report' ? 'text-amber-700 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Camera className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-bold">Report</span>
        </button>
      </nav>

      {/* Floating Separate Map Icon Button (On desktop/tablet) */}
      <button
        id="btn-floating-view-map"
        onClick={() => handleOpenMapWithState('ALL')}
        className="hidden sm:flex fixed bottom-6 right-6 z-40 bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 hover:from-rose-500 hover:via-rose-600 hover:to-amber-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all items-center gap-3 border-2 border-white cursor-pointer"
        title="Open Interactive QGIS Landslide Map"
      >
        <div className="relative">
          <MapIcon className="w-6 h-6 text-white group-hover:rotate-6 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
        </div>
        <div className="text-left">
          <div className="text-[10px] uppercase font-black tracking-widest text-rose-200">QGIS GIS Map</div>
          <div className="text-xs font-extrabold text-white">View Map Properly</div>
        </div>
      </button>

      {/* Dedicated Full-Screen Interactive QGIS Map Modal */}
      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        profile={profile}
        onSelectZone={handleZoneSelectFromMap}
        initialState={mapInitialState}
      />

      {/* Modals */}
      {isProfileModalOpen && (
        <CitizenProfileModal
          onClose={() => setIsProfileModalOpen(false)}
          onLanguageChange={handleLanguageChange}
        />
      )}

      {isHelplineModalOpen && (
        <HelplineDirectory
          onClose={() => setIsHelplineModalOpen(false)}
          profile={profile}
        />
      )}

      {isVoiceModalOpen && (
        <VoiceAlertModal
          onClose={() => setIsVoiceModalOpen(false)}
          currentLanguage={currentLang}
        />
      )}

      {isNotificationModalOpen && (
        <NotificationCenterModal
          onClose={() => setIsNotificationModalOpen(false)}
          isOffline={isOffline}
        />
      )}

      {/* Security RBAC & Developer Gatekeeper Modal */}
      <AuthGatekeeperModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Google Maps Enabled Evacuation Route & Trajectory Modal */}
      <EvacuationRouteTrajectoryModal
        isOpen={isEvacuationModalOpen}
        onClose={() => setIsEvacuationModalOpen(false)}
        defaultZoneId={inspectedZone?.id}
      />

      {/* Model Prediction Transparency, Accuracy & Feedback Modal */}
      <PredictionAccuracyFeedbackModal
        isOpen={isAccuracyModalOpen}
        onClose={() => setIsAccuracyModalOpen(false)}
        currentZone={inspectedZone || undefined}
      />

      {/* Historical Landslide Analysis & Thematic Map Modal */}
      <HistoricalAnalysisMap
        isOpen={isHistoricalModalOpen}
        onClose={() => setIsHistoricalModalOpen(false)}
        onSelectZone={(z: any) => {
          setInspectedZone(z);
          setIsMapModalOpen(true);
        }}
      />

      {/* System Architecture & Technical Specification PDF Modal */}
      <TechnicalDocumentationModal
        isOpen={isTechDocsModalOpen}
        onClose={() => setIsTechDocsModalOpen(false)}
      />
    </div>
  );
}
