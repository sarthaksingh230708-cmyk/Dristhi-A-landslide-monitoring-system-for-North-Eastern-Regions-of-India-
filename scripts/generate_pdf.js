import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

function generateArchitecturePDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 16;
  const contentWidth = pageWidth - margin * 2; // 178mm
  let y = margin;

  function checkPageBreak(neededHeight) {
    if (y + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
      drawHeaderFooter();
    }
  }

  function drawHeaderFooter() {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // Slate-400
    // Running header
    doc.text('DRISHTI-NER | System Architecture & Technical Specifications', margin, 10);
    doc.text('SDMA / GSI Alignment | QGIS v3.34 Standards', pageWidth - margin - 60, 10);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(margin, 12, pageWidth - margin, 12);

    // Running footer
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
    doc.text(`Page ${pageNumber}`, pageWidth - margin - 10, pageHeight - 8);
    doc.text('CONFIDENTIAL & OPERATIONAL | Document ID: DRISHTI-TECH-SPEC-2026-v3.34', margin, pageHeight - 8);
  }

  // Cover / Header on Page 1
  drawHeaderFooter();

  // Top Category Pill
  doc.setFillColor(225, 29, 72); // Rose-600
  doc.roundedRect(margin, y, 78, 6.5, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('FULL-STACK TECHNICAL SPECIFICATION', margin + 3, y + 4.5);
  y += 11;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text('DRISHTI-NER Architecture Specification', margin, y);
  y += 6;

  // Subtitle
  doc.setFontSize(10);
  doc.setTextColor(190, 18, 60); // Rose-700
  doc.text('Frontend, Backend, Database, Hosting & DevOps Architecture Breakdown', margin, y);
  y += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Operational Scope: 8 North Eastern States (Assam, Arunachal, Meghalaya, Manipur, Mizoram, Nagaland, Sikkim, Tripura)', margin, y);
  y += 6.5;

  // Top Summary Table (5 Pillars)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');

  const summaryCols = [
    { title: '1. FRONTEND', sub: 'React 19 + Vite 8', detail: 'Leaflet GIS & Tailwind v4', x: margin + 3 },
    { title: '2. BACKEND', sub: 'Node.js + Express', detail: 'Gemini 2.5 AI SDK (CJS)', x: margin + 38 },
    { title: '3. DATABASE', sub: 'Local & Cloud Store', detail: 'IndexedDB, GCS Ready', x: margin + 74 },
    { title: '4. HOSTING', sub: 'Google Cloud Run', detail: 'Port 3000, 0.0.0.0 Host', x: margin + 110 },
    { title: '5. DEVOPS', sub: 'esbuild + TS Linter', detail: 'PWA Service Worker', x: margin + 144 },
  ];

  summaryCols.forEach(col => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(col.title, col.x, y + 5);

    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(col.sub, col.x, y + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(col.detail, col.x, y + 15);
  });
  y += 25;

  // ==========================================
  // 1. FRONTEND (CLIENT-SIDE)
  // ==========================================
  checkPageBreak(55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Frontend (Client-side): What the user sees & touches', margin, y);
  y += 2;
  doc.setDrawColor(225, 29, 72);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + 45, y);
  y += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const feIntro = 'The client-side application delivers an accessible, ultra-responsive single-page GIS cockpit and mobile progressive web app (PWA) engineered for low-connectivity Himalayan and mountainous field conditions.';
  const feLines = doc.splitTextToSize(feIntro, contentWidth);
  doc.text(feLines, margin, y);
  y += feLines.length * 3.8 + 2.5;

  const feTable = [
    ['Technology / Component', 'Role in Client Experience & Interaction'],
    ['React 19.0 (SPA)', 'Declarative concurrent rendering, zero-lag state trees, memoized GIS calculations.'],
    ['TypeScript (Strict)', 'End-to-end type safety across sensor telemetry, hazard matrices, and GPS coordinates.'],
    ['Tailwind CSS v4', 'High-contrast light & dark palettes, WCAG 2.1 AA accessibility, dynamic type scaling.'],
    ['Leaflet 1.9.4 GIS', 'Hardware-accelerated map engine with Survey of India boundary lock & blackout mask.'],
    ['Motion 12', 'Smooth drawer animations, situational hazard status ripples, and alert sirens.'],
    ['Lucide React Icons', 'Clear, unambiguous visual iconography for road blocks, helplines, and sensors.'],
    ['Web Speech API (TTS)', 'Multilingual emergency audio broadcasts across 28 regional North Eastern dialects.'],
    ['Progressive Web App', 'Vite PWA service worker offline caching; app installs directly to home screen.']
  ];

  feTable.forEach(([tech, desc], idx) => {
    checkPageBreak(6.5);
    if (idx === 0) {
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y, contentWidth, 5.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(tech, margin + 2, y + 4);
      doc.text(desc, margin + 50, y + 4);
      y += 6.5;
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(190, 18, 60);
      doc.text(tech, margin + 2, y + 3.8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(51, 65, 85);
      const descLines = doc.splitTextToSize(desc, contentWidth - 52);
      doc.text(descLines, margin + 50, y + 3.8);
      y += 5.2;
    }
  });
  y += 4;

  // ==========================================
  // 2. BACKEND (SERVER-SIDE)
  // ==========================================
  checkPageBreak(55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Backend (Server-side): Server environment, logic & APIs', margin, y);
  y += 2;
  doc.setDrawColor(2, 132, 199);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + 45, y);
  y += 4.5;

  const bePoints = [
    ['Runtime & Framework', 'Node.js LTS with Express 4.21 web framework running inside Cloud Run containers.'],
    ['Single-Bundle CJS', 'Compiled with esbuild into dist/server.cjs with externalized packages for cold starts.'],
    ['Google Gemini 2.5 AI', 'Server-side @google/genai SDK proxy for damage assessment & plain-language SITREPs.'],
    ['Telemetry Engine', 'Ingests Sentinel-1 InSAR, NASA GPM IMERG 24-hr rain, and NASA SMAP soil moisture.'],
    ['Core API Endpoints', 'GET /api/health (heartbeat), POST /api/analyze-incident, POST /api/generate-sitrep.'],
    ['API Security', 'Strict server-side containment of GEMINI_API_KEY; zero browser-side secret exposure.']
  ];

  bePoints.forEach(([tech, desc]) => {
    checkPageBreak(6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(2, 132, 199);
    doc.text(`• ${tech}:`, margin + 2, y + 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const descLines = doc.splitTextToSize(desc, contentWidth - 48);
    doc.text(descLines, margin + 46, y + 3.5);
    y += 5.2;
  });
  y += 4;

  // ==========================================
  // 3. DATABASE & STORAGE
  // ==========================================
  checkPageBreak(50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Database & Storage: Persistent data & uploaded files', margin, y);
  y += 2;
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + 45, y);
  y += 4.5;

  const dbPoints = [
    ['Client Storage', 'localStorage & IndexedDB: Stores citizen profiles, active emergency alerts, and offline queues.'],
    ['PWA Cache Storage', 'Workbox Service Worker caches base map tiles, vector styles, and core JS bundles.'],
    ['Cloud Database (Ready)', 'Google Cloud Firestore / Firebase SDK configured for synced incident reports & multi-role RBAC.'],
    ['File & Media Storage', 'Base64 image serialization for immediate preview; Google Cloud Storage (GCS) bucket bucket-ready for drone photos.'],
    ['GIS Spatial Datasets', 'High-precision WGS84 GeoJSON polygons covering 8 NER state boundaries and active fault lines.']
  ];

  dbPoints.forEach(([tech, desc]) => {
    checkPageBreak(6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(217, 119, 6);
    doc.text(`• ${tech}:`, margin + 2, y + 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const descLines = doc.splitTextToSize(desc, contentWidth - 48);
    doc.text(descLines, margin + 46, y + 3.5);
    y += 5.2;
  });
  y += 4;

  // ==========================================
  // 4. HOSTING & DEPLOYMENT
  // ==========================================
  checkPageBreak(50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('4. Hosting & Deployment: Where the app lives & deployment model', margin, y);
  y += 2;
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + 45, y);
  y += 4.5;

  const hostPoints = [
    ['Serverless Platform', 'Google Cloud Run container architecture with automated HTTPS termination & auto-scaling.'],
    ['Networking & Port', 'Hardcoded container ingress on Port 3000, bound to host 0.0.0.0 via reverse proxy.'],
    ['Dev Environment', 'Cloud Run development container (Live HMR-disabled incremental workspace).'],
    ['Production Staging', 'Shared preview sandbox for live multi-device validation across web and mobile.'],
    ['Production Start Script', 'node dist/server.cjs serves optimized static client files and proxies backend API routes.']
  ];

  hostPoints.forEach(([tech, desc]) => {
    checkPageBreak(6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(16, 185, 129);
    doc.text(`• ${tech}:`, margin + 2, y + 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const descLines = doc.splitTextToSize(desc, contentWidth - 48);
    doc.text(descLines, margin + 46, y + 3.5);
    y += 5.2;
  });
  y += 4;

  // ==========================================
  // 5. DEVOPS & TOOLS
  // ==========================================
  checkPageBreak(50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('5. DevOps & Tools: Version control, pipelines & build tooling', margin, y);
  y += 2;
  doc.setDrawColor(147, 51, 234);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + 45, y);
  y += 4.5;

  const devopsPoints = [
    ['Version Control', 'Standard Git repository architecture; 1-click GitHub export and ZIP archive generation.'],
    ['Vite 8 & esbuild', 'Sub-second client bundle compilation and dual-stage backend CommonJS bundling.'],
    ['Type Checking & Lint', 'tsc --noEmit validation ensuring zero undefined references or missing interface props.'],
    ['Package Ecosystem', 'Strict npm dependency management with zero unvetted runtime dependencies.'],
    ['PDF Build Tool', 'Automated headless jsPDF generator creating certified technical documentation on demand.']
  ];

  devopsPoints.forEach(([tech, desc]) => {
    checkPageBreak(6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(147, 51, 234);
    doc.text(`• ${tech}:`, margin + 2, y + 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const descLines = doc.splitTextToSize(desc, contentWidth - 48);
    doc.text(descLines, margin + 46, y + 3.5);
    y += 5.2;
  });
  y += 6;

  // Final Sign-off Box
  checkPageBreak(20);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 15, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('OFFICIAL ARCHITECTURE SPECIFICATION VERIFIED', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(100, 116, 139);
  doc.text('Direct PDF URL: /DRISHTI_NER_Architecture_Specification.pdf', margin + 4, y + 10.5);
  doc.text('Authorized User: mishraashu7801@gmail.com | Status: OPERATIONAL', pageWidth - margin - 85, y + 10.5);

  // Write output to /public
  const outputDir = path.resolve('public');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = path.join(outputDir, 'DRISHTI_NER_Architecture_Specification.pdf');
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(outputPath, pdfBuffer);
  console.log(`Successfully generated updated PDF at: ${outputPath} (${pdfBuffer.length} bytes)`);
}

generateArchitecturePDF();
