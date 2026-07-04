import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

export function SectionHeader({
  title,
  subtitle,
  level = 'primary',
}: {
  title: string;
  subtitle?: string;
  level?: 'primary' | 'secondary';
}) {
  const isPrimary = level === 'primary';
  return (
    <View style={[styles.container, isPrimary ? styles.primaryContainer : styles.secondaryContainer]}>
      <Text style={isPrimary ? styles.primaryTitle : styles.secondaryTitle}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  primaryContainer: {
    marginTop: 22,
    marginBottom: 4,
  },
  secondaryContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  primaryTitle: {
    color: Colors.text,
    fontSize: 19,
    fontWeight: '700',
  },
  secondaryTitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
});
