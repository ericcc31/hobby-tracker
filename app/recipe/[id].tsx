import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { RecipeForm } from '@/components/recipe-form';
import { Colors } from '@/constants/theme';
import { deleteRecipe, getPinnedUnitIds, getRecipe, Recipe, setPinnedUnits, setRecipePhoto, updateRecipe } from '@/db/recipes';
import { deletePhotoFile, saveRecipePhoto } from '@/lib/photo-storage';

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
      onSubmit={async (input, pinnedUnitIds, photoUpdate) => {
        await updateRecipe(recipeId, input);
        await setPinnedUnits(recipeId, pinnedUnitIds);
        if (photoUpdate === null) {
          if (recipe.photoUri) await deletePhotoFile(recipe.photoUri);
          await setRecipePhoto(recipeId, null);
        } else if (typeof photoUpdate === 'string') {
          const savedUri = await saveRecipePhoto(recipeId, photoUpdate);
          await setRecipePhoto(recipeId, savedUri);
        }
        router.back();
      }}
      onDelete={async () => {
        await deleteRecipe(recipeId);
        router.back();
      }}
    />
  );
}
