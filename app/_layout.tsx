import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FavouriteProvider } from '../context/FavouriteContext';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <FavouriteProvider>
          <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="bottom-sheet"
                options={{
                  headerShown: false,
                  presentation: 'transparentModal',
                }}
              />
            </Stack>
          </SafeAreaProvider>
        </FavouriteProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
