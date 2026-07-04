import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/card';
import { EmptyState } from '@/components/empty-state';
import { Fab } from '@/components/fab';
import { Colors } from '@/constants/theme';
import { deleteRecipe, listRecipes, Recipe } from '@/db/recipes';

export default function RecipesScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const refresh = useCallback(() => {
    listRecipes().then(setRecipes);
  }, []);

  useFocusEffect(refresh);

  function handleLongPress(recipe: Recipe) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(recipe.name, undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await deleteRecipe(recipe.id);
          refresh();
        },
      },
    ]);
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12, paddingBottom: tabBarHeight + 24 }}>
        <Text style={styles.title}>Paint Recipes</Text>
        {recipes.length === 0 ? (
          <EmptyState icon="paintpalette.fill" message="No recipes yet. Tap + to add your first paint recipe." />
        ) : (
          <View style={styles.grid}>
            {recipes.map((recipe) => (
              <Pressable
                key={recipe.id}
                onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: String(recipe.id) } })}
                onLongPress={() => handleLongPress(recipe)}
                style={styles.recipeCardWrapper}>
                <Card style={styles.recipeCard}>
                  <View style={styles.recipeThumb} />
                  <Text style={styles.recipeName} numberOfLines={1}>
                    {recipe.name}
                  </Text>
                  <Text style={styles.recipeSteps}>{recipe.steps.length} steps</Text>
                </Card>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
      <Fab onPress={() => router.push('/recipe/new')} />
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
  recipeCardWrapper: {
    width: '47%',
  },
  recipeCard: {
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
