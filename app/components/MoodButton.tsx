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

type Mood = "happy" | "neutral" | "sad" | "bully" | "tired" | "stressed" | "sore";
type Variant = "mood" | "context";

type Props = {
  mood?: Mood;
  onPress: () => void;
  label?: string;
  customStyle?: object;
  variant?: Variant;
};

export default function MoodButton({ mood, onPress, label, customStyle, variant = "mood" }: Props) {
  const moodConfig: Record<Mood, { icon: any; color: string; label: string }> = {
    happy: { icon: faFaceSmile, color: "#50C878", label: "Happy" },
    neutral: { icon: faFaceMeh, color: "#FFC107", label: "Neutral" },
    sad: { icon: faFaceFrown, color: "#FF5F1F", label: "Sad" },
    bully: { icon: faHeartCrack, color: "#D2042D", label: "Bullied" },
    tired: { icon: faGhost, color: "#828282", label: "Tired" },
    stressed: { icon: faTired, color: "#800080", label: "Stressed" },
    sore: { icon: faFaceMehBlank, color: "#FF0000", label: "Sore" },
  };

  // Get mood styles safely
  const moodStyle = mood ? moodConfig[mood] : null;

  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={({ pressed }) => [
          variant === "mood" ? styles.moodButton : styles.contextButton,
          pressed && styles.pressedButton,
          customStyle,
        ]}
        onPress={onPress}
      >
        {/* If there's a label, show it. Otherwise, show the mood icon (if available) */}
        {label ? (
          <Text style={styles.buttonLabel}>{label}</Text>
        ) : moodStyle ? (
          <FontAwesomeIcon icon={moodStyle.icon} size={90} color={moodStyle.color} />
        ) : null}
      </Pressable>

    </View>
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
    backgroundColor: "rgb(50, 60, 70)", // Keep context button style
  },
  pressedButton: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
  buttonLabel: {
    fontSize: 16,
    color: "white",
  },
});
