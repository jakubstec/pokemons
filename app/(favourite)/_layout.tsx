import { Stack } from 'expo-router';

export default function favouriteLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="camera" options={{ headerShown: false }} />
    </Stack>
  );
}
