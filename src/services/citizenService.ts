import { CitizenProfile, IncidentReport } from '../types';
import { INITIAL_CITIZEN_REPORTS } from '../data/nerData';

const CITIZEN_PROFILE_KEY = 'ner_landslide_citizen_profile_v1';
const INCIDENT_REPORTS_KEY = 'ner_landslide_incident_reports_v1';

export const DEFAULT_CITIZEN_PROFILE: CitizenProfile = {
  id: 'citizen-default',
  fullName: 'Tenzing Jamir',
  phoneNumber: '+91 94360 88912',
  state: 'Assam',
  district: 'Dima Hasao',
  villageOrTown: 'Haflong Basti',
  lat: 25.176,
  lng: 93.024,
  emergencyContactName: 'Dr. Anupam Sarma',
  emergencyContactPhone: '+91 98640 12345',
  notificationsEnabled: true,
  voiceAlertsEnabled: true,
  preferredLanguage: 'English',
};

class CitizenService {
  private profile: CitizenProfile = DEFAULT_CITIZEN_PROFILE;
  private reports: IncidentReport[] = INITIAL_CITIZEN_REPORTS;
  private profileListeners: Set<(profile: CitizenProfile) => void> = new Set();
  private reportsListeners: Set<(reports: IncidentReport[]) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem(CITIZEN_PROFILE_KEY);
      if (storedProfile) {
        try {
          this.profile = JSON.parse(storedProfile);
        } catch {
          this.profile = DEFAULT_CITIZEN_PROFILE;
        }
      }

      const storedReports = localStorage.getItem(INCIDENT_REPORTS_KEY);
      if (storedReports) {
        try {
          this.reports = JSON.parse(storedReports);
        } catch {
          this.reports = INITIAL_CITIZEN_REPORTS;
        }
      }
    }
  }

  public getProfile(): CitizenProfile {
    return { ...this.profile };
  }

  public updateProfile(updated: Partial<CitizenProfile>): CitizenProfile {
    this.profile = { ...this.profile, ...updated };
    if (typeof window !== 'undefined') {
      localStorage.setItem(CITIZEN_PROFILE_KEY, JSON.stringify(this.profile));
    }
    this.notifyProfileListeners();
    return this.profile;
  }

  public getReports(): IncidentReport[] {
    return [...this.reports];
  }

  public addReport(report: Omit<IncidentReport, 'id' | 'photoTimestamp' | 'verified' | 'upvotes'>): IncidentReport {
    const newReport: IncidentReport = {
      ...report,
      id: 'rep-' + Date.now(),
      photoTimestamp: 'Just now',
      verified: false,
      upvotes: 1,
    };
    this.reports = [newReport, ...this.reports];
    if (typeof window !== 'undefined') {
      localStorage.setItem(INCIDENT_REPORTS_KEY, JSON.stringify(this.reports));
    }
    this.notifyReportsListeners();
    return newReport;
  }

  public upvoteReport(id: string): void {
    this.reports = this.reports.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r));
    if (typeof window !== 'undefined') {
      localStorage.setItem(INCIDENT_REPORTS_KEY, JSON.stringify(this.reports));
    }
    this.notifyReportsListeners();
  }

  public subscribeProfile(listener: (profile: CitizenProfile) => void): () => void {
    this.profileListeners.add(listener);
    listener(this.profile);
    return () => {
      this.profileListeners.delete(listener);
    };
  }

  public subscribeReports(listener: (reports: IncidentReport[]) => void): () => void {
    this.reportsListeners.add(listener);
    listener(this.reports);
    return () => {
      this.reportsListeners.delete(listener);
    };
  }

  private notifyProfileListeners() {
    this.profileListeners.forEach((fn) => fn(this.profile));
  }

  private notifyReportsListeners() {
    this.reportsListeners.forEach((fn) => fn(this.reports));
  }
}

export const citizenService = new CitizenService();
