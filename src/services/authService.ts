import { UserRole, UserSession, CivilianVisibilityConfig, PredictionOutcomeReport } from '../types';

const AUTH_SESSION_KEY = 'ner_drishti_auth_session_v1';
const VISIBILITY_CONFIG_KEY = 'ner_drishti_civilian_visibility_v1';
const PREDICTION_OUTCOMES_KEY = 'ner_drishti_prediction_outcomes_v1';

export const DEVELOPER_PASSKEY = 'SPAIN07AM';

export const DEFAULT_VISIBILITY_CONFIG: CivilianVisibilityConfig = {
  showClassifiedBROCorridors: false,
  showRawInSARInterferograms: false,
  showTectonicFaultDisplacements: false,
  showSensitiveInfrastructures: true,
  showUnverifiedFieldReports: true,
};

class AuthService {
  private session: UserSession | null = null;
  private visibilityConfig: CivilianVisibilityConfig = DEFAULT_VISIBILITY_CONFIG;
  private outcomes: PredictionOutcomeReport[] = [];
  private sessionListeners: Set<(session: UserSession | null) => void> = new Set();
  private visibilityListeners: Set<(config: CivilianVisibilityConfig) => void> = new Set();
  private outcomeListeners: Set<(outcomes: PredictionOutcomeReport[]) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const storedSession = localStorage.getItem(AUTH_SESSION_KEY);
      if (storedSession) {
        try {
          this.session = JSON.parse(storedSession);
        } catch {
          this.session = null;
        }
      }

      const storedVisibility = localStorage.getItem(VISIBILITY_CONFIG_KEY);
      if (storedVisibility) {
        try {
          this.visibilityConfig = { ...DEFAULT_VISIBILITY_CONFIG, ...JSON.parse(storedVisibility) };
        } catch {
          this.visibilityConfig = DEFAULT_VISIBILITY_CONFIG;
        }
      }

      const storedOutcomes = localStorage.getItem(PREDICTION_OUTCOMES_KEY);
      if (storedOutcomes) {
        try {
          this.outcomes = JSON.parse(storedOutcomes);
        } catch {
          this.outcomes = [];
        }
      } else {
        // Seed initial calibrated outcomes
        this.outcomes = [
          {
            id: 'out-seed-1',
            zoneId: 'hz-sohra-meghalaya',
            zoneName: 'Sohra (Cherrapunji) - Mawsynram',
            predictedRange: [87, 96],
            predictedWindow: 'Next 5 - 7 hours (Tuesday, 7th September)',
            reportedOutcome: 'LANDSLIDE_CONFIRMED',
            observedRainfallMm: 184.2,
            reporterRole: 'OFFICIAL',
            reporterName: 'Executive Engineer PWD Hills',
            notes: 'Debris slump along Sohra-Shella cut at km 14; road cleared in 3 hours.',
            timestamp: '7th Sept, 16:45 IST',
          },
          {
            id: 'out-seed-2',
            zoneId: 'hz-kohima-nagaland',
            zoneName: 'Kohima - Phesama Ridge',
            predictedRange: [88, 94],
            predictedWindow: 'Next 4 - 6 hours',
            reportedOutcome: 'NEAR_MISS_MINOR',
            observedRainfallMm: 132.0,
            reporterRole: 'OFFICIAL',
            reporterName: 'NSDMA Field Observer',
            notes: 'Minor surface tension cracks detected. Pre-emptive single-lane traffic prevented accidents.',
            timestamp: 'Yesterday, 11:20 IST',
          },
          {
            id: 'out-seed-3',
            zoneId: 'hz-guwahati-hills',
            zoneName: 'Guwahati Urban Hills',
            predictedRange: [52, 64],
            predictedWindow: 'Next 8 hours',
            reportedOutcome: 'FALSE_ALARM_STABLE',
            observedRainfallMm: 28.5,
            reporterRole: 'CIVILIAN',
            reporterName: 'Guwahati Resident',
            notes: 'No earth movement. Heavy clouds dissipated without ground failure.',
            timestamp: '3 days ago',
          },
        ];
      }
    }
  }

  public getSession(): UserSession | null {
    return this.session ? { ...this.session } : null;
  }

  public getVisibilityConfig(): CivilianVisibilityConfig {
    return { ...this.visibilityConfig };
  }

  public getOutcomes(): PredictionOutcomeReport[] {
    return [...this.outcomes];
  }

  public loginDeveloper(passkey: string): { success: boolean; message: string } {
    if (passkey.trim() === DEVELOPER_PASSKEY) {
      const session: UserSession = {
        role: 'DEVELOPER',
        displayName: 'Lead System Developer',
        organization: 'DRISHTI Core Architecture & GIS Lab',
        officialId: 'DEV-SPAIN-07AM',
        isDeveloperAuthenticated: true,
        loginTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      this.setSession(session);
      return { success: true, message: 'Developer passkey verified. Direct superadmin access granted.' };
    }
    return { success: false, message: 'Invalid developer passkey. Please check credentials.' };
  }

  public loginOfficial(params: {
    displayName: string;
    organization: string;
    officialId: string;
    state: string;
    role: 'ADMINISTRATOR' | 'OFFICIAL';
  }): void {
    const session: UserSession = {
      role: params.role,
      displayName: params.displayName,
      organization: params.organization,
      officialId: params.officialId,
      state: params.state,
      isDeveloperAuthenticated: false,
      loginTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    this.setSession(session);
  }

  public loginCivilian(params: {
    fullName: string;
    phoneNumber: string;
    state: string;
    district: string;
    villageOrTown: string;
  }): void {
    const session: UserSession = {
      role: 'CIVILIAN',
      displayName: params.fullName || 'North East Citizen',
      state: params.state,
      district: params.district,
      isDeveloperAuthenticated: false,
      loginTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    this.setSession(session);
  }

  public logout(): void {
    this.session = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_SESSION_KEY);
    }
    this.notifySessionListeners();
  }

  public updateVisibilityConfig(config: Partial<CivilianVisibilityConfig>): void {
    this.visibilityConfig = { ...this.visibilityConfig, ...config };
    if (typeof window !== 'undefined') {
      localStorage.setItem(VISIBILITY_CONFIG_KEY, JSON.stringify(this.visibilityConfig));
    }
    this.notifyVisibilityListeners();
  }

  public addPredictionOutcome(outcome: Omit<PredictionOutcomeReport, 'id' | 'timestamp'>): PredictionOutcomeReport {
    const newOutcome: PredictionOutcomeReport = {
      ...outcome,
      id: 'out-' + Date.now(),
      timestamp: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    this.outcomes = [newOutcome, ...this.outcomes];
    if (typeof window !== 'undefined') {
      localStorage.setItem(PREDICTION_OUTCOMES_KEY, JSON.stringify(this.outcomes));
    }
    this.notifyOutcomeListeners();
    return newOutcome;
  }

  public saveOutcomeReport(report: PredictionOutcomeReport): PredictionOutcomeReport {
    this.outcomes = [report, ...this.outcomes];
    if (typeof window !== 'undefined') {
      localStorage.setItem(PREDICTION_OUTCOMES_KEY, JSON.stringify(this.outcomes));
    }
    this.notifyOutcomeListeners();
    return report;
  }

  public subscribeSession(listener: (session: UserSession | null) => void): () => void {
    this.sessionListeners.add(listener);
    listener(this.session);
    return () => {
      this.sessionListeners.delete(listener);
    };
  }

  public subscribeVisibility(listener: (config: CivilianVisibilityConfig) => void): () => void {
    this.visibilityListeners.add(listener);
    listener(this.visibilityConfig);
    return () => {
      this.visibilityListeners.delete(listener);
    };
  }

  public subscribeOutcomes(listener: (outcomes: PredictionOutcomeReport[]) => void): () => void {
    this.outcomeListeners.add(listener);
    listener(this.outcomes);
    return () => {
      this.outcomeListeners.delete(listener);
    };
  }

  private setSession(session: UserSession) {
    this.session = session;
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    }
    this.notifySessionListeners();
  }

  private notifySessionListeners() {
    this.sessionListeners.forEach((fn) => fn(this.session));
  }

  private notifyVisibilityListeners() {
    this.visibilityListeners.forEach((fn) => fn(this.visibilityConfig));
  }

  private notifyOutcomeListeners() {
    this.outcomeListeners.forEach((fn) => fn(this.outcomes));
  }
}

export const authService = new AuthService();
