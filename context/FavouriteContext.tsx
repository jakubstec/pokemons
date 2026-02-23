import { useEffect, useState, createContext, useContext } from 'react';
import {
  loadFavourite,
  saveFavourite,
  removeFavourite,
} from '../utils/favouriteStorage';
import { PokemonFavourite } from '../types/pokemon';

type favouriteContextType = {
  favourite: PokemonFavourite | null;
  setFavouritePokemon: (pokemon: PokemonFavourite) => Promise<void>;
  removeFavouritePokemon: () => Promise<void>;
};

const FavouriteContext = createContext<favouriteContextType | undefined>(
  undefined
);

export function FavouriteProvider({ children }: { children: React.ReactNode }) {
  const [favourite, setFavourite] = useState<PokemonFavourite | null>(null);

  useEffect(() => {
    loadFavourite().then(setFavourite);
  }, []);

  const setFavouritePokemon = async (pokemon: PokemonFavourite) => {
    setFavourite(pokemon);
    await saveFavourite(pokemon);
  };

  const removeFavouritePokemon = async () => {
    setFavourite(null);
    await removeFavourite();
  };

  return (
    <FavouriteContext.Provider
      value={{ favourite, setFavouritePokemon, removeFavouritePokemon }}
    >
      {children}
    </FavouriteContext.Provider>
  );
}

export function useFavourite() {
  const context = useContext(FavouriteContext);
  if (!context) {
    throw new Error('useFavourite must be used within a FavouriteProvider');
  }
  return context;
}
