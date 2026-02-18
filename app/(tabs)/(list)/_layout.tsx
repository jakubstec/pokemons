import { Stack, useLocalSearchParams } from 'expo-router';

export default function ListLayout() {
  const { name } = useLocalSearchParams<{
    name: string;
  }>();
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[name]" options={{ title: name }} />
    </Stack>
  );
}
