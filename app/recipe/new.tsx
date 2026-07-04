import { useRouter } from 'expo-router';

import { RecipeForm } from '@/components/recipe-form';
import { createRecipe, setPinnedUnits, setRecipePhoto } from '@/db/recipes';
import { saveRecipePhoto } from '@/lib/photo-storage';

export default function NewRecipeScreen() {
  const router = useRouter();

  return (
    <RecipeForm
      submitLabel="Add Recipe"
      onSubmit={async (input, pinnedUnitIds, photoUpdate) => {
        const id = await createRecipe(input);
        await setPinnedUnits(id, pinnedUnitIds);
        if (photoUpdate) {
          const savedUri = await saveRecipePhoto(id, photoUpdate);
          await setRecipePhoto(id, savedUri);
        }
        router.back();
      }}
    />
  );
}
