import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Pressable, Text } from 'react-native';
import { useFavourite } from '../context/FavouriteContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getPokemonDescription } from '../utils/fetchPokemonsData';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LoadingSpinner from '../components/LoadingSpinner';
import { Image } from 'expo-image';

// todo: wiecej callbaczkow ;]
export default function DetailScreen() {
  const { name, image, id } = useLocalSearchParams<{
    name: string;
    image: string;
    id: string;
  }>();
  const { favourite, setFavouritePokemon } = useFavourite();
  const [description, setDescription] = useState<string>();

  const snapPoints = useMemo(() => ['60%', '80%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      router.back();
    }
  }, []);

  const isFav = favourite?.name === name;
  const isLoading = description === null;

  useEffect(() => {
    async function loadData() {
      const pokemonId = Number(id);
      if (isNaN(pokemonId)) return;

      const text = await getPokemonDescription(pokemonId);

      setDescription(text || 'No description available');
    }
    loadData();
  }, [id]);

  const addFavourite = async () => {
    if (!description) return;
    await setFavouritePokemon({
      name,
      image,
      description,
    });
  };

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const imageSource = image
    ? { uri: image as string }
    : { uri: 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg' };
  return (
    <GestureHandlerRootView style={styles.rootContainer}>
      <Pressable style={StyleSheet.absoluteFill} onPress={goBack} />

      <BottomSheet
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        index={2}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text style={styles.description}>{name}</Text>

          <Image source={imageSource} style={styles.image} />

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <Text style={styles.description}>{description}</Text>
          )}

          <Pressable
            onPress={addFavourite}
            disabled={isLoading || isFav}
            style={[
              styles.button,
              (isLoading || isFav) && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.buttonText}>
              {isFav ? 'Already in Favourites' : 'Add to Favourites'}
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  contentContainer: {
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
