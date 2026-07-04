import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export function BlurTabBarBackground() {
  return <BlurView tint="dark" intensity={80} style={StyleSheet.absoluteFill} />;
}
