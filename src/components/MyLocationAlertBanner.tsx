import React, { useState } from 'react';
import {
  AlertTriangle,
  Volume2,
  PhoneCall,
  MapPin,
  ShieldAlert,
  VolumeX,
} from 'lucide-react';
import { CitizenProfile, HazardZone } from '../types';
import { LanguagePack } from '../data/languages';
import { voiceAlert } from '../services/voiceAlertService';
import { NER_HAZARD_ZONES, NER_VILLAGES_QGIS, NER_HELPLINES } from '../data/nerData';

interface MyLocationAlertBannerProps {
  profile: CitizenProfile;
  langPack: LanguagePack;
  onOpenProfile: () => void;
  onOpenHelpline: () => void;
}

export const MyLocationAlertBanner: React.FC<MyLocationAlertBannerProps> = ({
  profile,
  langPack,
  onOpenProfile,
  onOpenHelpline,
}) => {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  // Find nearest hazard zone or compute customized probability based on registered village/district
  const matchedZone: HazardZone = React.useMemo(() => {
    // Check if zone matches user district/state
    const exactMatch = NER_HAZARD_ZONES.find(
      (z) =>
        z.state.toLowerCase() === profile.state.toLowerCase() &&
        z.district.toLowerCase().includes(profile.district.toLowerCase())
    );
    if (exactMatch) return exactMatch;

    const stateMatch = NER_HAZARD_ZONES.find(
      (z) => z.state.toLowerCase() === profile.state.toLowerCase()
    );
    return stateMatch || NER_HAZARD_ZONES[0];
  }, [profile.state, profile.district]);

  // Find nearest mapped village asset to show shelter & capacity
  const matchedVillage = React.useMemo(() => {
    const vMatch = NER_VILLAGES_QGIS.find(
      (v) =>
        v.name.toLowerCase().includes(profile.villageOrTown.toLowerCase()) ||
        v.district.toLowerCase() === profile.district.toLowerCase()
    );
    return (
      vMatch || {
        name: profile.villageOrTown,
        nearestShelter: 'District Administrative Disaster Relief Shelter',
        shelterCapacity: 850,
        distanceToFaultKm: 2.1,
      }
    );
  }, [profile.villageOrTown, profile.district]);

  const prob = matchedZone.probability;

  // Determine color and category with high contrast for white background
  let categoryColor = 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-sm';
  let badgeColor = 'bg-emerald-600 text-white';
  let severityLabel = 'SAFE / LOW HAZARD (< 75%) - GREEN';
  let bannerPhraseTitle = langPack.phrases.darkGreenTitle;
  let bannerPhraseDesc = langPack.phrases.darkGreenDesc;

  if (prob >= 95) {
    categoryColor = 'bg-purple-50/90 border-purple-400 text-purple-950 shadow-md';
    badgeColor = 'bg-purple-700 text-white animate-pulse';
    severityLabel = 'CRITICAL DANGER (95% - 100%) - PURPLE';
    bannerPhraseTitle = langPack.phrases.redWarningTitle;
    bannerPhraseDesc = langPack.phrases.redWarningDesc;
  } else if (prob >= 85) {
    categoryColor = 'bg-amber-50/90 border-amber-400 text-amber-950 shadow-md';
    badgeColor = 'bg-amber-600 text-white font-bold';
    severityLabel = 'HIGH ALERT (85% - 95%) - ORANGE';
    bannerPhraseTitle = langPack.phrases.darkYellowTitle;
    bannerPhraseDesc = langPack.phrases.darkYellowDesc;
  } else if (prob >= 75) {
    categoryColor = 'bg-blue-50/90 border-blue-400 text-blue-950 shadow-md';
    badgeColor = 'bg-blue-600 text-white';
    severityLabel = 'MODERATE RISK (75% - 85%) - BLUE';
    bannerPhraseTitle = langPack.phrases.blueTitle;
    bannerPhraseDesc = langPack.phrases.blueDesc;
  }

  // Find state helpline
  const stateHelpline =
    NER_HELPLINES.find((h) => h.state.toLowerCase() === profile.state.toLowerCase()) ||
    NER_HELPLINES[0];

  const handleTriggerVoice = async () => {
    setIsPlayingVoice(true);
    try {
      const broadcastText = `${langPack.phrases.voiceBroadcast} Alert for ${profile.villageOrTown}, ${profile.district}, ${profile.state}. Landslide probability is ${prob} percent. Designated emergency shelter is ${matchedVillage.nearestShelter}.`;
      await voiceAlert.broadcastAlert(broadcastText, 'en-IN', false);
    } finally {
      setIsPlayingVoice(false);
    }
  };

  const handleStopVoice = () => {
    voiceAlert.stopAll();
    setIsPlayingVoice(false);
  };

  return (
    <div
      id="citizen-location-alert-card"
      className={`border-2 rounded-3xl p-4 sm:p-6 transition-all mb-5 ${categoryColor}`}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        {/* Left: Location details and Hazard status */}
        <div className="flex-1 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              id="citizen-alert-severity-badge"
              className={`text-xs px-3 py-1 rounded-full font-black tracking-wider uppercase flex items-center gap-1.5 shadow-xs ${badgeColor}`}
            >
              <ShieldAlert className="w-4 h-4" />
              {severityLabel}
            </span>
            <span className="bg-white px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 border border-slate-300 flex items-center gap-1 shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              {profile.villageOrTown}, {profile.district} ({profile.state})
            </span>
            <button
              id="btn-edit-registered-location"
              onClick={onOpenProfile}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold underline underline-offset-2 ml-1"
            >
              Change Location
            </button>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2 text-slate-950">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600" />
              <span>{bannerPhraseTitle}</span>
              <span className="text-xs sm:text-sm font-mono font-black px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-900 ml-auto sm:ml-2">
                Prob: {prob}%
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
              {bannerPhraseDesc}
            </p>
          </div>

          {/* Environmental factors for citizen's location */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="bg-white/80 px-3 py-2 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase text-slate-500 block font-bold font-mono">24h Rainfall</span>
              <span className="text-xs sm:text-sm font-black text-slate-900">
                {matchedZone.rainfall24hMm} mm
              </span>
            </div>
            <div className="bg-white/80 px-3 py-2 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase text-slate-500 block font-bold font-mono">Soil Saturation</span>
              <span className="text-xs sm:text-sm font-black text-slate-900">
                {matchedZone.soilMoistureSatPct}% (SMAP)
              </span>
            </div>
            <div className="bg-white/80 px-3 py-2 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase text-slate-500 block font-bold font-mono">Slope Angle</span>
              <span className="text-xs sm:text-sm font-black text-slate-900">
                {matchedZone.slopeDeg}° (Bhuvan DEM)
              </span>
            </div>
            <div className="bg-white/80 px-3 py-2 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase text-slate-500 block font-bold font-mono">InSAR Slip</span>
              <span className="text-xs sm:text-sm font-black text-rose-600">
                {matchedZone.insarDeformationMmYr} mm/yr
              </span>
            </div>
          </div>

          {/* Nearest Shelter and evacuation advice */}
          <div className="bg-white/90 rounded-2xl p-3 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div>
              <span className="text-slate-500 block font-mono text-[10px] font-bold">
                NEAREST DESIGNATED SAFE RELIEF SHELTER:
              </span>
              <span className="font-extrabold text-slate-900">
                {matchedVillage.nearestShelter} (Capacity: {matchedVillage.shelterCapacity} Persons)
              </span>
            </div>
            <div className="text-slate-700 text-[11px] font-medium italic">
              {matchedZone.recommendedAction}
            </div>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-64 flex-shrink-0">
          {/* Voice Alert broadcast button */}
          <button
            id="btn-trigger-voice-alert-my-loc"
            onClick={isPlayingVoice ? handleStopVoice : handleTriggerVoice}
            className={`w-full px-4 py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer min-h-[44px] ${
              isPlayingVoice
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-gradient-to-r from-amber-500 via-rose-600 to-rose-700 text-white hover:brightness-105'
            }`}
          >
            {isPlayingVoice ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Stop Voice Warning</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Play Voice Warning ({profile.preferredLanguage})</span>
              </>
            )}
          </button>

          {/* Emergency Call Button */}
          <a
            id="btn-call-emergency-sdma"
            href={`tel:${stateHelpline.tollFree.split(' ')[0]}`}
            className="w-full px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-rose-700 border border-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs min-h-[44px]"
          >
            <PhoneCall className="w-4 h-4 text-rose-600" />
            <span>Call {profile.state} SDMA ({stateHelpline.tollFree})</span>
          </a>

          {/* View emergency contact */}
          <div className="text-[11px] text-slate-700 bg-white/90 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
            <span className="text-slate-500 font-medium truncate">Emergency Contact: {profile.emergencyContactName}</span>
            <span className="font-mono font-bold text-slate-900 ml-2">{profile.emergencyContactPhone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
