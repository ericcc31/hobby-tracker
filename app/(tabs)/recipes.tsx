import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/card';
import { Fab } from '@/components/fab';
import { Colors } from '@/constants/theme';

type FakeRecipe = {
  id: string;
  name: string;
  stepCount: number;
};

const FAKE_RECIPES: FakeRecipe[] = [
  { id: '1', name: 'Blood Angels Red Armor', stepCount: 5 },
  { id: '2', name: 'Dark Angels Green', stepCount: 4 },
  { id: '3', name: 'Gold Trim & Purity Seals', stepCount: 3 },
];

export default function RecipesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12 }}>
        <Text style={styles.title}>Paint Recipes</Text>
        <View style={styles.grid}>
          {FAKE_RECIPES.map((recipe) => (
            <Card key={recipe.id} style={styles.recipeCard}>
              <View style={styles.recipeThumb} />
              <Text style={styles.recipeName} numberOfLines={1}>
                {recipe.name}
              </Text>
              <Text style={styles.recipeSteps}>{recipe.stepCount} steps</Text>
            </Card>
          ))}
        </View>
      </ScrollView>
      <Fab onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  recipeCard: {
    width: '47%',
    gap: 8,
  },
  recipeThumb: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: Colors.surface2,
  },
  recipeName: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  recipeSteps: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
});
