// context/SettingsContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '../types';

const STORAGE_KEY = '@iro-no-ito/settings/v1';

const DEFAULT_SETTINGS: AppSettings = {
  hasOnboarded: false,
  sessionCount: 0,
  notifications: {
    enabled: false,
    morningHour: 9,
    noonHour: 13,
    nightHour: 21,
  },
  labels: {},
};

interface SettingsContextType {
  settings: AppSettings;
  setLabel: (colorId: string, name: string) => void;
  setNotificationEnabled: (enabled: boolean) => void;
  setNotificationHour: (slot: 'morningHour' | 'noonHour' | 'nightHour', hour: number) => void;
  markOnboarded: () => void;
  incrementSession: () => void;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
        }
      } catch {} finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (next: AppSettings) => {
    setSettings(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const setLabel = useCallback((colorId: string, name: string) => {
    persist({ ...settings, labels: { ...settings.labels, [colorId]: name } });
  }, [settings, persist]);

  const setNotificationEnabled = useCallback((enabled: boolean) => {
    persist({ ...settings, notifications: { ...settings.notifications, enabled } });
  }, [settings, persist]);

  const setNotificationHour = useCallback((slot: 'morningHour' | 'noonHour' | 'nightHour', hour: number) => {
    persist({ ...settings, notifications: { ...settings.notifications, [slot]: hour } });
  }, [settings, persist]);

  const markOnboarded = useCallback(() => {
    persist({ ...settings, hasOnboarded: true });
  }, [settings, persist]);

  const incrementSession = useCallback(() => {
    persist({ ...settings, sessionCount: settings.sessionCount + 1 });
  }, [settings, persist]);

  const value = useMemo(() => ({
    settings,
    setLabel,
    setNotificationEnabled,
    setNotificationHour,
    markOnboarded,
    incrementSession,
    loading,
  }), [settings, setLabel, setNotificationEnabled, setNotificationHour, markOnboarded, incrementSession, loading]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextType => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be inside SettingsProvider');
  return ctx;
};
