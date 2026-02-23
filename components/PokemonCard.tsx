import { View, Text, StyleSheet } from 'react-native';
import { COLOR_MAP, PokemonCardProps } from '../types/pokemon';

export default function PokemonCard({
  name,
  image,
  description,
  colorName = 'default',
}: PokemonCardProps) {
  const cardColor = COLOR_MAP[colorName];
  return (
    <View style={styles.cardContainer}>
      <View style={[styles.cardBody, { backgroundColor: cardColor }]}>
        <View style={styles.cardHeader}>
          <Text>{name}</Text>
        </View>
        <View style={styles.cardImageBox}>{image}</View>
        <View style={styles.cardDescription}>{description}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {},
  cardBody: {},
  cardHeader: {},
  cardImageBox: {},
  cardDescription: {},
});
