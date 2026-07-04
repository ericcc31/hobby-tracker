import { useRouter } from 'expo-router';

import { RecipeForm } from '@/components/recipe-form';
import { createRecipe, setPinnedUnits } from '@/db/recipes';

export default function NewRecipeScreen() {
  const router = useRouter();

  return (
    <RecipeForm
      submitLabel="Add Recipe"
      onSubmit={async (input, pinnedUnitIds) => {
        const id = await createRecipe(input);
        await setPinnedUnits(id, pinnedUnitIds);
        router.back();
      }}
    />
  );
}
