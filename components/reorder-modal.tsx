import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Pressable onPress={onClose}>
            <Text style={styles.closeLabel}>Cancel</Text>
          </Pressable>
        </View>
        <Text style={styles.hint}>Hold and drag a row to reorder.</Text>
        <DraggableFlatList
          data={order}
          keyExtractor={(item) => item}
          onDragEnd={({ data }) => setOrder(data)}
          contentContainerStyle={styles.list}
          renderItem={({ item, drag, isActive }: RenderItemParams<string>) => (
            <ScaleDecorator>
              <Pressable
                onLongPress={drag}
                disabled={isActive}
                style={[styles.row, isActive && styles.rowActive]}>
                <IconSymbol name="line.3.horizontal" size={16} color={Colors.textSecondary} />
                <Text style={styles.rowLabel}>{item}</Text>
              </Pressable>
            </ScaleDecorator>
          )}
        />
        <Pressable
          style={styles.saveButton}
          onPress={() => {
            onSave(order);
            onClose();
          }}>
          <Text style={styles.saveButtonLabel}>Save Order</Text>
        </Pressable>
      </GestureHandlerRootView>
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
  hint: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  list: {
    padding: 16,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  rowActive: {
    backgroundColor: Colors.surface2,
    borderColor: Colors.accent,
  },
  rowLabel: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  saveButtonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
