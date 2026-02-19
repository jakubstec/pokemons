import { Stack, useLocalSearchParams } from 'expo-router';
import {
  StyleSheet,
  Image,
  View,
  ActivityIndicator,
  Pressable,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavourite } from '../../../helpers/FavouriteContext';
import { useEffect, useState } from 'react';
import { getPokemonDescription } from '../../../helpers/pokemonStorage';

export default function DetailScreen() {
  const { name, image, id } = useLocalSearchParams<{
    name: string;
    image: string;
    id: string;
  }>();

  const { favourite, setFavouritePokemon } = useFavourite();

  const [description, setDescription] = useState<string | null>(null);

  const isFav = favourite?.name === name;
  const isLoading = description === null;

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const pokemonId = Number(id);
      if (isNaN(pokemonId)) return;

      const text = await getPokemonDescription(pokemonId);

      if (isMounted) {
        setDescription(text || 'No description available.');
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const addFavourite = async () => {
    if (!description) return;
    await setFavouritePokemon({
      name,
      image,
      description,
    });
  };

  const imageSource = image
    ? { uri: image as string }
    : { uri: 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg' };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: name }} />
      <Image source={imageSource} style={styles.image} />

      {isLoading ? (
        <View style={{ padding: 20 }}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <Text style={styles.description}>{description}</Text>
      )}

      <Pressable
        onPress={addFavourite}
        disabled={isLoading || isFav}
        style={[styles.button, (isLoading || isFav) && styles.buttonDisabled]}
      >
        <Text style={styles.buttonText}>
          {isFav ? 'Already in Favourites' : 'Add to Favourites'}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 16,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    maxWidth: 300,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
