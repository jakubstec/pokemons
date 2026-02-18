import { router } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const pokemons: ItemData[] = [
  {
    name: 'Bulbasaur',
    image:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
  },
  {
    name: 'Charmander',
    image:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
  },
  {
    name: 'Squirtle',
    image:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
  },
];

type ItemData = {
  name: string;
  image: string;
};

type ItemProps = {
  item: ItemData;
  onPress: () => void;
};

const Item = ({ item, onPress }: ItemProps) => (
  <Pressable onPress={onPress} style={styles.pokecontainer}>
    <Text style={styles.pokename}>{item.name}</Text>
    <Image source={{ uri: item.image }} style={styles.pokeimage} />
  </Pressable>
);

export default function ListScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>List</Text>
        <FlatList
          data={pokemons}
          renderItem={({ item }) => (
            <Item
              item={item}
              onPress={() => {
                router.push({
                  pathname: '/(tabs)/(list)/[name]',
                  params: { name: item.name, image: item.image },
                });
              }}
            />
          )}
          keyExtractor={(item) => item.name}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pokecontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  pokename: {
    fontSize: 18,
    marginLeft: 8,
  },
  pokeimage: {
    width: 80,
    height: 80,
  },
});
