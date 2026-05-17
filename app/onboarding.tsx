import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PALETTE, THEME } from '../constants/Palette';

export default function Onboarding() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>色の糸へようこそ</Text>
        <Text style={styles.lead}>
          1日1色、{'\n'}気分を「糸」として織りためる{'\n'}ミニマル日記。
        </Text>

        <View style={styles.demo}>
          {PALETTE.slice(0, 8).map(p => (
            <View
              key={p.colorId}
              style={[styles.thread, { backgroundColor: p.hex }]}
            />
          ))}
        </View>

        <Text style={styles.step}>1. パレットから色をタップ</Text>
        <Text style={styles.step}>2. その色の糸が今日の織物に追加</Text>
        <Text style={styles.step}>3. 月末に「織物カレンダー」をシェア</Text>

        <Text style={styles.note}>
          書く言葉はゼロ。{'\n'}三日坊主にならない、続く日記です。
        </Text>

        <Pressable
          onPress={() => router.back()}
          style={styles.cta}
          testID="onboarding-start"
          accessibilityLabel="はじめる"
        >
          <Text style={styles.ctaText}>はじめる</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: THEME.background },
  scroll: { padding: 24, alignItems: 'center', paddingBottom: 40 },
  title: {
    fontSize: 26,
    color: THEME.accent,
    fontWeight: '300',
    letterSpacing: 4,
    marginTop: 24,
    textAlign: 'center',
  },
  lead: {
    fontSize: 13,
    color: THEME.text,
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 22,
  },
  demo: {
    flexDirection: 'row',
    height: 120,
    width: 200,
    marginVertical: 24,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  thread: { flex: 1, marginHorizontal: 0.5 },
  step: {
    fontSize: 12,
    color: THEME.text,
    marginVertical: 4,
    alignSelf: 'flex-start',
  },
  note: {
    fontSize: 11,
    color: THEME.textSub,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
  cta: {
    marginTop: 28,
    paddingHorizontal: 36,
    paddingVertical: 14,
    backgroundColor: THEME.accent,
    borderRadius: 28,
  },
  ctaText: { color: '#FFF', fontSize: 14, fontWeight: '500', letterSpacing: 2 },
});
