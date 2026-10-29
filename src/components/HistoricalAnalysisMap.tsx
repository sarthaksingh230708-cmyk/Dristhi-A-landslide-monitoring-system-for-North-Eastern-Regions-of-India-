import React, { useState } from 'react';
import {
  History,
  Calendar,
  Layers,
  CloudRain,
  Droplets,
  Activity,
  AlertTriangle,
  Info,
  MapPin,
  Filter,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Eye,
  BarChart3,
  Flame,
  X,
} from 'lucide-react';
import {
  HISTORICAL_LANDSLIDES_DATA,
  MONSOON_GRADIENT_REGIONS,
  SOIL_MOISTURE_REGIONS,
  TECTONIC_MOVEMENTS_REGIONS,
} from '../data/historicalLandslides';
import { HistoricalLandslideEvent, ThematicLayerType } from '../types';

interface HistoricalAnalysisMapProps {
  isOpen?: boolean;
  onClose?: () => void;
  inline?: boolean;
  onSelectZone?: (zone: any) => void;
}

export const HistoricalAnalysisMap: React.FC<HistoricalAnalysisMapProps> = ({
  isOpen = true,
  onClose,
  inline = false,
  onSelectZone,
}) => {
  const [timeFilter, setTimeFilter] = useState<'LAST_WEEK' | 'LAST_MONTH' | 'LAST_YEAR' | 'ALL'>('ALL');
  const [causeFilter, setCauseFilter] = useState<string>('ALL');
  const [activeThematicLayer, setActiveThematicLayer] = useState<ThematicLayerType>('ALL_COMBINED');
  const [selectedEvent, setSelectedEvent] = useState<HistoricalLandslideEvent | null>(
    HISTORICAL_LANDSLIDES_DATA[0]
  );

  if (!inline && !isOpen) return null;

  // Filter events based on time and cause
  const filteredEvents = HISTORICAL_LANDSLIDES_DATA.filter((event) => {
    if (timeFilter === 'LAST_WEEK' && event.timePeriodCategory !== 'LAST_WEEK') return false;
    if (timeFilter === 'LAST_MONTH' && event.timePeriodCategory !== 'LAST_WEEK' && event.timePeriodCategory !== 'LAST_MONTH') {
      return false;
    }
    if (timeFilter === 'LAST_YEAR' && event.timePeriodCategory === 'ARCHIVE') return false;
    if (causeFilter !== 'ALL' && event.primaryCause !== causeFilter) return false;
    return true;
  });

  const uniqueCauses = Array.from(new Set(HISTORICAL_LANDSLIDES_DATA.map((e) => e.primaryCause)));

  const content = (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-900 max-w-6xl w-full max-h-[92vh]">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-sky-800/40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                Historical Landslide Geological Analysis &amp; Thematic Map
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-mono font-bold border border-sky-500/40">
                GSI HISTORICAL ARCHIVE
              </span>
            </div>
            <p className="text-xs text-sky-200/90 mt-0.5">
              Multi-temporal analysis (Last Week, Month, Year) correlated with Monsoon, Soil Saturation &amp; Tectonic Fault movements
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter and Thematic Selector Controls */}
      <div className="bg-slate-100 border-b border-slate-200 p-3.5 space-y-2.5 text-xs">
        {/* Row 1: Time Periods & Thematic Overlays */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Time Period Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="font-bold text-slate-600 whitespace-nowrap flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span>Historical Period:</span>
            </span>
            <button
              onClick={() => setTimeFilter('LAST_WEEK')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                timeFilter === 'LAST_WEEK'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              Last 7 Days (Recent)
            </button>
            <button
              onClick={() => setTimeFilter('LAST_MONTH')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                timeFilter === 'LAST_MONTH'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              Last Month (30 Days)
            </button>
            <button
              onClick={() => setTimeFilter('LAST_YEAR')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                timeFilter === 'LAST_YEAR'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              Last Year (365 Days)
            </button>
            <button
              onClick={() => setTimeFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                timeFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              Complete Archive (All)
            </button>
          </div>

          {/* Thematic Layers Toggle */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="font-bold text-slate-600 whitespace-nowrap flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Thematic Map:</span>
            </span>
            <button
              onClick={() => setActiveThematicLayer('MONSOON')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeThematicLayer === 'MONSOON'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Monsoon Rain</span>
            </button>
            <button
              onClick={() => setActiveThematicLayer('SOIL_MOISTURE')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeThematicLayer === 'SOIL_MOISTURE'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Soil Moisture</span>
            </button>
            <button
              onClick={() => setActiveThematicLayer('TECTONIC_MOVEMENTS')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeThematicLayer === 'TECTONIC_MOVEMENTS'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Tectonic Faults</span>
            </button>
            <button
              onClick={() => setActiveThematicLayer('ALL_COMBINED')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeThematicLayer === 'ALL_COMBINED'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <span>Multi-Gradient</span>
            </button>
          </div>
        </div>

        {/* Row 2: Cause Filter Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1">
          <span className="font-bold text-slate-500 whitespace-nowrap flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-500" />
            <span>Filter Primary Cause:</span>
          </span>
          <button
            onClick={() => setCauseFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
              causeFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Causes ({HISTORICAL_LANDSLIDES_DATA.length})
          </button>
          {uniqueCauses.map((cause) => (
            <button
              key={cause}
              onClick={() => setCauseFilter(cause)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap cursor-pointer ${
                causeFilter === cause
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cause}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area: Split View */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Thematic Regional Gradients & Event List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Thematic Gradient Legend Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Thematic Environmental Analysis</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                {activeThematicLayer === 'MONSOON' && 'IMD Doppler & Isohyetal Isobars'}
                {activeThematicLayer === 'SOIL_MOISTURE' && 'SMAP Satellite Soil Moisture Depth'}
                {activeThematicLayer === 'TECTONIC_MOVEMENTS' && 'GPS Crustal Velocity & Seismic Faults'}
                {activeThematicLayer === 'ALL_COMBINED' && 'Composite Multi-Factor Gradient Model'}
              </span>
            </div>

            {/* Render selected thematic gradient cards */}
            {(activeThematicLayer === 'MONSOON' || activeThematicLayer === 'ALL_COMBINED') && (
              <div className="mt-2 space-y-1.5">
                <div className="text-[11px] font-bold text-sky-300 flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                  <span>Monsoon Precipitation Intensity Gradient</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {MONSOON_GRADIENT_REGIONS.map((reg) => (
                    <div
                      key={reg.id}
                      className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-2 text-[10px]"
                    >
                      <strong className="text-white block font-bold truncate">{reg.regionName}</strong>
                      <span className="text-sky-300 font-bold block">{reg.precipitationLevel}</span>
                      <span className="text-slate-400">{reg.seasonalRainfallMm} mm avg</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeThematicLayer === 'SOIL_MOISTURE' || activeThematicLayer === 'ALL_COMBINED') && (
              <div className="mt-3 space-y-1.5 pt-2 border-t border-slate-800">
                <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-amber-400" />
                  <span>Subsurface Soil Moisture &amp; Saturation Gradient</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SOIL_MOISTURE_REGIONS.map((reg) => (
                    <div
                      key={reg.id}
                      className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-2 text-[10px]"
                    >
                      <strong className="text-white block font-bold truncate">{reg.regionName}</strong>
                      <span className="text-amber-300 font-bold block">{reg.saturationLevel}</span>
                      <span className="text-slate-400">{reg.soilMoistureSatPct}% sat.</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeThematicLayer === 'TECTONIC_MOVEMENTS' || activeThematicLayer === 'ALL_COMBINED') && (
              <div className="mt-3 space-y-1.5 pt-2 border-t border-slate-800">
                <div className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                  <span>Tectonic Fault Displacements &amp; Crustal Shear</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {TECTONIC_MOVEMENTS_REGIONS.map((reg) => (
                    <div
                      key={reg.id}
                      className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-2 text-[10px]"
                    >
                      <strong className="text-white block font-bold truncate">{reg.regionName}</strong>
                      <span className="text-purple-300 font-bold block truncate">{reg.faultSystem}</span>
                      <span className="text-slate-400">{reg.crustalDeformationMmYr} mm/yr slip</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filtered Historical Events List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <History className="w-4 h-4 text-sky-600" />
                <span>Historical Events ({filteredEvents.length} Recorded Incidents)</span>
              </h4>
              <span className="text-[11px] text-slate-500">Click any incident to inspect cause analysis</span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredEvents.map((event) => {
                const isSelected = selectedEvent?.id === event.id;
                return (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`border rounded-2xl p-3.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/80 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              event.fatalities > 0 ? 'bg-rose-500 animate-ping' : 'bg-amber-500'
                            }`}
                          ></span>
                          <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{event.locationName}</h5>
                          <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10px] font-bold">
                            {event.state}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">
                          <strong>Cause:</strong> {event.primaryCause} ({event.rainfallAtTriggerMm}mm rainfall)
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md block">
                          {event.date}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          {event.timePeriodCategory === 'LAST_WEEK'
                            ? 'Past 7 Days'
                            : event.timePeriodCategory === 'LAST_MONTH'
                            ? 'Past Month'
                            : 'Historical'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Forensic Cause & Scientific Breakdown (5 cols) */}
        <div className="lg:col-span-5">
          {selectedEvent ? (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 sticky top-0">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 font-mono">
                    Incident Forensic Dossier #{selectedEvent.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold">
                    {selectedEvent.date}
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  {selectedEvent.locationName}, {selectedEvent.district} ({selectedEvent.state})
                </h3>
                <span className="text-[11px] font-mono text-slate-500 block mt-0.5">
                  Coordinates: {selectedEvent.lat.toFixed(3)}°N, {selectedEvent.lng.toFixed(3)}°E
                </span>
              </div>

              {/* Exact Primary & Secondary Geological Causes */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
                <strong className="text-xs text-slate-900 block font-black uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Exact Primary Cause</span>
                </strong>
                <p className="text-xs text-slate-800 font-bold leading-relaxed">{selectedEvent.primaryCause}</p>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 leading-relaxed">
                  <strong>Trigger Mechanism:</strong> {selectedEvent.triggerMechanism}
                </div>
              </div>

              {/* Telemetry At Time of Trigger */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white border border-slate-200 rounded-xl p-3">
                  <span className="text-[10px] text-slate-500 uppercase block font-medium">Antecedent Rainfall</span>
                  <strong className="text-sm font-black text-sky-700">{selectedEvent.rainfallAtTriggerMm} mm</strong>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3">
                  <span className="text-[10px] text-slate-500 uppercase block font-medium">Slope Gradient</span>
                  <strong className="text-sm font-black text-amber-700">{selectedEvent.slopeDegrees}° Incline</strong>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3">
                  <span className="text-[10px] text-slate-500 uppercase block font-medium">Debris Volume</span>
                  <strong className="text-sm font-black text-purple-700">{selectedEvent.debrisVolumeM3.toLocaleString()} m³</strong>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3">
                  <span className="text-[10px] text-slate-500 uppercase block font-medium">Human Fatalities</span>
                  <strong className="text-sm font-black text-rose-700">{selectedEvent.fatalities} Lost</strong>
                </div>
              </div>

              {/* Geological Formation & Damage */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-xs space-y-1.5">
                <div>
                  <strong className="text-slate-900">Bedrock / Geological Formation:</strong>
                  <p className="text-slate-600 text-[11px] mt-0.5">{selectedEvent.geologicalFormation}</p>
                </div>
                <div className="pt-1.5 border-t border-slate-100">
                  <strong className="text-slate-900">Infrastructural Impact:</strong>
                  <p className="text-slate-600 text-[11px] mt-0.5">{selectedEvent.infrastructureDamaged}</p>
                </div>
              </div>

              {/* GSI Scientific Link */}
              <div className="flex items-center justify-between text-xs text-sky-800 bg-sky-100/70 rounded-xl p-3 font-medium">
                <span className="flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-sky-600" />
                  <span>GSI Geological Record: {selectedEvent.gsiReportRef}</span>
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedEvent.lat},${selectedEvent.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold underline flex items-center gap-0.5 hover:text-sky-950"
                >
                  <span>Pin Map</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100 rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              Select an incident from the historical timeline to inspect its geological cause breakdown.
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs">
        <span className="text-slate-500">
          Source: Geological Survey of India (GSI) North Eastern Region Landslide Inventory &amp; IMD Agartala/Gangtok Radars
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
          >
            Close Analysis
          </button>
        )}
      </div>
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-150">
      {content}
    </div>
  );
};
