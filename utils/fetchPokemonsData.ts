import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pokemon } from '../types/pokemon';

export const LIMIT = 100;

function extractId(url: string) {
  const parts = url.split('/');
  return parts.pop() || parts.pop();
}

export async function fetchPokemonsWithOffset(offset: number) {
  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`
    );
    const data = await res.json();

    const newPokemons: Pokemon[] = data.results.map((p: any) => {
      const id = extractId(p.url);
      return {
        id,
        name: p.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      };
    });
    return newPokemons;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getPokemonDescription(id: number): Promise<string> {
  const key = `pokemon_desc_${id}`;

  try {
    const cached = await AsyncStorage.getItem(key);
    if (
      cached &&
      cached !== 'No description' &&
      cached !== 'Failed to load description'
    ) {
      return cached;
    }

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const data = await res.json();

    const entry = data.flavor_text_entries.find(
      (e: any) => e.language.name === 'en'
    );

    const text = entry
      ? entry.flavor_text.replace(/[\n]/g, ' ')
      : 'No description available.';

    await AsyncStorage.setItem(key, JSON.stringify(text));

    return text;
  } catch (e) {
    console.error(e);
    return 'Failed to load description';
  }
}
