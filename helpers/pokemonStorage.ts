import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pokemon } from './pokemon';

const INDEX_KEY = 'pokemon_index_ids';
export const LIMIT = 100;

function extractId(url: string) {
  const parts = url.split('/');
  return parts.pop() || parts.pop();
}

export async function fetchAndCachePokemonPage(offset: number) {
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

    const pairs: [string, string][] = newPokemons.map((p: any) => {
      const storageKey = `pokemon_${p.id}`;
      const storageValue = JSON.stringify(p);
      return [storageKey, storageValue];
    });

    if (pairs.length > 0) {
      await AsyncStorage.multiSet(pairs);
    }

    const existingIdsJson = await AsyncStorage.getItem(INDEX_KEY);
    let existingIds: number[] = [];
    try {
      existingIds = existingIdsJson ? JSON.parse(existingIdsJson) : [];
    } catch (e) {
      existingIds = [];
    }

    const newIds = newPokemons.map((p) => p.id);

    const uniqueIds = [...new Set([...existingIds, ...newIds])];

    await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(uniqueIds));

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
      ? entry.flavor_text.replace(/[\n\f]/g, ' ')
      : 'No description available.';

    await AsyncStorage.setItem(key, text);

    return text;
  } catch (e) {
    console.error(e);
    return 'Failed to load description';
  }
}
