import * as ImagePicker from 'expo-image-picker';
import { ActionSheetIOS, Alert, Platform } from 'react-native';

export async function pickImage(source: 'camera' | 'library', aspect: [number, number] = [1, 1]): Promise<string | null> {
  const permission =
    source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert(
      'Permission needed',
      `Enable ${source === 'camera' ? 'camera' : 'photo library'} access in Settings to add photos.`
    );
    return null;
  }
  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: true, aspect })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.7, allowsEditing: true, aspect });
  return result.canceled ? null : result.assets[0].uri;
}

export function askSource(): Promise<'camera' | 'library' | null> {
  return new Promise((resolve) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ['Take Photo', 'Choose from Library', 'Cancel'], cancelButtonIndex: 2 },
        (index) => resolve(index === 0 ? 'camera' : index === 1 ? 'library' : null)
      );
    } else {
      Alert.alert('Add Photo', undefined, [
        { text: 'Take Photo', onPress: () => resolve('camera') },
        { text: 'Choose from Library', onPress: () => resolve('library') },
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
      ]);
    }
  });
}
