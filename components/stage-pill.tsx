import { StyleSheet, Text, View } from 'react-native';

import { Stage, StageColors, StageLabels } from '@/constants/theme';

export function StagePill({ stage }: { stage: Stage }) {
  const color = StageColors[stage];

  return (
    <View style={[styles.pill, { backgroundColor: color + '33', borderColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{StageLabels[stage]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
