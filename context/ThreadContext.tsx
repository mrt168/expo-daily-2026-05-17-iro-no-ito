// context/ThreadContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorEntry } from '../types';
import { todayKey } from '../utils/dateUtils';
import { SEED_THREADS } from '../data/seedThreads';

const STORAGE_KEY = '@iro-no-ito/entries/v1';
const SEED_FLAG = '@iro-no-ito/seeded/v1';
const MAX_PER_DAY = 100;

interface ThreadContextType {
  entries: ColorEntry[];
  todaysEntries: ColorEntry[];
  addEntry: (colorId: string) => void;
  undoLast: () => void;
  resetAll: () => void;
  reseedAll: () => void;
  loading: boolean;
  totalCount: number;
}

const ThreadContext = createContext<ThreadContextType | null>(null);

const uid = () => `e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const ThreadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<ColorEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const seeded = await AsyncStorage.getItem(SEED_FLAG);
        if (stored) {
          setEntries(JSON.parse(stored));
        } else if (!seeded) {
          // 初回起動: シードデータを投入（Grill Council TOP3#1）
          setEntries(SEED_THREADS);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_THREADS));
          await AsyncStorage.setItem(SEED_FLAG, 'true');
        }
      } catch (e) {
        // ignore - 起動を止めない
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (next: ColorEntry[]) => {
    setEntries(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const addEntry = useCallback((colorId: string) => {
    const date = todayKey();
    const todays = entries.filter(e => e.date === date);
    if (todays.length >= MAX_PER_DAY) return;
    const next: ColorEntry[] = [
      ...entries,
      { id: uid(), date, colorId, timestamp: Date.now() },
    ];
    persist(next);
  }, [entries, persist]);

  const undoLast = useCallback(() => {
    const date = todayKey();
    const lastIdx = [...entries].reverse().findIndex(e => e.date === date);
    if (lastIdx === -1) return;
    const realIdx = entries.length - 1 - lastIdx;
    const next = [...entries.slice(0, realIdx), ...entries.slice(realIdx + 1)];
    persist(next);
  }, [entries, persist]);

  const resetAll = useCallback(() => {
    persist([]);
  }, [persist]);

  const reseedAll = useCallback(() => {
    persist(SEED_THREADS);
  }, [persist]);

  const todaysEntries = useMemo(() => {
    const date = todayKey();
    return entries.filter(e => e.date === date);
  }, [entries]);

  const value = useMemo<ThreadContextType>(() => ({
    entries,
    todaysEntries,
    addEntry,
    undoLast,
    resetAll,
    reseedAll,
    loading,
    totalCount: entries.length,
  }), [entries, todaysEntries, addEntry, undoLast, resetAll, reseedAll, loading]);

  return <ThreadContext.Provider value={value}>{children}</ThreadContext.Provider>;
};

export const useThread = (): ThreadContextType => {
  const ctx = useContext(ThreadContext);
  if (!ctx) throw new Error('useThread must be inside ThreadProvider');
  return ctx;
};
