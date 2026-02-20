import { AppleMaps, GoogleMaps, Coordinates } from 'expo-maps';
import { useState } from 'react';
import { Platform, Text } from 'react-native';
import { MarkerItem } from '../../types/map';
import { useFavourite } from '../../context/FavouriteContext';
import { router } from 'expo-router';

export default function MapScreen() {
  const [markerList, setMarkerList] = useState<MarkerItem[]>([]);

  const { favourite } = useFavourite();

  const handleAddMarker = (event: { coordinates: Coordinates }) => {
    const { coordinates } = event;
    if (!favourite) {
      alert('select favourite pokemon first!');
      return;
    }
    const newMarker: MarkerItem = {
      id: Date.now().toString(),
      coordinates: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
      pokemonData: favourite,
    };

    setMarkerList([...markerList, newMarker]);
  };

  const handleMarkerClick = (event: { id?: string }) => {
    const clickedMarker = markerList.find((m) => m.id === event.id);

    if (clickedMarker?.pokemonData) {
      router.push({
        pathname: '/bottom-sheet',
        params: { ...clickedMarker.pokemonData },
      });
    }
  };

  if (Platform.OS === 'ios') {
    return (
      <>
        <AppleMaps.View
          style={{ flex: 1 }}
          cameraPosition={{
            coordinates: {
              latitude: 50.048765,
              longitude: 19.965564,
            },
            zoom: 16,
          }}
          onMapClick={handleAddMarker}
          onMarkerClick={handleMarkerClick}
          markers={markerList.map((m) => ({
            id: m.id,
            coordinates: m.coordinates,
            title: m.pokemonData?.name,
          }))}
        />
      </>
    );
  } else if (Platform.OS === 'android') {
    return <GoogleMaps.View style={{ flex: 1 }} />;
  } else {
    return <Text>Maps are only available on Android and iOS</Text>;
  }
}

// type AppleMapsMarker = {
//     id?: string;
//     systemImage?: string;
//     coordinates?: Coordinates;
//     title?: string;
//     tintColor?: string;
// }
