import React, { useState } from 'react';
import {
  PhoneCall,
  Shield,
  Copy,
  Check,
  Send,
  Radio,
  MapPin,
  X,
  AlertOctagon,
  MessageSquare,
} from 'lucide-react';
import { NER_HELPLINES } from '../data/nerData';
import { CitizenProfile } from '../types';

interface HelplineDirectoryProps {
  onClose: () => void;
  profile: CitizenProfile;
}

export const HelplineDirectory: React.FC<HelplineDirectoryProps> = ({ onClose, profile }) => {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>(profile.state || 'ALL');

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const filteredHelplines = NER_HELPLINES.filter((h) => {
    if (selectedState === 'ALL') return true;
    return h.state.toLowerCase() === selectedState.toLowerCase() || h.state.includes('National');
  });

  // Offline SOS SMS Template Generator
  const sosSmsBody = encodeURIComponent(
    `EMERGENCY LANDSLIDE SOS! Location: ${profile.villageOrTown}, ${profile.district} (${profile.state}). Lat: ${profile.lat || '25.5'}, Lng: ${profile.lng || '93.0'}. Urgent rescue assistance requested! Citizen: ${profile.fullName}, Phone: ${profile.phoneNumber}`
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-6 my-auto text-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-xl font-black text-slate-950 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-rose-600 animate-bounce" />
              24x7 State &amp; National Disaster Helplines (NER)
            </h3>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Direct emergency control rooms for the 8 North Eastern States, NDRF Battalions, and Border Roads Organisation (BRO).
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Priority Emergency SOS Dispatch Box (Works Offline via SMS) */}
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-rose-900 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              OFFLINE SOS DISPATCH (No Internet Required)
            </span>
            <span className="text-[10px] bg-rose-600 text-white font-mono px-2 py-0.5 rounded-full font-black">
              SMS / CELLULAR FALLBACK
            </span>
          </div>
          <p className="text-xs text-rose-950 font-medium">
            If mountain cellular data/internet has failed, use this pre-formatted SMS trigger to broadcast your GPS coordinates and registered location to the nearest control room.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <a
              id="btn-sms-sos-112"
              href={`sms:112?body=${sosSmsBody}`}
              className="bg-rose-600 hover:bg-rose-700 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send SOS SMS to 112 (National Emergency)</span>
            </a>
            <a
              id="btn-sms-sos-1070"
              href={`sms:1070?body=${sosSmsBody}`}
              className="bg-white hover:bg-slate-100 text-rose-800 border border-rose-300 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call State Control Room 1070</span>
            </a>
          </div>
        </div>

        {/* State Filter */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="text-slate-700 font-bold">Filter State / Region:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-50 text-slate-800 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:border-rose-500"
          >
            <option value="ALL">All 8 NER States + National</option>
            <option value="Assam">Assam (ASDMA)</option>
            <option value="Sikkim">Sikkim (SSDMA)</option>
            <option value="Meghalaya">Meghalaya (MSDMA)</option>
            <option value="Nagaland">Nagaland (NSDMA)</option>
            <option value="Manipur">Manipur SDMA</option>
            <option value="Mizoram">Mizoram SDMA</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Tripura">Tripura TDMA</option>
          </select>
        </div>

        {/* Helplines List */}
        <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
          {filteredHelplines.map((helpline, idx) => (
            <div
              key={idx}
              className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-black px-2 py-0.5 rounded-full font-mono">
                    {helpline.state}
                  </span>
                  <h4 className="font-black text-slate-950 text-sm">{helpline.agencyName}</h4>
                </div>
                <div className="text-slate-700 flex flex-wrap items-center gap-3 mt-1 font-medium">
                  <span>
                    Toll-Free: <strong className="text-rose-700 font-black text-sm">{helpline.tollFree}</strong>
                  </span>
                  <span className="text-slate-400">|</span>
                  <span>
                    Control Room: <strong className="text-slate-900 font-mono font-bold">{helpline.controlRoomNumber}</strong>
                  </span>
                </div>
                {helpline.whatsappEmergency && (
                  <div className="text-[11px] text-emerald-700 font-bold">
                    WhatsApp SOS: <span className="font-mono">{helpline.whatsappEmergency}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <a
                  href={`tel:${helpline.tollFree.split(' ')[0]}`}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {helpline.tollFree.split(' ')[0]}</span>
                </a>
                <button
                  onClick={() => handleCopy(helpline.tollFree)}
                  title="Copy Number"
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 cursor-pointer"
                >
                  {copiedNumber === helpline.tollFree ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
