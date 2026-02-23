import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef } from 'react';
import {
  Camera,
  runAsync,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {
  Face,
  useFaceDetector,
  FrameFaceDetectionOptions,
} from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';

export default function App() {
  const device = useCameraDevice('front');
  const faceDetectionOptions = useRef<FrameFaceDetectionOptions>({
    performanceMode: 'fast',
    classificationMode: 'all',
  }).current;

  const { detectFaces, stopListeners } = useFaceDetector(faceDetectionOptions);
  const { hasPermission } = useCameraPermission();

  useEffect(() => {
    (async () => {
      await Camera.requestCameraPermission();
    })();
    return () => stopListeners();
  }, []);

  const handleDetectedFaces = Worklets.createRunOnJS((faces: Face[]) => {
    if (faces.length > 0) {
      console.log('Detected faces:', faces.length);
    }
  });

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';
      runAsync(frame, () => {
        'worklet';
        const faces = detectFaces(frame);
        handleDetectedFaces(faces);
      });
    },
    [detectFaces, handleDetectedFaces]
  );

  if (!device)
    return (
      <View style={styles.center}>
        <Text>No Device!</Text>
      </View>
    );

  if (!hasPermission)
    return (
      <View style={styles.center}>
        <Text>No Permission!</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
