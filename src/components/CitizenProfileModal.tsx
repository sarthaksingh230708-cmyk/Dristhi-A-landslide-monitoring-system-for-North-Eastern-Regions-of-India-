import React, { useState, useMemo } from 'react';
import {
  User,
  MapPin,
  Compass,
  Phone,
  Save,
  X,
  Bell,
  Volume2,
  Globe2,
  CheckCircle2,
  AlertOctagon,
  ShieldCheck,
  Droplets,
  Activity,
  Mountain,
  Home,
  PhoneCall,
} from 'lucide-react';
import { CitizenProfile, SupportedLanguage } from '../types';
import { citizenService } from '../services/citizenService';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { notificationService } from '../services/notificationService';
import { voiceAlert } from '../services/voiceAlertService';
import { evaluateLocationCondition } from '../utils/nerSearch';

interface CitizenProfileModalProps {
  onClose: () => void;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export const CitizenProfileModal: React.FC<CitizenProfileModalProps> = ({
  onClose,
  onLanguageChange,
}) => {
  const currentProfile = citizenService.getProfile();

  const [fullName, setFullName] = useState(currentProfile.fullName);
  const [phoneNumber, setPhoneNumber] = useState(currentProfile.phoneNumber);
  const [state, setState] = useState(currentProfile.state);
  const [district, setDistrict] = useState(currentProfile.district);
  const [villageOrTown, setVillageOrTown] = useState(currentProfile.villageOrTown);
  const [lat, setLat] = useState<number | undefined>(currentProfile.lat);
  const [lng, setLng] = useState<number | undefined>(currentProfile.lng);
  const [emergencyContactName, setEmergencyContactName] = useState(currentProfile.emergencyContactName);
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(currentProfile.emergencyContactPhone);
  const [notificationsEnabled, setNotificationsEnabled] = useState(currentProfile.notificationsEnabled);
  const [voiceAlertsEnabled, setVoiceAlertsEnabled] = useState(currentProfile.voiceAlertsEnabled);
  const [preferredLanguage, setPreferredLanguage] = useState(currentProfile.preferredLanguage);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSpeakingAlert, setIsSpeakingAlert] = useState(false);

  // Dynamically compute real-time alert for entered location
  const locationAlert = useMemo(() => {
    const locQuery = villageOrTown || district || state;
    return evaluateLocationCondition(locQuery, state, district, lat, lng);
  }, [villageOrTown, district, state, lat, lng]);

  // Auto-detect GPS Coordinates
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const detectedLat = Number(pos.coords.latitude.toFixed(4));
        const detectedLng = Number(pos.coords.longitude.toFixed(4));
        setLat(detectedLat);
        setLng(detectedLng);
        setIsDetectingGps(false);
      },
      (err) => {
        console.warn('GPS location error:', err);
        setLat(25.176);
        setLng(93.024);
        setIsDetectingGps(false);
      },
      { timeout: 10000 }
    );
  };

  const handleTestVoiceAlert = async () => {
    setIsSpeakingAlert(true);
    try {
      const alertMsg = `Landslide warning broadcast for ${locationAlert.placeName}, ${locationAlert.district}. Hazard risk is ${locationAlert.probability} percent (${locationAlert.colorName} code). ${locationAlert.actionRequired}`;
      await voiceAlert.broadcastAlert(alertMsg, 'en-IN', false);
    } finally {
      setIsSpeakingAlert(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    citizenService.updateProfile({
      fullName,
      phoneNumber,
      state,
      district,
      villageOrTown,
      lat,
      lng,
      emergencyContactName,
      emergencyContactPhone,
      notificationsEnabled,
      voiceAlertsEnabled,
      preferredLanguage,
    });

    notificationService.setEnabled(notificationsEnabled);
    voiceAlert.setEnabled(voiceAlertsEnabled);
    onLanguageChange(preferredLanguage as SupportedLanguage);

    notificationService.notify({
      title: `Location Monitored: ${villageOrTown || district}`,
      message: `Personalized landslide alert active: ${locationAlert.probability}% (${locationAlert.colorName}). Nearest Shelter: ${locationAlert.nearestShelter}`,
      priority: locationAlert.probability >= 95 ? 'CRITICAL' : locationAlert.probability >= 85 ? 'HIGH' : 'INFO',
    });

    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl space-y-5 my-auto max-h-[92vh] overflow-y-auto text-slate-900">
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-xl font-black text-slate-950 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Citizen Profile &amp; Location Dashboard
            </h3>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Configure your personal location to monitor real-time landslide risk, emergency voice broadcasts, and shelter routes.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess ? (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center space-y-2 animate-in fade-in">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-black text-slate-950">Profile &amp; Location Saved!</h4>
            <p className="text-xs text-emerald-900 font-medium">
              Your personalized landslide alert for {villageOrTown}, {district} ({state}) is now active.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            {/* SEPARATE LIVE LOCATION ALERT PANEL IN PROFILE DASHBOARD */}
            <div
              id="profile-location-alert-panel"
              className="rounded-2xl border-2 p-4 shadow-xs space-y-2.5 transition-all"
              style={{
                borderColor: locationAlert.color,
                backgroundColor:
                  locationAlert.colorName === 'PURPLE'
                    ? 'rgba(168, 85, 247, 0.08)'
                    : locationAlert.colorName === 'ORANGE'
                    ? 'rgba(249, 115, 22, 0.08)'
                    : locationAlert.colorName === 'BLUE'
                    ? 'rgba(59, 130, 246, 0.08)'
                    : 'rgba(34, 197, 94, 0.08)',
              }}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-black uppercase text-white flex items-center gap-1.5 shadow-xs"
                    style={{ backgroundColor: locationAlert.color }}
                  >
                    {locationAlert.hasActiveLandslideThreat ? (
                      <AlertOctagon className="w-3.5 h-3.5" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {locationAlert.probability}% Risk • {locationAlert.colorName} CODE
                    </span>
                  </span>

                  <span className="text-xs font-black text-slate-950 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    Live Alert for {villageOrTown || district || state}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleTestVoiceAlert}
                  disabled={isSpeakingAlert}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isSpeakingAlert ? 'animate-bounce' : ''}`} />
                  <span>{isSpeakingAlert ? 'Broadcasting...' : 'Voice Siren'}</span>
                </button>
              </div>

              {/* Landslide Condition Description */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1 shadow-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full animate-ping"
                    style={{ backgroundColor: locationAlert.color }}
                  ></span>
                  <span className="font-black text-slate-950 text-xs sm:text-sm">
                    {locationAlert.hasActiveLandslideThreat
                      ? '⚠️ Landslide Danger Present on This Location'
                      : '✅ No Landslide / Terrain Currently Stable'}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {locationAlert.conditionDescription}
                </p>
              </div>

              {/* Critical Sensor Telemetry for entered location */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="bg-white p-2 rounded-xl border border-slate-200 text-center shadow-xs">
                  <span className="text-[10px] text-slate-500 uppercase flex items-center justify-center gap-1 font-bold">
                    <Droplets className="w-3 h-3 text-cyan-600" /> Rain (24h)
                  </span>
                  <span className="font-mono font-black text-cyan-700 text-xs block mt-0.5">
                    {locationAlert.rainfallMm} mm
                  </span>
                </div>

                <div className="bg-white p-2 rounded-xl border border-slate-200 text-center shadow-xs">
                  <span className="text-[10px] text-slate-500 uppercase flex items-center justify-center gap-1 font-bold">
                    <Activity className="w-3 h-3 text-amber-600" /> Soil Sat
                  </span>
                  <span className="font-mono font-black text-amber-700 text-xs block mt-0.5">
                    {locationAlert.soilMoisturePct}%
                  </span>
                </div>

                <div className="bg-white p-2 rounded-xl border border-slate-200 text-center shadow-xs">
                  <span className="text-[10px] text-slate-500 uppercase flex items-center justify-center gap-1 font-bold">
                    <Mountain className="w-3 h-3 text-emerald-600" /> Slope
                  </span>
                  <span className="font-mono font-black text-emerald-700 text-xs block mt-0.5">
                    {locationAlert.slopeDegrees}°
                  </span>
                </div>

                <div className="bg-white p-2 rounded-xl border border-slate-200 text-center shadow-xs">
                  <span className="text-[10px] text-slate-500 uppercase flex items-center justify-center gap-1 font-bold">
                    <Home className="w-3 h-3 text-rose-600" /> Fault Proximity
                  </span>
                  <span className="font-mono font-black text-rose-700 text-xs block mt-0.5">
                    {locationAlert.distanceToHazardKm} km
                  </span>
                </div>
              </div>

              {/* Action and shelter */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1 shadow-xs">
                <div className="text-slate-800">
                  <strong className="text-slate-950 font-bold">Designated Evacuation Shelter:</strong> {locationAlert.nearestShelter} (Capacity: {locationAlert.shelterCapacity})
                </div>
                <div className="text-amber-800 font-medium">
                  <strong className="text-amber-900 font-bold">Action Required:</strong> {locationAlert.actionRequired}
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-2.5 focus:border-purple-600 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Mobile Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-2.5 focus:border-purple-600 focus:bg-white font-medium"
                />
              </div>
            </div>

            {/* Geographical Location in NER */}
            <div className="space-y-2 border-t border-slate-200 pt-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-700 uppercase text-[10px] tracking-wider block">
                  Location Settings (Updating changes live alert)
                </span>
                <span className="text-[10px] text-slate-500 font-medium">8 NER States</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">State</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value as any)}
                    className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-2.5 focus:border-purple-600 focus:bg-white font-medium"
                  >
                    <option value="Assam">Assam</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Tripura">Tripura</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">District</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dima Hasao, Mangan, Kohima"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-2.5 focus:border-purple-600 focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Village / Town / Ward</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Haflong Basti, Dzongu"
                    value={villageOrTown}
                    onChange={(e) => setVillageOrTown(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-2.5 focus:border-purple-600 focus:bg-white font-medium"
                  />
                </div>
              </div>

              {/* Coordinates & GPS Detection */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-700 font-mono text-[11px]">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <span>
                    Lat: <strong className="text-slate-950">{lat || '25.1760'}</strong>, Lng:{' '}
                    <strong className="text-slate-950">{lng || '93.0240'}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleDetectGps}
                  disabled={isDetectingGps}
                  className="bg-white hover:bg-slate-100 text-slate-800 font-bold px-3 py-1.5 rounded-xl border border-slate-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Compass className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin text-purple-600' : 'text-amber-600'}`} />
                  <span>{isDetectingGps ? 'Detecting GPS...' : 'Auto-Detect Current GPS'}</span>
                </button>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-200 pt-3">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Emergency Contact Person</label>
                <input
                  type="text"
                  required
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-2.5 focus:border-purple-600 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Emergency Contact Number</label>
                <input
                  type="tel"
                  required
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-2.5 focus:border-purple-600 focus:bg-white font-medium"
                />
              </div>
            </div>

            {/* Notification & Voice Settings Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-200 pt-3">
              {/* Language */}
              <div>
                <label className="text-slate-700 font-bold block mb-1">Preferred Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-2.5 focus:border-purple-600 focus:bg-white font-medium"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.name}>
                      {l.name} ({l.nativeName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Notification Toggle */}
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-bold text-slate-900 block">Notifications</span>
                    <span className="text-[10px] text-slate-500">Push &amp; Offline</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-white border-slate-300 cursor-pointer"
                />
              </div>

              {/* Voice Alert Toggle */}
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-purple-600" />
                  <div>
                    <span className="font-bold text-slate-900 block">Voice Alerts</span>
                    <span className="text-[10px] text-slate-500">Siren &amp; Speech</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={voiceAlertsEnabled}
                  onChange={(e) => setVoiceAlertsEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-white border-slate-300 cursor-pointer"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer text-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile &amp; Update Location Alert</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
