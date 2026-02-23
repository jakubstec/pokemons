import { Link } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  fetchPokemonsWithOffset,
  LIMIT,
} from '../../../utils/fetchPokemonsData';
import { useEffect, useState } from 'react';
import { Pokemon } from '../../../types/pokemon';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { Image } from 'expo-image';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const Item = ({ item }: { item: Pokemon }) => {
  return (
    <Link
      href={{
        pathname: '/(tabs)/(list)/bottom-sheet',
        params: { name: item.name, image: item.image, id: item.id },
      }}
      asChild
    >
      <Pressable style={styles.pokecontainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.pokeimage}
          placeholder={{ blurhash }}
        />
        <Text style={styles.pokename}>{item.name}</Text>
      </Pressable>
    </Link>
  );
};

export default function ListScreen() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMore = async () => {
    if (loading || !hasMore || refreshing) return;
    setLoading(true);

    const newPokemons = (await fetchPokemonsWithOffset(offset)) as Pokemon[];

    if (newPokemons.length > 0) {
      setPokemons((prev) => [...prev, ...newPokemons]);
      setOffset((prev) => prev + LIMIT);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  // initial loading
  useEffect(() => {
    loadMore();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);

    const newPokemons = (await fetchPokemonsWithOffset(0)) as Pokemon[];

    setPokemons(newPokemons);

    setOffset(LIMIT);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerName}>list size: {pokemons.length}</Text>
      <View style={styles.container}>
        <FlatList
          data={pokemons}
          renderItem={({ item }) => <Item item={item} />}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#707070"
              colors={['#707070']}
            />
          }
          ListFooterComponent={loading ? <LoadingSpinner /> : null}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  pokecontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    height: 100,
    width: 300,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  pokename: {
    flex: 1,
    fontSize: 18,
    marginLeft: 12,
    color: '#000',
  },
  pokeimage: {
    width: 80,
    height: 80,
  },
  headerName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
});
