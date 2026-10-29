import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  FileText,
  Server,
  Layers,
  MapPin,
  Cpu,
  ShieldCheck,
  Database,
  Radio,
  ExternalLink,
  Code2,
} from 'lucide-react';

interface ArchitectureDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDocModal: React.FC<ArchitectureDocModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<'all' | 'frontend' | 'backend' | 'gis' | 'schemas'>('all');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const markdownContent = getMarkdownSpecification();
    navigator.clipboard.writeText(markdownContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownloadHtmlDoc = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>DRISHTI-NER Architecture Specification</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #0f172a; max-width: 960px; margin: 0 auto; padding: 32px 24px; }
    h1 { color: #b91c1c; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
    h2 { color: #1e293b; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-top: 32px; }
    h3 { color: #334155; margin-top: 24px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f1f5f9; font-weight: 600; }
    code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 90%; }
    pre { background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 700; margin-right: 6px; }
    .badge-purple { background: #f3e8ff; color: #6b21a8; }
    .badge-orange { background: #ffedd5; color: #c2410c; }
    .badge-blue { background: #dbeafe; color: #1e40af; }
    .badge-green { background: #dcfce7; color: #15803d; }
  </style>
</head>
<body>
  ${getHtmlSpecification()}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'DRISHTI_NER_Technical_Architecture_Specification.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto no-print">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden printable-doc">
        {/* Sticky Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-600 text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  DRISHTI-NER System Architecture Specification
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                  PDF Export Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official Engineering Whitepaper &bull; Frontend Stack, Backend Services, QGIS Engine &amp; Telemetry Pipelines
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Print as PDF Button */}
            <button
              id="btn-print-pdf-spec"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/30 active:scale-95 transition-all cursor-pointer"
              title="Print or Save as PDF via your browser's native PDF printer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            {/* Download Offline HTML Document */}
            <button
              id="btn-download-html-spec"
              onClick={handleDownloadHtmlDoc}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
              title="Download standalone offline HTML whitepaper"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Offline HTML</span>
            </button>

            {/* Copy Markdown */}
            <button
              id="btn-copy-md-spec"
              onClick={handleCopyMarkdown}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
              title="Copy complete markdown text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Markdown'}</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs (Web View Only) */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs font-bold text-slate-600 no-print">
          <button
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'all'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            Complete Document (All)
          </button>
          <button
            onClick={() => setActiveSection('frontend')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'frontend'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            Frontend Architecture
          </button>
          <button
            onClick={() => setActiveSection('gis')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'gis'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            QGIS &amp; Spatial Engine
          </button>
          <button
            onClick={() => setActiveSection('backend')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'backend'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            Backend &amp; Gemini AI
          </button>
          <button
            onClick={() => setActiveSection('schemas')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'schemas'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            Data Schemas &amp; Security
          </button>
        </div>

        {/* Scrollable Document Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-slate-800 text-sm leading-relaxed">
          {/* Document Cover Header */}
          <div className="border-b-2 border-slate-200 pb-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-mono">
              <span>DOC-ID: DRISHTI-NER-TECH-SPEC-2026</span>
              <span>CLASSIFICATION: TECHNICAL ARCHITECTURE SPECIFICATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              DRISHTI-NER: Multi-Sensor Landslide Early Warning &amp; Telemetry System
            </h1>
            <p className="text-sm font-semibold text-rose-700 uppercase tracking-wide">
              Disaster Risk Intelligence &amp; Slope Hazard Telemetry &bull; Technical Specification of Frontend &amp; Backend
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Frontend Stack</span>
                <span className="font-bold text-slate-900">React 19 &bull; TypeScript &bull; Vite</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">GIS Mapping</span>
                <span className="font-bold text-slate-900">Leaflet 1.9 &bull; QGIS v3.34 Specs</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Backend Runtime</span>
                <span className="font-bold text-slate-900">Node.js &bull; Express 4.21 &bull; Cloud Run</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Multimodal AI</span>
                <span className="font-bold text-slate-900">Google Gemini &bull; @google/genai</span>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          {(activeSection === 'all' || activeSection === 'frontend') && (
            <section className="space-y-4 print-avoid-break">
              <div className="flex items-center gap-2 text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">
                <Layers className="w-5 h-5 text-rose-600" />
                <h2>1. Executive Summary &amp; Geographic Boundary Scope</h2>
              </div>
              <p>
                <strong>DRISHTI-NER</strong> is a mission-critical, real-time Slope Hazard Early Warning and Telemetry Platform designed explicitly for the <strong>8 North Eastern States of India</strong>:
                Assam, Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, Sikkim, and Tripura.
              </p>
              <p>
                The system integrates satellite radar interferometry (Sentinel-1 InSAR), satellite precipitation monitoring (NASA GPM IMERG), soil moisture microwave radiometry (NASA SMAP), automatic weather stations (IMD AWS), and citizen crowd-sourced ground verification to generate high-resolution probabilistic landslide hazard forecasts.
              </p>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1.5">
                <h4 className="font-black text-xs uppercase tracking-wide text-amber-900">
                  Strict Geographic Bounding Box (Survey Reference Extent)
                </h4>
                <p className="text-xs leading-relaxed">
                  The visual and computational canvas is strictly geofenced to the authorized regional extent shown in the reference map:
                  <strong> Latitude 21.40&deg;N to 29.75&deg;N</strong> and <strong>Longitude 87.45&deg;E to 97.35&deg;E</strong>.
                  Any coordinate or navigation attempt outside this boundary is rigidly locked and masked via an opaque global blackout collar.
                </p>
              </div>
            </section>
          )}

          {/* Section 2: Frontend Architecture */}
          {(activeSection === 'all' || activeSection === 'frontend') && (
            <section className="space-y-4 print-avoid-break">
              <div className="flex items-center gap-2 text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">
                <Code2 className="w-5 h-5 text-rose-600" />
                <h2>2. Frontend Architecture &amp; Technology Stack</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900">
                      <th className="border border-slate-300 p-2.5 font-bold">Layer / Technology</th>
                      <th className="border border-slate-300 p-2.5 font-bold">Specification</th>
                      <th className="border border-slate-300 p-2.5 font-bold">Purpose &amp; Functional Implementation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2.5 font-bold text-rose-700">UI Framework</td>
                      <td className="border border-slate-300 p-2.5 font-mono">React 19.0 + TypeScript 7.0</td>
                      <td className="border border-slate-300 p-2.5">Modern functional component model with hooks, typed interfaces, and zero-runtime type safety.</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2.5 font-bold text-rose-700">Build Tool &amp; Dev Server</td>
                      <td className="border border-slate-300 p-2.5 font-mono">Vite 8.3 + @vitejs/plugin-react</td>
                      <td className="border border-slate-300 p-2.5">Fast HMR development server, optimized ESM code bundling, tree-shaking, and static asset pipeline.</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2.5 font-bold text-rose-700">Styling Engine</td>
                      <td className="border border-slate-300 p-2.5 font-mono">Tailwind CSS v4.3</td>
                      <td className="border border-slate-300 p-2.5">Utility-first responsive design, dynamic root CSS variables for device-adaptive typography scaling, and high-contrast color systems.</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2.5 font-bold text-rose-700">Motion &amp; Animations</td>
                      <td className="border border-slate-300 p-2.5 font-mono">Motion (motion/react v12.23)</td>
                      <td className="border border-slate-300 p-2.5">Physics-based spring animations, modal backdrop fades, notification toasts, and tab transitions.</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2.5 font-bold text-rose-700">Iconography</td>
                      <td className="border border-slate-300 p-2.5 font-mono">Lucide React v0.546</td>
                      <td className="border border-slate-300 p-2.5">Crisp, scalable SVG icons strictly standardized across the entire application interface.</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2.5 font-bold text-rose-700">PWA &amp; Offline Caching</td>
                      <td className="border border-slate-300 p-2.5 font-mono">vite-plugin-pwa v1.3 + Service Worker</td>
                      <td className="border border-slate-300 p-2.5">Offline asset caching, installable home screen capability, background sync, and offline hazard incident queuing.</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2.5 font-bold text-rose-700">Speech &amp; Multilingual</td>
                      <td className="border border-slate-300 p-2.5 font-mono">Web Speech API + Custom Voice Synthesizer</td>
                      <td className="border border-slate-300 p-2.5">Automated auditory siren alarms and real-time natural language voice evacuation alerts across 10 Indian languages.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="font-bold text-sm text-slate-900">Key Modular Frontend Components</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900 block font-mono">MapQGISView.tsx</strong>
                    Primary interactive Leaflet GIS canvas featuring multi-layer toggles, 4-tier risk polygons, and InSAR vectors.
                  </li>
                  <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900 block font-mono">DashboardOverview.tsx</strong>
                    Central telemetry hub, high-clarity 8-state focus controls, probability window cards, and lifeline highway feeds.
                  </li>
                  <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900 block font-mono">NERLocationSearchBar.tsx</strong>
                    Geospatial search engine matching over 100 NER settlements, hill stations, and border passes with bounds validation.
                  </li>
                  <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900 block font-mono">VoiceAlertModal.tsx &amp; Service</strong>
                    Multilingual audio siren and evacuation advisor supporting Assamese, Bengali, Bodo, Mizo, Manipuri, Khasi, Garo, Nagamese, Hindi, and English.
                  </li>
                  <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900 block font-mono">EvacuationRouteTrajectoryModal.tsx</strong>
                    Terrain-aware evacuation trajectories, assembly safe zones, relief medical facilities, and GPS routing.
                  </li>
                  <li className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="text-slate-900 block font-mono">PredictionAccuracyFeedbackModal.tsx</strong>
                    Transparent machine learning accuracy dashboard tracking false positive/negative rates, ROC-AUC, and expert feedback.
                  </li>
                </ul>
              </div>
            </section>
          )}

          {/* Section 3: QGIS Mapping Engine */}
          {(activeSection === 'all' || activeSection === 'gis') && (
            <section className="space-y-4 print-avoid-break">
              <div className="flex items-center gap-2 text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">
                <MapPin className="w-5 h-5 text-rose-600" />
                <h2>3. Spatial Engine &amp; QGIS Multi-Layer Mapping Architecture</h2>
              </div>
              <p>
                The mapping subsystem is engineered using <strong>Leaflet 1.9.4</strong> customized to match professional <strong>QGIS v3.34</strong> cartographic styling standards.
              </p>

              <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 space-y-3 font-mono text-xs">
                <div className="text-cyan-400 font-bold">// Spatial Boundaries &amp; Rigidity Parameters</div>
                <div className="space-y-1">
                  <div>const NER_BOUNDS: [[number, number], [number, number]] = [</div>
                  <div className="pl-4 text-emerald-400">[21.40, 87.45], // South-West (Bay of Bengal / Medinipur / Chittagong)</div>
                  <div className="pl-4 text-emerald-400">[29.75, 97.35], // North-East (Northern Arunachal / Upper Chindwin)</div>
                  <div>];</div>
                  <div>maxBoundsViscosity: 1.0; // 100% rigid boundary wall (no elastic panning out of bounds)</div>
                  <div>zoomSnap: 0.1; // Smooth container-derived zoom level locking</div>
                </div>
              </div>

              <h4 className="font-bold text-xs uppercase tracking-wide text-slate-900">
                4-Tier Probability Classification Model
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-purple-50 border-2 border-purple-200">
                  <span className="font-bold text-purple-900 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Purple Zone (95–100%)
                  </span>
                  <p className="text-[11px] text-purple-800 mt-1">
                    Critical Emergency: Imminent slope collapse, active debris avalanche, mandatory evacuation ordered.
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 border-2 border-amber-200">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Orange Zone (85–95%)
                  </span>
                  <p className="text-[11px] text-amber-800 mt-1">
                    High Alert: InSAR ground displacement detected, intense monsoon pore-water saturation, sirens armed.
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-blue-50 border-2 border-blue-200">
                  <span className="font-bold text-blue-900 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Blue Zone (75–85%)
                  </span>
                  <p className="text-[11px] text-blue-800 mt-1">
                    Moderate Watch: Weather station precipitation thresholds exceeded; vulnerable cut-slopes monitored.
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-200">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Green Zone (&lt;75%)
                  </span>
                  <p className="text-[11px] text-emerald-800 mt-1">
                    Baseline Stability: Normal slope conditions, ongoing geological sensor telemetry within safe limits.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Section 4: Backend & APIs */}
          {(activeSection === 'all' || activeSection === 'backend') && (
            <section className="space-y-4 print-avoid-break">
              <div className="flex items-center gap-2 text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">
                <Server className="w-5 h-5 text-rose-600" />
                <h2>4. Backend Architecture, APIs &amp; Google Gemini AI Integration</h2>
              </div>
              <p>
                The backend is built as an enterprise Node.js microservice packaged for high-availability <strong>Google Cloud Run</strong> containerized deployment.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900">
                      <th className="border border-slate-300 p-2.5 font-bold">Endpoint Route</th>
                      <th className="border border-slate-300 p-2.5 font-bold">Method</th>
                      <th className="border border-slate-300 p-2.5 font-bold">Payload / Parameters</th>
                      <th className="border border-slate-300 p-2.5 font-bold">Functional Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2.5 font-mono text-rose-700">/api/health</td>
                      <td className="border border-slate-300 p-2.5 font-bold">GET</td>
                      <td className="border border-slate-300 p-2.5">None</td>
                      <td className="border border-slate-300 p-2.5">Container health status, uptime, active sensor pipeline state.</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2.5 font-mono text-rose-700">/api/hazard-zones</td>
                      <td className="border border-slate-300 p-2.5 font-bold">GET</td>
                      <td className="border border-slate-300 p-2.5 font-mono">?state=Meghalaya&amp;risk=purple</td>
                      <td className="border border-slate-300 p-2.5">GeoJSON features of calibrated hazard zones across the 8 NER states.</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2.5 font-mono text-rose-700">/api/telemetry/live</td>
                      <td className="border border-slate-300 p-2.5 font-bold">GET</td>
                      <td className="border border-slate-300 p-2.5 font-mono">?zoneId=ner-zone-meg-01</td>
                      <td className="border border-slate-300 p-2.5">Current InSAR displacement (mm/yr), NASA GPM rain, and SMAP moisture.</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2.5 font-mono text-rose-700">/api/incidents/report</td>
                      <td className="border border-slate-300 p-2.5 font-bold">POST</td>
                      <td className="border border-slate-300 p-2.5 font-mono">{'{ lat, lng, imageBase64, severity }'}</td>
                      <td className="border border-slate-300 p-2.5">Citizen crowd-sourced landslide report ingestion into dispatch queue.</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 p-2.5 font-mono text-rose-700">/api/ai/damage-assessment</td>
                      <td className="border border-slate-300 p-2.5 font-bold">POST</td>
                      <td className="border border-slate-300 p-2.5 font-mono">{'{ imageBase64, coordinates }'}</td>
                      <td className="border border-slate-300 p-2.5">Gemini Multimodal computer vision analysis estimating slope failure category and debris volume.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wide text-slate-900 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-rose-600" />
                  Google Gemini Multimodal AI Integration (@google/genai)
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  All AI reasoning and image analysis is executed strictly on the server-side proxy to ensure zero client-side credential leakage:
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                  <li><strong>Image Damage Categorization:</strong> Analyzes user-submitted ground photos to detect rockfalls, mudflows, translational slides, or road blockages.</li>
                  <li><strong>Confidence Scoring:</strong> Scores image severity against satellite radar indicators to filter out spurious reports.</li>
                  <li><strong>Multilingual Broadcast Generation:</strong> Automatically renders emergency evacuation advisories in native NER scripts (অসমীয়া, বাংলা, बड़ो, Mizo, etc.).</li>
                </ul>
              </div>
            </section>
          )}

          {/* Section 5: Data Schemas & Security */}
          {(activeSection === 'all' || activeSection === 'schemas') && (
            <section className="space-y-4 print-avoid-break">
              <div className="flex items-center gap-2 text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">
                <Database className="w-5 h-5 text-rose-600" />
                <h2>5. Data Models, Schemas &amp; Security Architecture</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 space-y-2">
                  <div className="text-rose-400 font-bold">// HazardZone Data Schema</div>
                  <pre className="text-[11px] leading-snug overflow-x-auto text-slate-300">
{`interface HazardZone {
  id: string;
  name: string;
  state: 'Assam' | 'Arunachal Pradesh' |
         'Manipur' | 'Meghalaya' |
         'Mizoram' | 'Nagaland' |
         'Sikkim' | 'Tripura';
  district: string;
  probability: number; // 0 - 100%
  riskCategory: 'Purple' | 'Orange' |
                'Blue' | 'Green';
  coordinates: [number, number];
  polygonBounds: [number, number][];
  insarDeformationMmYr: number;
  precipitation24hMm: number;
  soilMoisturePct: number;
  slopeAngleDeg: number;
  geologyFormation: string;
  threatenedPopulation: number;
  recommendedAction: string;
}`}
                  </pre>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 space-y-2">
                  <div className="text-cyan-400 font-bold">// Role-Based Access Control (RBAC)</div>
                  <pre className="text-[11px] leading-snug overflow-x-auto text-slate-300">
{`enum UserRole {
  CIVILIAN = 'CIVILIAN',
  FIRST_RESPONDER = 'FIRST_RESPONDER',
  GEOLOGIST_DISASTER_OFFICER = 
    'GEOLOGIST_DISASTER_OFFICER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

// Security Policies:
// 1. All alerts, maps, and voice sirens
//    are 100% public (no login barrier).
// 2. Sensitive InSAR raw telemetry,
//    evacuation routing overrides, and
//    incident verification require
//    cryptographic authentication.
// 3. Local-First Privacy: Citizen GPS
//    stays on device unless SOS broadcast.`}
                  </pre>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2 text-xs">
                <h4 className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Life-Safety First Architecture &amp; Zero Barrier Design
                </h4>
                <p>
                  DRISHTI is architected with a <strong>Zero Barrier Principle</strong>: During a catastrophic flash-flood or monsoonal slope collapse, citizens must never encounter a mandatory login wall or payment barrier to access life-saving sirens, offline evacuation vectors, or local emergency helpline numbers.
                </p>
              </div>
            </section>
          )}

          {/* Document Footer & Sign-off */}
          <div className="pt-6 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span>DRISHTI-NER Technical Architecture Specification &bull; Approved for Deployment</span>
            </div>
            <div className="font-mono text-[11px]">
              Vite 8.3 &bull; React 19 &bull; Node.js Express &bull; Google Cloud Run
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to produce clean raw Markdown specification
function getMarkdownSpecification(): string {
  return `# DRISHTI-NER: Multi-Sensor Landslide Early Warning & Telemetry System
## Comprehensive Technical Specification: Frontend & Backend Architecture
**Document ID:** DOC-ID: DRISHTI-NER-TECH-SPEC-2026  
**Classification:** Technical Architecture Specification  
**Target Coverage:** 8 North Eastern Region (NER) States: Assam, Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, Sikkim, Tripura  
**Geographic Bounds:** Latitude 21.40°N to 29.75°N | Longitude 87.45°E to 97.35°E  

---

### 1. FRONTEND ARCHITECTURE
- **Framework:** React 19.0.1 (Concurrent React, functional hooks, strict typed component trees)
- **Language:** TypeScript 7.0.2 with strict type validation
- **Build Engine:** Vite 8.3 with @vitejs/plugin-react
- **Styling:** Tailwind CSS v4.3 (CSS variables, dynamic typography accessibility with data-font-size)
- **Animations:** Motion (motion/react v12.23)
- **Iconography:** Lucide React v0.546
- **Offline & PWA:** vite-plugin-pwa v1.3 with Service Worker caching and offline sync queue
- **Speech Engine:** Web Speech API natural speech synthesis + regional acoustic sirens
- **Languages Supported (10):** English, Hindi, Assamese (অসমীয়া), Bengali (বাংলা), Bodo (बड़ो), Mizo (Mizo ṭawng), Manipuri (মৈতৈলোন্), Khasi (Ka Ktien Khasi), Garo (A·chik), Nagamese

### 2. GIS & CARTOGRAPHIC SUBSYSTEM
- **Mapping Library:** Leaflet 1.9.4
- **Spatial Bounding:** Locked to Reference Extent [21.40°N, 87.45°E] to [29.75°N, 97.35°E]
- **Boundary Behavior:** maxBoundsViscosity: 1.0 (Rigid constraint preventing panning outside authorized area)
- **Outer Mask:** 100% opaque blackout collar (WORLD_MASK_POLYGON) concealing all exterior territories
- **Neatline Border:** Double cartographic neatline (NEATLINE_RECT) matching Survey of India reference sheets
- **4-Tier Probability Classifications:**
  - **Purple (95-100%):** Critical Emergency, imminent slope failure, mandatory evacuation.
  - **Orange (85-95%):** High Alert, active InSAR strain, severe pore-water buildup.
  - **Blue (75-85%):** Moderate Watch, precipitation threshold exceeded.
  - **Green (<75%):** Stable Baseline, standard monitoring active.
- **Layers:** Sentinel-1 InSAR deformation vectors, NASA GPM IMERG rainfall contours, NASA SMAP soil moisture, BRO/NHIDCL highways, evacuation assembly zones.

### 3. BACKEND ARCHITECTURE
- **Runtime:** Node.js + Express 4.21.2
- **Compilation:** TypeScript (dev mode via tsx; production via esbuild single-bundle CJS)
- **Container Environment:** Google Cloud Run (Port 3000, 0.0.0.0 host binding)
- **AI Vision Pipeline:** Google Gemini 2.5 / Flash Multimodal API (@google/genai TypeScript SDK)
- **Key REST Endpoints:**
  - \`GET /api/health\` - Service liveness and telemetry ingestion state
  - \`GET /api/hazard-zones\` - GeoJSON hazard zones and active probabilities
  - \`GET /api/telemetry/live\` - Real-time InSAR, precipitation, and soil moisture metrics
  - \`POST /api/incidents/report\` - Citizen report submission with geofence validation
  - \`POST /api/ai/damage-assessment\` - Server-side Gemini computer vision hazard classification

### 4. DATA SOURCES & SENSOR PIPELINES
1. **Sentinel-1 InSAR (Copernicus ESA):** Line-of-sight slope deformation velocity (mm/year).
2. **NASA GPM IMERG:** Real-time 24-hour and 72-hour cumulative precipitation.
3. **NASA SMAP L-Band Radiometer:** Volumetric soil moisture and saturation percentages.
4. **IMD Automatic Weather Stations:** Ground rainfall gauges and barometric telemetry.
5. **GSI Bhukosh:** Geological Survey of India historical landslide polygons and rock formations.

### 5. SECURITY & PRIVACY MODEL
- **Role-Based Access Control (RBAC):** CIVILIAN, FIRST_RESPONDER, GEOLOGIST_DISASTER_OFFICER, SUPER_ADMIN
- **Server-Side API Proxying:** Gemini API keys and sensitive credentials never leak to client browsers.
- **Local-First Citizen Safety:** All critical life-saving alerts, sirens, maps, and offline routes accessible without forced login.
`;
}

// Helper function to produce standalone HTML whitepaper content
function getHtmlSpecification(): string {
  return `
  <h1>DRISHTI-NER System Architecture Specification</h1>
  <p><strong>Multi-Sensor Landslide Early Warning &amp; Telemetry System</strong><br>
  <em>Covering the 8 North Eastern States of India: Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura</em></p>
  
  <hr>
  
  <h2>1. Technical Summary</h2>
  <p>DRISHTI-NER is an integrated, real-time spatial early-warning and telemetry platform designed to monitor slope stability, pore-water pressure, and catastrophic landslide triggers across India's fragile Eastern Himalayan and Indo-Burma ranges.</p>
  
  <h2>2. Frontend Specification</h2>
  <ul>
    <li><strong>Core Framework:</strong> React 19.0.1 + TypeScript 7.0</li>
    <li><strong>Build Tool:</strong> Vite 8.3</li>
    <li><strong>Styling:</strong> Tailwind CSS v4.3 with adaptive font sizing</li>
    <li><strong>GIS &amp; Mapping:</strong> Leaflet 1.9.4 with QGIS v3.34 cartographic layer symbology</li>
    <li><strong>Rigid Spatial Extent:</strong> Lat 21.40&deg;N – 29.75&deg;N, Lng 87.45&deg;E – 97.35&deg;E with 100% outer blackout mask</li>
    <li><strong>Offline / PWA:</strong> Service Worker with local storage queue and installable web manifest</li>
    <li><strong>Multilingual Engine:</strong> 10 Indian Regional Languages + Web Speech API audio sirens</li>
  </ul>

  <h2>3. Backend &amp; Cloud Specification</h2>
  <ul>
    <li><strong>Runtime:</strong> Node.js + Express 4.21</li>
    <li><strong>Hosting:</strong> Google Cloud Run container architecture</li>
    <li><strong>Multimodal AI:</strong> Google Gemini (@google/genai SDK) executing server-side visual damage assessment</li>
    <li><strong>APIs:</strong> Telemetry ingestion, GeoJSON zone query, incident dispatch, road status feeds</li>
  </ul>

  <h2>4. 4-Tier Risk Classification</h2>
  <table>
    <tr><th>Risk Tier</th><th>Probability</th><th>Field Protocol</th></tr>
    <tr><td><span class="badge badge-purple">Purple</span> Critical</td><td>95–100%</td><td>Mandatory evacuation; imminent slope failure.</td></tr>
    <tr><td><span class="badge badge-orange">Orange</span> High</td><td>85–95%</td><td>Active displacement watch; sirens armed.</td></tr>
    <tr><td><span class="badge badge-blue">Blue</span> Moderate</td><td>75–85%</td><td>Precipitation threshold exceeded.</td></tr>
    <tr><td><span class="badge badge-green">Green</span> Stable</td><td>&lt;75%</td><td>Normal baseline monitoring.</td></tr>
  </table>
  `;
}
