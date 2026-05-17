import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WeavingTile } from '../../components/iro/WeavingTile';
import { useThread } from '../../context/ThreadContext';
import {
  daysInMonth,
  firstDayOfWeek,
  formatJpMonth,
  dateKeyForMonthDay,
} from '../../utils/dateUtils';
import { THEME } from '../../constants/Palette';
import { shareViewAsPng, SHARE_HASHTAGS } from '../../utils/shareUtils';

const WEEK = ['日', '月', '火', '水', '木', '金', '土'];

export default function CalendarScreen() {
  const { entries } = useThread();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const captureRef = useRef<View>(null);

  const total = daysInMonth(year, month);
  const offset = firstDayOfWeek(year, month);

  const byDate = useMemo(() => {
    const map: Record<string, typeof entries> = {};
    for (const e of entries) {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    }
    return map;
  }, [entries]);

  const cells: ({ day: number; key: string } | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= total; d++) {
    cells.push({ day: d, key: dateKeyForMonthDay(year, month, d) });
  }

  const prevMonth = () => {
    const m = month - 1;
    if (m < 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else setMonth(m);
  };
  const nextMonth = () => {
    const m = month + 1;
    if (m > 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else setMonth(m);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headRow}>
          <Pressable onPress={prevMonth} style={styles.navBtn} accessibilityLabel="前の月">
            <Text style={styles.navText}>◀</Text>
          </Pressable>
          <Text style={styles.monthTitle}>{formatJpMonth(year, month)}</Text>
          <Pressable onPress={nextMonth} style={styles.navBtn} accessibilityLabel="次の月">
            <Text style={styles.navText}>▶</Text>
          </Pressable>
        </View>

        <View ref={captureRef} collapsable={false} style={styles.captureArea}>
          <View style={styles.weekRow}>
            {WEEK.map(d => (
              <Text key={d} style={styles.weekLabel}>{d}</Text>
            ))}
          </View>
          <View style={styles.grid}>
            {cells.map((c, i) => (
              <View key={i} style={styles.cell}>
                {c ? (
                  <>
                    <Text style={styles.dayNum}>{c.day}</Text>
                    <WeavingTile entries={byDate[c.key] || []} size={36} />
                  </>
                ) : (
                  <View style={{ width: 36, height: 36 }} />
                )}
              </View>
            ))}
          </View>
          <Text style={styles.brand}>色の糸 · iro-no-ito</Text>
        </View>

        <Pressable
          onPress={() => shareViewAsPng(captureRef, `iro-no-ito-${year}-${month + 1}.png`)}
          style={styles.shareBtn}
          testID="share-calendar"
          accessibilityLabel="月のカレンダーを画像で共有"
        >
          <Text style={styles.shareText}>📸 月の織物をシェア</Text>
        </Pressable>
        <Text style={styles.hashtag}>{SHARE_HASHTAGS}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: THEME.background },
  scroll: { paddingBottom: 32 },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  monthTitle: { fontSize: 18, color: THEME.accent, fontWeight: '300', letterSpacing: 2 },
  navBtn: { padding: 8 },
  navText: { fontSize: 14, color: THEME.textSub },
  captureArea: {
    marginHorizontal: 12,
    backgroundColor: THEME.card,
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  weekRow: { flexDirection: 'row', paddingHorizontal: 4 },
  weekLabel: { width: `${100 / 7}%`, textAlign: 'center', fontSize: 11, color: THEME.textSub },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 4, paddingTop: 6 },
  cell: { width: `${100 / 7}%`, alignItems: 'center', paddingVertical: 4 },
  dayNum: { fontSize: 10, color: THEME.textSub, marginBottom: 2 },
  brand: { textAlign: 'center', fontSize: 10, color: THEME.textSub, marginTop: 10 },
  shareBtn: {
    alignSelf: 'center',
    marginTop: 16,
    paddingHorizontal: 22,
    paddingVertical: 12,
    backgroundColor: THEME.accent,
    borderRadius: 24,
  },
  shareText: { color: '#FFF', fontSize: 14, fontWeight: '500' },
  hashtag: { textAlign: 'center', fontSize: 11, color: THEME.textSub, marginTop: 8 },
});
