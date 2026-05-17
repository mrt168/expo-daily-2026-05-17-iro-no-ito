// components/iro/WeavingTile.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ColorEntry } from '../../types';
import { hexById, THEME } from '../../constants/Palette';

interface WeavingTileProps {
  entries: ColorEntry[];
  size?: number;
}

export const WeavingTile: React.FC<WeavingTileProps> = ({ entries, size = 36 }) => {
  if (entries.length === 0) {
    return <View style={[styles.empty, { width: size, height: size }]} />;
  }
  const maxLines = Math.min(entries.length, 10);
  const lines = entries.slice(0, maxLines);
  return (
    <View style={[styles.tile, { width: size, height: size }]}>
      {lines.map((e, idx) => (
        <View
          key={e.id || idx}
          style={{
            flex: 1,
            backgroundColor: hexById(e.colorId),
            marginHorizontal: 0.5,
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.border,
    backgroundColor: '#FFFFFF',
  },
  empty: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: THEME.border,
    backgroundColor: '#F0EBE3',
  },
});
