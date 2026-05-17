// types/index.ts

export interface ColorEntry {
  id: string;
  date: string;      // YYYY-MM-DD
  colorId: string;
  timestamp: number; // unix ms
}

export interface ColorLabel {
  colorId: string;
  hex: string;
  defaultName: string;
  name: string;
}

export interface DailyThread {
  date: string;
  entries: ColorEntry[];
}

export interface NotificationSettings {
  enabled: boolean;
  morningHour: number;
  noonHour: number;
  nightHour: number;
}

export interface AppSettings {
  hasOnboarded: boolean;
  sessionCount: number;
  notifications: NotificationSettings;
  labels: Record<string, string>; // colorId -> custom name
}
