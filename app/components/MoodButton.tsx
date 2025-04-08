import { View, Pressable, StyleSheet, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faFaceSmile,
  faFaceMeh,
  faFaceFrown,
  faHeartCrack,
  faGhost,
  faTired,
  faFaceMehBlank
} from "@fortawesome/free-solid-svg-icons";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from "react-native-reanimated";
import { useEffect } from "react";

type Mood = "happy" | "neutral" | "sad" | "bully" | "tired" | "stressed" | "sore";
type Variant = "mood" | "context";

type Props = {
  mood?: Mood;
  onPress?: () => void;
  label?: string;
  customStyle?: object;
  variant?: Variant;
  renderDelay?: number; // New prop for render delay
};

export default function MoodButton({ mood, onPress, label, customStyle, variant = "mood", renderDelay = 0 }: Props) {
  const moodConfig: Record<Mood, { icon: any; color: string; label: string }> = {
    happy: { icon: faFaceSmile, color: "#40d63d", label: "Happy" },
    neutral: { icon: faFaceMeh, color: "#FFC107", label: "Neutral" },
    sad: { icon: faFaceFrown, color: "#FF5F1F", label: "Sad" },
    bully: { icon: faHeartCrack, color: "#D2042D", label: "Bullied" },
    tired: { icon: faGhost, color: "#c4c4c4", label: "Tired" },
    stressed: { icon: faTired, color: "#800080", label: "Stressed" },
    sore: { icon: faFaceMehBlank, color: "#FF0000", label: "Sore" },
  };

  const moodStyle = mood ? moodConfig[mood] : null;

  // Animation values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withDelay(renderDelay, withTiming(1, { duration: 500 }));
    scale.value = withDelay(renderDelay, withTiming(1, { duration: 500 }));
  }, [renderDelay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.buttonContainer, animatedStyle]}>
      <Pressable
        style={({ pressed }) => [
          variant === "mood" ? styles.moodButton : styles.contextButton,
          pressed && styles.pressedButton,
          customStyle,
        ]}
        onPress={onPress}
      >
        {label ? (
          <Text style={styles.buttonLabel}>{label}</Text>
        ) : moodStyle ? (
          <FontAwesomeIcon icon={moodStyle.icon} size={90} color={moodStyle.color} />
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  moodButton: {
    flex: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  contextButton: {
    flex: 1,
    borderRadius: 20,
    minWidth: 100,
    maxHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(245, 217, 11)",
  },
  pressedButton: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
  buttonLabel: {
    fontSize: 16,
    color: "black",
  },
});
