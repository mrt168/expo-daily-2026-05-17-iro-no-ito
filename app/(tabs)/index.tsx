import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThreadStrip } from '../../components/iro/ThreadStrip';
import { ColorPalette } from '../../components/iro/ColorPalette';
import { useThread } from '../../context/ThreadContext';
import { useSettings } from '../../context/SettingsContext';
import { formatJpDate } from '../../utils/dateUtils';
import { THEME } from '../../constants/Palette';

export default function HomeScreen() {
  const router = useRouter();
  const { todaysEntries, addEntry, undoLast, loading } = useThread();
  const { settings, markOnboarded, incrementSession } = useSettings();
  const today = useMemo(() => formatJpDate(new Date()), []);

  useEffect(() => {
    if (!loading && !settings.hasOnboarded) {
      router.push('/onboarding');
      markOnboarded();
    }
  }, [loading, settings.hasOnboarded]);

  useEffect(() => {
    incrementSession();
  }, []);

  const onAdd = (colorId: string) => {
    try {
      addEntry(colorId);
    } catch (e: any) {
      Alert.alert('追加できませんでした', e?.message || '不明なエラー');
    }
  };

  const onUndo = () => {
    if (todaysEntries.length === 0) return;
    undoLast();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.date}>{today}</Text>
          <Text style={styles.title}>色の糸</Text>
          <Text style={styles.subtitle}>今日の気分を色で織る</Text>
        </View>

        <View style={styles.threadWrap}>
          <ThreadStrip entries={todaysEntries} />
          <Text style={styles.counter} testID="thread-count">{todaysEntries.length} 本の糸</Text>
        </View>

        <ColorPalette onSelect={onAdd} />

        <View style={styles.actions}>
          <Pressable
            onPress={onUndo}
            disabled={todaysEntries.length === 0}
            style={[styles.undoBtn, todaysEntries.length === 0 && styles.disabled]}
            testID="undo-button"
            accessibilityLabel="ひとつ戻す"
          >
            <Text style={styles.undoText}>ひとつ戻す</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: THEME.background },
  scroll: { paddingBottom: 32 },
  header: { alignItems: 'center', paddingTop: 20, paddingHorizontal: 16 },
  date: { fontSize: 12, color: THEME.textSub, letterSpacing: 1 },
  title: { fontSize: 28, color: THEME.accent, marginTop: 6, fontWeight: '300', letterSpacing: 4 },
  subtitle: { fontSize: 12, color: THEME.textSub, marginTop: 4 },
  threadWrap: { paddingHorizontal: 16, paddingVertical: 18, alignItems: 'center' },
  counter: { fontSize: 11, color: THEME.textSub, marginTop: 8 },
  actions: { alignItems: 'center', marginTop: 8 },
  undoBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.border,
    backgroundColor: THEME.card,
  },
  disabled: { opacity: 0.35 },
  undoText: { color: THEME.text, fontSize: 13 },
});
