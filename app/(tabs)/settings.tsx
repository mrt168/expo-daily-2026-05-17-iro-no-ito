import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../../context/SettingsContext';
import { useThread } from '../../context/ThreadContext';
import { THEME } from '../../constants/Palette';

export default function SettingsScreen() {
  const { settings, setNotificationEnabled, setNotificationHour } = useSettings();
  const { resetAll, reseedAll, totalCount } = useThread();

  const confirmReset = () => {
    Alert.alert('すべての糸を削除', '本当に削除しますか？元には戻せません。', [
      { text: 'キャンセル', style: 'cancel' },
      { text: '削除', style: 'destructive', onPress: () => resetAll() },
    ]);
  };

  const confirmReseed = () => {
    Alert.alert('サンプルを再生成', 'デモ用の糸を投入します（既存データは置き換え）', [
      { text: 'キャンセル', style: 'cancel' },
      { text: '実行', onPress: () => reseedAll() },
    ]);
  };

  const cycleHour = (
    slot: 'morningHour' | 'noonHour' | 'nightHour',
    base: number
  ) => {
    const cur = settings.notifications[slot];
    const next = cur >= base + 2 ? base - 2 : cur + 1;
    setNotificationHour(slot, ((next % 24) + 24) % 24);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>設定</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>通知</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>毎日リマインダー</Text>
            <Switch
              value={settings.notifications.enabled}
              onValueChange={setNotificationEnabled}
              testID="notif-toggle"
            />
          </View>
          {settings.notifications.enabled && (
            <>
              <Pressable onPress={() => cycleHour('morningHour', 9)} style={styles.row}>
                <Text style={styles.rowLabel}>朝</Text>
                <Text style={styles.rowValue}>{settings.notifications.morningHour}時</Text>
              </Pressable>
              <Pressable onPress={() => cycleHour('noonHour', 13)} style={styles.row}>
                <Text style={styles.rowLabel}>昼</Text>
                <Text style={styles.rowValue}>{settings.notifications.noonHour}時</Text>
              </Pressable>
              <Pressable onPress={() => cycleHour('nightHour', 21)} style={styles.row}>
                <Text style={styles.rowLabel}>夜</Text>
                <Text style={styles.rowValue}>{settings.notifications.nightHour}時</Text>
              </Pressable>
              <Text style={styles.hint}>※ Expo Go では通知が制限される場合があります</Text>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>データ</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>糸の合計</Text>
            <Text style={styles.rowValue}>{totalCount} 本</Text>
          </View>
          <Pressable onPress={confirmReseed} style={styles.actionBtn}>
            <Text style={styles.actionText}>サンプルを再生成</Text>
          </Pressable>
          <Pressable onPress={confirmReset} style={[styles.actionBtn, styles.danger]}>
            <Text style={[styles.actionText, { color: '#C24747' }]}>
              すべての糸を削除
            </Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>このアプリについて</Text>
          <Text style={styles.aboutText}>色の糸 — 1日1色で気分を織る、ミニマル日記</Text>
          <Text style={[styles.aboutText, { marginTop: 6, color: THEME.textSub }]}>
            v0.1 · #色の糸 #IroNoIto
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: THEME.background },
  scroll: { padding: 16, paddingBottom: 40 },
  title: {
    fontSize: 22,
    color: THEME.accent,
    fontWeight: '300',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 16,
  },
  section: {
    backgroundColor: THEME.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  sectionTitle: { fontSize: 12, color: THEME.textSub, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rowLabel: { fontSize: 13, color: THEME.text },
  rowValue: { fontSize: 13, color: THEME.accent },
  hint: { fontSize: 10, color: THEME.textSub, marginTop: 6 },
  actionBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: THEME.background,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  danger: { borderColor: '#E5B4B4' },
  actionText: { fontSize: 13, color: THEME.text },
  aboutText: { fontSize: 12, color: THEME.text },
});
