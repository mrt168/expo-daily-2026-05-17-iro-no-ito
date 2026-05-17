// components/iro/ColorPalette.tsx
import React from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE, THEME } from '../../constants/Palette';
import { useSettings } from '../../context/SettingsContext';

interface ColorPaletteProps {
  onSelect: (colorId: string) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ onSelect }) => {
  const { settings } = useSettings();
  const labelOf = (id: string, def: string) => settings.labels[id] || def;

  const handlePress = async (colorId: string) => {
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    onSelect(colorId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>色をタップして糸に追加</Text>
      <View style={styles.grid}>
        {PALETTE.map(c => (
          <Pressable
            key={c.colorId}
            onPress={() => handlePress(c.colorId)}
            style={styles.cell}
            accessibilityLabel={labelOf(c.colorId, c.defaultName)}
            testID={`color-${c.colorId}`}
          >
            <View style={[styles.swatch, { backgroundColor: c.hex }]} />
            <Text style={styles.label} numberOfLines={1}>
              {labelOf(c.colorId, c.defaultName)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  heading: {
    fontSize: 13,
    color: THEME.textSub,
    marginBottom: 12,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cell: {
    width: '24%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  label: {
    fontSize: 11,
    marginTop: 4,
    color: THEME.text,
  },
});
