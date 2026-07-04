import { useRouter } from 'expo-router';

import { UnitForm } from '@/components/unit-form';
import { createUnit, setInProgress, setPinnedRecipes } from '@/db/units';

export default function NewUnitScreen() {
  const router = useRouter();

  return (
    <UnitForm
      submitLabel="Add Unit"
      onSubmit={async (input, pinnedRecipeIds, inProgress) => {
        const id = await createUnit(input);
        await setPinnedRecipes(id, pinnedRecipeIds);
        if (inProgress) await setInProgress(id, true);
        router.back();
      }}
    />
  );
}
