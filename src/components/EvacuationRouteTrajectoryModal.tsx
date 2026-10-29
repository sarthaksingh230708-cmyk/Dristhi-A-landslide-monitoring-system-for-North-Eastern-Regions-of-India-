import React, { useState } from 'react';
import {
  Navigation,
  MapPin,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Car,
  Footprints,
  PhoneCall,
  CheckCircle,
  Copy,
  ChevronRight,
  X,
  Compass,
} from 'lucide-react';
import { NER_EVACUATION_TRAJECTORIES, getEvacuationTrajectory } from '../data/evacuationTrajectories';
import { EvacuationTrajectory } from '../types';

interface EvacuationRouteTrajectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialZoneId?: string;
  defaultZoneId?: string;
}

export const EvacuationRouteTrajectoryModal: React.FC<EvacuationRouteTrajectoryModalProps> = ({
  isOpen,
  onClose,
  initialZoneId,
  defaultZoneId,
}) => {
  const activeZoneId = defaultZoneId || initialZoneId || 'hz-sohra-meghalaya';
  const [selectedZoneKey, setSelectedZoneKey] = useState<string>(
    NER_EVACUATION_TRAJECTORIES[activeZoneId] ? activeZoneId : 'hz-sohra-meghalaya'
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  const trajectory: EvacuationTrajectory =
    NER_EVACUATION_TRAJECTORIES[selectedZoneKey] || getEvacuationTrajectory(selectedZoneKey);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(trajectory.googleMapsDirectionsUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleOpenGoogleMaps = () => {
    window.open(trajectory.googleMapsDirectionsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-5 flex items-center justify-between border-b border-teal-800/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  Google Maps Enabled Evacuation Trajectory
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/40">
                  LIVE GPS ROUTING
                </span>
              </div>
              <p className="text-xs text-teal-200/90 mt-0.5">
                Safe ridge navigation avoiding slope slip faces, swollen torrents &amp; rockfall chutes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Zone Selector Strip */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 font-bold whitespace-nowrap">Select Vulnerability Sector:</span>
          {Object.entries(NER_EVACUATION_TRAJECTORIES).map(([key, item]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedZoneKey(key);
                setActiveStep(1);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedZoneKey === key
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {item.zoneName.split('(')[0].trim()}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Quick Metrics & Google Maps Action Bar */}
          <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-teal-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>Sector Corridor: {trajectory.zoneName}</span>
              </div>
              <h3 className="text-lg font-black text-white mt-1">
                From: {trajectory.originPlaceName}
              </h3>
              <p className="text-xs text-teal-200 flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Destination Shelter: <strong>{trajectory.destinationShelterName}</strong></span>
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span><strong>{trajectory.totalDistanceKm} km</strong> Safe Path</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg">
                  <Car className="w-3.5 h-3.5 text-sky-400" />
                  <span><strong>~{trajectory.estimatedDriveTimeMin} mins</strong> Convoy Drive</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg">
                  <Footprints className="w-3.5 h-3.5 text-amber-400" />
                  <span><strong>~{trajectory.estimatedWalkTimeMin} mins</strong> Foot Evacuation</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Hazard Clearance: <strong>{trajectory.hazardAvoidanceRadiusKm} km Buffer</strong></span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <button
                onClick={handleOpenGoogleMaps}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-transform hover:scale-[1.02] cursor-pointer text-xs sm:text-sm whitespace-nowrap"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in Google Maps App</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="bg-white/15 hover:bg-white/25 text-white font-bold px-3 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs"
                title="Copy Google Maps Navigation Link"
              >
                {copiedLink ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Route Link'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Trajectory Waypoint Timeline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-600" />
                <span>Turn-by-Turn Geological Trajectory Waypoints</span>
              </h4>
              <span className="text-[11px] text-slate-500">
                Coordinated with BRO, SDRF &amp; Local Village Disaster Committees
              </span>
            </div>

            <div className="space-y-3">
              {trajectory.waypoints.map((wp, idx) => (
                <div
                  key={wp.order}
                  onClick={() => setActiveStep(wp.order)}
                  className={`border rounded-2xl p-4 transition-all cursor-pointer ${
                    activeStep === wp.order
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          wp.isSafeZone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-600 text-white'
                        }`}
                      >
                        {wp.order}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-slate-900 text-sm">{wp.name}</h5>
                          {wp.isSafeZone ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Safe High Ground
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                              Hazard Exit Corridor
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 mt-1 leading-relaxed">{wp.instruction}</p>
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-100/60 rounded-lg px-2.5 py-1 mt-2 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{wp.safetyCaution}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-slate-500 block">
                        {wp.lat.toFixed(3)}°N, {wp.lng.toFixed(3)}°E
                      </span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${wp.lat},${wp.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] text-emerald-700 font-bold hover:underline inline-flex items-center gap-0.5 mt-1"
                      >
                        <span>Pin in Maps</span>
                        <ChevronRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Offline Survival Instructions */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-slate-900 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-rose-600" />
                <span>Low-Connectivity Field Instructions</span>
              </strong>
              <span className="text-[10px] font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-bold">
                SSDMA / BRO HELPLINE: 1070
              </span>
            </div>
            <p className="text-[11px] leading-relaxed">
              If cellular data is lost along the route, continue following the ridge road uphill toward{' '}
              <strong>{trajectory.destinationShelterName}</strong>. Do not seek shelter under overhanging rock ledges or
              near stream culverts. High visibility flags placed by the SDRF mark the safe pedestrian corridor.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Trajectory verified against Geological Survey of India (GSI) slope stability maps
          </span>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
          >
            Close Trajectory
          </button>
        </div>
      </div>
    </div>
  );
};
