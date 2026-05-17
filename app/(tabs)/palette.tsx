import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PALETTE, THEME } from '../../constants/Palette';
import { useSettings } from '../../context/SettingsContext';

export default function PaletteScreen() {
  const { settings, setLabel } = useSettings();
  const [editing, setEditing] = useState<Record<string, string>>({});

  const valueFor = (id: string, def: string) =>
    editing[id] !== undefined ? editing[id] : settings.labels[id] ?? def;

  const save = (id: string, def: string) => {
    const v = editing[id];
    if (v === undefined) return;
    setLabel(id, v.trim() || def);
    setEditing(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>パレット</Text>
        <Text style={styles.subtitle}>色に自分だけの名前をつける</Text>

        {PALETTE.map(c => (
          <View key={c.colorId} style={styles.row}>
            <View style={[styles.swatch, { backgroundColor: c.hex }]} />
            <View style={styles.midCol}>
              <Text style={styles.defaultName}>{c.defaultName}</Text>
              <TextInput
                style={styles.input}
                value={valueFor(c.colorId, c.defaultName)}
                onChangeText={t => setEditing(prev => ({ ...prev, [c.colorId]: t }))}
                placeholder={c.defaultName}
                placeholderTextColor={THEME.textSub}
                onBlur={() => save(c.colorId, c.defaultName)}
                onSubmitEditing={() => save(c.colorId, c.defaultName)}
                testID={`label-input-${c.colorId}`}
              />
            </View>
            <Pressable
              style={styles.saveBtn}
              onPress={() => save(c.colorId, c.defaultName)}
              accessibilityLabel={`${c.defaultName}の名前を保存`}
            >
              <Text style={styles.saveText}>保存</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: THEME.background },
  scroll: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 22, color: THEME.accent, fontWeight: '300', letterSpacing: 3, textAlign: 'center' },
  subtitle: { fontSize: 11, color: THEME.textSub, textAlign: 'center', marginTop: 4, marginBottom: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  swatch: { width: 32, height: 32, borderRadius: 16, marginRight: 12 },
  midCol: { flex: 1 },
  defaultName: { fontSize: 10, color: THEME.textSub },
  input: {
    fontSize: 14,
    color: THEME.text,
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  saveBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: THEME.background,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  saveText: { fontSize: 11, color: THEME.text },
});
