import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import PokemonCard from './PokemonCard';
import { PokemonCardProps } from '../types/pokemon';

export default function GradedSlab({
  name,
  image,
  description,
  colorName,
}: PokemonCardProps) {
  return (
    <View style={styles.slabContainer}>
      <View style={styles.slabCase}>
        <View style={styles.slabHeader}>
          <Image style={styles.slabHeaderLogo}></Image>
          <Text style={styles.slabHeaderName}>{name}</Text>
          <Text style={styles.slabHeaderGrade}></Text>
        </View>
        <View style={styles.slabCard}>
          <PokemonCard
            name={name}
            image={image}
            description={description}
            colorName={colorName}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slabContainer: {},
  slabCase: {},
  slabHeader: {},
  slabHeaderLogo: {},
  slabHeaderGrade: {},
  slabHeaderName: {},
  slabLabel: {},
  slabLogo: {},
  slabCard: {},
});
