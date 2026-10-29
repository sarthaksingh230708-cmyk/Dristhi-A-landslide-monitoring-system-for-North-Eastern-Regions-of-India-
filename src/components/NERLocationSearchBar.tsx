import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MapPin,
  AlertOctagon,
  ShieldCheck,
  Navigation,
  CheckCircle,
  Volume2,
  X,
  Droplets,
  Activity,
  Mountain,
  Home,
  PhoneCall,
} from 'lucide-react';
import {
  evaluateLocationCondition,
  LocationConditionResult,
  NER_PLACES_DIRECTORY,
} from '../utils/nerSearch';
import { citizenService } from '../services/citizenService';
import { voiceAlert } from '../services/voiceAlertService';
import { notificationService } from '../services/notificationService';

interface NERLocationSearchBarProps {
  onLocationSelected?: (result: LocationConditionResult) => void;
  onProfileUpdated?: () => void;
}

export const NERLocationSearchBar: React.FC<NERLocationSearchBarProps> = ({
  onLocationSelected,
  onProfileUpdated,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<typeof NER_PLACES_DIRECTORY>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [conditionResult, setConditionResult] = useState<LocationConditionResult | null>(null);
  const [isSavedToProfile, setIsSavedToProfile] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update suggestions as user types
  const handleInputChange = (val: string) => {
    setQuery(val);
    if (val.trim().length > 1) {
      const q = val.toLowerCase().trim();
      const filtered = NER_PLACES_DIRECTORY.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q)
      ).slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (searchQuery?: string) => {
    const term = (searchQuery || query).trim();
    if (!term) return;

    setShowSuggestions(false);
    const result = evaluateLocationCondition(term);
    setConditionResult(result);
    setIsSavedToProfile(false);

    if (onLocationSelected) {
      onLocationSelected(result);
    }
  };

  const handleSelectSuggestion = (place: (typeof NER_PLACES_DIRECTORY)[0]) => {
    setQuery(place.name);
    setShowSuggestions(false);
    const result = evaluateLocationCondition(
      place.name,
      place.state,
      place.district,
      place.lat,
      place.lng
    );
    setConditionResult(result);
    setIsSavedToProfile(false);

    if (onLocationSelected) {
      onLocationSelected(result);
    }
  };

  const handleSetAsProfileLocation = () => {
    if (!conditionResult) return;

    citizenService.updateProfile({
      villageOrTown: conditionResult.placeName,
      district: conditionResult.district,
      state: conditionResult.state as any,
      lat: conditionResult.lat,
      lng: conditionResult.lng,
    });

    notificationService.notify({
      title: `Location Alert Updated: ${conditionResult.placeName}`,
      message: `Landslide condition evaluated at ${conditionResult.probability}% (${conditionResult.colorName}). Nearest shelter: ${conditionResult.nearestShelter}`,
      priority: conditionResult.probability >= 95 ? 'CRITICAL' : conditionResult.probability >= 85 ? 'HIGH' : 'INFO',
    });

    setIsSavedToProfile(true);
    if (onProfileUpdated) {
      onProfileUpdated();
    }
  };

  const handlePlayVoice = async () => {
    if (!conditionResult) return;
    setIsSpeaking(true);
    try {
      const text = `Alert for ${conditionResult.placeName}, ${conditionResult.district}, ${conditionResult.state}. Landslide risk is ${conditionResult.probability} percent, color level ${conditionResult.colorName}. ${conditionResult.actionRequired}`;
      await voiceAlert.broadcastAlert(text, 'en-IN', false);
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full space-y-2.5">
      {/* Search Input Bar */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="input-ner-place-search"
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            onFocus={() => query.trim().length > 1 && setShowSuggestions(true)}
            placeholder="Search any place in NER (e.g. Haflong, Mangan, Kohima, Tawang, Aizawl, Cherrapunji)..."
            className="w-full bg-slate-900 text-slate-100 placeholder-slate-400 border border-slate-700/80 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setConditionResult(null);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          id="btn-submit-place-search"
          onClick={() => handleSearch()}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-purple-950/40 transition-all active:scale-98 whitespace-nowrap"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Check Condition</span>
        </button>
      </div>

      {/* Auto-suggest dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-w-xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden divide-y divide-slate-800 text-xs animate-in fade-in zoom-in-95">
          {suggestions.map((item) => (
            <div
              key={`${item.name}-${item.district}`}
              onClick={() => handleSelectSuggestion(item)}
              className="p-2.5 hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <div>
                  <span className="font-bold text-white block">{item.name}</span>
                  <span className="text-[10px] text-slate-400">
                    {item.district}, {item.state} • {item.type}
                  </span>
                </div>
              </div>
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded font-bold"
                style={{
                  backgroundColor:
                    (item.baseRisk || 70) >= 95
                      ? '#9333EA'
                      : (item.baseRisk || 70) >= 85
                      ? '#EA580C'
                      : (item.baseRisk || 70) >= 75
                      ? '#2563EB'
                      : '#16A34A',
                  color: '#FFFFFF',
                }}
              >
                {item.baseRisk || 70}% Risk
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Quick Place Chips */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
        <span className="text-slate-400 font-medium mr-1">Quick Check:</span>
        {['Haflong (98%)', 'Mangan (96%)', 'Tupul (97%)', 'Kohima (91%)', 'Tawang (89%)', 'Sohra (87%)', 'Aizawl (82%)', 'Gangtok (76%)', 'Guwahati (59%)'].map((chip) => {
          const rawName = chip.split(' ')[0];
          return (
            <button
              key={chip}
              onClick={() => {
                setQuery(rawName);
                handleSearch(rawName);
              }}
              className="bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white px-2 py-1 rounded-lg border border-slate-800 text-[10px] font-medium transition-colors"
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* Searched Location Condition Result Card */}
      {conditionResult && (
        <div
          id="searched-location-condition-card"
          className="rounded-2xl border p-4 sm:p-5 shadow-2xl transition-all animate-in fade-in slide-in-from-top-2"
          style={{
            borderColor: conditionResult.color,
            backgroundColor:
              conditionResult.colorName === 'PURPLE'
                ? 'rgba(88, 28, 135, 0.25)'
                : conditionResult.colorName === 'ORANGE'
                ? 'rgba(124, 45, 18, 0.25)'
                : conditionResult.colorName === 'BLUE'
                ? 'rgba(30, 58, 138, 0.25)'
                : 'rgba(6, 78, 59, 0.25)',
          }}
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            {/* Left detail column */}
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-black uppercase text-white flex items-center gap-1.5 shadow-md"
                  style={{ backgroundColor: conditionResult.color }}
                >
                  {conditionResult.hasActiveLandslideThreat ? (
                    <AlertOctagon className="w-4 h-4" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  <span>
                    {conditionResult.probability}% Risk • {conditionResult.colorName}
                  </span>
                </span>

                <span className="bg-slate-900/90 text-slate-200 border border-slate-700/80 px-2.5 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-400" />
                  {conditionResult.placeName}, {conditionResult.district} ({conditionResult.state})
                </span>

                <span className="text-[10px] font-mono text-slate-400">
                  {conditionResult.lat.toFixed(4)}°N, {conditionResult.lng.toFixed(4)}°E
                </span>
              </div>

              {/* Condition Statement */}
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full animate-pulse"
                    style={{ backgroundColor: conditionResult.color }}
                  ></span>
                  <strong className="text-xs sm:text-sm text-white font-bold">
                    Landslide Condition:{' '}
                    <span style={{ color: conditionResult.color }}>
                      {conditionResult.hasActiveLandslideThreat
                        ? 'Active Landslide Hazard Condition Present'
                        : 'No Active Landslide / Slope Conditions Stable'}
                    </span>
                  </strong>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {conditionResult.conditionDescription}
                </p>
              </div>

              {/* Key Environmental Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1">
                    <Droplets className="w-3 h-3 text-cyan-400" /> Rainfall (24h)
                  </span>
                  <span className="font-mono font-bold text-cyan-300 text-xs mt-0.5 block">
                    {conditionResult.rainfallMm} mm
                  </span>
                </div>

                <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1">
                    <Activity className="w-3 h-3 text-amber-400" /> Soil Saturation
                  </span>
                  <span className="font-mono font-bold text-amber-300 text-xs mt-0.5 block">
                    {conditionResult.soilMoisturePct}%
                  </span>
                </div>

                <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1">
                    <Mountain className="w-3 h-3 text-emerald-400" /> Slope Angle
                  </span>
                  <span className="font-mono font-bold text-emerald-300 text-xs mt-0.5 block">
                    {conditionResult.slopeDegrees}°
                  </span>
                </div>

                <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1">
                    <Home className="w-3 h-3 text-rose-400" /> Nearest Fault
                  </span>
                  <span className="font-mono font-bold text-rose-300 text-xs mt-0.5 block">
                    {conditionResult.distanceToHazardKm} km
                  </span>
                </div>
              </div>

              {/* Action and shelter */}
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="text-slate-200">
                  <strong className="text-white">Designated Shelter:</strong> {conditionResult.nearestShelter} (Capacity: {conditionResult.shelterCapacity} persons)
                </div>
                <div className="text-amber-200">
                  <strong className="text-amber-400">Action Required:</strong> {conditionResult.actionRequired}
                </div>
                <div className="text-slate-400 text-[11px] flex items-center gap-1">
                  <PhoneCall className="w-3 h-3 text-rose-400" />
                  <span>State Helpline: <strong>{conditionResult.stateHelpline}</strong></span>
                </div>
              </div>
            </div>

            {/* Right Action buttons */}
            <div className="flex flex-row md:flex-col items-center gap-2 md:w-56 shrink-0">
              {onLocationSelected && (
                <button
                  id="btn-fly-to-searched-place"
                  onClick={() => onLocationSelected(conditionResult)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                >
                  <Navigation className="w-3.5 h-3.5 text-purple-400" />
                  <span>Inspect on Map</span>
                </button>
              )}

              <button
                id="btn-set-searched-profile-location"
                onClick={handleSetAsProfileLocation}
                disabled={isSavedToProfile}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                  isSavedToProfile
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white shadow-purple-950/40'
                }`}
              >
                {isSavedToProfile ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                    <span>Location Registered!</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Set as My Profile Location</span>
                  </>
                )}
              </button>

              <button
                id="btn-voice-alert-searched"
                onClick={handlePlayVoice}
                disabled={isSpeaking}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-amber-400' : ''}`} />
                <span>{isSpeaking ? 'Announcing...' : 'Voice Broadcast'}</span>
              </button>

              <button
                onClick={() => setConditionResult(null)}
                className="w-full text-slate-400 hover:text-white text-[11px] py-1 text-center"
              >
                Dismiss Condition Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
