import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { getPaintHex } from '@/constants/paints';
import { Colors, SCREEN_BOTTOM_PADDING } from '@/constants/theme';
import { deleteRecipe, listRecipes, Recipe } from '@/db/recipes';

function paintDotColors(recipe: Recipe): string[] {
  const colors = new Set<string>();
  for (const step of recipe.steps) {
    const hex = getPaintHex(step.paintName);
    if (hex) colors.add(hex);
  }
  return Array.from(colors).slice(0, 5);
}

export default function RecipesScreen() {
  const insets = useSafeAreaInsets();
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
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: insets.top + 12, paddingBottom: SCREEN_BOTTOM_PADDING }}>
        <Text style={styles.title}>Paint Recipes</Text>
        {recipes.length === 0 ? (
          <EmptyState icon="paintpalette.fill" message="No recipes yet. Tap + to add your first paint recipe." />
        ) : (
          <View style={styles.grid}>
            {recipes.map((recipe) => {
              const dots = paintDotColors(recipe);
              return (
                <Pressable
                  key={recipe.id}
                  onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: String(recipe.id) } })}
                  onLongPress={() => handleLongPress(recipe)}
                  style={styles.recipeCardWrapper}>
                  <View style={styles.recipeCard}>
                    {recipe.photoUri ? (
                      <Image source={{ uri: recipe.photoUri }} style={StyleSheet.absoluteFill} contentFit="cover" />
                    ) : (
                      <View style={[StyleSheet.absoluteFill, styles.recipeCardFallback]} />
                    )}
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.88)']}
                      style={styles.recipeCardGradient}
                    />
                    {dots.length > 0 && (
                      <View style={styles.dotsRow}>
                        {dots.map((hex, i) => (
                          <View key={i} style={[styles.dot, { backgroundColor: hex }]} />
                        ))}
                      </View>
                    )}
                    <View style={styles.recipeCardText}>
                      <Text style={styles.recipeName} numberOfLines={1}>
                        {recipe.name}
                      </Text>
                      <Text style={styles.recipeSteps}>
                        {recipe.steps.length} {recipe.steps.length === 1 ? 'step' : 'steps'}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
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
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  recipeCardFallback: {
    backgroundColor: Colors.surface2,
  },
  recipeCardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '65%',
  },
  dotsRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  recipeCardText: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
    gap: 2,
  },
  recipeName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  recipeSteps: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontWeight: '600',
  },
});
