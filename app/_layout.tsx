import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FavouriteProvider } from '../helpers/FavouriteContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

export default function RootLayout() {
  // useEffect(() => {
  //   AsyncStorage.clear();
  // }, []);

  return (
    <FavouriteProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </FavouriteProvider>
  );
}
