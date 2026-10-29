import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Radio,
  Sliders,
  X,
  AlertTriangle,
  Globe2,
  BellRing,
} from 'lucide-react';
import { voiceAlert } from '../services/voiceAlertService';
import { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../data/languages';

interface VoiceAlertModalProps {
  onClose: () => void;
  currentLanguage: SupportedLanguage;
}

export const VoiceAlertModal: React.FC<VoiceAlertModalProps> = ({
  onClose,
  currentLanguage,
}) => {
  const [isEnabled, setIsEnabled] = useState(voiceAlert.isEnabled());
  const [isSpeaking, setIsSpeaking] = useState(voiceAlert.isSpeaking());
  const [testText, setTestText] = useState(
    'CRITICAL WARNING: 98% Landslide Probability in Dima Hasao. Soil saturation threshold breached. Move to designated emergency shelter immediately!'
  );

  useEffect(() => {
    const unsub = voiceAlert.subscribe((active) => {
      setIsSpeaking(active);
    });
    return () => unsub();
  }, []);

  const handleToggle = () => {
    const next = !isEnabled;
    setIsEnabled(next);
    voiceAlert.setEnabled(next);
    if (!next) {
      voiceAlert.stop();
    }
  };

  const handleTestVoice = async () => {
    await voiceAlert.speakAlert(testText, currentLanguage, { playSiren: false });
  };

  const handleStop = () => {
    voiceAlert.stop();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 my-auto text-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-xl font-black text-slate-950 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-purple-600" />
              Voice Alert System
            </h3>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Provides audible synthetic voice broadcasts for urgent landslide warnings.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master ON / OFF Control Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isEnabled ? 'bg-purple-100 text-purple-700 border border-purple-300' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {isEnabled ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-bold text-sm text-slate-950 flex items-center gap-2">
                <span>Voice Alert Broadcast:</span>
                <span className={isEnabled ? 'text-purple-700 font-black' : 'text-slate-500 font-black'}>
                  {isEnabled ? 'ENABLED (ON)' : 'MUTED (OFF)'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                {isEnabled ? 'Will automatically speak critical purple/orange hazard warnings' : 'Voice synthesis and audio sirens muted'}
              </p>
            </div>
          </div>

          <button
            id="btn-toggle-voice-system"
            onClick={handleToggle}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer ${
              isEnabled ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isEnabled ? 'Turn OFF' : 'Turn ON'}
          </button>
        </div>

        {/* Current Active Language for Voice */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Globe2 className="w-4 h-4 text-purple-600" />
            <span>Active Voice Synthesis Language:</span>
          </div>
          <span className="font-black text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
            {currentLanguage}
          </span>
        </div>

        {/* Test Speech Sample */}
        <div className="space-y-2 text-xs">
          <label className="text-slate-700 font-bold block">Test Voice Announcement Script:</label>
          <textarea
            rows={3}
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-2.5 focus:border-purple-600 focus:bg-white font-medium"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleTestVoice}
            disabled={!isEnabled || isSpeaking}
            className={`flex-1 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
              !isEnabled
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white active:scale-98'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>{isSpeaking ? 'Announcing Now...' : 'Play Test Voice Alert'}</span>
          </button>

          {isSpeaking && (
            <button
              onClick={handleStop}
              className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-rose-600 border border-rose-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Square className="w-4 h-4" />
              <span>Stop</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
