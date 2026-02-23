import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Favourite',
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={24} name="favorite" color={color} />
          ),
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="(list)"
        options={{
          title: 'List',
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={24} name="list" color={color} />
          ),
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="map" color={color} />
          ),
          headerShown: true,
        }}
      />
    </Tabs>
  );
}
