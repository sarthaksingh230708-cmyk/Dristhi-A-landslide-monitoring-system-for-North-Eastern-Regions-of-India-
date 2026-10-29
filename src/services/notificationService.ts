import { AppNotification } from '../types';

const STORAGE_KEY_NOTIFICATIONS = 'ner_landslide_notifications_v1';
const STORAGE_KEY_NOTIF_ENABLED = 'ner_landslide_notif_enabled_v1';

class NotificationService {
  private enabled: boolean = true;
  private listeners: Set<(notifications: AppNotification[]) => void> = new Set();
  private notifications: AppNotification[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const storedEnabled = localStorage.getItem(STORAGE_KEY_NOTIF_ENABLED);
      if (storedEnabled !== null) {
        this.enabled = storedEnabled === 'true';
      }

      const storedItems = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      if (storedItems) {
        try {
          this.notifications = JSON.parse(storedItems);
        } catch {
          this.seedInitialNotifications();
        }
      } else {
        this.seedInitialNotifications();
      }
    }
  }

  private seedInitialNotifications() {
    this.notifications = [
      {
        id: 'notif-1',
        title: 'CRITICAL HAZARD: Dima Hasao Sector (98% Probability)',
        message: 'Extreme continuous rainfall detected by NASA GPM and IMD. Soil saturation at 96.8%. Red alert active for Haflong and Jatinga.',
        severity: 'CRITICAL',
        timestamp: '10 minutes ago',
        zoneId: 'hz-dima-hasao',
        read: false,
        isOfflineCached: true,
      },
      {
        id: 'notif-2',
        title: 'HIGH ALERT: NH-10 Teesta Corridor Blocked (96% Probability)',
        message: 'BRO Project Swastik confirms massive debris washaway at 29th Mile. Road impassable; use alternate Lava-Reshi route.',
        severity: 'CRITICAL',
        timestamp: '25 minutes ago',
        zoneId: 'hz-teesta-sikkim',
        read: false,
        isOfflineCached: true,
      },
      {
        id: 'notif-3',
        title: 'HIGH ALERT: Kohima - Phesama Ridge Warning (91% Probability)',
        message: 'Perched water table movement. NH-29 sinking sector restricted to single-lane emergency convoy.',
        severity: 'WARNING',
        timestamp: '1 hour ago',
        zoneId: 'hz-kohima-nagaland',
        read: true,
        isOfflineCached: true,
      },
      {
        id: 'notif-4',
        title: 'OFFLINE CACHED BULLETIN: Regional Monsoonal Advisory',
        message: 'All 8 NER state disaster control rooms on 24x7 standby. Keep emergency battery torches, offline maps, and basic rations ready.',
        severity: 'INFO',
        timestamp: '3 hours ago',
        read: true,
        isOfflineCached: true,
      },
    ];
    this.saveToStorage();
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_NOTIF_ENABLED, String(enabled));
    }
    this.notifyListeners();

    if (enabled && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }

  public getNotifications(): AppNotification[] {
    return [...this.notifications];
  }

  public getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  public markAsRead(id: string): void {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.saveToStorage();
    this.notifyListeners();
  }

  public markAllAsRead(): void {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    this.saveToStorage();
    this.notifyListeners();
  }

  public clearAll(): void {
    this.notifications = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  public addNotification(notification: Omit<AppNotification, 'id' | 'timestamp' | 'read' | 'isOfflineCached'>): void {
    if (!this.enabled) return;

    const newNotif: AppNotification = {
      ...notification,
      id: 'notif-' + Date.now(),
      timestamp: 'Just now',
      read: false,
      isOfflineCached: true,
    };

    this.notifications = [newNotif, ...this.notifications];
    this.saveToStorage();
    this.notifyListeners();

    // Trigger system notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
        });
      } catch (err) {
        console.warn('Browser notification error:', err);
      }
    }
  }

  public notify(item: {
    title: string;
    message: string;
    priority?: 'CRITICAL' | 'HIGH' | 'INFO';
    severity?: 'CRITICAL' | 'WARNING' | 'INFO';
    zoneId?: string;
    actionRequired?: string;
  }): void {
    const sev = item.severity || (item.priority === 'HIGH' ? 'WARNING' : item.priority === 'CRITICAL' ? 'CRITICAL' : 'INFO');
    this.addNotification({
      title: item.title,
      message: item.message,
      severity: sev,
      zoneId: item.zoneId,
      actionRequired: item.actionRequired,
    });
  }

  public subscribe(listener: (notifications: AppNotification[]) => void): () => void {
    this.listeners.add(listener);
    listener(this.getNotifications());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const data = this.getNotifications();
    this.listeners.forEach((fn) => fn(data));
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(this.notifications.slice(0, 50)));
    }
  }
}

export const notificationService = new NotificationService();
