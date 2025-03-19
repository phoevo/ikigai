import { View, Pressable, StyleSheet, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faFaceLaughBeam,
  faFaceSmile,
  faFaceMeh,
  faFaceFrown,
  faFaceSadTear,
  faHeartCrack
} from "@fortawesome/free-solid-svg-icons";

type Mood = "reallyHappy" | "happy" | "neutral" | "sad" | "reallySad" | "bully";
type Variant = "mood" | "context";

type Props = {
  mood: Mood;
  onPress: () => void;
  label?: string;
  customStyle?: object;
  variant?: Variant;
};

export default function MoodButton({ mood, onPress, label, customStyle, variant = "mood" }: Props) {
  const moodConfig: Record<Mood, { icon: any; color: string; label: string }> = {
    reallyHappy: { icon: faFaceLaughBeam, color: "#4CBB17", label: "Really Happy" }, // Gold
    happy: { icon: faFaceSmile, color: "#50C878", label: "Happy" }, // Green
    neutral: { icon: faFaceMeh, color: "#FFC107", label: "Neutral" }, // Yellow
    sad: { icon: faFaceFrown, color: "#FF5F1F", label: "Sad" }, // Red
    reallySad: { icon: faFaceSadTear, color: "#DC143C", label: "Really Sad" }, // Dark Red
    bully: { icon: faHeartCrack, color: "#D2042D", label: "Bullied" }, // Orange-Red
  };

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
        {label ? (
          <Text style={styles.buttonLabel}>{label}</Text>
        ) : (
          <FontAwesomeIcon icon={moodConfig[mood].icon} size={90} color={moodConfig[mood].color} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
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
