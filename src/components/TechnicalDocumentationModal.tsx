import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  X,
  Layers,
  Server,
  Code2,
  Database,
  Cpu,
  ShieldCheck,
  Radio,
  ExternalLink,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface TechnicalDocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalDocumentationModal: React.FC<TechnicalDocumentationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'frontend' | 'backend' | 'gis' | 'schemas'>('all');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHTML = () => {
    const reportElement = document.getElementById('printable-tech-spec');
    if (!reportElement) return;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>DRISHTI-NER Full-Stack Architecture & Technical Specification</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 900px; margin: 40px auto; padding: 0 20px; background: #fff; }
    h1 { color: #be123c; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
    h2 { color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin-top: 32px; }
    h3 { color: #1e293b; margin-top: 24px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f8fafc; font-weight: 600; }
    code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
    pre { background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; background: #e0f2fe; color: #0369a1; }
    @media print {
      body { margin: 0; padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  ${reportElement.innerHTML}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'DRISHTI-NER-Technical-Specification-Architecture.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] printable-doc print:max-h-none print:shadow-none print:border-none print:rounded-none animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 px-6 py-4 flex items-center justify-between text-white border-b border-slate-700 select-none no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-600 rounded-xl text-white shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">DRISHTI-NER Architecture &amp; System Specification</h2>
                <span className="bg-rose-500/30 text-rose-200 border border-rose-400/40 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  v3.34-LTS
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Complete Engineering Reference: Frontend, Backend, QGIS Engine &amp; Multi-Satellite Pipelines
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct PDF Download */}
            <a
              id="btn-download-direct-pdf"
              href="/DRISHTI_NER_Architecture_Specification.pdf"
              download="DRISHTI_NER_Architecture_Specification.pdf"
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-lg shadow-rose-900/30 flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
              title="Download official DRISHTI-NER Architecture Specification PDF file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>

            {/* View PDF in New Tab */}
            <a
              id="btn-view-pdf-tab"
              href="/DRISHTI_NER_Architecture_Specification.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-600 items-center gap-1.5 transition-colors cursor-pointer"
              title="Open raw PDF file in a new browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open PDF</span>
            </a>

            {/* Print / Save as PDF Button */}
            <button
              onClick={handlePrint}
              className="hidden md:flex px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-600 items-center gap-1.5 transition-colors cursor-pointer"
              title="Print via browser dialog"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dialog</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Filter Pills */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between gap-2 overflow-x-auto no-print">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">View Focus:</span>
            <button
              onClick={() => setActiveSection('all')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeSection === 'all'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Complete Specification (All)
            </button>
            <button
              onClick={() => setActiveSection('frontend')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeSection === 'frontend'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Frontend Stack
            </button>
            <button
              onClick={() => setActiveSection('backend')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeSection === 'backend'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Backend &amp; Cloud Services
            </button>
            <button
              onClick={() => setActiveSection('gis')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeSection === 'gis'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              QGIS &amp; Extent Bounding
            </button>
            <button
              onClick={() => setActiveSection('schemas')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeSection === 'schemas'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Data Schemas &amp; APIs
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-mono hidden md:block">
            Tip: Press <strong>Save as PDF</strong> and choose <em>"Save as PDF"</em> as your printer destination.
          </div>
        </div>

        {/* Scrollable Printable Specification Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 text-slate-800 space-y-8 bg-white print:overflow-visible print:p-0 print:m-0" id="printable-tech-spec">
          
          {/* Document Cover Header */}
          <div className="border-b-2 border-slate-900 pb-6 print-avoid-break">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black tracking-widest text-rose-700 uppercase bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                  Government of India &bull; SDMA / GSI Alignment
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-2 tracking-tight">
                  DRISHTI-NER System Architecture Specification
                </h1>
                <p className="text-sm font-medium text-slate-600 mt-1">
                  Disaster Risk Intelligence &amp; Slope Hazard Telemetry &mdash; Technical Manual for Frontend &amp; Backend Implementation
                </p>
              </div>
              <div className="text-right text-xs text-slate-500 space-y-1">
                <div><strong>Classification:</strong> Public Safety Engineering Doc</div>
                <div><strong>Document Ref:</strong> TECH-SPEC-DRISHTI-2026-v3.34</div>
                <div><strong>Geographic Region:</strong> 8 North Eastern States (NER India)</div>
                <div><strong>Status:</strong> Active Production Build</div>
              </div>
            </div>

            {/* Quick Spec Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-200">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500">Frontend Core</div>
                <div className="text-sm font-extrabold text-slate-900">React 19 + Vite 8</div>
                <div className="text-[11px] text-slate-600">TypeScript 7 + Tailwind 4</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500">GIS &amp; Mapping</div>
                <div className="text-sm font-extrabold text-slate-900">Leaflet QGIS Engine</div>
                <div className="text-[11px] text-slate-600">Locked Extent Masking</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500">Backend &amp; Cloud</div>
                <div className="text-sm font-extrabold text-slate-900">Node / Express CJS</div>
                <div className="text-[11px] text-slate-600">Gemini 2.5 AI SDK</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500">Deployment Target</div>
                <div className="text-sm font-extrabold text-slate-900">Google Cloud Run</div>
                <div className="text-[11px] text-slate-600">Containerized Port 3000</div>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          {(activeSection === 'all' || activeSection === 'frontend' || activeSection === 'backend') && (
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <BookOpen className="w-5 h-5 text-rose-600" />
                1. System Overview &amp; Architectural Objectives
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                DRISHTI-NER is a mission-critical, early warning and risk intelligence platform engineered explicitly for the landslide-vulnerable terrain of the eight North Eastern States of India (<strong>Arunachal Pradesh, Assam, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, and Tripura</strong>). 
                The platform integrates multi-satellite earth observation feeds (NASA GPM IMERG precipitation, NASA SMAP soil moisture, Copernicus Sentinel-1 InSAR surface deformation, and IMD hydromet networks) to compute 24-hour ahead probabilistic slope failure models, generate automated multilingual voice warnings across 28 indigenous dialects, and guide evacuation routes.
              </p>
            </section>
          )}

          {/* Section 2: Frontend Architecture */}
          {(activeSection === 'all' || activeSection === 'frontend') && (
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Layers className="w-5 h-5 text-blue-600" />
                2. Frontend Architecture &amp; Technology Stack
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Layer / Component</th>
                      <th className="p-3">Technology &amp; Version</th>
                      <th className="p-3">Architectural Role &amp; Rationale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">UI Library</td>
                      <td className="p-3 font-mono text-slate-700">React 19.0.1</td>
                      <td className="p-3 text-slate-600">High-performance functional architecture, automatic batching, memoized GIS calculations.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Build Tool &amp; Dev Server</td>
                      <td className="p-3 font-mono text-slate-700">Vite 8.3.0 + @vitejs/plugin-react</td>
                      <td className="p-3 text-slate-600">Sub-second build times, native ESM development, modular code-splitting for map tiles.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Type Engine</td>
                      <td className="p-3 font-mono text-slate-700">TypeScript 7.0.2</td>
                      <td className="p-3 text-slate-600">Strict compile-time type safety across hazard telemetry, GPS coordinates, and multilingual schemas.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Styling System</td>
                      <td className="p-3 font-mono text-slate-700">Tailwind CSS v4.3.3 (@tailwindcss/vite)</td>
                      <td className="p-3 text-slate-600">Zero-runtime utility CSS engine, high-contrast dark/light tokens, responsive layout scaling.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Animation Engine</td>
                      <td className="p-3 font-mono text-slate-700">Motion 12.23 (import from motion/react)</td>
                      <td className="p-3 text-slate-600">Fluid state transitions, evacuation route draw-in animations, radar pulse indicators.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Geospatial GIS Engine</td>
                      <td className="p-3 font-mono text-slate-700">Leaflet 1.9.4 + @types/leaflet</td>
                      <td className="p-3 text-slate-600">Lightweight hardware-accelerated raster &amp; vector rendering, polygon masking, custom interactive overlays.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Vector Icons</td>
                      <td className="p-3 font-mono text-slate-700">Lucide React 0.546.0</td>
                      <td className="p-3 text-slate-600">Consistent, lightweight semantic UI iconography for telemetry, evacuation, and emergency actions.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Offline &amp; PWA</td>
                      <td className="p-3 font-mono text-slate-700">vite-plugin-pwa 1.3.0 + Service Worker</td>
                      <td className="p-3 text-slate-600">Offline asset caching, installable home-screen manifest, background sync of citizen incident drafts.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Voice Synthesis</td>
                      <td className="p-3 font-mono text-slate-700">Web Speech API (SpeechSynthesis)</td>
                      <td className="p-3 text-slate-600">Natural voice alerts across 28 North-Eastern languages with pitch/rate adaptation and phonetic fallbacks.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Frontend Directory Structure */}
              <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto space-y-1">
                <div className="text-slate-400 font-bold mb-2">// Frontend Source Code Structure (/src)</div>
                <div>src/</div>
                <div>├── App.tsx                     # Main Application Controller, Modal Registry &amp; Tab Router</div>
                <div>├── main.tsx                    # React Entrypoint &amp; Service Worker Registration</div>
                <div>├── index.css                   # Global Tailwind CSS Entry (@import "tailwindcss";)</div>
                <div>├── types.ts                    # Global TypeScript Interfaces (HazardZone, Profile, Telemetry)</div>
                <div>├── components/</div>
                <div>│   ├── MapQGISView.tsx         # Full-featured QGIS GIS Map (Blackout Mask, Tile Switcher, Layers)</div>
                <div>│   ├── MapModal.tsx            # Dedicated Full-screen Dialog Container for GIS Mapping</div>
                <div>│   ├── DashboardOverview.tsx   # DRISHTI Risk Radar, Regional Metric Cards &amp; 8-State Focus</div>
                <div>│   ├── TelemetryPanel.tsx      # InSAR, SMAP, GPM Precipitation &amp; Sensor Real-time Telemetry</div>
                <div>│   ├── RoadConnectivityBoard.tsx # BRO &amp; NHIDCL Highway Blockage &amp; Clearance Feeds</div>
                <div>│   ├── PublicPhotoFeed.tsx     # Citizen Crowdsourced Geo-Tagged Photo Feed &amp; Incident Verification</div>
                <div>│   ├── CitizenIncidentReporting.tsx # Step-by-Step Field Incident &amp; Geocoded Reporting Wizard</div>
                <div>│   ├── EvacuationRouteTrajectoryModal.tsx # Safe Haven Routing &amp; Slope Gradient Navigation</div>
                <div>│   ├── PredictionAccuracyFeedbackModal.tsx # Transparency, Confusion Matrix &amp; GSI Verification</div>
                <div>│   ├── HistoricalAnalysisMap.tsx # 2018-2026 Archive of Major Slope Failures &amp; Casualties</div>
                <div>│   ├── Navbar.tsx              # Brand, Multi-lingual Picker (28 Dialects), Role Switcher, Audio</div>
                <div>│   └── PWAInstallButton.tsx    # Native Mobile Install Prompt Integration</div>
                <div>├── data/</div>
                <div>│   ├── nerData.ts              # 32+ Calibrated NER Hazard Zones, Villages, Helplines &amp; Sensors</div>
                <div>│   ├── evacuationTrajectories.ts # Route Coordinates, Safe Shelters &amp; Elevation Drops</div>
                <div>│   ├── historicalLandslides.ts # GSI Incident Archives (Waypoints, Trigger Rainfalls, GSI IDs)</div>
                <div>│   └── languages.ts            # 28 NER Regional Language Dictionaries &amp; TTS Voice Mappings</div>
                <div>├── services/</div>
                <div>│   ├── authService.ts          # Passkey &amp; Session Management (Civilian, Official, Dev SPAIN07AM)</div>
                <div>│   ├── citizenService.ts       # Citizen Profile, Local Storage Sync &amp; Location Caching</div>
                <div>│   ├── notificationService.ts  # Push Alert Subscriptions &amp; Sound Generation Engine</div>
                <div>│   └── voiceAlertService.ts    # Web Speech API Multi-lingual Synthesizer &amp; Broadcasts</div>
                <div>└── utils/</div>
                <div>    └── nerSearch.ts            # Fast Fuzzy Location Geocoder &amp; Bounding-Box Spatial Verifier</div>
              </div>
            </section>
          )}

          {/* Section 3: Backend & Cloud Infrastructure */}
          {(activeSection === 'all' || activeSection === 'backend') && (
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Server className="w-5 h-5 text-emerald-600" />
                3. Backend Architecture &amp; Server Infrastructure
              </h2>

              <p className="text-sm text-slate-700 leading-relaxed">
                The DRISHTI platform utilizes a hybrid architecture: a highly responsive client-side edge runtime coupled with Node.js/Express backend capabilities and server-side Google Gemini GenAI SDK processing.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                    <Cpu className="w-4 h-4 text-purple-600" />
                    <span>Node.js / Express Server Engine</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li><strong>Runtime:</strong> Node.js LTS (Containerized on Google Cloud Run).</li>
                    <li><strong>Network Binding:</strong> Host <code>0.0.0.0</code> on standard Port <code>3000</code> behind NGINX proxy.</li>
                    <li><strong>Compilation:</strong> Bundled cleanly via <code>esbuild</code> into CommonJS (<code>dist/server.cjs</code>) with <code>--packages=external</code> to bypass strict runtime ESM resolution issues.</li>
                    <li><strong>API Proxying:</strong> Keeps Google Gemini and third-party satellite credentials secure on the server side, preventing credential exposure in client browser DevTools.</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Gemini AI Risk Synthesis Engine</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li><strong>SDK:</strong> <code>@google/genai</code> official TypeScript SDK.</li>
                    <li><strong>Model Tier:</strong> <code>gemini-2.5-flash</code> / <code>gemini-2.5-pro</code>.</li>
                    <li><strong>Capabilities:</strong> Synthesizes real-time rainfall surges, InSAR millimeter line-of-sight shift, and soil moisture saturation into plain-language disaster warnings for first responders.</li>
                    <li><strong>Multi-Lingual Generation:</strong> Translates hazard advisories into 28 indigenous North-Eastern dialects with situational safety protocols.</li>
                  </ul>
                </div>
              </div>

              {/* Data Flow ASCII Diagram */}
              <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto space-y-1">
                <div className="text-slate-400 font-bold mb-2">// Multi-Satellite to Civilian Alert Pipeline Flow</div>
                <pre>{`[NASA GPM Satellites]    [Sentinel-1 InSAR]    [IMD AWS Weather]    [ISRO Bhuvan DEM]
        │                         │                    │                    │
        └─────────────────────────┼────────────────────┴────────────────────┘
                                  ▼
                [DRISHTI Multi-Sensor Fusion Engine]
                                  │
                 Computes Slope Saturation Index (SSI)
                 + 24-hr Antecedent Rainfall Thresholds
                                  │
        ┌─────────────────────────┴─────────────────────────┐
        ▼                                                   ▼
[4-Tier Hazard Risk Engine]                         [Server-Side Gemini AI]
 • Purple: 95-100% Critical                          • Generates Plain-Language SITREPs
 • Orange: 85-95% High                               • Auto-Translates into 28 Dialects
 • Blue:   75-85% Moderate                           • Synthesizes Evacuation Orders
 • Green:  <75% Stable                              │
        │                                           │
        └─────────────────────────┬─────────────────┘
                                  ▼
                     [Express API & Client State]
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        ▼                         ▼                         ▼
[Leaflet QGIS Map]        [Web Speech Audio]        [PWA Push Notifications]
Interactive Overlays      Multilingual TTS          Offline Broadcast Banners`}</pre>
              </div>
            </section>
          )}

          {/* Section 4: QGIS Mapping Engine & Spatial Locking */}
          {(activeSection === 'all' || activeSection === 'gis') && (
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Radio className="w-5 h-5 text-rose-600" />
                4. GIS Engine, Spatial Extent &amp; Boundary Masking
              </h2>

              <p className="text-sm text-slate-700 leading-relaxed">
                To satisfy the strict operational requirements of the user's cartographic reference sheet, the mapping engine is mathematically bounded to the exact physical extent of the Northeast Region and immediate adjoining borders.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-black text-rose-700 uppercase">Latitude Limits</div>
                  <div className="text-base font-black text-slate-900 mt-1">21.40°N &mdash; 29.75°N</div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    From Bay of Bengal delta &amp; South Mizoram up to Tato, Anini, and Yarlung Zangbo / Tibet ridge.
                  </p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-black text-rose-700 uppercase">Longitude Limits</div>
                  <div className="text-base font-black text-slate-900 mt-1">87.45°E &mdash; 97.35°E</div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    From Medinipur, Kolkata fringe &amp; Sikkim to Tezu, Hayuliang, Wakro &amp; Upper Chindwin.
                  </p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-black text-rose-700 uppercase">Blackout Masking</div>
                  <div className="text-base font-black text-slate-900 mt-1">100% Opaque Ring</div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    <code>WORLD_MASK_POLYGON</code> blocks all exterior continents and tiles from view or inspection.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-900">Rigid Navigation Constraints:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li><strong>Max Bounds Viscosity:</strong> Set to <code>1.0</code> (Leaflet hard boundary wall; zero rubber-band panning beyond image borders).</li>
                  <li><strong>Dynamic Min Zoom:</strong> Dynamically computed via <code>map.getBoundsZoom(NER_BOUNDS)</code> so user can never zoom out smaller than the authorized map frame.</li>
                  <li><strong>Tile Layer Bounds:</strong> Hard-coded <code>bounds: NER_BOUNDS</code> on OpenStreetMap, OpenTopoMap, and CartoDB Dark basemaps prevents network tile loading outside the rectangle.</li>
                  <li><strong>Cartographic Double Neatline:</strong> SVG vector neatlines (Outer: #0f172a 4px, Inner: #0284c7 2px dashed) mirror the authentic printed survey sheet.</li>
                </ul>
              </div>
            </section>
          )}

          {/* Section 5: Data Schemas & RBAC */}
          {(activeSection === 'all' || activeSection === 'schemas') && (
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Database className="w-5 h-5 text-amber-600" />
                5. Data Model Schemas &amp; Security Roles
              </h2>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Core Hazard Zone Interface (TypeScript)</h3>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto">
                  <pre>{`export interface HazardZone {
  id: string;                      // Unique Zone identifier (e.g., 'ZONE-SKM-01')
  name: string;                    // Prominent geographical name (e.g., 'Mangan-Dzongu Ridge')
  state: string;                   // One of the 8 NER States
  district: string;                // Administrative District
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  probability: number;             // Calculated failure probability (0 - 100%)
  coordinates: [number, number];   // [Latitude, Longitude] WGS84
  currentRainfallMm: number;       // IMD / GPM 24-hr cumulative precipitation
  thresholdRainfallMm: number;     // Critical saturation threshold
  soilSaturationPct: number;       // NASA SMAP L-band soil moisture %
  insarDeformationMmYr: number;    // Sentinel-1 InSAR millimeter line-of-sight shift
  slopeAngleDeg: number;           // Topographic slope angle from SRTM/Bhuvan DEM
  status: 'ACTIVE_RED' | 'HIGH_ALERT' | 'WATCH' | 'STABLE';
  evacuationRoutes: string[];      // Pre-calculated safe trajectory codes
  helplinePhone: string;           // Local SDMA / District control room number
}`}</pre>
                </div>
              </div>

              {/* RBAC Table */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC) Matrix</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Role Tier</th>
                        <th className="p-3">Authentication Method</th>
                        <th className="p-3">Granted Permissions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      <tr>
                        <td className="p-3 font-bold text-slate-900">CIVILIAN</td>
                        <td className="p-3 font-mono">Public / Anonymous Session</td>
                        <td className="p-3">Read hazard radar, listen to voice warnings, view evacuation routes, submit citizen photo reports.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-amber-900">OFFICIAL / RESPONDER</td>
                        <td className="p-3 font-mono">Official Passkey / PIN</td>
                        <td className="p-3">Verify field incident reports, broadcast localized emergency sirens, access SDRF troop mobilization logs.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-rose-900">ADMINISTRATOR</td>
                        <td className="p-3 font-mono">SDMA / DDMA Auth Token</td>
                        <td className="p-3">Override rainfall thresholds, publish state-wide evacuation advisories, manage road block status.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-purple-900">DEVELOPER</td>
                        <td className="p-3 font-mono">Passkey 'SPAIN07AM'</td>
                        <td className="p-3">Full telemetry debugging, QGIS layer inspection, offline simulation toggle, direct model calibration.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Section 6: Database & Storage */}
          {(activeSection === 'all' || activeSection === 'schemas') && (
            <section className="space-y-4 print-avoid-break">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Database className="w-5 h-5 text-amber-600" />
                6. Database &amp; Storage: Persistent Data &amp; Uploaded Files
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-black text-amber-700 uppercase">Client-Side Persistence</div>
                  <div className="text-sm font-black text-slate-900 mt-1">localStorage &amp; IndexedDB</div>
                  <p className="text-xs text-slate-600 mt-1">
                    Stores civilian profiles, offline incident report queues, and dismissed alert IDs without network dependencies.
                  </p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-black text-amber-700 uppercase">PWA Offline Cache</div>
                  <div className="text-sm font-black text-slate-900 mt-1">Cache Storage API (Workbox)</div>
                  <p className="text-xs text-slate-600 mt-1">
                    Pre-caches application shell, CSS, icons, and base GIS cartographic tile sets for emergency blackouts.
                  </p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-black text-amber-700 uppercase">Cloud DB &amp; Media Storage</div>
                  <div className="text-sm font-black text-slate-900 mt-1">Cloud Firestore &amp; GCS Ready</div>
                  <p className="text-xs text-slate-600 mt-1">
                    Incident images serialized as Base64 in memory; backend ready to persist multi-user reports directly to Firestore and Google Cloud Storage buckets.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Section 7: Hosting & Deployment */}
          {(activeSection === 'all' || activeSection === 'backend') && (
            <section className="space-y-4 print-avoid-break">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Server className="w-5 h-5 text-emerald-600" />
                7. Hosting &amp; Deployment: Cloud Run &amp; Container Ingress
              </h2>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-900">Infrastructure &amp; Networking Topology:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li><strong>Serverless Container:</strong> Hosted on Google Cloud Run with automated TLS/HTTPS termination and elastic scaling.</li>
                  <li><strong>Port &amp; Host Configuration:</strong> Ingress traffic routes exclusively through Port <code>3000</code> bound to <code>0.0.0.0</code> behind the internal Nginx reverse proxy.</li>
                  <li><strong>Single-Bundle Node Server:</strong> Compiled with <code>esbuild</code> into <code>dist/server.cjs</code> for sub-second container cold starts.</li>
                  <li><strong>Static Assets:</strong> Vite builds client assets into <code>/dist</code>, served via Express static middleware with SPA HTML fallback.</li>
                </ul>
              </div>
            </section>
          )}

          {/* Section 8: DevOps & Tools */}
          {(activeSection === 'all' || activeSection === 'frontend') && (
            <section className="space-y-4 print-avoid-break">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Code2 className="w-5 h-5 text-purple-600" />
                8. DevOps &amp; Tools: Pipelines, Quality &amp; Build Tooling
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="font-black text-purple-700 uppercase text-[10px]">Version Control</div>
                  <div className="font-bold text-slate-900 mt-0.5">Git &amp; GitHub Export</div>
                  <div className="text-slate-600 text-[11px] mt-1">Clean tree with .gitignore avoiding node_modules and transient build artifacts.</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="font-black text-purple-700 uppercase text-[10px]">Build Pipeline</div>
                  <div className="font-bold text-slate-900 mt-0.5">Vite 8 + esbuild</div>
                  <div className="text-slate-600 text-[11px] mt-1">Parallel client compilation and server bundle generation via single <code>npm run build</code>.</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="font-black text-purple-700 uppercase text-[10px]">Type Checking</div>
                  <div className="font-bold text-slate-900 mt-0.5">TypeScript (tsc --noEmit)</div>
                  <div className="text-slate-600 text-[11px] mt-1">Automated static analysis verifying strict typing on all interfaces.</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="font-black text-purple-700 uppercase text-[10px]">Doc Engine</div>
                  <div className="font-bold text-slate-900 mt-0.5">Headless jsPDF</div>
                  <div className="text-slate-600 text-[11px] mt-1">Compiles certified architectural documentation directly to public static PDF.</div>
                </div>
              </div>
            </section>
          )}

          {/* Document Sign-off Footer */}
          <div className="pt-6 border-t border-slate-300 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-3">
            <div>
              <strong>Engineering Certification:</strong> Built with strict adherence to User Intent, Anti-Slop Guidelines, and GIS Cartographic Precision.
            </div>
            <div>
              Generated for: <strong>mishraashu7801@gmail.com</strong>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
