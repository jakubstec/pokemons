import { Stack } from 'expo-router';

export default function favouriteLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true }} />
      <Stack.Screen name="camera" options={{ headerShown: true }} />
    </Stack>
  );
}
