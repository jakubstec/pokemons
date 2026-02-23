export type Pokemon = {
  id: number;
  name: string;
  image: string;
};

export type PokemonFavourite = {
  name: string;
  image: string;
  description: string;
};

export type PokemonCardProps = {
  name: string;
  image: string;
  description: string;
  colorName: string;
};

export type GradedSlabProps = {
  pokemonName: string;
};

export const COLOR_MAP: Record<string, string> = {
  green: '#A7DB8D',
  red: '#F95587',
  blue: '#9CF0F5',
  white: '#F5F5F5',
  brown: '#B66738',
  yellow: '#FBE675',
  purple: '#A98FF3',
  pink: '#F6B7F7',
  gray: '#B7B7CE',
  black: '#707070',
  default: '#E0E0E0',
};
