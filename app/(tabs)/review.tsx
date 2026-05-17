import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThread } from '../../context/ThreadContext';
import { useSettings } from '../../context/SettingsContext';
import { last7Days } from '../../utils/dateUtils';
import { PALETTE, THEME, hexById } from '../../constants/Palette';

export default function ReviewScreen() {
  const { entries } = useThread();
  const { settings } = useSettings();

  const days = useMemo(() => last7Days(), []);
  const weekEntries = useMemo(
    () => entries.filter(e => days.includes(e.date)),
    [entries, days]
  );

  const counts: Record<string, number> = {};
  for (const e of weekEntries) counts[e.colorId] = (counts[e.colorId] || 0) + 1;
  const ranking = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const labelOf = (id: string) =>
    settings.labels[id] ||
    PALETTE.find(p => p.colorId === id)?.defaultName ||
    id;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>今週の織物</Text>
        <Text style={styles.subtitle}>過去7日間の色のまとめ</Text>

        <View style={styles.card}>
          <Text style={styles.label}>合計の糸</Text>
          <Text style={styles.bigNum}>{weekEntries.length}</Text>
          <Text style={styles.label}>本</Text>
        </View>

        <Text style={styles.section}>よく選ばれた色 TOP3</Text>
        {ranking.length === 0 && (
          <Text style={styles.empty}>まだ記録がありません</Text>
        )}
        {ranking.map(([colorId, n], i) => (
          <View key={colorId} style={styles.row}>
            <Text style={styles.rank}>{i + 1}</Text>
            <View style={[styles.swatch, { backgroundColor: hexById(colorId) }]} />
            <Text style={styles.colorName}>{labelOf(colorId)}</Text>
            <Text style={styles.count}>{n} 本</Text>
          </View>
        ))}

        <Text style={styles.section}>日別</Text>
        {days.map(d => {
          const day = weekEntries.filter(e => e.date === d);
          return (
            <View key={d} style={styles.dayRow}>
              <Text style={styles.dayLabel}>{d.slice(5)}</Text>
              <View style={styles.dayStrip}>
                {day.slice(0, 30).map((e, idx) => (
                  <View
                    key={e.id || idx}
                    style={{
                      flex: 1,
                      height: 20,
                      backgroundColor: hexById(e.colorId),
                      marginHorizontal: 0.5,
                    }}
                  />
                ))}
                {day.length === 0 && <Text style={styles.dayEmpty}>—</Text>}
              </View>
              <Text style={styles.dayCount}>{day.length}</Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: THEME.background },
  scroll: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 22, color: THEME.accent, fontWeight: '300', letterSpacing: 3, textAlign: 'center' },
  subtitle: { fontSize: 11, color: THEME.textSub, textAlign: 'center', marginTop: 4 },
  card: {
    backgroundColor: THEME.card,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginVertical: 16,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  label: { fontSize: 11, color: THEME.textSub },
  bigNum: { fontSize: 40, color: THEME.accent, fontWeight: '300', marginVertical: 4 },
  section: { fontSize: 13, color: THEME.text, marginTop: 16, marginBottom: 8 },
  empty: { fontSize: 12, color: THEME.textSub, textAlign: 'center', paddingVertical: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.card,
    padding: 12,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  rank: { width: 24, fontSize: 14, color: THEME.accent, fontWeight: '500' },
  swatch: { width: 24, height: 24, borderRadius: 12, marginHorizontal: 8 },
  colorName: { flex: 1, fontSize: 13, color: THEME.text },
  count: { fontSize: 12, color: THEME.textSub },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  dayLabel: { width: 48, fontSize: 11, color: THEME.textSub },
  dayStrip: {
    flex: 1,
    flexDirection: 'row',
    height: 24,
    backgroundColor: THEME.card,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.border,
    alignItems: 'center',
  },
  dayEmpty: { width: '100%', textAlign: 'center', color: THEME.textSub, fontSize: 11 },
  dayCount: { width: 32, textAlign: 'right', fontSize: 11, color: THEME.textSub },
});
