import { Link } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
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

const Item = ({ item }: { item: Pokemon }) => {
  const [imgUri, setImgUri] = useState(item.image);
  return (
    <Link
      href={{
        pathname: '/(tabs)/(list)/bottom-sheet',
        params: { name: item.name, image: imgUri, id: item.id },
      }}
      asChild
    >
      <Pressable style={styles.pokecontainer}>
        <Image
          source={{ uri: imgUri }}
          style={styles.pokeimage}
          onError={() =>
            setImgUri(
              'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
            )
          }
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
              tintColor="#007AFF"
              colors={['#007AFF']}
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
