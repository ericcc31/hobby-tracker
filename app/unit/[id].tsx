import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { UnitForm } from '@/components/unit-form';
import { UnitPhotos } from '@/components/unit-photos';
import { Colors } from '@/constants/theme';
import { deleteUnit, getPinnedRecipeIds, getUnit, setInProgress, setPinnedRecipes, Unit, updateUnit } from '@/db/units';

export default function EditUnitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const unitId = Number(id);
  const [unit, setUnit] = useState<Unit | null>(null);
  const [pinnedIds, setPinnedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [u, pins] = await Promise.all([getUnit(unitId), getPinnedRecipeIds(unitId)]);
      setUnit(u);
      setPinnedIds(pins);
      setLoading(false);
    })();
  }, [unitId]);

  if (loading || !unit) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.accent} />
      </View>
    );
  }

  return (
    <UnitForm
      initialValues={unit}
      initialPinnedRecipeIds={pinnedIds}
      initialInProgress={unit.inProgress}
      photosSection={<UnitPhotos unitId={unitId} />}
      submitLabel="Save Changes"
      onSubmit={async (input, pinnedRecipeIds, inProgress) => {
        // Photos for an existing unit are written directly to the DB by
        // UnitPhotos as they're picked, so there's nothing to commit here.
        await updateUnit(unitId, input);
        await setPinnedRecipes(unitId, pinnedRecipeIds);
        await setInProgress(unitId, inProgress);
        router.back();
      }}
      onDelete={async () => {
        await deleteUnit(unitId);
        router.back();
      }}
    />
  );
}
