import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

export default function YoyoAnimation() {
  const YoyoHeight = 250; // Maximum height of the yoyo's movement
  const CIRCLE_SIZE = 40;


  // Shared value for the vertical position of the yoyo
  const translateY = useSharedValue(0);

  useEffect(() => {
    // Start the animation with repeat to simulate yoyo movement up and down
    translateY.value = withRepeat(
      withTiming(YoyoHeight, { duration: 1000, easing: Easing.ease }), // Move to top
      -1, // Repeat infinitely
      true // Reverse direction to go down
    );
  }, []);

  // Animated style for the circle
  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Animated style for the string (line)
  const lineStyle = useAnimatedStyle(() => ({
    height: translateY.value + YoyoHeight, // Length of the string adjusts based on yoyo's position
  }));

  return (
    <View style={styles.container}>
      <View style={styles.lineContainer}>
        {/* The string of the yoyo */}
        <Animated.View style={[styles.line, lineStyle]} />

        {/* The yoyo circle */}
        <Animated.View
          style={[styles.circle, { width: CIRCLE_SIZE, height: CIRCLE_SIZE }, circleStyle]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  lineContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  line: {
    position: "absolute",
    width: 2,
    backgroundColor: "#000",
  },
  circle: {
    backgroundColor: "#6366f1",
    borderRadius: 15,
    position: "absolute", // Position the circle relative to the line
  },
});
