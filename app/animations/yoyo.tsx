import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

export default function YoyoBreathing() {
  const MAX_HEIGHT = 250;
  const CIRCLE_SIZE = 50;

  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Animate translateY (up and down) and scale (breathing)
    translateY.value = withRepeat(
      withTiming(MAX_HEIGHT, {
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    scale.value = withRepeat(
      withTiming(1.5, {
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const lineStyle = useAnimatedStyle(() => ({
    height: translateY.value + CIRCLE_SIZE / 2,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.lineContainer}>
        {/* String */}
        <Animated.View style={[styles.line, lineStyle]} />

        {/* Circle (Yoyo) */}
        <Animated.View
          style={[styles.circle, { width: CIRCLE_SIZE, height: CIRCLE_SIZE }, circleStyle]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 380,
    width: 380,
    backgroundColor: "#eef2ff",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 12,
  },
  lineContainer: {
    alignItems: "center",
    position: "relative",
  },
  line: {
    position: "absolute",
    width: 2,
    backgroundColor: "#94a3b8",
    top: 0,
  },
  circle: {
    backgroundColor: "#6366f1",
    borderRadius: 100, // Fully round
    position: "absolute",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5, // Android shadow
  },
});
