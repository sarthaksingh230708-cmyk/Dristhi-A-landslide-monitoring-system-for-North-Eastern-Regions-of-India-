import React, { useState } from 'react';
import {
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  FileText,
  Image as ImageIcon,
  X,
  Send,
  WifiOff,
} from 'lucide-react';
import { CitizenProfile, IncidentReport } from '../types';
import { citizenService } from '../services/citizenService';

interface CitizenIncidentReportingProps {
  profile: CitizenProfile;
  onReportSubmitted: () => void;
  isOffline: boolean;
}

export const CitizenIncidentReporting: React.FC<CitizenIncidentReportingProps> = ({
  profile,
  onReportSubmitted,
  isOffline,
}) => {
  const [reporterName, setReporterName] = useState(profile.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber || '');
  const [state, setState] = useState(profile.state || 'Assam');
  const [district, setDistrict] = useState(profile.district || '');
  const [villageRoad, setVillageRoad] = useState(profile.villageOrTown || '');
  const [incidentType, setIncidentType] = useState<IncidentReport['incidentType']>('Debris Flow');
  const [severity, setSeverity] = useState<IncidentReport['severity']>('High (Road Cut)');
  const [roadBlockStatus, setRoadBlockStatus] = useState<IncidentReport['roadBlockStatus']>('Totally Blocked');
  const [description, setDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File Upload handler with base64 conversion
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Fallback emergency image if user didn't pick one
    const finalPhoto =
      photoPreview ||
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1000&q=80';

    citizenService.addReport({
      reporterName: reporterName || 'Anonymous Citizen',
      phoneNumber: phoneNumber || 'Not provided',
      state,
      district: district || 'NER District',
      villageRoad: villageRoad || 'Hill Road Sector',
      lat: profile.lat || 25.5,
      lng: profile.lng || 92.5,
      incidentType,
      severity,
      roadBlockStatus,
      description: description || 'Active landslide observed by citizen.',
      photoUrl: finalPhoto,
    });

    setIsSubmitting(false);
    setSubmittedSuccess(true);

    setTimeout(() => {
      onReportSubmitted();
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-600" />
            Citizen Landslide Incident &amp; Photo Report
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Empower early warning and relief teams by uploading live verified ground photos of debris, road washouts, and ground fractures.
          </p>
        </div>

        {isOffline && (
          <span className="bg-amber-50 text-amber-900 text-xs px-2.5 py-1 rounded-lg border border-amber-300 flex items-center gap-1.5 font-bold">
            <WifiOff className="w-3.5 h-3.5 text-amber-700" />
            Offline Queue Active
          </span>
        )}
      </div>

      {submittedSuccess ? (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center space-y-3 animate-in fade-in">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-black text-slate-950">Landslide Incident Submitted Successfully!</h3>
          <p className="text-xs text-emerald-900 max-w-md mx-auto font-medium">
            Your field report and photos have been posted to the public community feed. Relevant State Disaster Control Rooms (SDMA) have been notified.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Photo Upload Area */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 uppercase tracking-wider block">
              Landslide Photo / Camera Upload (Required)
            </label>

            {photoPreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-300 max-h-72 bg-slate-100 flex items-center justify-center">
                <img
                  src={photoPreview}
                  alt="Incident Preview"
                  className="w-full h-full object-cover max-h-72"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="absolute top-3 right-3 bg-slate-900/80 text-white p-2 rounded-full hover:bg-rose-600 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-8 text-center bg-slate-50 transition-colors cursor-pointer"
                onClick={() => document.getElementById('file-incident-input')?.click()}
              >
                <UploadCloud className="w-10 h-10 text-amber-600 mx-auto mb-2" />
                <div className="text-slate-900 font-bold text-sm">
                  Click to select photo or drag and drop image here
                </div>
                <div className="text-slate-500 text-xs mt-1">
                  Supports camera capture, PNG, JPG, WebP from mobile or computer
                </div>
                <input
                  id="file-incident-input"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-700 font-bold block mb-1">State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-2.5 focus:border-amber-600 focus:bg-white font-medium"
              >
                <option value="Assam">Assam</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Manipur">Manipur</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Tripura">Tripura</option>
                <option value="Sikkim">Sikkim</option>
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
                className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-2.5 focus:border-amber-600 focus:bg-white font-medium"
              />
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Village / Road / Landmark</label>
              <input
                type="text"
                required
                placeholder="e.g. NH-10 29th Mile, Haflong Cut"
                value={villageRoad}
                onChange={(e) => setVillageRoad(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-2.5 focus:border-amber-600 focus:bg-white font-medium"
              />
            </div>
          </div>

          {/* Incident Type & Road Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Incident Type</label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value as any)}
                className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-2.5 focus:border-amber-600 focus:bg-white font-medium"
              >
                <option value="Debris Flow">Debris Flow / Mudflow</option>
                <option value="Rockfall">Rockfall / Falling Boulders</option>
                <option value="Mudslide">Mudslide</option>
                <option value="Road Subsidance">Road Subsidance / Sinking</option>
                <option value="Ground Tension Crack">Ground Tension Crack</option>
                <option value="Flash Flood Debris">Flash Flood Debris</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Hazard Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-2.5 focus:border-amber-600 focus:bg-white font-medium"
              >
                <option value="Severe (Life Threatening)">Severe (Life Threatening)</option>
                <option value="High (Road Cut)">High (Road Cut)</option>
                <option value="Moderate">Moderate Hazard</option>
                <option value="Minor">Minor Slump</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-bold block mb-1">Road Blockage Status</label>
              <select
                value={roadBlockStatus}
                onChange={(e) => setRoadBlockStatus(e.target.value as any)}
                className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-2.5 focus:border-amber-600 focus:bg-white font-medium"
              >
                <option value="Totally Blocked">Totally Blocked (No vehicle)</option>
                <option value="Single Lane Only">Single Lane Only</option>
                <option value="Vehicles Stranded">Vehicles Stranded</option>
                <option value="Open with Caution">Open with Caution</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-slate-700 font-bold block mb-1">
              Field Description &amp; Danger Assessment
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe damage, size of boulders, water flow, stranded vehicles, and safe detours..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-2.5 focus:border-amber-600 focus:bg-white font-medium"
            />
          </div>

          {/* Reporter info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Your Name</label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-2.5 focus:border-amber-600 focus:bg-white font-medium"
              />
            </div>
            <div>
              <label className="text-slate-700 font-bold block mb-1">Contact Phone (Optional)</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 border border-slate-300 rounded-xl p-2.5 focus:border-amber-600 focus:bg-white font-medium"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white font-black flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer text-sm"
          >
            <Send className="w-4 h-4" />
            <span>Submit Report to DRISHTI Public Feed</span>
          </button>
        </form>
      )}
    </div>
  );
};
