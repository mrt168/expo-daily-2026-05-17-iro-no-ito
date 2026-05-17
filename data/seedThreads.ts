// data/seedThreads.ts - シードデータ（FR-08: Day-0直帰率対策）
// 過去3日分のサンプル織物
import { ColorEntry } from '../types';
import { todayKey } from '../utils/dateUtils';

const dayOffset = (offset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return todayKey(d);
};

let idCounter = 0;
const nextId = () => `seed-${++idCounter}`;

const buildEntries = (date: string, colorIds: string[]): ColorEntry[] => {
  return colorIds.map((colorId, idx) => ({
    id: nextId(),
    date,
    colorId,
    timestamp: Date.now() - (colorIds.length - idx) * 3600000,
  }));
};

export const SEED_THREADS: ColorEntry[] = [
  ...buildEntries(dayOffset(-3), [
    'asagi', 'sakura', 'sakura', 'moegi', 'asagi', 'fuji', 'gunjo', 'yamabuki',
    'shu', 'moegi', 'asagi', 'sakura', 'fuji', 'shiro',
  ]),
  ...buildEntries(dayOffset(-2), [
    'shu', 'yamabuki', 'yamabuki', 'moegi', 'shu', 'asagi', 'fuji', 'sakura',
    'moegi', 'gunjo', 'asagi', 'sakura',
  ]),
  ...buildEntries(dayOffset(-1), [
    'sakura', 'fuji', 'kikyo', 'gunjo', 'asagi', 'asagi', 'moegi', 'sakura',
    'yamabuki', 'shu', 'sakura', 'fuji', 'kikyo', 'gunjo', 'asagi',
  ]),
];
