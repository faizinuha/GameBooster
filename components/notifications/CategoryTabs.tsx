import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { theme } from '../../constants/theme';

type Category = 'all' | 'social' | 'custom';

interface CategoryTabsProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

const categories: { id: Category; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'social', label: 'Media Sosial' },
  { id: 'custom', label: 'Custom' },
];

export const CategoryTabs = ({ selectedCategory, onSelectCategory }: CategoryTabsProps) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map(category => {
        const isSelected = selectedCategory === category.id;
        return (
          <Pressable
            key={category.id}
            onPress={() => onSelectCategory(category.id)}
            style={({ pressed }) => [
              styles.tab,
              isSelected && styles.tabSelected,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {category.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  tab: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tabSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
  labelSelected: {
    color: theme.colors.text,
  },
});
