import { View, ActivityIndicator } from 'react-native';

export default function LoadingSpinner() {
  return (
    <View style={{ padding: 20 }}>
      <ActivityIndicator size="large" color="#707070" />
    </View>
  );
}
