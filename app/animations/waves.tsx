import React, { useEffect } from "react"
import { View, StyleSheet } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated"

export default function WaveAnimation() {
  // Wave dimensions
  const WAVE_WIDTH = 300
  const WAVE_HEIGHT = 20
  const AMPLITUDE = 30 // Height of the wave oscillation
  const NUM_POINTS = 10 // Number of points to create the wave

  // Horizontal position for the wave
  const waveOffset = useSharedValue(0)

  // Animated styles for the wave
  const waveStyle = useAnimatedStyle(() => ({
    width: WAVE_WIDTH,
    height: WAVE_HEIGHT,
    position: "absolute",
    bottom: 100, // Adjust vertical position of the wave
    flexDirection: "row",
    justifyContent: "space-between",
  }))

  const pointStyles = Array(NUM_POINTS)
    .fill(null)
    .map((_, index) => {
      const pointOffset = useSharedValue(index * (WAVE_WIDTH / NUM_POINTS))

      const pointStyle = useAnimatedStyle(() => {
        // Interpolate the wave position (sinusoidal motion) for each point
        const y = interpolate(
          waveOffset.value + pointOffset.value,
          [0, WAVE_WIDTH],
          [0, Math.PI * 2],
        )
        const waveY = Math.sin(y) * AMPLITUDE
        return {
          transform: [{ translateY: waveY }],
        }
      })

      return pointStyle
    })

  // Animate the wave
  useEffect(() => {
    // Animate waveOffset for the horizontal movement
    waveOffset.value = withRepeat(
      withTiming(WAVE_WIDTH, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      () => {
        waveOffset.value = 1 // Reset after completing one cycle
      }
    )
  }, [])

  return (
    <View style={styles.container}>
      <Animated.View style={waveStyle}>
        {pointStyles.map((pointStyle, index) => (
          <Animated.View
            key={index}
            style={[styles.wavePoint, pointStyle]}
          />
        ))}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  wavePoint: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3498db", // Wave color
  },
})
