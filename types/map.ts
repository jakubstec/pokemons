import { PokemonFavourite } from './pokemon';

export type MarkerItem = {
  id: string;
  coordinates: {
    latitude: number | undefined;
    longitude: number | undefined;
  };
  pokemonData: PokemonFavourite | null;
};
