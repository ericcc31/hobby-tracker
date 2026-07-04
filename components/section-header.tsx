import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
});
