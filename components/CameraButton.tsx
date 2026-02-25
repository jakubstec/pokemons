import { router } from 'expo-router';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CameraButton() {
  return (
    <Pressable
      onPress={() => router.push('(tabs)/(favourite)/camera')}
      style={styles.button}
    >
      <View>
        <Ionicons name="camera" size={30} color="white" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#08030383',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
