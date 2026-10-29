import React, { useState } from 'react';
import {
  CloudRain,
  Droplets,
  Satellite,
  Mountain,
  History,
} from 'lucide-react';
import { NER_SCIENTIFIC_TELEMETRY } from '../data/nerData';

export const TelemetryPanel: React.FC = () => {
  const [activeSourceTab, setActiveSourceTab] = useState<'rainfall' | 'soil' | 'satellite' | 'terrain' | 'historical'>('rainfall');
  const telemetry = NER_SCIENTIFIC_TELEMETRY;

  return (
    <div className="space-y-6">
      {/* Overview Cards: The 5 Pillars of DRISHTI Landslide Early Warning */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* 1. Rainfall */}
        <button
          onClick={() => setActiveSourceTab('rainfall')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeSourceTab === 'rainfall'
              ? 'bg-blue-50/90 border-2 border-blue-500 shadow-md'
              : 'bg-white border border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <CloudRain className="w-5 h-5 text-blue-600" />
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
              IMD / GPM
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-[11px] text-slate-500 block font-bold">24h Cumulative Rain</span>
            <span className="text-xl font-black text-slate-950">{telemetry.rainfall.current24hCumulativeMm} mm</span>
          </div>
          <div className="mt-1 text-[11px] text-rose-600 font-bold">
            {telemetry.rainfall.imdWarningStatus} (Threshold: {telemetry.rainfall.exceedanceThresholdMm}mm)
          </div>
        </button>

        {/* 2. Soil Moisture */}
        <button
          onClick={() => setActiveSourceTab('soil')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeSourceTab === 'soil'
              ? 'bg-cyan-50/90 border-2 border-cyan-500 shadow-md'
              : 'bg-white border border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <Droplets className="w-5 h-5 text-cyan-600" />
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-200">
              NASA SMAP
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-[11px] text-slate-500 block font-bold">Soil Saturation</span>
            <span className="text-xl font-black text-slate-950">{telemetry.soilMoisture.saturationPercentage}%</span>
          </div>
          <div className="mt-1 text-[11px] text-rose-600 font-bold">
            Pore Pressure: {telemetry.soilMoisture.poreWaterPressureKPa} kPa
          </div>
        </button>

        {/* 3. Satellite SAR */}
        <button
          onClick={() => setActiveSourceTab('satellite')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeSourceTab === 'satellite'
              ? 'bg-rose-50/90 border-2 border-rose-500 shadow-md'
              : 'bg-white border border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <Satellite className="w-5 h-5 text-rose-600" />
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
              Sentinel-1
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-[11px] text-slate-500 block font-bold">InSAR Velocity</span>
            <span className="text-xl font-black text-rose-700">{telemetry.satelliteRadar.inSarLineOfSightVelocityMmYr} mm/yr</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-700 font-bold">
            Unstable Area: {telemetry.satelliteRadar.unstableSlopeAreaSqKm} km²
          </div>
        </button>

        {/* 4. Terrain & DEM */}
        <button
          onClick={() => setActiveSourceTab('terrain')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeSourceTab === 'terrain'
              ? 'bg-emerald-50/90 border-2 border-emerald-500 shadow-md'
              : 'bg-white border border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <Mountain className="w-5 h-5 text-emerald-600" />
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              ISRO Bhuvan
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-[11px] text-slate-500 block font-bold">Max Critical Slope</span>
            <span className="text-xl font-black text-slate-950">{telemetry.terrainGeology.maxSlopeAngleDeg}°</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-600 font-bold">
            Fault Proximity: {telemetry.terrainGeology.tectonicProximityKm} km
          </div>
        </button>

        {/* 5. Historical */}
        <button
          onClick={() => setActiveSourceTab('historical')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeSourceTab === 'historical'
              ? 'bg-amber-50/90 border-2 border-amber-500 shadow-md'
              : 'bg-white border border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <History className="w-5 h-5 text-amber-600" />
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
              GSI NLSM
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-[11px] text-slate-500 block font-bold">Historical Records</span>
            <span className="text-xl font-black text-slate-950">{telemetry.historicalDatabase.totalRecordedLandslides.toLocaleString()}</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-700 font-bold">
            Critical Threshold I-D Curve
          </div>
        </button>
      </div>

      {/* Deep-Dive Analysis Section for Selected Telemetry Pillar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        {/* Source 1: Rainfall Patterns */}
        {activeSourceTab === 'rainfall' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
                  <CloudRain className="w-5 h-5 text-blue-600" />
                  Rainfall Patterns Analysis (NASA Giovanni GPM &amp; IMD Hydromet Division)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Real-time precipitation radar integration, antecedent moisture indices, and IMD rainfall intensity thresholds.
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-1 rounded-lg">
                Satellite Pass: {telemetry.rainfall.gpmSatellitePass}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 uppercase font-mono font-bold">Current 24h Cumulative</span>
                <div className="text-2xl font-black text-blue-700">{telemetry.rainfall.current24hCumulativeMm} mm</div>
                <p className="text-xs text-rose-600 font-bold">
                  Exceeds safe triggering threshold of {telemetry.rainfall.exceedanceThresholdMm} mm by +58.4 mm
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 uppercase font-mono font-bold">Hourly Cloudburst Intensity</span>
                <div className="text-2xl font-black text-amber-700">{telemetry.rainfall.hourlyIntensityMmHr} mm/hr</div>
                <p className="text-xs text-slate-600">
                  Instantaneous runoff exceeding hill culvert hydraulic carrying capacity
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 uppercase font-mono font-bold">Antecedent 3-Day Rainfall</span>
                <div className="text-2xl font-black text-rose-700">{telemetry.rainfall.antecedentRainfall3DaysMm} mm</div>
                <p className="text-xs text-slate-600">
                  Total ground pre-wetting leading to deep failure surfaces in Dima Hasao and Sikkim
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs leading-relaxed space-y-2">
              <h4 className="font-bold text-slate-900">IMD Hydromet &amp; NASA Giovanni Integration Workflow:</h4>
              <p className="text-slate-700">
                Data is ingested at 30-minute intervals from NASA Global Precipitation Measurement (GPM) Integrated Multi-satellitE Retrievals (IMERG) and cross-calibrated against ground Automatic Weather Stations (AWS) deployed by the India Meteorological Department across Guwahati, Haflong, Gangtok, Kohima, and Pasighat. When cumulative 24h precipitation exceeds 160 mm on slopes &gt;35°, automated voice and notification alerts are dispatched to citizens.
              </p>
            </div>
          </div>
        )}

        {/* Source 2: Soil Moisture Sensors */}
        {activeSourceTab === 'soil' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-cyan-600" />
                  Soil Moisture Telemetry (NASA SMAP &amp; Copernicus Climate Data Store)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  L-band radiometer volumetric water content (m³/m³) and ERA5-Land rootzone saturation analysis.
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 px-2 py-1 rounded-lg">
                Feed: {telemetry.soilMoisture.smapPassTime}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 uppercase font-mono font-bold">Topsoil Moisture (0-10 cm)</span>
                <div className="text-2xl font-black text-cyan-700">{telemetry.soilMoisture.topsoilMoisture_m3m3} m³/m³</div>
                <p className="text-xs text-rose-600 font-bold">Near field saturation limit (porosity limit: 0.460)</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 uppercase font-mono font-bold">Rootzone Moisture (10-40 cm)</span>
                <div className="text-2xl font-black text-cyan-700">{telemetry.soilMoisture.rootzoneMoisture_m3m3} m³/m³</div>
                <p className="text-xs text-slate-600">Deep soil slip plane lubricated by sub-surface aquifer</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 uppercase font-mono font-bold">Saturation Percentage</span>
                <div className="text-2xl font-black text-rose-700">{telemetry.soilMoisture.saturationPercentage}%</div>
                <p className="text-xs text-rose-600 font-bold">Shear strength reduction: 82% loss</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs leading-relaxed space-y-2">
              <h4 className="font-bold text-slate-900">Copernicus CDS &amp; SMAP Geotechnical Significance:</h4>
              <p className="text-slate-700">
                Landslides in the North Eastern Region are predominately hydrologically driven shallow translational slides and debris flows. When the SMAP soil moisture saturation index crosses 85%, capillary cohesion in the Disang and Barail group soils drops to near-zero. Coupled with positive pore water pressure, gravitational shear stress overcomes friction, leading to immediate slope failure.
              </p>
            </div>
          </div>
        )}

        {/* Source 3: Satellite Imagery & Radar */}
        {activeSourceTab === 'satellite' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
                  <Satellite className="w-5 h-5 text-rose-600" />
                  Satellite Imagery &amp; InSAR (Alaska Satellite Facility &amp; Google Earth Engine)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Sentinel-1 C-band Synthetic Aperture Radar (SAR) Interferometry and Optical Coherence Change Detection.
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200 px-2 py-1 rounded-lg">
                Interferogram: {telemetry.satelliteRadar.interferogramDate}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 uppercase font-mono font-bold">InSAR Line-of-Sight Velocity</span>
                <div className="text-2xl font-black text-rose-700">
                  {telemetry.satelliteRadar.inSarLineOfSightVelocityMmYr} mm/year
                </div>
                <p className="text-xs text-rose-600 font-bold">Rapid downslope creeping movement detected</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 uppercase font-mono font-bold">Radar Coherence Loss</span>
                <div className="text-2xl font-black text-amber-700">{telemetry.satelliteRadar.coherenceDegradation}</div>
                <p className="text-xs text-slate-600">Ground surface physical disruption and tension cracking</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 uppercase font-mono font-bold">Unstable Active Slope Area</span>
                <div className="text-2xl font-black text-slate-950">{telemetry.satelliteRadar.unstableSlopeAreaSqKm} km²</div>
                <p className="text-xs text-slate-600">Mapped across vulnerable highway cuts and river valleys</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs leading-relaxed space-y-2">
              <h4 className="font-bold text-slate-900">Alaska Satellite Facility (ASF) InSAR Processing:</h4>
              <p className="text-slate-700">
                By comparing Sentinel-1 SAR phase differences between consecutive 12-day orbital passes through the Alaska Satellite Facility Open Science Lab pipeline and Google Earth Engine (GEE), mm-scale millimeter ground movement is tracked prior to catastrophic failure. High line-of-sight velocity (-44 mm/yr) on the Teesta valley slopes triggered the proactive red alert for the Dzongu sector.
              </p>
            </div>
          </div>
        )}

        {/* Source 4: Terrain / Slope Data */}
        {activeSourceTab === 'terrain' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
                  <Mountain className="w-5 h-5 text-emerald-600" />
                  Terrain &amp; Slope Data (ISRO Bhuvan &amp; USGS EarthExplorer)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  CartoDEM 30m Digital Elevation Model, slope curvature, aspect, and fault line proximity.
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-1 rounded-lg">
                DEM: {telemetry.terrainGeology.digitalElevationModel}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 uppercase font-mono font-bold">Critical Slope Angle</span>
                <div className="text-2xl font-black text-emerald-700">{telemetry.terrainGeology.maxSlopeAngleDeg}°</div>
                <p className="text-xs text-rose-600 font-bold">Exceeds 35° natural angle of repose</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 uppercase font-mono font-bold">Lithological Formation</span>
                <div className="text-sm font-bold text-slate-950 line-clamp-2">{telemetry.terrainGeology.lithology}</div>
                <p className="text-xs text-slate-600 mt-1">High weathering susceptibility upon water ingress</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 uppercase font-mono font-bold">Drainage Flow Density</span>
                <div className="text-sm font-bold text-amber-700">{telemetry.terrainGeology.drainageDensity}</div>
                <p className="text-xs text-slate-600">Rapid channel concentration causing toe erosion</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs leading-relaxed space-y-2">
              <h4 className="font-bold text-slate-900">ISRO Bhuvan &amp; USGS EarthExplorer Geomorphology:</h4>
              <p className="text-slate-700">
                Cartosat-1 derived CartoDEM data provides high-precision slope gradient and drainage basin delineation. Slopes between 35° and 55° with concave profile curvature exhibit the highest concentration of historical failures across Nagaland and Meghalaya escarpments.
              </p>
            </div>
          </div>
        )}

        {/* Source 5: Historical Landslide Records */}
        {activeSourceTab === 'historical' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
                  <History className="w-5 h-5 text-amber-600" />
                  Historical Landslide Database &amp; Trigger Analysis (GSI &amp; NER SDMAs)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Over 4,100 verified historical records analyzed for empirical Intensity-Duration (I-D) triggering thresholds.
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 rounded-lg">
                Threshold: {telemetry.historicalDatabase.criticalRainfallDurationThreshold}
              </span>
            </div>

            {/* Historical Notable Disasters Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Benchmark Historical Landslide Events &amp; Triggering Conditions:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {telemetry.historicalDatabase.notableEvents.map((evt, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-950 text-sm">
                        {evt.year} - {evt.location}
                      </span>
                      <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {evt.fatalities} Fatalities
                      </span>
                    </div>
                    <div className="text-amber-700 font-mono font-bold text-[11px]">
                      Trigger Rainfall: {evt.triggerRainfallMm} mm / 24h
                    </div>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {evt.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs leading-relaxed space-y-2">
              <h4 className="font-bold text-slate-900">GSI National Landslide Susceptibility Mapping (NLSM) Conditions:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {telemetry.historicalDatabase.majorTriggers.map((trig, i) => (
                  <li key={i}>{trig}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
