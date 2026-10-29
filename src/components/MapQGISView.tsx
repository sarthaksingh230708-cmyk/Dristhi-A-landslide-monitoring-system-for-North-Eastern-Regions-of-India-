import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  Layers,
  Eye,
  EyeOff,
  Maximize2,
  ZoomIn,
  ZoomOut,
  MapPin,
  Sliders,
  Filter,
  Compass,
  AlertTriangle,
  Info,
  Search,
  ShieldCheck,
  Navigation,
  Target,
  History,
  Clock,
  Calendar,
  Percent,
} from 'lucide-react';
import {
  NER_HAZARD_ZONES,
  NER_VILLAGES_QGIS,
  NER_INFRASTRUCTURE_QGIS,
  NER_ROAD_STATUS,
} from '../data/nerData';
import { CitizenProfile, HazardZone } from '../types';
import { NERLocationSearchBar } from './NERLocationSearchBar';
import { evaluateLocationCondition, LocationConditionResult } from '../utils/nerSearch';
import { voiceAlert } from '../services/voiceAlertService';
import { EvacuationRouteTrajectoryModal } from './EvacuationRouteTrajectoryModal';
import { PredictionAccuracyFeedbackModal } from './PredictionAccuracyFeedbackModal';
import { HistoricalAnalysisMap } from './HistoricalAnalysisMap';

interface MapQGISViewProps {
  profile: CitizenProfile;
  onSelectZone?: (zone: HazardZone) => void;
  onClose?: () => void;
  isModalMode?: boolean;
  initialState?: string;
}

export interface NERStateFocusItem {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  activeClass: string;
  idleClass: string;
  keyLocations: string;
  bounds: [[number, number], [number, number]];
  maxZoom: number;
}

// Complete 8 North Eastern States Focus Configuration
export const NER_STATES_FOCUS_LIST: NERStateFocusItem[] = [
  {
    id: 'Sikkim',
    name: 'Sikkim',
    shortName: 'Sikkim',
    icon: '🏔️',
    activeClass: 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 ring-1 ring-cyan-400',
    idleClass: 'text-cyan-300 hover:bg-cyan-950/50 bg-slate-950/60 border border-cyan-800/50',
    keyLocations: 'Mangan, Dzongu, Teesta Basin, Chungthang',
    bounds: [[27.05, 88.00], [28.18, 88.92]],
    maxZoom: 10,
  },
  {
    id: 'Tripura',
    name: 'Tripura',
    shortName: 'Tripura',
    icon: '🌳',
    activeClass: 'bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-1 ring-amber-400',
    idleClass: 'text-amber-300 hover:bg-amber-950/50 bg-slate-950/60 border border-amber-800/50',
    keyLocations: 'Longtharai cut, Jampui hills, Agartala, Ambassa',
    bounds: [[22.95, 91.15], [24.55, 92.35]],
    maxZoom: 10,
  },
  {
    id: 'Assam',
    name: 'Assam',
    shortName: 'Assam',
    icon: '🦏',
    activeClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400',
    idleClass: 'text-emerald-300 hover:bg-emerald-950/50 bg-slate-950/60 border border-emerald-800/50',
    keyLocations: 'Dima Hasao, Haflong-Jatinga, Brahmaputra Valley, Kamrup',
    bounds: [[24.20, 89.70], [28.00, 96.10]],
    maxZoom: 9,
  },
  {
    id: 'Arunachal Pradesh',
    name: 'Arunachal Pradesh',
    shortName: 'Arunachal',
    icon: '🌄',
    activeClass: 'bg-orange-600 text-white shadow-md shadow-orange-600/30 ring-1 ring-orange-400',
    idleClass: 'text-orange-300 hover:bg-orange-950/50 bg-slate-950/60 border border-orange-800/50',
    keyLocations: 'Tawang, Sela Pass, Siang Valley, Pasighat, Ziro, Anini',
    bounds: [[26.65, 91.50], [29.60, 97.55]],
    maxZoom: 9,
  },
  {
    id: 'Meghalaya',
    name: 'Meghalaya',
    shortName: 'Meghalaya',
    icon: '🌧️',
    activeClass: 'bg-sky-600 text-white shadow-md shadow-sky-600/30 ring-1 ring-sky-400',
    idleClass: 'text-sky-300 hover:bg-sky-950/50 bg-slate-950/60 border border-sky-800/50',
    keyLocations: 'East Khasi Hills, Sohra ridge, Cherrapunji, Jaintia slopes, Tura',
    bounds: [[25.00, 89.80], [26.15, 92.85]],
    maxZoom: 10,
  },
  {
    id: 'Manipur',
    name: 'Manipur',
    shortName: 'Manipur',
    icon: '🏞️',
    activeClass: 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-1 ring-purple-400',
    idleClass: 'text-purple-300 hover:bg-purple-950/50 bg-slate-950/60 border border-purple-800/50',
    keyLocations: 'Noney, Tupul railway corridor, Leimatak, Churachandpur',
    bounds: [[23.80, 93.00], [25.75, 94.80]],
    maxZoom: 10,
  },
  {
    id: 'Mizoram',
    name: 'Mizoram',
    shortName: 'Mizoram',
    icon: '⛰️',
    activeClass: 'bg-teal-600 text-white shadow-md shadow-teal-600/30 ring-1 ring-teal-400',
    idleClass: 'text-teal-300 hover:bg-teal-950/50 bg-slate-950/60 border border-teal-800/50',
    keyLocations: 'Aizawl, Sairang NH-54 cut, Lunglei, Champhai, Tuipang',
    bounds: [[21.90, 92.20], [24.55, 93.50]],
    maxZoom: 10,
  },
  {
    id: 'Nagaland',
    name: 'Nagaland',
    shortName: 'Nagaland',
    icon: '🏹',
    activeClass: 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-1 ring-rose-400',
    idleClass: 'text-rose-300 hover:bg-rose-950/50 bg-slate-950/60 border border-rose-800/50',
    keyLocations: 'Kohima, Phesama bypass ridge, Mokokchung, Mon, Dimapur',
    bounds: [[25.15, 93.30], [27.05, 95.25]],
    maxZoom: 10,
  },
];

// Geographic Extent: Strictly locked to the reference map provided by the user
// Latitude: 21.40°N to 29.75°N (Bay of Bengal / S. Mizoram to Northern Arunachal / Yarlung Zangbo)
// Longitude: 87.45°E to 97.35°E (West Bengal / Sikkim to Eastern Arunachal / Upper Myanmar)
const NER_BOUNDS: [[number, number], [number, number]] = [
  [21.40, 87.45], // South-West corner
  [29.75, 97.35], // North-East corner
];

const NER_CENTER: [number, number] = [25.575, 92.40]; // Centered on reference map

// 100% Opaque outer world-mask: exterior ring covers entire globe, interior hole unmasks ONLY the reference map
const WORLD_MASK_POLYGON: [number, number][][] = [
  // Outer global polygon
  [
    [-85, -180],
    [-85, 180],
    [85, 180],
    [85, -180],
  ],
  // Inner transparent aperture (matching the uploaded reference map)
  [
    [21.40, 87.45], // SW
    [29.75, 87.45], // NW
    [29.75, 97.35], // NE
    [21.40, 97.35], // SE
  ],
];

// Double neatline border matching the printed reference map in the photo
const NEATLINE_RECT: [number, number][] = [
  [21.40, 87.45],
  [29.75, 87.45],
  [29.75, 97.35],
  [21.40, 97.35],
  [21.40, 87.45],
];

const NER_BORDER_POLYGON: [number, number][] = [
  // West & North-West: Full Sikkim border (covering Kangchenjunga to Rangpo)
  [28.25, 87.90],
  [27.60, 87.95],
  [27.05, 88.00],
  [26.70, 88.25], // North Bengal / Siliguri Corridor gateway
  [26.40, 89.60], // North Bengal corridor connection to Lower Assam
  [25.80, 89.70], // Meghalaya West (Garo Hills)
  [25.10, 89.80],
  [25.05, 91.50], // South Meghalaya (Cherrapunji / Dawki)
  [24.80, 91.80],
  [24.35, 91.10], // West Tripura (Agartala border)
  [22.90, 91.20], // South Tripura (Sabroom tip)
  [22.80, 92.20],
  [21.65, 92.70], // South Mizoram (Tuipang southernmost tip)
  [22.35, 93.30], // South-East Mizoram border
  [23.85, 93.35], // Mizoram-Manipur border
  [24.25, 94.35], // South-East Manipur (Moreh border)
  [25.05, 94.50], // East Manipur (Ukhrul)
  [25.65, 94.95], // Nagaland East (Phek / Kiphire)
  [26.25, 95.10], // Nagaland East (Noklak)
  [26.85, 95.15], // Nagaland East (Mon border)
  [27.15, 95.80], // Arunachal Pradesh (Tirap / Changlang)
  [28.10, 97.45], // Easternmost Arunachal (Dong / Kibithu / Walong)
  [28.85, 97.05], // Arunachal Pradesh (Anjaw / Lohit)
  [29.50, 96.55], // Arunachal Pradesh (Dibang Valley)
  [29.20, 94.50], // Arunachal Pradesh (Upper Siang)
  [29.00, 93.50], // Arunachal Pradesh (Upper Subansiri)
  [28.25, 92.00], // Arunachal Pradesh (Tawang)
  [27.80, 91.50], // Arunachal / Bhutan border
  [27.10, 88.95], // Sikkim / Bhutan border
  [28.25, 87.90], // Back to NW Sikkim
];

export const MapQGISView: React.FC<MapQGISViewProps> = ({
  profile,
  onSelectZone,
  onClose,
  isModalMode,
  initialState,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layer groups references
  const hazardLayerRef = useRef<L.LayerGroup | null>(null);
  const villageLayerRef = useRef<L.LayerGroup | null>(null);
  const roadLayerRef = useRef<L.LayerGroup | null>(null);
  const infraLayerRef = useRef<L.LayerGroup | null>(null);
  const citizenLayerRef = useRef<L.LayerGroup | null>(null);
  const telemetryRadarLayerRef = useRef<L.LayerGroup | null>(null);
  const inspectionMarkerRef = useRef<L.Marker | null>(null);

  // QGIS Layer Visibility State
  const [layersVisibility, setLayersVisibility] = useState({
    hazardZones: true,
    villages: true,
    roads: true,
    infrastructure: true,
    citizenLocation: true,
    insarRadar: true,
  });

  // Layer Opacities
  const [hazardOpacity, setHazardOpacity] = useState(0.75);

  // Filter for Probability threshold: Purple (95-100%), Orange (85-95%), Blue (75-85%), Green (<75%)
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PURPLE' | 'ORANGE' | 'BLUE' | 'GREEN'>('ALL');

  // Selected State to Zoom
  const [selectedState, setSelectedState] = useState<string>(initialState || 'ALL');

  // Selected feature for detail drawer
  const [selectedZone, setSelectedZone] = useState<HazardZone | null>(null);
  const [copiedBulletin, setCopiedBulletin] = useState(false);
  const [outsideNerNotice, setOutsideNerNotice] = useState(false);

  // New Modals State
  const [isEvacuationOpen, setIsEvacuationOpen] = useState(false);
  const [isAccuracyOpen, setIsAccuracyOpen] = useState(false);
  const [isHistoricalOpen, setIsHistoricalOpen] = useState(false);

  // Mouse coordinate inspector
  const [inspectorCoords, setInspectorCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Map Tile Style: Standard (OSM detailed reference style matching uploaded map), Topo, Dark
  const [baseMap, setBaseMap] = useState<'topo' | 'dark' | 'standard'>('standard');
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);

  // Color helper strictly according to user instructions:
  // 95% - 100%: Purple
  // 85% - 95%: Orange
  // 75% - 85%: Blue
  // Below 75%: Green
  const getProbabilityColor = (prob: number) => {
    if (prob >= 95) return '#9333EA'; // Purple (95% - 100%)
    if (prob >= 85) return '#EA580C'; // Orange (85% - 95%)
    if (prob >= 75) return '#2563EB'; // Blue (75% - 85%)
    return '#16A34A'; // Green (Below 75%)
  };

  const getProbabilityCategoryName = (prob: number) => {
    if (prob >= 95) return 'CRITICAL DANGER (95% - 100%) - Purple';
    if (prob >= 85) return 'HIGH ALERT (85% - 95%) - Orange';
    if (prob >= 75) return 'MODERATE RISK (75% - 85%) - Blue';
    return 'SAFE / LOW HAZARD (Below 75%) - Green';
  };

  // Inspect any clicked point or searched location on the interactive map
  const inspectMapPoint = useCallback(
    (lat: number, lng: number, customTitle?: string) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      // Boundary check: Encompasses strictly the regional reference monitoring area in the image
      if (lat < 21.40 || lat > 29.75 || lng < 87.45 || lng > 97.35) {
        setOutsideNerNotice(true);
        setTimeout(() => setOutsideNerNotice(false), 4500);
        return;
      }

      const evalRes = evaluateLocationCondition(customTitle || 'Inspected Point', undefined, undefined, lat, lng);

      if (inspectionMarkerRef.current) {
        map.removeLayer(inspectionMarkerRef.current);
      }

      const markerHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
          <span style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: ${evalRes.color}; opacity: 0.5; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          <div style="width: 20px; height: 20px; border-radius: 50%; background: ${evalRes.color}; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center;">
            <div style="width: 6px; height: 6px; border-radius: 50%; background: white;"></div>
          </div>
        </div>
      `;

      const customPinIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-inspection-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const newMarker = L.marker([lat, lng], { icon: customPinIcon }).addTo(map);
      inspectionMarkerRef.current = newMarker;

      const popupHtml = `
        <div style="font-family: sans-serif; min-width: 250px; color: #0f172a; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid ${evalRes.color}; padding-bottom: 5px; margin-bottom: 6px;">
            <strong style="font-size: 13px; color: #1e293b;">${evalRes.placeName}</strong>
            <span style="background: ${evalRes.color}; color: white; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 9999px;">
              ${evalRes.probability}% • ${evalRes.colorName}
            </span>
          </div>
          <div style="font-size: 11px; margin-bottom: 5px;">
            <strong>Condition:</strong> <span style="color: ${evalRes.color}; font-weight: bold;">
              ${evalRes.hasActiveLandslideThreat ? '⚠️ Active Landslide Danger' : '✅ Stable Terrain (No Landslide)'}
            </span>
          </div>
          <div style="font-size: 10px; color: #475569; margin-bottom: 6px;">
            ${evalRes.district}, ${evalRes.state} (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)
          </div>
          <div style="background: #f1f5f9; padding: 6px; border-radius: 6px; font-size: 10px; margin-bottom: 6px;">
            <div><strong>24h Rain:</strong> ${evalRes.rainfallMm} mm</div>
            <div><strong>Soil Moisture:</strong> ${evalRes.soilMoisturePct}%</div>
            <div><strong>Slope Angle:</strong> ${evalRes.slopeDegrees}°</div>
            <div><strong>Nearest Fault Zone:</strong> ${evalRes.nearestHazardZoneName} (${evalRes.distanceToHazardKm} km)</div>
          </div>
          <div style="font-size: 10px; color: #0f172a; margin-bottom: 4px;">
            <strong>Shelter:</strong> ${evalRes.nearestShelter}
          </div>
          <div style="font-size: 10px; color: #b45309; font-weight: 600;">
            Action: ${evalRes.actionRequired}
          </div>
        </div>
      `;

      newMarker.bindPopup(popupHtml).openPopup();

      const inspectedHazardZone: HazardZone = {
        id: `point-${lat.toFixed(3)}-${lng.toFixed(3)}`,
        name: `${evalRes.placeName} (${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E)`,
        state: evalRes.state as any,
        district: evalRes.district,
        lat: lat,
        lng: lng,
        radiusKm: 12,
        probability: evalRes.probability,
        colorCategory: evalRes.colorName.toLowerCase() as any,
        rainfall24hMm: evalRes.rainfallMm,
        soilMoistureSatPct: evalRes.soilMoisturePct,
        slopeDeg: evalRes.slopeDegrees,
        insarDeformationMmYr: evalRes.insarDeformationMmYr,
        triggerCause: evalRes.conditionDescription,
        vulnerableVillagesCount: evalRes.hasActiveLandslideThreat ? 6 : 1,
        affectedRoads: ['Local Mountain Road'],
        historicalEventsCount: evalRes.probability >= 85 ? 14 : 2,
        statusText: evalRes.statusBadge,
        recommendedAction: evalRes.actionRequired,
      };

      setSelectedZone(inspectedHazardZone);
      if (onSelectZone) {
        onSelectZone(inspectedHazardZone);
      }
    },
    [onSelectZone]
  );

  // Handle Search Result from NERLocationSearchBar
  const handleSearchResult = useCallback(
    (res: LocationConditionResult) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      map.flyTo([res.lat, res.lng], 11, { duration: 1.5 });
      inspectMapPoint(res.lat, res.lng, res.placeName);
    },
    [inspectMapPoint]
  );

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy prior map instance if existing to prevent container collision
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: NER_CENTER,
      zoom: 6,
      minZoom: 5.0,
      maxZoom: 15,
      maxBounds: NER_BOUNDS,
      maxBoundsViscosity: 1.0, // 100% rigid boundary wall: users CANNOT pan out of this area
      zoomSnap: 0.1,
      zoomControl: false,
    });

    // Add zoom control in top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Calculate and lock minZoom so user cannot zoom out smaller than the reference map area
    const lockExtentMinZoom = () => {
      if (!map) return;
      try {
        const fitZoom = map.getBoundsZoom(NER_BOUNDS, false);
        map.setMinZoom(fitZoom);
        if (map.getZoom() < fitZoom) {
          map.setZoom(fitZoom);
        }
      } catch {
        // Container not yet fully laid out
      }
    };
    lockExtentMinZoom();

    // Base tile layer: Standard, Topo, or Dark basemap restricted strictly to NER_BOUNDS
    const getTileUrl = (style: 'topo' | 'dark' | 'standard') => {
      if (style === 'dark') {
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      }
      if (style === 'topo') {
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      }
      return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    };

    const tileLayer = L.tileLayer(getTileUrl(baseMap), {
      attribution: '&copy; OpenStreetMap contributors &copy; Survey & GIS',
      bounds: NER_BOUNDS, // Restrict tile loading strictly to image bounds
      maxZoom: 18,
    }).addTo(map);

    baseTileLayerRef.current = tileLayer;

    // 100% Opaque outer blackout mask: Completely hides and covers any area outside the uploaded map image
    const blackoutMask = L.polygon(WORLD_MASK_POLYGON, {
      fillColor: '#020617', // Solid opaque dark slate (matches container background)
      fillOpacity: 1.0,     // 100% opaque blackout
      stroke: true,
      color: '#0f172a',
      weight: 3,
      interactive: true,    // Absorbs clicks outside map
    });
    blackoutMask.addTo(map);

    // Double neatline border matching the printed reference map in the photo
    const neatlineOuter = L.polyline(NEATLINE_RECT, {
      color: '#0f172a',
      weight: 4,
      interactive: false,
    });
    neatlineOuter.addTo(map);

    const neatlineInner = L.polyline(NEATLINE_RECT, {
      color: '#0284c7', // Cyan neatline
      weight: 2,
      dashArray: '6, 4',
      interactive: false,
    });
    neatlineInner.addTo(map);

    // Clean administrative boundary line for the 8 North Eastern States
    const nerBorderLine = L.polygon(NER_BORDER_POLYGON, {
      fillColor: 'transparent',
      fillOpacity: 0,
      color: '#0284c7', // High-clarity cyan boundary line
      weight: 2,
      dashArray: '6, 6',
      interactive: false,
    });
    nerBorderLine.addTo(map);

    // Create LayerGroups
    hazardLayerRef.current = L.layerGroup().addTo(map);
    villageLayerRef.current = L.layerGroup().addTo(map);
    roadLayerRef.current = L.layerGroup().addTo(map);
    infraLayerRef.current = L.layerGroup().addTo(map);
    telemetryRadarLayerRef.current = L.layerGroup().addTo(map);
    citizenLayerRef.current = L.layerGroup().addTo(map);

    // Mousemove event for QGIS Coordinate Inspector
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setInspectorCoords({
        lat: Number(e.latlng.lat.toFixed(4)),
        lng: Number(e.latlng.lng.toFixed(4)),
      });
    });

    // Map is Clickable - Click anywhere on terrain to inspect condition
    map.on('click', (e: L.LeafletMouseEvent) => {
      inspectMapPoint(e.latlng.lat, e.latlng.lng);
    });

    // Fit map bounds to exact regional extent matching user reference map
    map.fitBounds(NER_BOUNDS, { padding: [0, 0] });

    mapInstanceRef.current = map;

    // Staggered invalidateSize and fitBounds calls ensure all map tiles snap to full canvas
    const t1 = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        lockExtentMinZoom();
        mapInstanceRef.current.fitBounds(NER_BOUNDS, { padding: [0, 0] });
      }
    }, 80);
    const t2 = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        lockExtentMinZoom();
      }
    }, 250);
    const t3 = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        lockExtentMinZoom();
      }
    }, 600);

    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        lockExtentMinZoom();
      }
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [baseMap, inspectMapPoint]);

  // Update Base Tile on change
  useEffect(() => {
    if (!mapInstanceRef.current || !baseTileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(baseTileLayerRef.current);

    let url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    if (baseMap === 'topo') {
      url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    } else if (baseMap === 'standard') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }

    const newTileLayer = L.tileLayer(url, {
      attribution: '&copy; OpenStreetMap contributors &copy; Survey & GIS',
      bounds: NER_BOUNDS, // Restrict tile loading strictly to image bounds
      maxZoom: 18,
    }).addTo(mapInstanceRef.current);

    baseTileLayerRef.current = newTileLayer;
  }, [baseMap]);

  // Render & Re-render Map Features based on visibility, opacities, and filters
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Expose global zone selector for HTML popup buttons
    (window as any).__selectZone = (zoneId: string) => {
      const targetZone = NER_HAZARD_ZONES.find((item) => item.id === zoneId);
      if (targetZone) {
        setSelectedZone(targetZone);
        if (onSelectZone) onSelectZone(targetZone);
      }
    };

    // 1. Hazard Zones Layer: Small Alert Circles of Landslide Probability
    // * 95% - 100% Probability: PURPLE
    // * 85% - 95% Probability: ORANGE
    // * 75% - 85% Probability: BLUE
    // * Below 75% Probability: GREEN
    if (hazardLayerRef.current) {
      hazardLayerRef.current.clearLayers();

      if (layersVisibility.hazardZones) {
        NER_HAZARD_ZONES.forEach((zone) => {
          // Check filter
          if (activeFilter === 'PURPLE' && zone.probability < 95) return;
          if (activeFilter === 'ORANGE' && (zone.probability >= 95 || zone.probability < 85)) return;
          if (activeFilter === 'BLUE' && (zone.probability >= 85 || zone.probability < 75)) return;
          if (activeFilter === 'GREEN' && zone.probability >= 75) return;
          if (selectedState !== 'ALL' && zone.state !== selectedState) return;

          const color = getProbabilityColor(zone.probability);
          const isPurple = zone.probability >= 95;
          const isOrange = zone.probability >= 85 && zone.probability < 95;
          const isBlue = zone.probability >= 75 && zone.probability < 85;

          const colorNameLabel = isPurple
            ? 'PURPLE (95% - 100%)'
            : isOrange
            ? 'ORANGE (85% - 95%)'
            : isBlue
            ? 'BLUE (75% - 85%)'
            : 'GREEN (Below 75%)';

          // A. Soft outer terrain buffer footprint (non-interactive so clicks always hit the small circle directly)
          const bufferCircle = L.circle([zone.lat, zone.lng], {
            radius: zone.radiusKm * 1000,
            color: color,
            fillColor: color,
            fillOpacity: hazardOpacity * 0.16,
            weight: 1.5,
            dashArray: isPurple ? '4, 6' : undefined,
            interactive: false,
          });

          // B. Distinct Small Circle of Alert with Probability Label & Pulse
          const circleHtml = `
            <div class="alert-circle-wrapper" style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              ${
                isPurple
                  ? `<span style="position: absolute; width: 34px; height: 34px; border-radius: 9999px; background-color: #9333EA; opacity: 0.65; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>`
                  : isOrange
                  ? `<span style="position: absolute; width: 30px; height: 30px; border-radius: 9999px; background-color: #EA580C; opacity: 0.5; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>`
                  : ''
              }
              <div style="position: relative; width: 24px; height: 24px; border-radius: 9999px; background-color: ${color}; border: 2.5px solid #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.65); display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 9px; font-weight: 900; letter-spacing: -0.5px; transition: transform 0.15s ease;"
                   title="${zone.name}: ${zone.probability}% (${colorNameLabel})">
                ${zone.probability}%
              </div>
            </div>
          `;

          const circleDivIcon = L.divIcon({
            html: circleHtml,
            className: 'custom-alert-circle-icon',
            iconSize: [34, 34],
            iconAnchor: [17, 17],
            popupAnchor: [0, -18],
          });

          const alertCircleMarker = L.marker([zone.lat, zone.lng], {
            icon: circleDivIcon,
            zIndexOffset: isPurple ? 1200 : isOrange ? 1000 : isBlue ? 800 : 500,
          });

          // Detailed condition popup explaining what is the condition in that region
          const popupContent = `
            <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 280px; max-width: 340px; color: #0f172a; padding: 2px;">
              <!-- Region & Probability Alert Header -->
              <div style="display: flex; align-items: flex-start; justify-content: space-between; border-bottom: 2px solid ${color}; padding-bottom: 6px; margin-bottom: 6px; gap: 8px;">
                <div>
                  <div style="font-size: 13px; font-weight: 800; color: #0f172a; line-height: 1.25;">${zone.name}</div>
                  <div style="font-size: 11px; color: #64748b; margin-top: 2px;">📍 ${zone.district}, ${zone.state}</div>
                </div>
                <span style="background-color: ${color}; color: #ffffff; font-size: 10px; font-weight: 900; padding: 3px 8px; border-radius: 9999px; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.25);">
                  ${zone.probability}% RISK
                </span>
              </div>

              <!-- Alert Category Badge -->
              <div style="margin-bottom: 8px;">
                <span style="display: inline-block; font-size: 10px; font-weight: 800; color: ${color}; background-color: ${color}15; border: 1px solid ${color}40; padding: 3px 8px; border-radius: 6px;">
                  ALERT: ${colorNameLabel}
                </span>
              </div>

              <!-- Condition in that region -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; font-size: 11px; margin-bottom: 8px;">
                <div style="font-weight: 800; color: #1e293b; margin-bottom: 3px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;">
                  ⚠️ Geological & Terrain Condition:
                </div>
                <div style="color: #334155; line-height: 1.45;">
                  ${zone.triggerCause}
                </div>
              </div>

              <!-- Live Hydrological & Slope Telemetry -->
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-bottom: 8px; text-align: center;">
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 2px;">
                  <div style="font-size: 8.5px; color: #64748b; font-weight: 700; text-transform: uppercase;">24h Rain</div>
                  <div style="font-size: 12px; font-weight: 800; color: #d97706;">${zone.rainfall24hMm} mm</div>
                </div>
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 2px;">
                  <div style="font-size: 8.5px; color: #64748b; font-weight: 700; text-transform: uppercase;">Soil Sat.</div>
                  <div style="font-size: 12px; font-weight: 800; color: #0284c7;">${zone.soilMoistureSatPct}%</div>
                </div>
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 2px;">
                  <div style="font-size: 8.5px; color: #64748b; font-weight: 700; text-transform: uppercase;">DEM Slope</div>
                  <div style="font-size: 12px; font-weight: 800; color: #059669;">${zone.slopeDeg}°</div>
                </div>
              </div>

              <!-- Human & Road Impact -->
              <div style="font-size: 10.5px; color: #475569; margin-bottom: 6px; line-height: 1.4;">
                <div>🏘️ <strong>At Risk:</strong> ${zone.vulnerableVillagesCount} vulnerable villages</div>
                <div>🛣️ <strong>Highways:</strong> ${zone.affectedRoads.join(', ')}</div>
                <div>🛰️ <strong>InSAR Motion:</strong> ${zone.insarDeformationMmYr} mm/yr deformation</div>
              </div>

              <!-- Action Required -->
              <div style="background-color: ${color}15; border-left: 3px solid ${color}; padding: 6px 8px; font-size: 10.5px; margin-bottom: 8px; border-radius: 0 6px 6px 0;">
                <strong style="color: ${color}; font-size: 9.5px; text-transform: uppercase;">Action Required:</strong>
                <div style="color: #1e293b; margin-top: 2px; line-height: 1.35; font-weight: 600;">
                  ${zone.recommendedAction}
                </div>
              </div>

              <!-- Detailed Inspector Trigger -->
              <div style="display: flex; gap: 6px; justify-content: flex-end; margin-top: 6px;">
                <button onclick="window.__selectZone('${zone.id}')" style="background: #0f172a; color: white; border: none; padding: 5px 10px; border-radius: 6px; font-size: 10px; font-weight: bold; cursor: pointer;">
                  Inspect Full Condition & History ↗
                </button>
              </div>
            </div>
          `;

          alertCircleMarker.bindPopup(popupContent, {
            maxWidth: 350,
            className: 'custom-leaflet-popup',
          });

          // Clean hover tooltip
          alertCircleMarker.bindTooltip(
            `<strong>${zone.name}</strong><br/><span style="color:${color};font-weight:bold;">${zone.probability}% - ${colorNameLabel}</span><br/><span style="font-size:10px;color:#94a3b8;">Click circle to view condition</span>`,
            {
              direction: 'top',
              offset: [0, -18],
            }
          );

          // Click handler to open condition card and pan
          alertCircleMarker.on('click', () => {
            setSelectedZone(zone);
            if (onSelectZone) onSelectZone(zone);
            map.panTo([zone.lat, zone.lng]);
          });

          hazardLayerRef.current?.addLayer(bufferCircle);
          hazardLayerRef.current?.addLayer(alertCircleMarker);
        });
      }
    }

    // 2. Vulnerable Villages Layer
    if (villageLayerRef.current) {
      villageLayerRef.current.clearLayers();

      if (layersVisibility.villages) {
        NER_VILLAGES_QGIS.forEach((village) => {
          if (selectedState !== 'ALL' && village.state !== selectedState) return;

          const villageIcon = L.divIcon({
            className: 'custom-village-icon',
            html: `
              <div style="background: #0f172a; border: 1.5px solid #f59e0b; border-radius: 6px; padding: 2px 5px; font-size: 10px; font-weight: bold; color: #fef08a; display: flex; align-items: center; gap: 3px; box-shadow: 0 2px 4px rgba(0,0,0,0.5); white-space: nowrap;">
                <span>🏠</span> ${village.name}
              </div>
            `,
            iconSize: [80, 24],
            iconAnchor: [40, 12],
          });

          const marker = L.marker([village.lat, village.lng], { icon: villageIcon });
          marker.bindPopup(`
            <div style="font-family: sans-serif; font-size: 11px; color: #0f172a;">
              <strong style="font-size: 12px;">Settlement: ${village.name}</strong><br/>
              District: ${village.district} (${village.state})<br/>
              Population: <strong>${village.population.toLocaleString()}</strong><br/>
              Local Landslide Risk: <strong>${village.riskProbability}%</strong><br/>
              <hr style="margin: 4px 0; border: none; border-top: 1px solid #e2e8f0;" />
              <strong>Designated Shelter:</strong> ${village.nearestShelter}<br/>
              Shelter Capacity: ${village.shelterCapacity} persons<br/>
              Fault Line Proximity: ${village.distanceToFaultKm} km
            </div>
          `);

          villageLayerRef.current?.addLayer(marker);
        });
      }
    }

    // 3. Roads & Lifeline Corridors Layer
    if (roadLayerRef.current) {
      roadLayerRef.current.clearLayers();

      if (layersVisibility.roads) {
        NER_ROAD_STATUS.forEach((road) => {
          let roadColor = '#10B981'; // Green for CLEAR
          let statusBadge = '🟢 OPEN';
          if (road.status === 'BLOCKED') {
            roadColor = '#EF4444'; // Red for BLOCKED
            statusBadge = '🔴 BLOCKED';
          } else if (road.status === 'ONE-WAY') {
            roadColor = '#F59E0B'; // Yellow
            statusBadge = '🟡 ONE-WAY CONVOY';
          } else if (road.status === 'HIGH_RISK') {
            roadColor = '#3B82F6'; // Blue
            statusBadge = '🔵 HIGH RISK PASS';
          }

          const roadMarker = L.circleMarker([road.lat, road.lng], {
            radius: 8,
            color: '#FFFFFF',
            fillColor: roadColor,
            fillOpacity: 0.95,
            weight: 2,
          });

          roadMarker.bindPopup(`
            <div style="font-family: sans-serif; font-size: 11px; color: #0f172a; min-width: 220px;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
                <strong>${road.highwayCode}</strong>
                <span style="font-weight: bold; font-size: 10px;">${statusBadge}</span>
              </div>
              <div style="margin-top: 4px;"><strong>Corridor:</strong> ${road.corridorName}</div>
              <div style="margin-top: 2px;"><strong>Block Location:</strong> ${road.blockageLocation}</div>
              <div style="margin-top: 2px; color: #dc2626;"><strong>Cause:</strong> ${road.cause}</div>
              <div style="margin-top: 2px;"><strong>Clearing Agency:</strong> ${road.clearingAgency}</div>
              <div style="margin-top: 2px; background: #f1f5f9; padding: 3px; border-radius: 4px;"><strong>Detour:</strong> ${road.alternateRoute || 'None'}</div>
            </div>
          `);

          roadLayerRef.current?.addLayer(roadMarker);
        });
      }
    }

    // 4. Critical Infrastructure Layer (Hospitals, Bridges, Helipads, etc.)
    if (infraLayerRef.current) {
      infraLayerRef.current.clearLayers();

      if (layersVisibility.infrastructure) {
        NER_INFRASTRUCTURE_QGIS.forEach((infra) => {
          let emoji = '🏥';
          if (infra.type === 'Bridge') emoji = '🌉';
          if (infra.type === 'Helipad') emoji = '🚁';
          if (infra.type === 'Power Station') emoji = '⚡';
          if (infra.type === 'Communication Tower') emoji = '📡';

          const infraIcon = L.divIcon({
            className: 'custom-infra-icon',
            html: `
              <div style="background: #1e1b4b; border: 1.5px solid #818cf8; border-radius: 9999px; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-size: 13px; box-shadow: 0 2px 6px rgba(0,0,0,0.6);">
                ${emoji}
              </div>
            `,
            iconSize: [26, 26],
            iconAnchor: [13, 13],
          });

          const marker = L.marker([infra.lat, infra.lng], { icon: infraIcon });
          marker.bindPopup(`
            <div style="font-family: sans-serif; font-size: 11px; color: #0f172a;">
              <strong>${infra.name}</strong><br/>
              Type: ${infra.type} (${infra.state})<br/>
              Status: <span style="color: ${infra.operationalStatus === 'Operational' ? '#16a34a' : '#d97706'}; font-weight: bold;">${infra.operationalStatus}</span>
            </div>
          `);

          infraLayerRef.current?.addLayer(marker);
        });
      }
    }

    // 5. InSAR Surface Radar Deformation Layer (Simulated InSAR Vectors / Coherence vectors)
    if (telemetryRadarLayerRef.current) {
      telemetryRadarLayerRef.current.clearLayers();

      if (layersVisibility.insarRadar) {
        // High deformation vectors along slope fault zones
        const deformationPoints: [number, number, number][] = [
          [25.183, 93.018, -38.4], // Dima Hasao
          [27.511, 88.528, -44.2], // Mangan Teesta
          [24.856, 93.637, -41.0], // Noney Tupul
          [25.642, 94.108, -24.8], // Kohima
        ];

        deformationPoints.forEach(([lat, lng, vel]) => {
          const vectorLine = L.polyline(
            [
              [lat, lng],
              [lat - 0.04, lng + 0.03],
            ],
            {
              color: '#F43F5E',
              weight: 3,
              dashArray: '2, 4',
            }
          );
          vectorLine.bindTooltip(`Sentinel-1 InSAR Slip: ${vel} mm/yr`, { permanent: false });
          telemetryRadarLayerRef.current?.addLayer(vectorLine);
        });
      }
    }

    // 6. Citizen Registered Location Marker
    if (citizenLayerRef.current) {
      citizenLayerRef.current.clearLayers();

      if (layersVisibility.citizenLocation && profile.lat && profile.lng) {
        const citizenIcon = L.divIcon({
          className: 'custom-citizen-icon',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
              <span style="position: absolute; width: 34px; height: 34px; border-radius: 9999px; background: #f43f5e; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
              <div style="background: #e11d48; border: 2.5px solid #ffffff; width: 18px; height: 18px; border-radius: 9999px; box-shadow: 0 0 10px #e11d48;"></div>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const citizenMarker = L.marker([profile.lat, profile.lng], { icon: citizenIcon });
        citizenMarker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 11px; color: #0f172a;">
            <strong style="color: #e11d48; font-size: 12px;">★ My Registered Citizen Location</strong><br/>
            Citizen: ${profile.fullName}<br/>
            Location: ${profile.villageOrTown}, ${profile.district} (${profile.state})<br/>
            Contact: ${profile.phoneNumber}
          </div>
        `);

        citizenLayerRef.current?.addLayer(citizenMarker);
      }
    }
  }, [
    layersVisibility,
    hazardOpacity,
    activeFilter,
    selectedState,
    profile.lat,
    profile.lng,
    profile.fullName,
    profile.villageOrTown,
    profile.district,
    profile.state,
    profile.phoneNumber,
    onSelectZone,
  ]);

  // Handle Zoom to State (All 8 North Eastern States)
  const handleStateZoom = (stateName: string) => {
    setSelectedState(stateName);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (stateName === 'ALL') {
      map.fitBounds(NER_BOUNDS, { padding: [0, 0] });
      return;
    }

    const stateConfig = NER_STATES_FOCUS_LIST.find((s) => s.id === stateName);
    if (stateConfig) {
      map.fitBounds(stateConfig.bounds, {
        padding: [25, 25],
        maxZoom: stateConfig.maxZoom,
      });
      return;
    }

    const stateZones = NER_HAZARD_ZONES.filter((z) => z.state === stateName);
    if (stateZones.length > 0) {
      const group = L.featureGroup(
        stateZones.map((z) => L.marker([z.lat, z.lng]))
      );
      map.fitBounds(group.getBounds().pad(0.35));
    }
  };

  // Automatically zoom to initial state on modal open if provided
  useEffect(() => {
    if (initialState && initialState !== 'ALL') {
      const timer = setTimeout(() => {
        handleStateZoom(initialState);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [initialState]);

  // Reset to full Regional Extent
  const handleResetNERView = () => {
    setSelectedState('ALL');
    mapInstanceRef.current?.fitBounds(NER_BOUNDS, { padding: [0, 0] });
  };

  // Toggle Layer Helper
  const toggleLayer = (key: keyof typeof layersVisibility) => {
    setLayersVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex flex-col ${isModalMode ? 'h-full' : 'h-[750px] min-h-[600px]'}`}>
      {/* Top Search Bar specifically designed for NER locations */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex-shrink-0">
        <NERLocationSearchBar onLocationSelected={handleSearchResult} />
      </div>

      <div className={`relative w-full flex flex-col xl:flex-row ${isModalMode ? 'flex-1 min-h-0' : 'h-[740px]'}`}>
        {/* Left Sidebar: QGIS Layer Tree & Scientific Filters */}
        <div className="w-full xl:w-80 bg-slate-900 border-b xl:border-b-0 xl:border-r border-slate-800 p-3.5 flex flex-col justify-between overflow-y-auto z-10 flex-shrink-0 max-h-[40vh] xl:max-h-full">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
                QGIS Layers & Symbology
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
              EPSG:4326 (WGS84)
            </span>
          </div>

          {/* User Required Color Legend: Purple, Orange, Blue, Green */}
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Landslide Probability Scale</span>
              <span className="text-purple-400">REAL-TIME</span>
            </div>

            <div className="space-y-1.5">
              {/* 95% - 100%: PURPLE */}
              <div
                onClick={() => setActiveFilter(activeFilter === 'PURPLE' ? 'ALL' : 'PURPLE')}
                className={`p-1.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                  activeFilter === 'PURPLE' ? 'bg-purple-950/90 border border-purple-500' : 'hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-600 shadow-sm shadow-purple-500/50"></span>
                  <span className="font-semibold text-purple-200 text-[11px]">95% - 100% Probability</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-purple-600 text-white px-1.5 py-0.2 rounded">
                  PURPLE
                </span>
              </div>

              {/* 85% - 95%: ORANGE */}
              <div
                onClick={() => setActiveFilter(activeFilter === 'ORANGE' ? 'ALL' : 'ORANGE')}
                className={`p-1.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                  activeFilter === 'ORANGE' ? 'bg-orange-950/90 border border-orange-500' : 'hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-600 shadow-sm shadow-orange-500/50"></span>
                  <span className="font-semibold text-orange-200 text-[11px]">85% - 95% Probability</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-orange-600 text-white px-1.5 py-0.2 rounded">
                  ORANGE
                </span>
              </div>

              {/* 75% - 85%: BLUE */}
              <div
                onClick={() => setActiveFilter(activeFilter === 'BLUE' ? 'ALL' : 'BLUE')}
                className={`p-1.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                  activeFilter === 'BLUE' ? 'bg-blue-950/90 border border-blue-600' : 'hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600 shadow-sm shadow-blue-500/50"></span>
                  <span className="font-semibold text-blue-200 text-[11px]">75% - 85% Probability</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-blue-600 text-white px-1.5 py-0.2 rounded">
                  BLUE
                </span>
              </div>

              {/* Below 75%: GREEN */}
              <div
                onClick={() => setActiveFilter(activeFilter === 'GREEN' ? 'ALL' : 'GREEN')}
                className={`p-1.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                  activeFilter === 'GREEN' ? 'bg-emerald-950/90 border border-emerald-600' : 'hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 shadow-sm shadow-emerald-500/50"></span>
                  <span className="font-semibold text-emerald-200 text-[11px]">Below 75% Probability</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-emerald-600 text-white px-1.5 py-0.2 rounded">
                  GREEN
                </span>
              </div>
            </div>

            {activeFilter !== 'ALL' && (
              <button
                onClick={() => setActiveFilter('ALL')}
                className="w-full mt-1 text-[10px] text-slate-400 hover:text-white bg-slate-800/80 py-1 rounded text-center"
              >
                Reset Filter (Show All Probability Tiers)
              </button>
            )}
          </div>

          {/* QGIS Layers Controller */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Vulnerability Layers Tree
            </div>

            <div className="space-y-1 text-xs">
              {/* Hazard Zones Layer */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layersVisibility.hazardZones}
                    onChange={() => toggleLayer('hazardZones')}
                    className="rounded text-rose-600 focus:ring-rose-500 bg-slate-900 border-slate-700"
                  />
                  <span className="font-medium text-slate-200">Landslide Hazard Heatmap</span>
                </label>
                <button
                  onClick={() => toggleLayer('hazardZones')}
                  className="text-slate-400 hover:text-white"
                >
                  {layersVisibility.hazardZones ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
                </button>
              </div>

              {/* Vulnerable Villages */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layersVisibility.villages}
                    onChange={() => toggleLayer('villages')}
                    className="rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
                  />
                  <span className="font-medium text-slate-200">Vulnerable Villages & Habitats</span>
                </label>
                <button
                  onClick={() => toggleLayer('villages')}
                  className="text-slate-400 hover:text-white"
                >
                  {layersVisibility.villages ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
                </button>
              </div>

              {/* Road Network & Blockages */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layersVisibility.roads}
                    onChange={() => toggleLayer('roads')}
                    className="rounded text-blue-500 focus:ring-blue-500 bg-slate-900 border-slate-700"
                  />
                  <span className="font-medium text-slate-200">Highways & Road Status</span>
                </label>
                <button
                  onClick={() => toggleLayer('roads')}
                  className="text-slate-400 hover:text-white"
                >
                  {layersVisibility.roads ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
                </button>
              </div>

              {/* Critical Infrastructure */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layersVisibility.infrastructure}
                    onChange={() => toggleLayer('infrastructure')}
                    className="rounded text-indigo-500 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                  />
                  <span className="font-medium text-slate-200">Hospitals, Bridges, Helipads</span>
                </label>
                <button
                  onClick={() => toggleLayer('infrastructure')}
                  className="text-slate-400 hover:text-white"
                >
                  {layersVisibility.infrastructure ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
                </button>
              </div>

              {/* Sentinel-1 InSAR Deformation */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layersVisibility.insarRadar}
                    onChange={() => toggleLayer('insarRadar')}
                    className="rounded text-rose-500 focus:ring-rose-500 bg-slate-900 border-slate-700"
                  />
                  <span className="font-medium text-slate-200">Sentinel-1 InSAR Vectors</span>
                </label>
                <button
                  onClick={() => toggleLayer('insarRadar')}
                  className="text-slate-400 hover:text-white"
                >
                  {layersVisibility.insarRadar ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
                </button>
              </div>

              {/* Citizen Location Pin */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layersVisibility.citizenLocation}
                    onChange={() => toggleLayer('citizenLocation')}
                    className="rounded text-rose-600 focus:ring-rose-500 bg-slate-900 border-slate-700"
                  />
                  <span className="font-medium text-rose-300">My Registered Location</span>
                </label>
                <button
                  onClick={() => toggleLayer('citizenLocation')}
                  className="text-slate-400 hover:text-white"
                >
                  {layersVisibility.citizenLocation ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
                </button>
              </div>
            </div>
          </div>

          {/* Opacity Slider */}
          <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Sliders className="w-3 h-3" /> Hazard Layer Opacity
              </span>
              <span className="font-mono">{Math.round(hazardOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={hazardOpacity}
              onChange={(e) => setHazardOpacity(parseFloat(e.target.value))}
              className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* State Quick Zoom Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Zoom to NER State (8 States)
            </label>
            <select
              id="select-ner-state-zoom"
              value={selectedState}
              onChange={(e) => handleStateZoom(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-rose-500"
            >
              <option value="ALL">All North Eastern Region (Overview)</option>
              <option value="Assam">Assam (Dima Hasao & Brahmaputra Hills)</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh (Tawang & Siang)</option>
              <option value="Meghalaya">Meghalaya (Sohra & Jaintia Slopes)</option>
              <option value="Manipur">Manipur (Noney & Tupul Railway Corridor)</option>
              <option value="Mizoram">Mizoram (Aizawl & Sairang Cut)</option>
              <option value="Nagaland">Nagaland (Kohima Phesama Ridge)</option>
              <option value="Tripura">Tripura (Jampui Hills)</option>
              <option value="Sikkim">Sikkim (Teesta Basin & Mangan Dzongu)</option>
            </select>

            {/* Quick State Focus Grid (All 8 NER States) */}
            <div className="grid grid-cols-2 gap-1.5 pt-1.5">
              {NER_STATES_FOCUS_LIST.map((st) => (
                <button
                  key={`sidebar-${st.id}`}
                  id={`btn-sidebar-focus-${st.id.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleStateZoom(st.id)}
                  className={`px-2 py-1.5 rounded-lg text-[10.5px] font-bold transition-all flex items-center gap-1.5 text-left border cursor-pointer ${
                    selectedState === st.id
                      ? `${st.activeClass} border-transparent`
                      : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-slate-600 hover:bg-slate-900'
                  }`}
                  title={`Focus on ${st.name}: ${st.keyLocations}`}
                >
                  <span className="text-xs">{st.icon}</span>
                  <span className="truncate">{st.shortName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Inspector Bar */}
        <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 space-y-1">
          <div className="flex justify-between items-center">
            <span>COORDS:</span>
            <span className="text-slate-200">
              {inspectorCoords ? `${inspectorCoords.lat}°N, ${inspectorCoords.lng}°E` : '26.2000°N, 92.8000°E'}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-500">
            <span>BOUNDS:</span>
            <span>NER Indian Map Only</span>
          </div>
        </div>
      </div>

      {/* Center/Right: Leaflet Map Canvas */}
      <div className="relative flex-1 h-full min-h-[450px] w-full">
        {/* Map Container */}
        <div ref={mapContainerRef} className="w-full h-full min-h-[450px] z-0 bg-slate-950" />

        {/* Floating Map Controls & Alert Circles Filter Overlay */}
        <div className="absolute top-3 left-3 right-3 sm:right-auto z-10 flex flex-wrap items-center gap-1.5 bg-slate-900/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-2xl text-xs max-w-full">
          {/* Base map switcher */}
          <div className="flex items-center gap-1 bg-slate-950/60 p-0.5 rounded-lg border border-slate-800/80">
            <button
              onClick={() => setBaseMap('dark')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                baseMap === 'dark' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dark Carto
            </button>
            <button
              onClick={() => setBaseMap('topo')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                baseMap === 'topo' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Topo
            </button>
            <button
              onClick={() => setBaseMap('standard')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                baseMap === 'standard' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              OSM
            </button>
          </div>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Quick Filter for Small Alert Circles */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1 hidden md:inline">
              Alert Circles:
            </span>
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-2 py-1 rounded-lg text-[10.5px] font-bold transition-all flex items-center gap-1 ${
                activeFilter === 'ALL'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/50'
              }`}
            >
              All ({NER_HAZARD_ZONES.length})
            </button>
            <button
              onClick={() => setActiveFilter(activeFilter === 'PURPLE' ? 'ALL' : 'PURPLE')}
              className={`px-2 py-1 rounded-lg text-[10.5px] font-bold transition-all flex items-center gap-1.5 ${
                activeFilter === 'PURPLE'
                  ? 'bg-purple-600 text-white ring-1 ring-purple-400 shadow-md shadow-purple-500/30'
                  : 'text-purple-300 hover:bg-purple-950/40 bg-slate-950/50'
              }`}
              title="95% - 100% Probability (PURPLE)"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm shadow-purple-500/60 animate-pulse"></span>
              <span>Purple 95-100% ({NER_HAZARD_ZONES.filter((z) => z.probability >= 95).length})</span>
            </button>
            <button
              onClick={() => setActiveFilter(activeFilter === 'ORANGE' ? 'ALL' : 'ORANGE')}
              className={`px-2 py-1 rounded-lg text-[10.5px] font-bold transition-all flex items-center gap-1.5 ${
                activeFilter === 'ORANGE'
                  ? 'bg-orange-600 text-white ring-1 ring-orange-400 shadow-md shadow-orange-500/30'
                  : 'text-orange-300 hover:bg-orange-950/40 bg-slate-950/50'
              }`}
              title="85% - 95% Probability (ORANGE)"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm shadow-orange-500/60"></span>
              <span>Orange 85-95% ({NER_HAZARD_ZONES.filter((z) => z.probability >= 85 && z.probability < 95).length})</span>
            </button>
            <button
              onClick={() => setActiveFilter(activeFilter === 'BLUE' ? 'ALL' : 'BLUE')}
              className={`px-2 py-1 rounded-lg text-[10.5px] font-bold transition-all flex items-center gap-1.5 ${
                activeFilter === 'BLUE'
                  ? 'bg-blue-600 text-white ring-1 ring-blue-400 shadow-md shadow-blue-500/30'
                  : 'text-blue-300 hover:bg-blue-950/40 bg-slate-950/50'
              }`}
              title="75% - 85% Probability (BLUE)"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/60"></span>
              <span>Blue 75-85% ({NER_HAZARD_ZONES.filter((z) => z.probability >= 75 && z.probability < 85).length})</span>
            </button>
            <button
              onClick={() => setActiveFilter(activeFilter === 'GREEN' ? 'ALL' : 'GREEN')}
              className={`px-2 py-1 rounded-lg text-[10.5px] font-bold transition-all flex items-center gap-1.5 ${
                activeFilter === 'GREEN'
                  ? 'bg-emerald-600 text-white ring-1 ring-emerald-400 shadow-md shadow-emerald-500/30'
                  : 'text-emerald-300 hover:bg-emerald-950/40 bg-slate-950/50'
              }`}
              title="Below 75% Probability (GREEN)"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/60"></span>
              <span>Green &lt;75% ({NER_HAZARD_ZONES.filter((z) => z.probability < 75).length})</span>
            </button>
          </div>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Quick Focus Chips for All 8 North Eastern States */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-0.5 hidden xl:inline">
              Focus State:
            </span>
            {NER_STATES_FOCUS_LIST.map((st) => (
              <button
                key={`toolbar-${st.id}`}
                id={`btn-map-focus-${st.id.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleStateZoom(st.id)}
                className={`px-2 py-1 rounded-lg text-[10.5px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  selectedState === st.id ? st.activeClass : st.idleClass
                }`}
                title={`Focus clearly on ${st.name} (${st.keyLocations})`}
              >
                <span>{st.icon}</span>
                <span>Focus {st.shortName}</span>
              </button>
            ))}
            <button
              onClick={() => setIsEvacuationOpen(true)}
              className="px-2 py-1 rounded-lg text-[10.5px] font-bold text-rose-300 hover:bg-rose-950/50 bg-slate-950/60 border border-rose-800/50 flex items-center gap-1"
              title="View Google Map enabled evacuation route & trajectory"
            >
              <Navigation className="w-3 h-3 text-rose-400" />
              <span>Evac Trajectory</span>
            </button>
            <button
              onClick={() => setIsAccuracyOpen(true)}
              className="px-2 py-1 rounded-lg text-[10.5px] font-bold text-indigo-300 hover:bg-indigo-950/50 bg-slate-950/60 border border-indigo-800/50 flex items-center gap-1"
              title="Verify Model Accuracy, False Alarms & Time Window"
            >
              <Target className="w-3 h-3 text-indigo-400" />
              <span>Model Accuracy</span>
            </button>
            <button
              onClick={() => setIsHistoricalOpen(true)}
              className="px-2 py-1 rounded-lg text-[10.5px] font-bold text-teal-300 hover:bg-teal-950/50 bg-slate-950/60 border border-teal-800/50 flex items-center gap-1"
              title="Inspect Historical Landslide Records & Thematic Map"
            >
              <History className="w-3 h-3 text-teal-400" />
              <span>Historical Map</span>
            </button>
          </div>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Reset Zoom */}
          <button
            onClick={handleResetNERView}
            className="px-2 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1 font-medium text-[11px]"
            title="Reset to whole North Eastern Region"
          >
            <Compass className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Reset Extent</span>
          </button>

          <span className="text-slate-700 hidden xl:inline">|</span>

          {/* Strict Geo-fence indicator */}
          <div className="hidden xl:flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-600/70 text-emerald-300 px-2.5 py-0.5 rounded-lg text-[10.5px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Map Extent Locked (Exact Image Bounds: 21.40°N – 29.75°N | 87.45°E – 97.35°E)</span>
          </div>
        </div>

        {/* Floating Notice when user attempts to inspect outside regional bounds */}
        {outsideNerNotice && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 bg-rose-950/95 border border-rose-500/80 text-rose-100 text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 backdrop-blur-md animate-in fade-in slide-in-from-top-2 max-w-lg">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>
              <strong>Outside Reference Map:</strong> Location is outside the authorized regional map area shown in the reference image.
            </span>
          </div>
        )}

        {/* Floating Selected Zone Quick Drawer: "What is the condition in that region" */}
        {selectedZone && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-[420px] max-h-[82vh] overflow-y-auto z-10 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm"
                    style={{
                      backgroundColor: getProbabilityColor(selectedZone.probability),
                      color: '#ffffff',
                    }}
                  >
                    {selectedZone.probability}% Probability • {selectedZone.probability >= 95 ? 'PURPLE' : selectedZone.probability >= 85 ? 'ORANGE' : selectedZone.probability >= 75 ? 'BLUE' : 'GREEN'} ALERT
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {selectedZone.lat.toFixed(3)}°N, {selectedZone.lng.toFixed(3)}°E
                  </span>
                </div>
                <h4 className="text-base font-black text-white mt-1.5 tracking-tight">{selectedZone.name}</h4>
                <p className="text-xs text-slate-400 font-medium">
                  {selectedZone.district}, {selectedZone.state}
                </p>
              </div>
              <button
                onClick={() => setSelectedZone(null)}
                className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg p-1.5 transition-colors"
                title="Close condition card"
              >
                ✕
              </button>
            </div>

            {/* Region Condition Section */}
            <div className="mt-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800/90 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                <span>⚠️</span> Condition in this Region
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                {selectedZone.triggerCause}
              </p>
            </div>

            {/* Predictive Probability Range & Specific Time Window */}
            <div className="mt-2.5 bg-purple-950/40 border border-purple-800/60 rounded-xl p-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-purple-300">
                <span className="flex items-center gap-1">
                  <Percent className="w-3 h-3 text-purple-400" />
                  Probability Range
                </span>
                <span className="font-mono bg-purple-900/80 px-2 py-0.5 rounded text-white text-[11px]">
                  {selectedZone.probabilityRange ? `${selectedZone.probabilityRange[0]}% - ${selectedZone.probabilityRange[1]}%` : `${Math.max(selectedZone.probability - 4, 10)}% - ${Math.min(selectedZone.probability + 5, 99)}%`}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3 text-amber-400" />
                  Forecast Window:
                </span>
                <span className="font-semibold text-amber-200">
                  {selectedZone.forecastTimeWindow || 'Next 5-7 hours'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3 h-3 text-cyan-400" />
                  Forecast Date:
                </span>
                <span className="font-medium text-cyan-200">
                  Tuesday, 7th September
                </span>
              </div>

              {/* Model Accuracy & False Alarm transparency */}
              <div className="pt-1.5 border-t border-purple-900/50 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Model Accuracy:</span>
                <span className="font-mono font-bold text-emerald-300">{selectedZone.modelAccuracyPct || 93.8}%</span>
                <span className="text-slate-500">• FPR: {selectedZone.falsePositiveRatePct || 3.4}%</span>
                <span className="text-slate-500">• FNR: {selectedZone.falseNegativeRatePct || 1.8}%</span>
              </div>
            </div>

            {/* Google Map Evacuation and Accuracy Buttons */}
            <button
              onClick={() => setIsEvacuationOpen(true)}
              className="w-full mt-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Navigation className="w-3.5 h-3.5" />
              View Google Maps Evacuation Route & Trajectory ↗
            </button>
            <button
              onClick={() => setIsAccuracyOpen(true)}
              className="w-full mt-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold py-1 px-3 rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-all border border-slate-700"
            >
              <Target className="w-3 h-3 text-indigo-400" />
              Inspect Accuracy Metrics & Submit Field Observation
            </button>

            {/* Telemetry Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 mt-2.5 text-center">
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-[9px] uppercase text-slate-400 font-bold block">24h Rainfall</span>
                <span className="text-xs font-black text-amber-300">{selectedZone.rainfall24hMm} mm</span>
                <span className="text-[8px] text-slate-500 block">IMD / GPM</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-[9px] uppercase text-slate-400 font-bold block">SMAP Soil Sat</span>
                <span className="text-xs font-black text-cyan-300">{selectedZone.soilMoistureSatPct}%</span>
                <span className="text-[8px] text-slate-500 block">Pore Saturation</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-[9px] uppercase text-slate-400 font-bold block">DEM Slope</span>
                <span className="text-xs font-black text-emerald-300">{selectedZone.slopeDeg}°</span>
                <span className="text-[8px] text-slate-500 block">SRTM Angle</span>
              </div>
            </div>

            {/* Infrastructure & Community Impact */}
            <div className="mt-2.5 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/70 text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Vulnerable Settlements:</span>
                <span className="font-bold text-white">{selectedZone.vulnerableVillagesCount} villages at risk</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Affected Arteries:</span>
                <span className="font-semibold text-sky-300">{selectedZone.affectedRoads.join(', ')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Sentinel-1 InSAR:</span>
                <span className="font-mono text-purple-300">{selectedZone.insarDeformationMmYr} mm/yr deformation</span>
              </div>
            </div>

            {/* Action Required */}
            <div
              className="mt-2.5 p-2.5 rounded-xl border text-[11px] leading-relaxed"
              style={{
                backgroundColor: `${getProbabilityColor(selectedZone.probability)}15`,
                borderColor: `${getProbabilityColor(selectedZone.probability)}50`,
                color: '#f8fafc',
              }}
            >
              <strong
                className="uppercase text-[9.5px] font-bold block mb-1"
                style={{ color: getProbabilityColor(selectedZone.probability) }}
              >
                Recommended Action for Residents & Travelers:
              </strong>
              {selectedZone.recommendedAction}
            </div>

            {/* Actions Bar */}
            <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  mapInstanceRef.current?.flyTo([selectedZone.lat, selectedZone.lng], 11, { duration: 1 });
                }}
                className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 py-1"
              >
                <Compass className="w-3.5 h-3.5" /> Re-Center on Circle
              </button>
              <button
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(
                      `Landslide Alert: ${selectedZone.name} (${selectedZone.probability}% Probability - ${selectedZone.district}, ${selectedZone.state}). Condition: ${selectedZone.triggerCause}. Action: ${selectedZone.recommendedAction}`
                    );
                    setCopiedBulletin(true);
                    setTimeout(() => setCopiedBulletin(false), 2500);
                  }
                }}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-lg font-medium transition-colors"
              >
                {copiedBulletin ? '✓ Copied!' : 'Copy Bulletin'}
              </button>
            </div>
          </div>
        )}

        {/* Floating Quick State Focus Dock on Map Canvas (All 8 North Eastern States) */}
        <div className="absolute bottom-3 right-3 sm:right-4 z-10 hidden md:flex items-center gap-1 bg-slate-900/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-800 shadow-2xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Compass className="w-3 h-3 text-rose-400" />
            <span>State Focus:</span>
          </span>
          <button
            onClick={handleResetNERView}
            className={`px-2 py-0.5 rounded-lg text-[10.5px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              selectedState === 'ALL'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 bg-slate-950/60 border border-slate-800'
            }`}
            title="Overview of all 8 North Eastern States"
          >
            <span>🇮🇳</span>
            <span>All NER</span>
          </button>
          {NER_STATES_FOCUS_LIST.map((st) => (
            <button
              key={`dock-${st.id}`}
              id={`btn-canvas-dock-${st.id.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => handleStateZoom(st.id)}
              className={`px-2 py-0.5 rounded-lg text-[10.5px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                selectedState === st.id ? st.activeClass : st.idleClass
              }`}
              title={`Focus on ${st.name}: ${st.keyLocations}`}
            >
              <span>{st.icon}</span>
              <span>{st.shortName}</span>
            </button>
          ))}
        </div>
      </div>
      </div>

      {/* Evacuation Route & Trajectory Modal (Google Maps enabled) */}
      <EvacuationRouteTrajectoryModal
        isOpen={isEvacuationOpen}
        onClose={() => setIsEvacuationOpen(false)}
        defaultZoneId={selectedZone?.id}
      />

      {/* Model Prediction Transparency, Accuracy & Feedback Modal */}
      <PredictionAccuracyFeedbackModal
        isOpen={isAccuracyOpen}
        onClose={() => setIsAccuracyOpen(false)}
        currentZone={selectedZone || undefined}
      />

      {/* Historical Landslide Analysis & Thematic Map Modal */}
      <HistoricalAnalysisMap
        isOpen={isHistoricalOpen}
        onClose={() => setIsHistoricalOpen(false)}
        onSelectZone={(z: any) => {
          setSelectedZone(z);
          mapInstanceRef.current?.flyTo([z.lat, z.lng], 11);
        }}
      />
    </div>
  );
};
