import React, { useEffect } from 'react';
import { X, Map as MapIcon, Maximize2 } from 'lucide-react';
import { MapQGISView } from './MapQGISView';
import { CitizenProfile, HazardZone } from '../types';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CitizenProfile;
  onSelectZone?: (zone: HazardZone) => void;
  initialState?: string;
}

export const MapModal: React.FC<MapModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSelectZone,
  initialState,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id="modal-interactive-qgis-map"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col p-2 sm:p-4 overflow-hidden animate-in fade-in duration-200"
    >
      {/* Modal Top Control Bar */}
      <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200 shadow-lg mb-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center shadow-xs">
            <MapIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-slate-950 tracking-tight">
                DRISHTI • North Eastern Region Landslide Map
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300 font-bold hidden md:inline">
                NER Restricted View
              </span>
            </div>
            <p className="text-[11px] text-slate-600 hidden sm:block">
              Click any colored circle alert to inspect real-time landslide conditions, telemetry, and evacuation instructions.
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          id="btn-close-map-modal"
          onClick={onClose}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Close Map &amp; Return</span>
          <span className="sm:hidden">Close</span>
        </button>
      </div>

      {/* Main Map Canvas Area */}
      <div className="flex-1 w-full min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <MapQGISView
          profile={profile}
          onSelectZone={onSelectZone}
          onClose={onClose}
          isModalMode={true}
          initialState={initialState}
        />
      </div>
    </div>
  );
};
