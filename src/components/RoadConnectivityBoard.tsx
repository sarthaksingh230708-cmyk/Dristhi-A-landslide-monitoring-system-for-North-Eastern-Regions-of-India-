import React, { useState } from 'react';
import {
  Car,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Navigation,
  Shield,
  Search,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { NER_ROAD_STATUS } from '../data/nerData';
import { RoadStatusItem } from '../types';

export const RoadConnectivityBoard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'BLOCKED' | 'ONE-WAY' | 'HIGH_RISK' | 'CLEAR'>('ALL');
  const [roadData] = useState<RoadStatusItem[]>(NER_ROAD_STATUS);

  const filteredRoads = roadData.filter((road) => {
    if (filterStatus !== 'ALL' && road.status !== filterStatus) return false;
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      road.highwayCode.toLowerCase().includes(q) ||
      road.corridorName.toLowerCase().includes(q) ||
      road.blockageLocation.toLowerCase().includes(q) ||
      road.states.some((s) => s.toLowerCase().includes(q))
    );
  });

  const blockedCount = roadData.filter((r) => r.status === 'BLOCKED').length;
  const oneWayCount = roadData.filter((r) => r.status === 'ONE-WAY').length;
  const highRiskCount = roadData.filter((r) => r.status === 'HIGH_RISK').length;
  const clearCount = roadData.filter((r) => r.status === 'CLEAR').length;

  return (
    <div className="space-y-6">
      {/* Highway Status Summary Dashboard on White Background */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setFilterStatus(filterStatus === 'BLOCKED' ? 'ALL' : 'BLOCKED')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            filterStatus === 'BLOCKED'
              ? 'bg-rose-100/90 border-2 border-rose-500 shadow-md'
              : 'bg-rose-50/70 border border-rose-200 hover:border-rose-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-rose-900 uppercase">🔴 Impassable / Cut</span>
            <span className="text-xl font-black text-rose-700">{blockedCount}</span>
          </div>
          <p className="text-[11px] text-rose-800 mt-1 font-medium">Carriageway cut by landslides</p>
        </button>

        <button
          onClick={() => setFilterStatus(filterStatus === 'ONE-WAY' ? 'ALL' : 'ONE-WAY')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            filterStatus === 'ONE-WAY'
              ? 'bg-amber-100/90 border-2 border-amber-500 shadow-md'
              : 'bg-amber-50/70 border border-amber-200 hover:border-amber-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-900 uppercase">🟡 One-Way Convoy</span>
            <span className="text-xl font-black text-amber-700">{oneWayCount}</span>
          </div>
          <p className="text-[11px] text-amber-800 mt-1 font-medium">Single lane; clearing active</p>
        </button>

        <button
          onClick={() => setFilterStatus(filterStatus === 'HIGH_RISK' ? 'ALL' : 'HIGH_RISK')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            filterStatus === 'HIGH_RISK'
              ? 'bg-blue-100/90 border-2 border-blue-500 shadow-md'
              : 'bg-blue-50/70 border border-blue-200 hover:border-blue-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-blue-900 uppercase">🔵 High Risk Pass</span>
            <span className="text-xl font-black text-blue-700">{highRiskCount}</span>
          </div>
          <p className="text-[11px] text-blue-800 mt-1 font-medium">Active falling rocks / fog hazard</p>
        </button>

        <button
          onClick={() => setFilterStatus(filterStatus === 'CLEAR' ? 'ALL' : 'CLEAR')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            filterStatus === 'CLEAR'
              ? 'bg-emerald-100/90 border-2 border-emerald-500 shadow-md'
              : 'bg-emerald-50/70 border border-emerald-200 hover:border-emerald-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-900 uppercase">🟢 Normal Movement</span>
            <span className="text-xl font-black text-emerald-700">{clearCount}</span>
          </div>
          <p className="text-[11px] text-emerald-800 mt-1 font-medium">No obstruction reported</p>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Highway (NH-10, NH-29, State...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-rose-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-600 font-bold hidden sm:inline">Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-slate-50 text-slate-800 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Highway Corridors ({roadData.length})</option>
            <option value="BLOCKED">Blocked Only</option>
            <option value="ONE-WAY">One-Way / Caution</option>
            <option value="HIGH_RISK">High Risk Passes</option>
            <option value="CLEAR">Clear Only</option>
          </select>
        </div>
      </div>

      {/* Highway Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRoads.map((road) => {
          let statusBadgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
          let statusLabel = 'OPEN & CLEAR';
          let cardBorder = 'border-slate-200 bg-white';

          if (road.status === 'BLOCKED') {
            statusBadgeClass = 'bg-rose-600 text-white border-rose-700 animate-pulse';
            statusLabel = '🔴 ROAD BLOCKED';
            cardBorder = 'border-rose-300 bg-rose-50/30';
          } else if (road.status === 'ONE-WAY') {
            statusBadgeClass = 'bg-amber-500 text-white border-amber-600';
            statusLabel = '🟡 ONE-WAY CONVOY';
            cardBorder = 'border-amber-300 bg-amber-50/30';
          } else if (road.status === 'HIGH_RISK') {
            statusBadgeClass = 'bg-blue-600 text-white border-blue-700';
            statusLabel = '🔵 HIGH RISK PASS';
            cardBorder = 'border-blue-300 bg-blue-50/30';
          }

          return (
            <div
              key={road.id}
              className={`p-5 rounded-3xl border-2 shadow-xs space-y-3.5 transition-all ${cardBorder}`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black font-mono px-2 py-0.5 rounded-lg bg-slate-900 text-white">
                      {road.highwayCode}
                    </span>
                    <h3 className="text-sm font-black text-slate-950">{road.corridorName}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    States: {road.states.join(', ')} • Updated {road.lastUpdated}
                  </p>
                </div>

                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-black border uppercase tracking-wider flex-shrink-0 ${statusBadgeClass}`}
                >
                  {statusLabel}
                </span>
              </div>

              {/* Specific Obstruction details */}
              <div className="space-y-2 text-xs">
                <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-1 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-mono text-[11px] uppercase font-bold">Location:</span>
                    <span className="font-extrabold text-amber-900">{road.blockageLocation}</span>
                  </div>
                  <div className="text-slate-700">
                    <strong className="text-slate-900">Cause:</strong> {road.cause}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase text-slate-500 block font-mono font-bold">
                      Restoration Agency:
                    </span>
                    <span className="font-bold text-slate-900">{road.clearingAgency}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase text-slate-500 block font-mono font-bold">
                      Estimated Opening Time:
                    </span>
                    <span className="font-bold text-rose-700">
                      {road.estimatedClearingTime || 'Normal passage'}
                    </span>
                  </div>
                </div>

                {road.alternateRoute && (
                  <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 flex items-start gap-2">
                    <Navigation className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-black text-blue-900 uppercase block font-mono">
                        Recommended Alternate Route / Detour:
                      </span>
                      <span className="text-slate-800 text-xs font-medium">{road.alternateRoute}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
