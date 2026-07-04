import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { RecipeForm } from '@/components/recipe-form';
import { Colors } from '@/constants/theme';
import { deleteRecipe, getPinnedUnitIds, getRecipe, Recipe, setPinnedUnits, updateRecipe } from '@/db/recipes';

export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const recipeId = Number(id);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [pinnedIds, setPinnedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [r, pins] = await Promise.all([getRecipe(recipeId), getPinnedUnitIds(recipeId)]);
      setRecipe(r);
      setPinnedIds(pins);
      setLoading(false);
    })();
  }, [recipeId]);

  if (loading || !recipe) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.accent} />
      </View>
    );
  }

  return (
    <RecipeForm
      initialValues={recipe}
      initialPinnedUnitIds={pinnedIds}
      submitLabel="Save Changes"
      onSubmit={async (input, pinnedUnitIds) => {
        await updateRecipe(recipeId, input);
        await setPinnedUnits(recipeId, pinnedUnitIds);
        router.back();
      }}
      onDelete={async () => {
        await deleteRecipe(recipeId);
        router.back();
      }}
    />
  );
}
