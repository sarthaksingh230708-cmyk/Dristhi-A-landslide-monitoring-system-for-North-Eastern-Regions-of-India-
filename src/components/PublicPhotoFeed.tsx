import React, { useState, useEffect } from 'react';
import {
  Camera,
  MapPin,
  ThumbsUp,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Filter,
  Eye,
  X,
  Share2,
  PlusCircle,
} from 'lucide-react';
import { IncidentReport } from '../types';
import { citizenService } from '../services/citizenService';

interface PublicPhotoFeedProps {
  onOpenReportForm?: () => void;
  onNavigateReport?: () => void;
}

export const PublicPhotoFeed: React.FC<PublicPhotoFeedProps> = ({ onOpenReportForm, onNavigateReport }) => {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [activeLightboxReport, setActiveLightboxReport] = useState<IncidentReport | null>(null);

  const handleOpenReport = onOpenReportForm || onNavigateReport || (() => {});

  useEffect(() => {
    const unsub = citizenService.subscribeReports((data) => {
      setReports(data);
    });
    return () => unsub();
  }, []);

  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    citizenService.upvoteReport(id);
  };

  const filteredReports = reports.filter((rep) => {
    if (selectedState !== 'ALL' && rep.state !== selectedState) return false;
    if (selectedSeverity !== 'ALL' && !rep.severity.includes(selectedSeverity)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-600" />
            Public Citizen Landslide Photo Feed
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Real-time crowdsourced ground photography and road blockage assessments from residents across the 8 NER states.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-50 text-slate-800 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:border-amber-500"
          >
            <option value="ALL">All States ({reports.length} Reports)</option>
            <option value="Assam">Assam</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Tripura">Tripura</option>
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-50 text-slate-800 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:border-amber-500"
          >
            <option value="ALL">All Hazard Severities</option>
            <option value="Severe">Severe (Life Threatening)</option>
            <option value="High">High (Road Cut)</option>
            <option value="Moderate">Moderate</option>
          </select>

          {/* Add Report Trigger */}
          <button
            id="btn-feed-upload-photo"
            onClick={handleOpenReport}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Reports Gallery Grid */}
      {filteredReports.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-xs">
          No reports found matching the selected state/severity filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReports.map((report) => {
            let roadBlockBadge = 'bg-rose-100 text-rose-800 border-rose-300';
            if (report.roadBlockStatus === 'Single Lane Only') {
              roadBlockBadge = 'bg-amber-100 text-amber-800 border-amber-300';
            } else if (report.roadBlockStatus === 'Open with Caution') {
              roadBlockBadge = 'bg-blue-100 text-blue-800 border-blue-300';
            }

            return (
              <div
                key={report.id}
                onClick={() => setActiveLightboxReport(report)}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Thumbnail */}
                  <div className="relative h-52 bg-slate-100 overflow-hidden">
                    <img
                      src={report.photoUrl}
                      alt={report.villageRoad}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

                    {/* Top Overlay Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider backdrop-blur-sm ${roadBlockBadge}`}
                      >
                        {report.roadBlockStatus}
                      </span>
                      {report.verified && (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <ShieldCheck className="w-3 h-3" />
                          GSI Verified
                        </span>
                      )}
                    </div>

                    {/* Bottom Photo caption: Location */}
                    <div className="absolute bottom-2.5 left-3 right-3 text-white">
                      <div className="flex items-center gap-1 text-xs font-black text-amber-300 drop-shadow">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        <span className="truncate">{report.villageRoad}</span>
                      </div>
                      <div className="text-[11px] text-slate-200 font-medium">
                        {report.district}, {report.state}
                      </div>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-bold text-rose-700">{report.incidentType}</span>
                      <span className="font-medium">{report.photoTimestamp}</span>
                    </div>

                    <p className="text-slate-700 line-clamp-3 leading-relaxed font-medium">
                      {report.description}
                    </p>
                  </div>
                </div>

                {/* Footer with Reporter & Upvote */}
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600 text-[11px]">
                    By <strong className="text-slate-900 font-bold">{report.reporterName}</strong>
                  </span>

                  <button
                    onClick={(e) => handleUpvote(report.id, e)}
                    className="flex items-center gap-1.5 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 px-2.5 py-1 rounded-lg border border-slate-300 transition-colors cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="font-black">{report.upvotes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {activeLightboxReport && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setActiveLightboxReport(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-black flex items-center justify-center max-h-[480px]">
              <img
                src={activeLightboxReport.photoUrl}
                alt={activeLightboxReport.villageRoad}
                className="max-h-[480px] w-full object-contain"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setActiveLightboxReport(null)}
                className="absolute top-4 right-4 bg-slate-900/80 hover:bg-rose-600 text-white p-2 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-slate-950 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-600" />
                    {activeLightboxReport.villageRoad}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {activeLightboxReport.district}, {activeLightboxReport.state} • Reported by {activeLightboxReport.reporterName} ({activeLightboxReport.photoTimestamp})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-rose-100 text-rose-800 border border-rose-300 text-xs px-2.5 py-1 rounded-full font-black">
                    {activeLightboxReport.severity}
                  </span>
                  <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs px-2.5 py-1 rounded-full font-black">
                    {activeLightboxReport.roadBlockStatus}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {activeLightboxReport.description}
              </p>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={(e) => handleUpvote(activeLightboxReport.id, e)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Confirm / Upvote Report ({activeLightboxReport.upvotes})</span>
                </button>
                <button
                  onClick={() => setActiveLightboxReport(null)}
                  className="text-xs text-slate-600 hover:text-slate-950 font-bold cursor-pointer"
                >
                  Close Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
