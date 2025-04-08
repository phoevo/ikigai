import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
} from 'react-native-reanimated';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const HeartAnimation: React.FC = () => {
  const scale = useSharedValue(1); // Shared value to control the scale
  const [breathe, setBreathe] = useState<string>("Inhale...");

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    const startAnimation = () => {
      setBreathe("Inhale...");
      setTimeout(() => {
        setBreathe("Hold...");
        setTimeout(() => {
          setBreathe("Exhale...");
          setTimeout(() => {
            startAnimation(); // Restart the animation
          }, 3000); // Exhale for 3 seconds
        }, 2000); // Hold for 2 seconds
      }, 3000); // Inhale for 3 seconds
    };

    scale.value = withRepeat(
      withSequence(
        withTiming(2, { duration: 3000, easing: Easing.ease }),  // Expand (3 sec)
        withDelay(2000, withTiming(2, { duration: 0 })), // Hold (2 sec)
        withTiming(1, { duration: 3000, easing: Easing.ease }) // Shrink (3 sec)
      ),
      -1, // Infinite loop
      false // Do not reverse automatically, we control the sequence manually
    );

    startAnimation(); // Start the animation immediately

    return () => {
      // Cleanup if necessary
    };
  }, []);

  return (
    <View style={{width: 380, height: 380}}>
    <View style={styles.container}>
      <Animated.View style={heartStyle}>
        <FontAwesomeIcon icon={faHeart} size={100} color="red" />
      </Animated.View>
      <Text style={styles.breatheText}>{breathe}</Text>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "purple",
    position: "relative",
    height: 380,
    width: 380,
    maxWidth: 800,
    overflow: "hidden",
    borderRadius: 12,
  },
  breatheText: {
    marginTop: 35,
    fontSize: 30,
    color: "white",
  },
});

export default HeartAnimation;
