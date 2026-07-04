import { StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

export function EmptyState({ icon, message }: { icon: 'square.grid.2x2.fill' | 'paintpalette.fill'; message: string }) {
  return (
    <View style={styles.container}>
      <IconSymbol name={icon} size={32} color={Colors.textSecondary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  message: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});
