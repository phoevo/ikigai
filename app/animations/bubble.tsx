"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  withRepeat,
} from "react-native-reanimated"

const { width } = Dimensions.get("window")



export default function BubbleBreathingExercise() {
  const [phase, setPhase] = useState("inhale")
  const [count, setCount] = useState(0)

  // Breathing cycle timing (in seconds)
  const inhaleTime = 4
  const exhaleTime = 4

  // Animation shared values
  const progress = useSharedValue(0)
  const timerProgress = useSharedValue(0)
  const textOpacity = useSharedValue(0.7)
  const textScale = useSharedValue(0.98)

  // Shared values for decorative bubbles
  const bubblesRef = useRef(Array.from({ length: 8 }, (_, i) => i))
  const bubbleYValues = useRef(bubblesRef.current.map(() => useSharedValue(0)))
  const bubbleOpacityValues = useRef(bubblesRef.current.map(() => useSharedValue(0.1)))
  const bubbleScaleValues = useRef(bubblesRef.current.map(() => useSharedValue(0.3)))

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const bubblePropertiesRef = useRef(
    Array.from({ length: 8 }, () => ({
      size: 10 + Math.random() * 40, // Fixed size
      left: `${10 + Math.random() * 80}%`, // Fixed horizontal position
    }))
  );

  // Manage breathing phases
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      setPhase((prev) => {
        const newPhase = prev === "inhale" ? "exhale" : "inhale"
        if (newPhase === "inhale") {
          setCount((c) => c + 1)

          // Reset bubble animations
          bubbleYValues.current.forEach((bubbleY) => (bubbleY.value = 0))
          bubbleOpacityValues.current.forEach((bubbleOpacity) => (bubbleOpacity.value = 0.1))
          bubbleScaleValues.current.forEach((bubbleScale) => (bubbleScale.value = 0.3))
        }
        return newPhase
      })
    }, (phase === "inhale" ? inhaleTime : exhaleTime) * 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [phase])

  // Function to start text animations
  const startTextAnimation = () => {
  textOpacity.value = withTiming(1, {
    duration: (phase === "inhale" ? inhaleTime : exhaleTime) * 500,
  });

  textScale.value = withTiming(phase === "inhale" ? 1.1 : 0.9, {
    duration: (phase === "inhale" ? inhaleTime : exhaleTime) * 1000,
    easing: Easing.inOut(Easing.quad),
  });
};

  // Function to animate bubbles
  const animateBubble = (index: number, size: number, delay: number, duration: number) => {
    bubbleYValues.current[index].value = withDelay(
      delay,
      withTiming(-500 - size, { duration, easing: Easing.out(Easing.quad) }),
    )

    bubbleOpacityValues.current[index].value = withDelay(
      delay,
      withSequence(
        withTiming(0.8, { duration: duration * 0.7 }),
        withTiming(0, { duration: duration * 0.3 }),
      ),
    )

    bubbleScaleValues.current[index].value = withDelay(
      delay,
      withTiming(phase === "inhale" ? 1 : 1.2, { duration }),
    )
  }

  // Update animations when phase changes
  useEffect(() => {
    // Reset and start timer animation
    timerProgress.value = withTiming(1, {
      duration: (phase === "inhale" ? inhaleTime : exhaleTime) * 1000,
      easing: Easing.linear,
    })

    // Update bubble size animation
    progress.value = withTiming(phase === "inhale" ? 1 : 0, {
      duration: (phase === "inhale" ? inhaleTime : exhaleTime) * 1000,
      easing: Easing.inOut(Easing.quad),
    })

    startTextAnimation()

    bubblesRef.current.forEach((_, index) => {
      const size = 10 + Math.random() * 40
      const delay = Math.random() * (phase === "inhale" ? inhaleTime / 2 : 0) * 1000
      const duration = (phase === "inhale" ? inhaleTime : exhaleTime) * 1000 + Math.random() * 2000

      animateBubble(index, size, delay, duration)
    })
  }, [phase])

  // Animated styles
  const mainBubbleStyle = useAnimatedStyle(() => ({
    width: interpolate(progress.value, [0, 1], [60, 120]),
    height: interpolate(progress.value, [0, 1], [60, 120]),
    transform: [{ translateY: interpolate(progress.value, [0, 1], [0, -30]) }],
    opacity: phase === "exhale" ? interpolate(progress.value, [0, 1], [1, 1]) : 1,
  }))

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.instructionText, useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ scale: textScale.value }],
      }))]}>
        {phase === "inhale" ? "Inhale" : "Exhale"}
      </Animated.Text>

      <Text style={styles.cycleCounter}>Breath Cycle: {count}</Text>

      <View style={styles.bubbleContainer}>
        <Animated.View style={[styles.mainBubble, mainBubbleStyle]} />


        {bubblesRef.current.map((bubble, index) => {
        const { size, left } = bubblePropertiesRef.current[index];

        return (
          <Animated.View
            key={`${index}`} // Use index, not phase/count
            style={[
              styles.decorativeBubble,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                left: left,
              },
              useAnimatedStyle(() => ({
                transform: [
                  { translateY: bubbleYValues.current[index].value },
                  { scale: bubbleScaleValues.current[index].value },
                ],
                opacity: bubbleOpacityValues.current[index].value,
              })),
            ]}
          />
        );
      })}

      </View>

      <Text style={styles.guidanceText}>
        {phase === "inhale"
          ? "Watch the bubble grow as you breathe in..."
          : "Let your breath go as the bubbles float away..."}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: 380,
    width: 380,
    maxWidth: 800,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: "#65a8db",
  },
  instructionText: {
    position: "absolute",
    top: 40,
    color: "white",
    fontWeight: "bold",
    fontSize: 28,
    textAlign: "center",
    zIndex: 10,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cycleCounter: {
    position: "absolute",
    top: 90,
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bubbleContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "70%",
    overflow: "hidden",
  },
  mainBubble: {
    position: "absolute",
    bottom: "20%",
    left: "45%",
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    transform: [{ translateX: -30 }],
    zIndex: 5,
    shadowColor: "rgba(255, 255, 255, 0.5)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
  },
  decorativeBubble: {
    position: "absolute",
    bottom: -50,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    zIndex: 1,
    shadowColor: "rgba(255, 255, 255, 0.3)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  guidanceText: {
    position: "absolute",
    bottom: 20,
    color: "white",
    fontSize: 16,
    textAlign: "center",
    zIndex: 10,
    paddingHorizontal: 20,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
})
