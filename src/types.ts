export type RiskLevel = 'EXTREME' | 'HIGH' | 'MODERATE' | 'LOW';

export interface HazardZone {
  id: string;
  name: string;
  state: 'Assam' | 'Arunachal Pradesh' | 'Meghalaya' | 'Manipur' | 'Mizoram' | 'Nagaland' | 'Tripura' | 'Sikkim';
  district: string;
  lat: number;
  lng: number;
  radiusKm: number;
  probability: number; // 0 - 100%
  colorCategory: 'purple' | 'orange' | 'blue' | 'green' | 'red' | 'dark-yellow' | 'dark-green';
  rainfall24hMm: number;
  soilMoistureSatPct: number;
  slopeDeg: number;
  insarDeformationMmYr: number;
  triggerCause: string;
  vulnerableVillagesCount: number;
  affectedRoads: string[];
  historicalEventsCount: number;
  statusText: string;
  recommendedAction: string;
  coordinatesPolygon?: [number, number][];
  // Prediction range & active forecast window
  probabilityRange?: [number, number]; // e.g. [87, 96]
  forecastTimeWindow?: string; // e.g. 'Next 5 - 7 hours (Valid until 18:30 IST)'
  forecastDateDay?: string; // e.g. 'Tuesday, 7th September'
  modelAccuracyPct?: number; // e.g. 93.4
  falsePositiveRatePct?: number; // e.g. 3.8
  falseNegativeRatePct?: number; // e.g. 2.1
  modelConfidenceScore?: number; // e.g. 92%
  nearestShelterName?: string;
  nearestShelterLat?: number;
  nearestShelterLng?: number;
  evacuationDistanceKm?: number;
}

export interface VillageAsset {
  id: string;
  name: string;
  state: string;
  district: string;
  lat: number;
  lng: number;
  population: number;
  riskProbability: number;
  nearestShelter: string;
  shelterCapacity: number;
  distanceToFaultKm: number;
}

export interface InfrastructureAsset {
  id: string;
  name: string;
  type: 'Hospital' | 'Bridge' | 'Power Station' | 'Relief Camp' | 'Communication Tower' | 'Helipad';
  state: string;
  lat: number;
  lng: number;
  operationalStatus: 'Operational' | 'Caution' | 'Damaged';
}

export interface RoadStatusItem {
  id: string;
  highwayCode: string;
  corridorName: string;
  states: string[];
  status: 'BLOCKED' | 'ONE-WAY' | 'HIGH_RISK' | 'CLEAR';
  blockageLocation: string;
  cause: string;
  clearingAgency: string; // e.g. BRO (Border Roads Organisation), PWD, NHIDCL
  estimatedClearingTime?: string;
  alternateRoute?: string;
  lastUpdated: string;
  lat: number;
  lng: number;
}

export interface ScientificTelemetry {
  rainfall: {
    source: 'NASA Giovanni (GPM) & IMD Hydromet Division';
    current24hCumulativeMm: number;
    hourlyIntensityMmHr: number;
    antecedentRainfall3DaysMm: number;
    imdWarningStatus: 'Red Alert' | 'Orange Alert' | 'Yellow Alert' | 'Green';
    exceedanceThresholdMm: number;
    gpmSatellitePass: string;
  };
  soilMoisture: {
    source: 'NASA SMAP & Copernicus Climate Data Store (CDS)';
    topsoilMoisture_m3m3: number;
    rootzoneMoisture_m3m3: number;
    saturationPercentage: number;
    poreWaterPressureKPa: number;
    smapPassTime: string;
  };
  satelliteRadar: {
    source: 'Alaska Satellite Facility (ASF) / Sentinel-1 SAR & Google Earth Engine';
    orbitDirection: 'Ascending' | 'Descending';
    inSarLineOfSightVelocityMmYr: number;
    coherenceDegradation: number;
    interferogramDate: string;
    unstableSlopeAreaSqKm: number;
  };
  terrainGeology: {
    source: 'ISRO Bhuvan Open Data Archive & USGS EarthExplorer';
    digitalElevationModel: 'CartoDEM 30m / SRTM';
    maxSlopeAngleDeg: number;
    lithology: string; // e.g., 'Disang Shales / Tertiary Sedimentary Formations'
    tectonicProximityKm: number;
    drainageDensity: string;
  };
  historicalDatabase: {
    source: 'Geological Survey of India (GSI) & NER State SDMAs';
    totalRecordedLandslides: number;
    majorTriggers: string[];
    criticalRainfallDurationThreshold: string;
    notableEvents: {
      year: number;
      location: string;
      fatalities: number;
      triggerRainfallMm: number;
      description: string;
    }[];
  };
}

export interface CitizenProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  state: string;
  district: string;
  villageOrTown: string;
  lat?: number;
  lng?: number;
  emergencyContactName: string;
  emergencyContactPhone: string;
  notificationsEnabled: boolean;
  voiceAlertsEnabled: boolean;
  preferredLanguage: string;
}

export interface IncidentReport {
  id: string;
  reporterName: string;
  phoneNumber?: string;
  state: string;
  district: string;
  villageRoad: string;
  lat: number;
  lng: number;
  incidentType: 'Debris Flow' | 'Rockfall' | 'Mudslide' | 'Road Subsidance' | 'Ground Tension Crack' | 'Flash Flood Debris';
  severity: 'Severe (Life Threatening)' | 'High (Road Cut)' | 'Moderate' | 'Minor';
  roadBlockStatus: 'Totally Blocked' | 'Single Lane Only' | 'Open with Caution' | 'Vehicles Stranded';
  description: string;
  photoUrl: string;
  photoTimestamp: string;
  verified: boolean;
  upvotes: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  timestamp: string;
  zoneId?: string;
  read: boolean;
  isOfflineCached?: boolean;
  actionRequired?: string;
}

export interface HelplineContact {
  state: string;
  agencyName: string;
  controlRoomNumber: string;
  tollFree: string;
  alternateNumber?: string;
  email?: string;
  whatsappEmergency?: string;
}

export type SupportedLanguage =
  | 'English'
  | 'Hindi'
  | 'Bodo'
  | 'Karbi'
  | 'Mising'
  | 'Sylheti'
  | 'Garo'
  | 'Jaintia / Pnar'
  | 'Ao'
  | 'Angami'
  | 'Sumi'
  | 'Lotha'
  | 'Konyak'
  | 'Thadou / Kuki'
  | 'Tangkhul'
  | 'Paite'
  | 'Kokborok'
  | 'Adi'
  | 'Galo'
  | 'Mishmi'
  | 'Monpa'
  | 'Wancho'
  | 'Lai'
  | 'Mara'
  | 'Chakma'
  | 'Sikkimese / Bhutia'
  | 'Lepcha'
  | 'Limbu';

export interface QGISLayerConfig {
  id: string;
  name: string;
  description: string;
  visible: boolean;
  opacity: number;
  color: string;
  category: 'Hazard' | 'Assets' | 'Telemetry' | 'Infrastructure';
}

export type UserRole = 'DEVELOPER' | 'ADMINISTRATOR' | 'OFFICIAL' | 'CIVILIAN';

export interface UserSession {
  role: UserRole;
  displayName: string;
  organization?: string;
  officialId?: string;
  state?: string;
  district?: string;
  isDeveloperAuthenticated: boolean;
  loginTimestamp: string;
}

export interface CivilianVisibilityConfig {
  showClassifiedBROCorridors: boolean;
  showRawInSARInterferograms: boolean;
  showTectonicFaultDisplacements: boolean;
  showSensitiveInfrastructures: boolean;
  showUnverifiedFieldReports: boolean;
}

export interface PredictionOutcomeReport {
  id: string;
  zoneId?: string;
  hazardZoneId?: string;
  zoneName: string;
  forecastDate?: string;
  forecastTimeWindow?: string;
  predictedRange: [number, number];
  predictedWindow?: string;
  reportedOutcome?: 'LANDSLIDE_CONFIRMED' | 'FALSE_ALARM_STABLE' | 'NEAR_MISS_MINOR' | 'DELAYED_TRIGGER';
  actualOutcome?: 'OCCURRED' | 'FALSE_ALARM' | 'NO_EVENT' | 'PENDING';
  observedRainfallMm?: number;
  reporterRole?: UserRole;
  reporterName?: string;
  submittedBy?: string;
  notes?: string;
  observerNotes?: string;
  timestamp: string;
}

export interface EvacuationWaypoint {
  order: number;
  name: string;
  lat: number;
  lng: number;
  instruction: string;
  safetyCaution: string;
  isSafeZone: boolean;
}

export interface EvacuationTrajectory {
  id: string;
  hazardZoneId: string;
  zoneName: string;
  originLat: number;
  originLng: number;
  originPlaceName: string;
  destinationLat: number;
  destinationLng: number;
  destinationShelterName: string;
  totalDistanceKm: number;
  estimatedDriveTimeMin: number;
  estimatedWalkTimeMin: number;
  hazardAvoidanceRadiusKm: number;
  waypoints: EvacuationWaypoint[];
  googleMapsDirectionsUrl: string;
}

export type ThematicLayerType = 'MONSOON' | 'SOIL_MOISTURE' | 'TECTONIC_MOVEMENTS' | 'ALL_COMBINED';

export interface ThematicRegionMonsoon {
  id: string;
  regionName: string;
  precipitationLevel: string;
  seasonalRainfallMm: number;
}

export interface ThematicRegionSoilMoisture {
  id: string;
  regionName: string;
  saturationLevel: string;
  soilMoistureSatPct: number;
}

export interface ThematicRegionTectonic {
  id: string;
  regionName: string;
  faultSystem: string;
  crustalDeformationMmYr: number;
}

export interface HistoricalLandslideEvent {
  id: string;
  date: string;
  timePeriod?: 'LAST_WEEK' | 'LAST_MONTH' | 'LAST_YEAR' | 'HISTORICAL_ARCHIVE';
  timePeriodCategory?: 'LAST_WEEK' | 'LAST_MONTH' | 'LAST_YEAR' | 'ARCHIVE';
  state: 'Assam' | 'Arunachal Pradesh' | 'Meghalaya' | 'Manipur' | 'Mizoram' | 'Nagaland' | 'Tripura' | 'Sikkim';
  district: string;
  location?: string;
  locationName: string;
  lat: number;
  lng: number;
  exactCauseCategory?: 'Heavy Precipitation' | 'Road-Cut Destabilization' | 'Toe River Erosion' | 'Seismic / Tectonic Fault' | 'Shale Liquefaction';
  exactCauseDetails?: string;
  primaryCause: string;
  triggerMechanism: string;
  fatalities: number;
  roadClosureDays?: number;
  rainfallPreceding72hMm?: number;
  rainfallAtTriggerMm: number;
  slopeDegrees: number;
  debrisVolumeM3: number;
  geologicalFormation: string;
  infrastructureDamaged: string;
  gsiReportRef: string;
  severityGrade: 'CRITICAL' | 'HIGH' | 'MODERATE';
}

