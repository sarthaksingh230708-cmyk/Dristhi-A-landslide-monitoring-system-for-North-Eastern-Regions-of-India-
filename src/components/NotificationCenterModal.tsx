import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellOff,
  CheckCheck,
  Trash2,
  X,
  WifiOff,
  AlertTriangle,
  Info,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { AppNotification } from '../types';
import { notificationService } from '../services/notificationService';

interface NotificationCenterModalProps {
  onClose: () => void;
  isOffline: boolean;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  onClose,
  isOffline,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isEnabled, setIsEnabled] = useState(notificationService.isEnabled());

  useEffect(() => {
    const unsub = notificationService.subscribe((list) => {
      setNotifications(list);
    });
    return () => unsub();
  }, []);

  const handleToggle = () => {
    const next = !isEnabled;
    setIsEnabled(next);
    notificationService.setEnabled(next);
  };

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
  };

  const handleClearAll = () => {
    notificationService.clearAll();
  };

  const handleTriggerTest = () => {
    notificationService.notify({
      title: 'TEST HAZARD WARNING (SYSTEM SIMULATION)',
      message: 'Soil moisture telemetry across Dima Hasao reached 91% saturation. Slopes unstable.',
      priority: 'HIGH',
      zoneId: 'ner-zone-1',
      actionRequired: 'Avoid non-essential hill transit along NH-27.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-auto text-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-xl font-black text-slate-950 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              Landslide Notification Center
            </h3>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Real-time multi-hazard bulletins and localized disaster advisories for the North Eastern Region.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master ON / OFF Control Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isEnabled ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-rose-100 text-rose-700 border border-rose-300'
              }`}
            >
              {isEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-bold text-sm text-slate-950 flex items-center gap-2">
                <span>Notification System Status:</span>
                <span className={isEnabled ? 'text-emerald-700 font-black' : 'text-rose-700 font-black'}>
                  {isEnabled ? 'ACTIVE (ON)' : 'DISABLED (OFF)'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                {isEnabled
                  ? 'Receiving early warnings, satellite triggers, and rain alerts'
                  : 'All notifications muted. Turn on to stay protected.'}
              </p>
            </div>
          </div>

          <button
            id="btn-toggle-notification-modal"
            onClick={handleToggle}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer ${
              isEnabled
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isEnabled ? 'Turn OFF' : 'Turn ON'}
          </button>
        </div>

        {/* Offline Cache Notice */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <WifiOff className="w-4 h-4 text-amber-600" />
            <span>
              <strong className="text-slate-900">Offline Resilience:</strong> Alerts are cached in persistent local storage so you can review hazard alerts even when disconnected.
            </span>
          </div>
          {isOffline && (
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full font-mono">
              OFFLINE MODE
            </span>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between text-xs pt-1">
          <button
            onClick={handleTriggerTest}
            className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Simulate Test Hazard Alert</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkAllRead}
              className="text-slate-600 hover:text-slate-950 font-medium flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={handleClearAll}
              className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear list</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl border border-slate-200 font-medium">
              No recent notifications logged.
            </div>
          ) : (
            notifications.map((n) => {
              let borderClass = 'border-slate-200 bg-white';
              let badgeClass = 'bg-slate-100 text-slate-700 border-slate-300';
              if (n.severity === 'CRITICAL') {
                borderClass = 'border-rose-300 bg-rose-50/50';
                badgeClass = 'bg-rose-600 text-white font-black';
              } else if (n.severity === 'WARNING') {
                borderClass = 'border-amber-300 bg-amber-50/50';
                badgeClass = 'bg-amber-500 text-white font-black';
              }

              return (
                <div
                  key={n.id}
                  onClick={() => notificationService.markAsRead(n.id)}
                  className={`p-4 rounded-2xl border ${borderClass} hover:shadow-xs transition-all space-y-1.5 cursor-pointer`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${badgeClass}`}>
                        {n.severity}
                      </span>
                      <h4 className="font-bold text-slate-950 text-xs">{n.title}</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono font-medium">{n.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{n.message}</p>

                  {n.actionRequired && (
                    <div className="text-[11px] text-rose-800 font-bold bg-rose-100/70 p-2 rounded-xl border border-rose-200">
                      Action Required: {n.actionRequired}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
