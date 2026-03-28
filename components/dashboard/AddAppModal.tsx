import { Modal, View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Tambah Aplikasi</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <MaterialIcons name="close" size={24} color={theme.colors.text} />
            </Pressable>
          </View>
          
          <FlatList
            data={apps}
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
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '80%',
    paddingTop: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  list: {
    padding: theme.spacing.lg,
  },
});
