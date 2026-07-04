import { useState } from 'react';
import { Alert, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors } from '@/constants/theme';

type Section = { title: string; items: string[] };

export function PickerModal({
  visible,
  title,
  sections,
  onSelect,
  onClose,
  searchable = false,
  allowCustom = false,
  getColor,
}: {
  visible: boolean;
  title: string;
  sections: Section[];
  onSelect: (value: string) => void;
  onClose: () => void;
  searchable?: boolean;
  allowCustom?: boolean;
  getColor?: (item: string) => string | undefined;
}) {
  const [query, setQuery] = useState('');

  const filteredSections = query.trim()
    ? sections
        .map((s) => ({
          title: s.title,
          items: s.items.filter((i) => i.toLowerCase().includes(query.trim().toLowerCase())),
        }))
        .filter((s) => s.items.length > 0)
    : sections;

  function handleSelect(value: string) {
    onSelect(value);
    setQuery('');
  }

  function handleCustom() {
    if (Platform.OS === 'ios') {
      Alert.prompt(title, 'Enter a custom value', (text) => {
        if (text?.trim()) handleSelect(text.trim());
      });
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Pressable onPress={onClose}>
            <Text style={styles.closeLabel}>Close</Text>
          </Pressable>
        </View>
        {searchable && (
          <TextInput
            style={styles.search}
            placeholder="Search..."
            placeholderTextColor={Colors.textSecondary}
            value={query}
            onChangeText={setQuery}
          />
        )}
        <ScrollView keyboardShouldPersistTaps="handled">
          {filteredSections.map((section) => (
            <View key={section.title}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item) => {
                const color = getColor?.(item);
                return (
                  <Pressable key={item} style={styles.row} onPress={() => handleSelect(item)}>
                    {color && <View style={[styles.swatch, { backgroundColor: color }]} />}
                    <Text style={styles.rowLabel}>{item}</Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
          {allowCustom && (
            <Pressable style={styles.customRow} onPress={handleCustom}>
              <Text style={styles.customLabel}>+ Use a custom name</Text>
            </Pressable>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  closeLabel: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: '600',
  },
  search: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    color: Colors.text,
    fontSize: 15,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 20,
    marginHorizontal: 16,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  rowLabel: {
    color: Colors.text,
    fontSize: 15,
  },
  swatch: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  customRow: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 32,
  },
  customLabel: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: '600',
  },
});
