import { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Camera as VisionCamera,
  Frame,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

import {
  Face,
  Camera,
  FrameFaceDetectionOptions,
} from 'react-native-vision-camera-face-detector';

export default function CameraScreen() {
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();
  const cameraRef = useRef<VisionCamera>(null);

  const faceDetectionOptions = useRef<FrameFaceDetectionOptions>({}).current;

  function handleFacesDetection(faces: Face[], frame: Frame) {
    console.log('faces', faces.length, 'frame', frame.toString());
  }

  if (!hasPermission) {
    requestPermission();
  }
  if (!device)
    return (
      <View>
        <Text>no device or no permission</Text>
      </View>
    );
  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      faceDetectionCallback={handleFacesDetection}
      faceDetectionOptions={faceDetectionOptions}
      ref={cameraRef}
      isActive={true}
    />
  );
}
