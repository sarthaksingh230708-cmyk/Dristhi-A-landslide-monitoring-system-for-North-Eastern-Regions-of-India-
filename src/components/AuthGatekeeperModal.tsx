import React, { useState, useEffect } from 'react';
import {
  Shield,
  Key,
  Building2,
  Users,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Sliders,
  Sparkles,
  ArrowRight,
  RefreshCw,
  X,
} from 'lucide-react';
import { authService, DEVELOPER_PASSKEY } from '../services/authService';
import { UserRole, UserSession, CivilianVisibilityConfig } from '../types';
import { citizenService } from '../services/citizenService';

interface AuthGatekeeperModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredForAccess?: boolean;
}

export const AuthGatekeeperModal: React.FC<AuthGatekeeperModalProps> = ({
  isOpen,
  onClose,
  requiredForAccess = false,
}) => {
  const [activeTab, setActiveTab] = useState<'developer' | 'official' | 'civilian' | 'visibility'>('civilian');
  const [session, setSession] = useState<UserSession | null>(authService.getSession());
  const [visibility, setVisibility] = useState<CivilianVisibilityConfig>(authService.getVisibilityConfig());

  // Developer passkey input
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState('');
  const [showPasskey, setShowPasskey] = useState(false);

  // Official form state
  const [officialName, setOfficialName] = useState('');
  const [officialOrg, setOfficialOrg] = useState('State Disaster Management Authority (SDMA)');
  const [officialId, setOfficialId] = useState('');
  const [officialState, setOfficialState] = useState('Meghalaya');
  const [officialRoleType, setOfficialRoleType] = useState<'ADMINISTRATOR' | 'OFFICIAL'>('ADMINISTRATOR');

  // Civilian form state
  const [civName, setCivName] = useState('');
  const [civPhone, setCivPhone] = useState('');
  const [civState, setCivState] = useState('Assam');
  const [civDistrict, setCivDistrict] = useState('Dima Hasao');
  const [civVillage, setCivVillage] = useState('Haflong Basti');

  useEffect(() => {
    const unsubSession = authService.subscribeSession((newSession) => {
      setSession(newSession);
    });
    const unsubVis = authService.subscribeVisibility((newVis) => {
      setVisibility(newVis);
    });
    return () => {
      unsubSession();
      unsubVis();
    };
  }, []);

  if (!isOpen) return null;

  const handleDeveloperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasskeyError('');
    const result = authService.loginDeveloper(passkeyInput);
    if (result.success) {
      onClose();
    } else {
      setPasskeyError('Invalid passkey. For authorized developers, enter SPAIN07AM.');
    }
  };

  const handleQuickBypass = () => {
    setPasskeyInput(DEVELOPER_PASSKEY);
    authService.loginDeveloper(DEVELOPER_PASSKEY);
    onClose();
  };

  const handleOfficialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officialName.trim()) {
      alert('Please enter your full name');
      return;
    }
    authService.loginOfficial({
      displayName: officialName,
      organization: officialOrg,
      officialId: officialId || 'NER-GOV-' + Math.floor(1000 + Math.random() * 9000),
      state: officialState,
      role: officialRoleType,
    });
    onClose();
  };

  const handleCivilianSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    authService.loginCivilian({
      fullName: civName || 'North East Resident',
      phoneNumber: civPhone || '+91 94360 XXXXX',
      state: civState,
      district: civDistrict,
      villageOrTown: civVillage,
    });
    citizenService.updateProfile({
      fullName: civName || 'North East Resident',
      state: civState,
      district: civDistrict,
      villageOrTown: civVillage,
      phoneNumber: civPhone || '+91 94360 XXXXX',
    });
    onClose();
  };

  const handleToggleVisibility = (key: keyof CivilianVisibilityConfig) => {
    authService.updateVisibilityConfig({
      [key]: !visibility[key],
    });
  };

  const isDevOrAdmin = session?.role === 'DEVELOPER' || session?.role === 'ADMINISTRATOR' || session?.role === 'OFFICIAL';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-900">
        {/* Header with Cyber Security Protocol Shield */}
        <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-rose-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-rose-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">DRISHTI Security &amp; Access Protocol</h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                  NER-RBAC v2.4
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Multi-tier identity access for Administrators, Government Bureaucrats, NER Civilians &amp; Developers
              </p>
            </div>
          </div>
          {!requiredForAccess && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Current Active Session Status Banner */}
        {session && (
          <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-600">Active Profile:</span>
              <strong className="text-slate-900 font-black">{session.displayName}</strong>
              <span className="px-2 py-0.5 rounded-md bg-slate-200 font-bold text-[10px] text-slate-700">
                {session.role}
              </span>
            </div>
            <button
              onClick={() => authService.logout()}
              className="text-rose-600 hover:text-rose-700 font-bold text-[11px] underline cursor-pointer"
            >
              Sign Out / Switch
            </button>
          </div>
        )}

        {/* Role Selection Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 p-1.5 gap-1 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('developer')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'developer'
                ? 'bg-white text-rose-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-4 h-4 text-purple-600" />
            <span>Developer Passkey</span>
          </button>
          <button
            onClick={() => setActiveTab('official')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'official'
                ? 'bg-white text-rose-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-600" />
            <span>Govt &amp; Officials</span>
          </button>
          <button
            onClick={() => setActiveTab('civilian')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'civilian'
                ? 'bg-white text-rose-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>NER Citizen Profile</span>
          </button>
          {isDevOrAdmin && (
            <button
              onClick={() => setActiveTab('visibility')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'visibility'
                  ? 'bg-white text-rose-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>Civilian View Controls</span>
            </button>
          )}
        </div>

        {/* Tab Contents */}
        <div className="p-5 overflow-y-auto flex-1 text-sm space-y-4">
          {/* TAB 1: DEVELOPER PASSKEY */}
          {activeTab === 'developer' && (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-purple-950">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Key className="w-4 h-4 text-purple-600" />
                  <span>Developer Instant Passkey Access</span>
                </div>
                <p className="text-xs text-purple-800 mt-1 leading-relaxed">
                  Developers with the master cryptographic passkey can open the application directly with full
                  superadmin privileges, sensitive telemetry override, and civil visibility controls.
                </p>
              </div>

              <form onSubmit={handleDeveloperSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enter Developer Passkey:
                  </label>
                  <div className="relative">
                    <input
                      type={showPasskey ? 'text' : 'password'}
                      value={passkeyInput}
                      onChange={(e) => setPasskeyInput(e.target.value)}
                      placeholder="Enter passkey (e.g. SPAIN07AM)"
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 font-mono text-sm tracking-wider focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasskey(!showPasskey)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPasskey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passkeyError && (
                    <p className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{passkeyError}</span>
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-700 hover:bg-purple-800 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-700/20"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Unlock Developer Mode</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickBypass}
                    className="bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-xs"
                    title="Pre-fill passkey SPAIN07AM and open directly"
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Quick Direct Open (SPAIN07AM)</span>
                  </button>
                </div>
              </form>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 space-y-1">
                <strong>Granted Developer Capabilities:</strong>
                <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                  <li>Direct bypass to all live QGIS radar, tectonic fault lines, and defense highways</li>
                  <li>Configure what general North East civilians are allowed to view</li>
                  <li>Inspect raw InSAR velocity deformation and GLOF risk profiles</li>
                  <li>Calibrate ground-truth accuracy parameters and false-alarm metrics</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: ADMINISTRATORS, OFFICIALS, GOVERNMENTS & BUREAUCRATS */}
          {activeTab === 'official' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-950">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Building2 className="w-4 h-4 text-amber-700" />
                  <span>Government &amp; Departmental Portal</span>
                </div>
                <p className="text-xs text-amber-800 mt-1">
                  Access reserved for State Disaster Management Authorities (SDMA), National Disaster Response Force (NDRF),
                  Border Roads Organisation (BRO), Ministry of DoNER, and District Commissioners.
                </p>
              </div>

              <form onSubmit={handleOfficialSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name &amp; Rank:</label>
                    <input
                      type="text"
                      value={officialName}
                      onChange={(e) => setOfficialName(e.target.value)}
                      placeholder="e.g. Er. Rajesh Debbarma"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Department / Organization:</label>
                    <select
                      value={officialOrg}
                      onChange={(e) => setOfficialOrg(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="State Disaster Management Authority (SDMA)">State Disaster Management Authority (SDMA)</option>
                      <option value="National Disaster Response Force (NDRF)">National Disaster Response Force (NDRF)</option>
                      <option value="Border Roads Organisation (BRO Project Swastik/Pushpak)">Border Roads Organisation (BRO)</option>
                      <option value="Public Works Department (PWD Hills)">Public Works Department (PWD Hills)</option>
                      <option value="Ministry of Development of North Eastern Region (DoNER)">Ministry of DoNER</option>
                      <option value="Geological Survey of India (GSI NER)">Geological Survey of India (GSI NER)</option>
                      <option value="District Magistrate / DC Emergency Cell">District Magistrate Emergency Cell</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Official Employee / Badge ID:</label>
                    <input
                      type="text"
                      value={officialId}
                      onChange={(e) => setOfficialId(e.target.value)}
                      placeholder="e.g. SSDMA-GSI-8821"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">State Jurisdiction:</label>
                    <select
                      value={officialState}
                      onChange={(e) => setOfficialState(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Sikkim">Sikkim</option>
                      <option value="Tripura">Tripura</option>
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Assam">Assam</option>
                      <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                      <option value="Manipur">Manipur</option>
                      <option value="Mizoram">Mizoram</option>
                      <option value="Nagaland">Nagaland</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Access Tier:</label>
                    <select
                      value={officialRoleType}
                      onChange={(e) => setOfficialRoleType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-bold text-amber-900 focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="ADMINISTRATOR">Administrator (Can control citizen view)</option>
                      <option value="OFFICIAL">Field Official / Responder</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-600/20 text-xs"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Authenticate Official Credentials &amp; Proceed</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: GENERAL NORTH EAST CIVILIANS */}
          {activeTab === 'civilian' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-950">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>General North East Civilian Registration</span>
                </div>
                <p className="text-xs text-emerald-800 mt-1">
                  Citizens of Assam, Sikkim, Meghalaya, Tripura, Arunachal Pradesh, Manipur, Mizoram, and Nagaland.
                  Receive verified public warnings, voice sirens, Google Maps evacuation trajectories, and emergency contacts.
                </p>
              </div>

              <form onSubmit={handleCivilianSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name:</label>
                    <input
                      type="text"
                      value={civName}
                      onChange={(e) => setCivName(e.target.value)}
                      placeholder="e.g. Tenzing Lepcha / Debojit Barman"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone (for Offline SMS Alerts):</label>
                    <input
                      type="tel"
                      value={civPhone}
                      onChange={(e) => setCivPhone(e.target.value)}
                      placeholder="+91 94360 XXXXX"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">NER State:</label>
                    <select
                      value={civState}
                      onChange={(e) => setCivState(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Sikkim">Sikkim</option>
                      <option value="Tripura">Tripura</option>
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Assam">Assam</option>
                      <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                      <option value="Manipur">Manipur</option>
                      <option value="Mizoram">Mizoram</option>
                      <option value="Nagaland">Nagaland</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">District:</label>
                    <input
                      type="text"
                      value={civDistrict}
                      onChange={(e) => setCivDistrict(e.target.value)}
                      placeholder="e.g. Mangan / Dhalai / East Khasi"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Village / Town / Locality:</label>
                    <input
                      type="text"
                      value={civVillage}
                      onChange={(e) => setCivVillage(e.target.value)}
                      placeholder="e.g. Chungthang / Jampui / Sohra"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 text-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Citizen Profile &amp; Enter DRISHTI</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: CIVILIAN VISIBILITY CONTROLLER (FOR DEVELOPERS & OFFICIALS) */}
          {activeTab === 'visibility' && isDevOrAdmin && (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-indigo-950">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Sliders className="w-4 h-4 text-indigo-700" />
                  <span>Civilian Visibility &amp; Information Governance (Cyber Security Rule)</span>
                </div>
                <p className="text-xs text-indigo-800 mt-1">
                  As an authorized Developer or Government Official, decide precisely what sensitive data and defense
                  infrastructure the general NER citizens are permitted to view.
                </p>
              </div>

              <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <div className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <strong className="text-slate-900 block">Classified BRO Military Lifeline Corridors</strong>
                    <span className="text-slate-500 text-[11px]">
                      Show strategic defense convoy bypasses and high-security border roads to civilians
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility('showClassifiedBROCorridors')}
                    className={`px-3 py-1 rounded-full font-bold text-xs cursor-pointer transition-colors ${
                      visibility.showClassifiedBROCorridors
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {visibility.showClassifiedBROCorridors ? 'Visible to Public' : 'Restricted (Govt Only)'}
                  </button>
                </div>

                <div className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <strong className="text-slate-900 block">Raw Satellite InSAR Interferograms &amp; Velocity Fields</strong>
                    <span className="text-slate-500 text-[11px]">
                      Permit citizens to inspect uncalibrated satellite radar line-of-sight velocity data
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility('showRawInSARInterferograms')}
                    className={`px-3 py-1 rounded-full font-bold text-xs cursor-pointer transition-colors ${
                      visibility.showRawInSARInterferograms
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {visibility.showRawInSARInterferograms ? 'Visible to Public' : 'Restricted (Govt Only)'}
                  </button>
                </div>

                <div className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <strong className="text-slate-900 block">Tectonic Fault Lines &amp; Seismic Micro-Displacements</strong>
                    <span className="text-slate-500 text-[11px]">
                      Display active tectonic shear velocity vectors along Main Boundary Thrust and Kopili fault
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility('showTectonicFaultDisplacements')}
                    className={`px-3 py-1 rounded-full font-bold text-xs cursor-pointer transition-colors ${
                      visibility.showTectonicFaultDisplacements
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {visibility.showTectonicFaultDisplacements ? 'Visible to Public' : 'Restricted (Govt Only)'}
                  </button>
                </div>

                <div className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <strong className="text-slate-900 block">Sensitive Infrastructure Points (Dams, Substations, Helipads)</strong>
                    <span className="text-slate-500 text-[11px]">
                      Render operational status of strategic bridges and hydroelectric powerhouses
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility('showSensitiveInfrastructures')}
                    className={`px-3 py-1 rounded-full font-bold text-xs cursor-pointer transition-colors ${
                      visibility.showSensitiveInfrastructures
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {visibility.showSensitiveInfrastructures ? 'Visible to Public' : 'Restricted (Govt Only)'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Current Tier:{' '}
            <strong className="text-slate-800 font-bold">{session ? session.role : 'Public Visitor (Civilian)'}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl cursor-pointer"
          >
            Continue to App
          </button>
        </div>
      </div>
    </div>
  );
};
