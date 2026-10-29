import React, { useState } from 'react';
import {
  Target,
  CheckCircle2,
  AlertOctagon,
  Percent,
  Clock,
  Calendar,
  Layers,
  HelpCircle,
  Sparkles,
  Send,
  X,
  TrendingDown,
  ShieldAlert,
} from 'lucide-react';
import { HazardZone, PredictionOutcomeReport } from '../types';
import { authService } from '../services/authService';

interface PredictionAccuracyFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  zone?: HazardZone | null;
  currentZone?: HazardZone | null;
  customPlaceName?: string;
  customProbabilityRange?: [number, number];
  customTimeWindow?: string;
  customDateDay?: string;
  customAccuracy?: number;
  customFPR?: number;
  customFNR?: number;
}

export const PredictionAccuracyFeedbackModal: React.FC<PredictionAccuracyFeedbackModalProps> = ({
  isOpen,
  onClose,
  zone,
  currentZone,
  customPlaceName,
  customProbabilityRange,
  customTimeWindow,
  customDateDay,
  customAccuracy,
  customFPR,
  customFNR,
}) => {
  const activeZone = zone || currentZone;
  const [actualOutcome, setActualOutcome] = useState<'OCCURRED' | 'FALSE_ALARM' | 'NO_EVENT' | 'PENDING'>('OCCURRED');
  const [notes, setNotes] = useState('');
  const [reporterName, setReporterName] = useState(authService.getSession()?.displayName || '');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const placeName = activeZone?.name || customPlaceName || 'East Khasi Hills (Sohra Escarpment)';
  const probRange = activeZone?.probabilityRange || customProbabilityRange || [87, 96];
  const timeWindow = activeZone?.forecastTimeWindow || customTimeWindow || 'Next 5 - 7 hours (Peak Trigger Window)';
  const dateDay = activeZone?.forecastDateDay || customDateDay || 'Tuesday, 7th September';
  const accuracyPct = activeZone?.modelAccuracyPct || customAccuracy || 93.8;
  const fpr = activeZone?.falsePositiveRatePct || customFPR || 3.4;
  const fnr = activeZone?.falseNegativeRatePct || customFNR || 1.8;
  const confidenceScore = activeZone?.modelConfidenceScore || 94;

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    const report: PredictionOutcomeReport = {
      id: 'rep-' + Date.now(),
      hazardZoneId: activeZone?.id || 'hz-custom',
      zoneName: placeName,
      forecastDate: dateDay,
      forecastTimeWindow: timeWindow,
      predictedRange: probRange,
      actualOutcome,
      observerNotes: notes || 'Verified by field station observer.',
      submittedBy: reporterName || 'Anonymous Field Observer',
      timestamp: new Date().toISOString(),
    };
    authService.saveOutcomeReport(report);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-indigo-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  Model Prediction Accuracy &amp; False Alarm Mitigator
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/30">
                  AI TRANSPARENCY
                </span>
              </div>
              <p className="text-xs text-indigo-200/90 mt-0.5">
                Quantifying forecast uncertainty, confidence intervals &amp; collecting ground-truth feedback
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

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-sm">
          {/* Target Place Focus Highlight Banner */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-md">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
              Evaluated Location Target
            </span>
            <h3 className="text-lg font-black text-white mt-0.5">{placeName}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>
                  Date: <strong>{dateDay}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Active Period: <strong>{timeWindow}</strong>
                </span>
              </div>
            </div>

            {/* User Requested Range Display */}
            <div className="mt-3 bg-indigo-950/60 border border-indigo-800/60 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-indigo-300 font-semibold block">
                  Calculated Landslide Probability Range:
                </span>
                <span className="text-xl font-black text-indigo-300 tracking-tight">
                  {probRange[0]}% – {probRange[1]}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-mono">Ensemble Confidence</span>
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/40">
                  {confidenceScore}/100 Score
                </span>
              </div>
            </div>
          </div>

          {/* Model Accuracy & Error Discrepancy Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-indigo-600" />
                <span>Model Verification Metrics for this Case</span>
              </h4>
              <span className="text-[11px] text-slate-500">Trained on 10,000+ GSI historical events</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Overall Accuracy */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-emerald-950">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block tracking-wider">
                  Model Accuracy Rate
                </span>
                <div className="text-2xl font-black text-emerald-800 mt-0.5">{accuracyPct}%</div>
                <p className="text-[11px] text-emerald-700 mt-1 leading-tight">
                  Correct classification on tertiary sandstone/shale rock slope profiles.
                </p>
              </div>

              {/* False Positive Rate (FPR) */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-amber-950">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-amber-700 block tracking-wider">
                    False Positive (False Alarm)
                  </span>
                  <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-amber-800 mt-0.5">{fpr}%</div>
                <p className="text-[11px] text-amber-700 mt-1 leading-tight">
                  Probability of siren sounding when no ground movement actually occurs.
                </p>
              </div>

              {/* False Negative Rate (FNR) */}
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-rose-950">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-rose-700 block tracking-wider">
                    False Negative (Missed Threat)
                  </span>
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                </div>
                <div className="text-2xl font-black text-rose-800 mt-0.5">{fnr}%</div>
                <p className="text-[11px] text-rose-700 mt-1 leading-tight">
                  Extremely low chance of an unpredicted slide occurring without trigger warning.
                </p>
              </div>
            </div>
          </div>

          {/* Continuous Learning Ground-Truth Submission Form */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Report Actual Field Outcome (Calibrate &amp; Reduce Future Errors)</span>
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Did a rockfall, mudflow, or slope crack occur in this location within the forecast time window?
            </p>

            {submitted ? (
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong className="text-sm font-bold block">Thank you! Ground truth recorded.</strong>
                  <span className="text-xs text-emerald-800">
                    Your report will be factored into Bayesian re-weighting to lower false positive alarms.
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <label
                    className={`border rounded-xl p-2.5 text-center cursor-pointer text-xs font-bold transition-all ${
                      actualOutcome === 'OCCURRED'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="outcome"
                      value="OCCURRED"
                      checked={actualOutcome === 'OCCURRED'}
                      onChange={() => setActualOutcome('OCCURRED')}
                      className="sr-only"
                    />
                    <span>Yes, Occurred</span>
                  </label>

                  <label
                    className={`border rounded-xl p-2.5 text-center cursor-pointer text-xs font-bold transition-all ${
                      actualOutcome === 'FALSE_ALARM'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="outcome"
                      value="FALSE_ALARM"
                      checked={actualOutcome === 'FALSE_ALARM'}
                      onChange={() => setActualOutcome('FALSE_ALARM')}
                      className="sr-only"
                    />
                    <span>False Alarm</span>
                  </label>

                  <label
                    className={`border rounded-xl p-2.5 text-center cursor-pointer text-xs font-bold transition-all ${
                      actualOutcome === 'NO_EVENT'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="outcome"
                      value="NO_EVENT"
                      checked={actualOutcome === 'NO_EVENT'}
                      onChange={() => setActualOutcome('NO_EVENT')}
                      className="sr-only"
                    />
                    <span>Slope Remained Safe</span>
                  </label>

                  <label
                    className={`border rounded-xl p-2.5 text-center cursor-pointer text-xs font-bold transition-all ${
                      actualOutcome === 'PENDING'
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="outcome"
                      value="PENDING"
                      checked={actualOutcome === 'PENDING'}
                      onChange={() => setActualOutcome('PENDING')}
                      className="sr-only"
                    />
                    <span>Still Observing</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Field Observations / Soil Slump:</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Minor road cut slip at km 4; culvert overflow"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Observer Name / Designation:</label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="e.g. Field Engineer / Local Resident"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20 text-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Field Ground Truth Report</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Probability models update dynamically every 15 minutes from radar telemetry
          </span>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
