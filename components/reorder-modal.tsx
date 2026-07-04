import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

export function ReorderModal({
  visible,
  title,
  items,
  onSave,
  onClose,
}: {
  visible: boolean;
  title: string;
  items: string[];
  onSave: (order: string[]) => void;
  onClose: () => void;
}) {
  const [order, setOrder] = useState(items);

  useEffect(() => {
    if (visible) setOrder(items);
  }, [visible, items]);

  function move(index: number, direction: -1 | 1) {
    setOrder((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Pressable onPress={onClose}>
            <Text style={styles.closeLabel}>Cancel</Text>
          </Pressable>
        </View>
        <View style={styles.list}>
          {order.map((item, index) => (
            <View key={item} style={styles.row}>
              <Text style={styles.rowLabel}>{item}</Text>
              <View style={styles.actions}>
                <Pressable onPress={() => move(index, -1)} style={styles.actionBtn}>
                  <IconSymbol name="chevron.up" size={18} color={Colors.textSecondary} />
                </Pressable>
                <Pressable onPress={() => move(index, 1)} style={styles.actionBtn}>
                  <IconSymbol name="chevron.down" size={18} color={Colors.textSecondary} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
        <Pressable
          style={styles.saveButton}
          onPress={() => {
            onSave(order);
            onClose();
          }}>
          <Text style={styles.saveButtonLabel}>Save Order</Text>
        </Pressable>
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
  list: {
    padding: 16,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  rowLabel: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
  },
  saveButtonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
