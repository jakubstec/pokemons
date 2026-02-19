import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useNavigation } from 'expo-router';
import { useFavourite } from '../../helpers/FavouriteContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FavouriteScreen() {
  const { favourite, removeFavouritePokemon } = useFavourite();
  const [cacheSize, setCacheSize] = useState(0);
  const navigation = useNavigation();

  const getPokemonCachedSize = async () => {
    try {
      const value = await AsyncStorage.getItem('pokemon_index_ids');
      if (value !== null) {
        const pokemonIndexesList = JSON.parse(value);
        const size = pokemonIndexesList ? pokemonIndexesList.length : 0;
        setCacheSize(size);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getPokemonCachedSize();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        favourite ? (
          <Pressable
            onPress={removeFavouritePokemon}
            style={styles.unfavButton}
          >
            <Text style={styles.unfavText}>UnFav</Text>
          </Pressable>
        ) : null,
      title: 'Favourite',
    });
  }, [navigation, favourite, removeFavouritePokemon]);

  return (
    <View style={styles.container}>
      <Text style={styles.nameDebug}>
        debug: loaded pokemons into &apos;pokemon_index_ids&apos; key:{' '}
        {cacheSize}
      </Text>
      {favourite === null ? (
        <Text style={styles.emptyText}>No favourite yet :(</Text>
      ) : (
        <View style={styles.content}>
          <Image
            source={{ uri: favourite.image }}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.name}>{favourite.name}</Text>
          <Text style={styles.description}>{favourite.description}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: 300, height: 300, marginBottom: 20 },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    justifyContent: 'flex-start',
    marginTop: 40,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: 10,
  },
  nameDebug: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },
  unfavText: {
    color: 'white',
  },
  unfavButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  emptyText: { fontSize: 18, color: '#888' },
});
