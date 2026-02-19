import AsyncStorage from '@react-native-async-storage/async-storage';
import { PokemonFavourite } from '../types/pokemon';

const FAVOURITE_KEY = 'favourite';

export async function loadFavourite(): Promise<PokemonFavourite | null> {
  try {
    const value = await AsyncStorage.getItem(FAVOURITE_KEY);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function saveFavourite(pokemon: PokemonFavourite) {
  try {
    await AsyncStorage.setItem(FAVOURITE_KEY, JSON.stringify(pokemon));
  } catch (e) {
    console.error(e);
  }
}

export async function removeFavourite() {
  try {
    await AsyncStorage.removeItem(FAVOURITE_KEY);
  } catch (e) {
    console.error(e);
  }
}
