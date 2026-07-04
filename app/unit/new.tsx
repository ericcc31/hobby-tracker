import { useRouter } from 'expo-router';

import { UnitForm } from '@/components/unit-form';
import { Stage } from '@/constants/theme';
import { setStagePhoto } from '@/db/photos';
import { createUnit, setInProgress, setPinnedRecipes } from '@/db/units';
import { saveUnitStagePhoto } from '@/lib/photo-storage';

export default function NewUnitScreen() {
  const router = useRouter();

  return (
    <UnitForm
      submitLabel="Add Unit"
      onSubmit={async (input, pinnedRecipeIds, inProgress, draftPhotos) => {
        const id = await createUnit(input);
        await setPinnedRecipes(id, pinnedRecipeIds);
        if (inProgress) await setInProgress(id, true);
        for (const [stage, uri] of Object.entries(draftPhotos) as [Stage, string][]) {
          const savedUri = await saveUnitStagePhoto(id, stage, uri);
          await setStagePhoto(id, stage, savedUri);
        }
        router.back();
      }}
    />
  );
}
