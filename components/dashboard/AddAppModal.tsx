import { Modal, View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useMemo } from 'react';
import { AppItem } from '../../types';
import { theme } from '../../constants/theme';
import { AppCard } from './AppCard';

interface AddAppModalProps {
  visible: boolean;
  apps: AppItem[];
  selectedApps: AppItem[];
  onToggle: (app: AppItem) => void;
  onClose: () => void;
}

export const AddAppModal = ({ visible, apps, selectedApps, onToggle, onClose }: AddAppModalProps) => {
  const [search, setSearch] = useState('');

  const filteredApps = useMemo(() => {
    if (!search) return apps;
    return apps.filter(app => 
      app.name.toLowerCase().includes(search.toLowerCase()) || 
      app.packageName.toLowerCase().includes(search.toLowerCase())
    );
  }, [apps, search]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>System Library</Text>
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color={theme.colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari aplikasi..."
              placeholderTextColor={theme.colors.textMuted}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          
          <FlatList
            data={filteredApps}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <AppCard
                app={item}
                isSelected={selectedApps.some(a => a.id === item.id)}
                onToggle={() => onToggle(item)}
              />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Aplikasi tidak ditemukan</Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center', // Center modal for premium feel
    padding: theme.spacing.lg,
  },
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    maxHeight: '75%',
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceLight,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    marginLeft: theme.spacing.sm,
  },
  list: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
  },
});

