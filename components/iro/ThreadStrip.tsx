// components/iro/ThreadStrip.tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ColorEntry } from '../../types';
import { hexById, THEME } from '../../constants/Palette';

interface ThreadStripProps {
  entries: ColorEntry[];
  height?: number;
  lineWidth?: number;
}

export const ThreadStrip: React.FC<ThreadStripProps> = ({
  entries,
  height = 220,
  lineWidth = 8,
}) => {
  if (entries.length === 0) {
    return (
      <View style={[styles.empty, { height }]}>
        <View style={styles.emptyHint} />
      </View>
    );
  }
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      <View style={[styles.strip, { height }]}>
        {entries.map((e) => (
          <View
            key={e.id}
            style={{
              width: lineWidth,
              height: '100%',
              backgroundColor: hexById(e.colorId),
              marginHorizontal: 1,
              borderRadius: 2,
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 16,
    flexGrow: 1,
    justifyContent: 'center',
  },
  strip: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: THEME.card,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    minWidth: 60,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  empty: {
    backgroundColor: THEME.card,
    borderRadius: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyHint: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: THEME.border,
    borderStyle: 'dashed',
  },
});
