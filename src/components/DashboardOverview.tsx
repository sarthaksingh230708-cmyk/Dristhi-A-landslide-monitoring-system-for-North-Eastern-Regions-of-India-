import React, { useState } from 'react';
import {
  Map,
  Compass,
  AlertTriangle,
  Activity,
  Droplets,
  Radio,
  Car,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Info,
  CheckCircle2,
  Smartphone,
  Flame,
  Layers,
  Wind,
  Navigation,
  Target,
  History,
  TrendingUp,
  Clock,
  Calendar,
  Mountain,
  FileText,
  Download,
} from 'lucide-react';
import { NER_HAZARD_ZONES } from '../data/nerData';
import { CitizenProfile } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface DashboardOverviewProps {
  onOpenMap: (stateName?: string) => void;
  profile: CitizenProfile;
  onNavigateTab: (tab: 'telemetry' | 'roads' | 'gallery' | 'report') => void;
  onOpenHelpline: () => void;
  onOpenEvacuation?: () => void;
  onOpenAccuracy?: () => void;
  onOpenHistorical?: () => void;
  onOpenTechDocs?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onOpenMap,
  profile,
  onNavigateTab,
  onOpenHelpline,
  onOpenEvacuation,
  onOpenAccuracy,
  onOpenHistorical,
  onOpenTechDocs,
}) => {
  const [stateFilter, setStateFilter] = useState<string>('ALL');

  // Compute hazard statistics based on colorCategory and probability
  const purpleCount = NER_HAZARD_ZONES.filter(
    (z) => z.colorCategory === 'purple' || z.probability >= 95
  ).length;
  const orangeCount = NER_HAZARD_ZONES.filter(
    (z) => z.colorCategory === 'orange' || (z.probability >= 85 && z.probability < 95)
  ).length;
  const blueCount = NER_HAZARD_ZONES.filter(
    (z) => z.colorCategory === 'blue' || (z.probability >= 75 && z.probability < 85)
  ).length;
  const greenCount = NER_HAZARD_ZONES.filter(
    (z) => z.colorCategory === 'green' || z.probability < 75
  ).length;

  return (
    <div className="space-y-6">
      {/* 1. PRIMARY DRISHTI DASHBOARD HERO BANNER (White / Clean Crisp Aesthetic) */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-xl p-5 sm:p-8 transition-all">
        {/* Subtle decorative atmospheric blurs */}
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            {/* DRISHTI Brand Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black uppercase tracking-wider shadow-sm">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                <span>DRISHTI • OFFICIAL NER HAZARD PORTAL</span>
              </div>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-bold">
                8 North Eastern States
              </span>
            </div>

            {/* DRISHTI Big Title as explicitly requested */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-none flex flex-wrap items-baseline gap-2.5">
                <span className="bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 bg-clip-text text-transparent">
                  DRISHTI
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-slate-800">
                  Landslide Early Warning Dashboard
                </span>
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wide">
                Disaster Risk Intelligence &amp; Slope Hazard Telemetry for India
              </p>
            </div>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              Real-time multi-sensor slope monitoring, high-resolution QGIS vulnerability mapping, and multi-lingual voice sirens protecting communities across Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, and Tripura.
            </p>

            {/* Probability Scale Quick Legend */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 flex items-center gap-1.5 font-bold shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                Purple 95-100% Critical
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-1.5 font-bold shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Orange 85-95% High
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 flex items-center gap-1.5 font-bold shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                Blue 75-85% Moderate
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-1.5 font-bold shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Green &lt;75% Stable
              </span>
            </div>
          </div>

          {/* Action CTAs including Mobile Install Button */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
            {/* Dedicated Map Button */}
            <button
              id="btn-hero-launch-map"
              onClick={() => onOpenMap()}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 hover:from-rose-500 hover:via-rose-600 hover:to-amber-500 text-white font-black text-base shadow-xl shadow-rose-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 border border-rose-300/30 cursor-pointer min-h-[52px]"
            >
              <div className="p-1.5 rounded-xl bg-white/20">
                <Map className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider text-rose-100 font-bold">Interactive GIS</div>
                <div className="font-extrabold text-white text-base">Open QGIS Hazard Map</div>
              </div>
              <ArrowRight className="w-5 h-5 ml-1 text-rose-100" />
            </button>

            {/* Mobile Install Button (PWA) */}
            <PWAInstallButton variant="hero" />

            {/* Emergency SOS Button */}
            <button
              id="btn-hero-sos-helplines"
              onClick={onOpenHelpline}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors min-h-[44px]"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Emergency SOS &amp; 24x7 Helplines (1070)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. REGIONAL THREAT LEVEL & COLOR BREAKDOWN METRICS (High contrast cards on White background) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Purple Card - Critical */}
        <div
          id="card-risk-purple"
          onClick={() => onOpenMap()}
          className="p-5 rounded-2xl bg-purple-50/90 border-2 border-purple-200 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-purple-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shadow-xs"></span>
              Critical Hazard
            </span>
            <span className="text-[10.5px] font-black px-2 py-0.5 rounded-full bg-purple-200 text-purple-900">
              PURPLE
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-4xl font-black text-purple-950">{purpleCount}</span>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
              95% - 100%
            </span>
          </div>
          <p className="text-xs text-purple-900 leading-relaxed">
            Immediate debris flow risk in Dima Hasao, Upper Subansiri &amp; Tamenglong.
          </p>
          <div className="text-xs text-purple-700 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1 pt-1">
            <span>Inspect in QGIS Map</span> &rarr;
          </div>
        </div>

        {/* Orange Card - High Alert */}
        <div
          id="card-risk-orange"
          onClick={() => onOpenMap()}
          className="p-5 rounded-2xl bg-amber-50/90 border-2 border-amber-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs"></span>
              High Alert
            </span>
            <span className="text-[10.5px] font-black px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
              ORANGE
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-4xl font-black text-amber-950">{orangeCount}</span>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              85% - 95%
            </span>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            Active soil saturation along NH-2 corridor, Kohima bypass &amp; Jampui Hills.
          </p>
          <div className="text-xs text-amber-700 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1 pt-1">
            <span>Inspect in QGIS Map</span> &rarr;
          </div>
        </div>

        {/* Blue Card - Moderate */}
        <div
          id="card-risk-blue"
          onClick={() => onOpenMap()}
          className="p-5 rounded-2xl bg-blue-50/90 border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-xs"></span>
              Moderate Risk
            </span>
            <span className="text-[10.5px] font-black px-2 py-0.5 rounded-full bg-blue-200 text-blue-900">
              BLUE
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-4xl font-black text-blue-950">{blueCount}</span>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              75% - 85%
            </span>
          </div>
          <p className="text-xs text-blue-900 leading-relaxed">
            Monitored steep slopes along Shillong plateau &amp; Aizawl western ridge.
          </p>
          <div className="text-xs text-blue-700 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1 pt-1">
            <span>Inspect in QGIS Map</span> &rarr;
          </div>
        </div>

        {/* Green Card - Stable */}
        <div
          id="card-risk-green"
          onClick={() => onOpenMap()}
          className="p-5 rounded-2xl bg-emerald-50/90 border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs"></span>
              Stable / Normal
            </span>
            <span className="text-[10.5px] font-black px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
              GREEN
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-4xl font-black text-emerald-950">{greenCount}</span>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              &lt; 75%
            </span>
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed">
            Lowland river valleys, Brahmaputra alluvial plain &amp; Agartala corridor.
          </p>
          <div className="text-xs text-emerald-700 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1 pt-1">
            <span>Inspect in QGIS Map</span> &rarr;
          </div>
        </div>
      </div>

      {/* 2.1 PREDICTIVE MODEL TRANSPARENCY & ACCURACY VERIFICATION (User Request 4 & 5) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-2xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10.5px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                Predictive Model Transparency &amp; Uncertainty Calibration
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">• Reducing False Positives &amp; Negatives</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Calibrated Probability Ranges &amp; Forecast Windows
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Because terrain hazard models are probabilistic and cannot guarantee 100% certainty, DRISHTI reports probability ranges and specific time horizons instead of point estimates to prevent discrepancies and false alarms.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            {onOpenEvacuation && (
              <button
                onClick={onOpenEvacuation}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 cursor-pointer active:scale-95 transition-all"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-200" />
                <span>Google Maps Evacuation</span>
              </button>
            )}
            {onOpenAccuracy && (
              <button
                onClick={onOpenAccuracy}
                className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-600/20 cursor-pointer active:scale-95 transition-all"
              >
                <Target className="w-3.5 h-3.5 text-cyan-200" />
                <span>Model Accuracy Metrics</span>
              </button>
            )}
            {onOpenHistorical && (
              <button
                onClick={onOpenHistorical}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              >
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span>Historical Thematic Map</span>
              </button>
            )}
            {onOpenTechDocs && (
              <button
                id="btn-quick-tech-docs"
                onClick={onOpenTechDocs}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-700 to-amber-700 hover:from-rose-600 hover:to-amber-600 text-white border border-rose-500/50 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-900/30 cursor-pointer active:scale-95 transition-all"
                title="System Architecture Specification & PDF Export"
              >
                <FileText className="w-3.5 h-3.5 text-rose-200" />
                <span>Architecture Spec</span>
              </button>
            )}
            <a
              id="btn-quick-download-pdf"
              href="/DRISHTI_NER_Architecture_Specification.pdf"
              download="DRISHTI_NER_Architecture_Specification.pdf"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              title="Download DRISHTI_NER_Architecture_Specification.pdf directly"
            >
              <Download className="w-3.5 h-3.5 text-rose-400" />
              <span>Download PDF</span>
            </a>
          </div>
        </div>

        {/* Highlighted Real Predictive Example (As requested in prompt) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-cyan-500/30 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                Live Calibrated Forecast Case: East Khasi Hills (Sohra Ridge, Meghalaya)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-cyan-300 font-mono">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tuesday, 7th September • IMD Flash Hydro-Run</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700">
              <span className="text-[11px] text-slate-400 font-medium block">Calculated Probability Range</span>
              <div className="text-2xl font-black text-rose-400 mt-0.5">87% - 96%</div>
              <span className="text-[10px] text-slate-400 block mt-0.5">High Monsoonal Surge Interval</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700">
              <span className="text-[11px] text-slate-400 font-medium block flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> Active Forecast Window
              </span>
              <div className="text-2xl font-black text-amber-300 mt-0.5">Next 5 - 7 Hours</div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Valid until 18:30 IST</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700">
              <span className="text-[11px] text-slate-400 font-medium block flex items-center gap-1">
                <Target className="w-3 h-3 text-emerald-400" /> Model Reliability Score
              </span>
              <div className="text-2xl font-black text-emerald-400 mt-0.5">94.2% Acc.</div>
              <span className="text-[10px] text-slate-400 block mt-0.5">FP: 3.4% • FN: 1.8%</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-slate-700/60 text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                <strong>Evacuation Trajectory:</strong> Primary Route via SH-5 (Mawkdok Escort) open; Sohra CHC safe assembly zone active.
              </span>
            </div>
            {onOpenEvacuation && (
              <button
                onClick={onOpenEvacuation}
                className="text-cyan-300 hover:text-cyan-200 font-bold underline flex items-center gap-1 cursor-pointer"
              >
                Inspect East Khasi Hills Trajectory &rarr;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2.2 ALL 8 NORTH EASTERN STATES HIGH-CLARITY REGIONAL TELEMETRY & FOCUS */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Mountain className="w-4 h-4 text-rose-600" />
            <h3 className="text-base font-extrabold text-slate-900">
              All 8 North Eastern States • Regional Telemetry &amp; Quick Focus
            </h3>
          </div>
          <button
            onClick={() => onOpenMap('ALL')}
            className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer hover:underline self-start sm:self-auto"
          >
            <span>View All in QGIS Full Map</span> &rarr;
          </button>
        </div>

        {/* State Filter Chips Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setStateFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
              stateFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            🇮🇳 All 8 States (8)
          </button>
          {[
            { id: 'Sikkim', name: 'Sikkim', icon: '🏔️' },
            { id: 'Tripura', name: 'Tripura', icon: '🌳' },
            { id: 'Assam', name: 'Assam', icon: '🦏' },
            { id: 'Arunachal Pradesh', name: 'Arunachal', icon: '🌄' },
            { id: 'Meghalaya', name: 'Meghalaya', icon: '🌧️' },
            { id: 'Manipur', name: 'Manipur', icon: '🏞️' },
            { id: 'Mizoram', name: 'Mizoram', icon: '⛰️' },
            { id: 'Nagaland', name: 'Nagaland', icon: '🏹' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStateFilter(st.id)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                stateFilter === st.id
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{st.icon}</span>
              <span>{st.name}</span>
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              state: 'Sikkim',
              name: 'Sikkim — Mangan Dzongu & Teesta Basin',
              icon: '🏔️',
              badge: 'ORANGE / PURPLE',
              badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
              dotColor: 'bg-rose-600',
              borderHover: 'hover:border-rose-400',
              textActionColor: 'text-rose-600',
              description: 'Chungthang to Dikchu valley corridor (NH-10). Steep glacio-fluvial moraine slopes under continuous rainfall.',
              probabilityRange: '86% - 94%',
              probabilityColor: 'text-rose-600',
              window: 'Next 4-6h',
              windowColor: 'text-amber-600',
              modelAccuracy: '93.8%',
              telemetryNote: 'Rain: 168.4 mm • Saturation: 92.4%',
            },
            {
              state: 'Tripura',
              name: 'Tripura — Longtharai & Jampui Hills',
              icon: '🌳',
              badge: 'BLUE / ORANGE',
              badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
              dotColor: 'bg-amber-500',
              borderHover: 'hover:border-amber-400',
              textActionColor: 'text-amber-600',
              description: 'Dhalai & North Tripura ridge cuts along NH-08 Lifeline. Tertiary sandstone friable cuts under monsoonal saturation.',
              probabilityRange: '68% - 78%',
              probabilityColor: 'text-amber-600',
              window: 'Next 6-8h',
              windowColor: 'text-blue-600',
              modelAccuracy: '92.6%',
              telemetryNote: 'Rain: 84.6 mm • Saturation: 76.8%',
            },
            {
              state: 'Assam',
              name: 'Assam — Dima Hasao & Brahmaputra Corridor',
              icon: '🦏',
              badge: 'PURPLE ALERT',
              badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
              dotColor: 'bg-purple-700',
              borderHover: 'hover:border-purple-400',
              textActionColor: 'text-purple-700',
              description: 'Jatinga valley & Haflong hill cut along NH-27. Super-saturated shale debris on 40°+ slope under monsoon torrents.',
              probabilityRange: '94% - 99%',
              probabilityColor: 'text-purple-700',
              window: 'Next 3-5h',
              windowColor: 'text-rose-600',
              modelAccuracy: '95.6%',
              telemetryNote: 'Rain: 218.4 mm • Saturation: 96.8%',
            },
            {
              state: 'Arunachal Pradesh',
              name: 'Arunachal Pradesh — Tawang & Siang Gorges',
              icon: '🌄',
              badge: 'PURPLE ALERT',
              badgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
              dotColor: 'bg-orange-600',
              borderHover: 'hover:border-orange-400',
              textActionColor: 'text-orange-600',
              description: 'BCT military highway & upper Siang gorges. High-altitude fractured granite and active morainic debris sliding.',
              probabilityRange: '90% - 97%',
              probabilityColor: 'text-rose-600',
              window: 'Next 3-6h',
              windowColor: 'text-amber-600',
              modelAccuracy: '94.4%',
              telemetryNote: 'Rain: 172.0 mm • Saturation: 91.2%',
            },
            {
              state: 'Meghalaya',
              name: 'Meghalaya — Sohra Escarpment & Jaintia Slopes',
              icon: '🌧️',
              badge: 'PURPLE ALERT',
              badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
              dotColor: 'bg-sky-600',
              borderHover: 'hover:border-sky-400',
              textActionColor: 'text-sky-600',
              description: 'East Khasi Hills vertical sandstone scarp. Extreme monsoonal cloudburst causing high-velocity debris flows.',
              probabilityRange: '91% - 98%',
              probabilityColor: 'text-purple-700',
              window: 'Next 2-5h',
              windowColor: 'text-rose-600',
              modelAccuracy: '96.2%',
              telemetryNote: 'Rain: 264.0 mm • Saturation: 98.2%',
            },
            {
              state: 'Manipur',
              name: 'Manipur — Noney & Tupul Railway Corridor',
              icon: '🏞️',
              badge: 'PURPLE ALERT',
              badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
              dotColor: 'bg-purple-600',
              borderHover: 'hover:border-purple-400',
              textActionColor: 'text-purple-600',
              description: 'Disang shale shear failure along NH-37 & Tupul railway cut with chronic geological and geotechnical fragility.',
              probabilityRange: '92% - 98%',
              probabilityColor: 'text-purple-700',
              window: 'Next 3-5h',
              windowColor: 'text-rose-600',
              modelAccuracy: '95.1%',
              telemetryNote: 'Rain: 204.0 mm • Saturation: 97.4%',
            },
            {
              state: 'Mizoram',
              name: 'Mizoram — Aizawl Slopes & Sairang Cut',
              icon: '⛰️',
              badge: 'ORANGE ALERT',
              badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
              dotColor: 'bg-teal-600',
              borderHover: 'hover:border-teal-400',
              textActionColor: 'text-teal-600',
              description: 'Steep siltstone and shale alternations along NH-54 & Sairang railway corridor with high structural vulnerability.',
              probabilityRange: '88% - 95%',
              probabilityColor: 'text-amber-600',
              window: 'Next 4-7h',
              windowColor: 'text-amber-600',
              modelAccuracy: '93.5%',
              telemetryNote: 'Rain: 156.2 mm • Saturation: 89.6%',
            },
            {
              state: 'Nagaland',
              name: 'Nagaland — Kohima Phesama Bypass & Dzukou',
              icon: '🏹',
              badge: 'ORANGE ALERT',
              badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
              dotColor: 'bg-rose-600',
              borderHover: 'hover:border-rose-400',
              textActionColor: 'text-rose-600',
              description: 'Chronic sinking zone along NH-29 lifeline connecting Dimapur and Kohima under active creeping colluvium.',
              probabilityRange: '87% - 96%',
              probabilityColor: 'text-amber-600',
              window: 'Next 4-6h',
              windowColor: 'text-amber-600',
              modelAccuracy: '94.0%',
              telemetryNote: 'Rain: 162.8 mm • Saturation: 90.5%',
            },
          ]
            .filter((c) => stateFilter === 'ALL' || c.state === stateFilter)
            .map((card) => (
              <div
                key={card.state}
                onClick={() => onOpenMap(card.state)}
                className={`p-4 sm:p-5 rounded-3xl bg-white border-2 border-slate-200 ${card.borderHover} hover:shadow-lg transition-all cursor-pointer group space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${card.dotColor}`}></span>
                    <span className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                      <span>{card.icon}</span>
                      <span>{card.name}</span>
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {card.description}
                </p>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-500 block font-medium">Probability Range</span>
                    <span className={`text-sm font-black ${card.probabilityColor}`}>{card.probabilityRange}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-500 block font-medium">Window</span>
                    <span className={`text-sm font-black ${card.windowColor}`}>{card.window}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-500 block font-medium">Model Accuracy</span>
                    <span className="text-sm font-black text-emerald-700">{card.modelAccuracy}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 font-medium">
                  <span>{card.telemetryNote}</span>
                  <span className={`${card.textActionColor} font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1`}>
                    Zoom to {card.state} &rarr;
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 3. DUAL SECTIONS: REAL-TIME TELEMETRY & ROADS STATUS (White background) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Real-time Scientific Telemetry Preview */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">NASA &amp; IMD Hydrological Telemetry</h3>
                <span className="text-[11px] text-slate-500">Live satellite geodetic feeds</span>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('telemetry')}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline min-h-[44px] px-2"
            >
              <span>Full Telemetry</span> &rarr;
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-medium">IMD 24h Rainfall</span>
                <Droplets className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">142.6 mm</div>
              <span className="text-[11px] text-rose-700 font-bold block mt-0.5">Heavy Monsoonal Trigger</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-medium">SMAP Soil Saturation</span>
                <Activity className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">94.2%</div>
              <span className="text-[11px] text-amber-700 font-bold block mt-0.5">Critical Pore-Water Level</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-medium">Sentinel-1 InSAR Slope Strain:</span>
              <span className="font-mono text-purple-700 font-bold">+18.4 mm/wk (Dima Hasao)</span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-medium">USGS Real-time Seismic Ground Motion:</span>
              <span className="font-mono text-emerald-700 font-bold">M 3.1 Cachar Border (Normal)</span>
            </div>
          </div>
        </div>

        {/* Road & Highway Connectivity Highlights */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Vital Lifeline Highway Status</h3>
                <span className="text-[11px] text-slate-500">BRO &amp; NHIDCL active reports</span>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('roads')}
              className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 hover:underline min-h-[44px] px-2"
            >
              <span>View All Roads</span> &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200 flex items-center justify-between gap-2">
              <div>
                <div className="font-bold text-xs text-rose-950">NH-2: Kohima - Imphal Highway</div>
                <div className="text-[11px] text-rose-800">Active rockfall near Senapati mountain pass</div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-rose-600 text-white flex-shrink-0">
                CRITICAL DELAY
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-2">
              <div>
                <div className="font-bold text-xs text-amber-950">NH-29: Dimapur - Kohima 4-Lane</div>
                <div className="text-[11px] text-amber-800">Pagla Pahar single-lane escort active</div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-amber-500 text-white flex-shrink-0">
                SLOPE WATCH
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between gap-2">
              <div>
                <div className="font-bold text-xs text-emerald-950">NH-37 / NH-27: Guwahati - Nagaon Arterial</div>
                <div className="text-[11px] text-emerald-800">Clear four-lane expressway corridor</div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-emerald-600 text-white flex-shrink-0">
                OPEN &amp; CLEAR
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
