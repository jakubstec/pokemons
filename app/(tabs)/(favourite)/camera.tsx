import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
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
import { facePosition } from '../../../types/camera';
import { useFavourite } from '../../../context/FavouriteContext';

export default function App() {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const device = useCameraDevice('front');

  const faceDetectionOptions = useRef<FrameFaceDetectionOptions>({
    performanceMode: 'fast',
    classificationMode: 'all',
    landmarkMode: 'all',
    autoMode: true,
    windowHeight: screenHeight,
    windowWidth: screenWidth,
  }).current;

  const { detectFaces, stopListeners } = useFaceDetector(faceDetectionOptions);
  const { hasPermission } = useCameraPermission();
  const [facePosition, setFacePosition] = useState<facePosition[]>([]);
  const { favourite } = useFavourite();

  useEffect(() => {
    (async () => {
      await Camera.requestCameraPermission();
    })();
    return () => stopListeners();
  }, [stopListeners]);

  const handleDetectedFaces = Worklets.createRunOnJS((faces: Face[]) => {
    if (faces.length > 0) {
      console.log('face detected: ', Date.now());
      const positions = faces.map((f) => {
        const faceWidth = f.bounds.width;
        const pokemonSize = faceWidth * 1;

        let centerX = f.bounds.x + f.bounds.width / 2;
        let centerY = f.bounds.y + f.bounds.height / 2;

        let finalX = centerX;
        let finalY = centerY - f.bounds.height * 0.7;

        return {
          x: finalX,
          y: finalY,
          roll: f.rollAngle,
          yaw: f.yawAngle,
          pitch: f.pitchAngle,
          trackingId: f.trackingId,
          size: pokemonSize,
        };
      });
      setFacePosition(positions);
    } else {
      setFacePosition([]);
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
      {!favourite && (
        <View style={styles.header}>
          <Text style={styles.headerText}>
            select your favourite pokemon first
          </Text>
        </View>
      )}

      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive
        frameProcessor={frameProcessor}
        pixelFormat="yuv"
      />

      {facePosition.map((f) => (
        <View
          key={f.trackingId ?? `${f.x}-${f.y}`}
          style={[
            styles.faceDot,
            {
              width: f.size,
              height: f.size,
              left: f.x - f.size / 2,
              top: f.y - f.size / 2,
              transform: [{ rotate: `${f.roll}deg` }],
            },
          ]}
        >
          {favourite && (
            <Image
              style={styles.image}
              source={
                favourite?.image
                  ? { uri: favourite.image }
                  : {
                      uri: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Pokebola-pokeball-png-0.png',
                    }
              }
              resizeMode="contain"
            />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: '25%',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    textShadowColor: 'black',
    textShadowRadius: 1,
    textShadowOffset: {
      width: 2,
      height: 2,
    },
  },
  faceDot: {
    position: 'absolute',
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
