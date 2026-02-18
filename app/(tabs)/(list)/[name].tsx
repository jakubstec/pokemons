import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetailScreen() {
  const { name, image } = useLocalSearchParams<{
    name: string;
    image: string;
  }>();
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: name }} />
      <Image source={{ uri: image }} style={styles.image} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 16,
  },
});
