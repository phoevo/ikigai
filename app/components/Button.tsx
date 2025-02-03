import { StyleSheet, View, Pressable, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFaceSmile, faFaceMeh, faFaceFrown } from '@fortawesome/free-solid-svg-icons';

type Mood = 'happy' | 'neutral' | 'sad';

type Props = {
  mood: Mood;
  onPress: () => void;
  label?: string; // Optional label for "Select Again"
  customStyle?: object; // Accept custom style
};

export default function MoodButton({ mood, onPress, label, customStyle }: Props) {
  const moodConfig: Record<Mood, { icon: any; color: string; label: string }> = {
    happy: { icon: faFaceSmile, color: '#4CAF50', label: 'Happy' },
    neutral: { icon: faFaceMeh, color: '#FFC107', label: 'Neutral' },
    sad: { icon: faFaceFrown, color: '#F44336', label: 'Sad' },
  };

  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={[styles.button, { backgroundColor: moodConfig[mood].color }, customStyle]} // Apply customStyle if available
        onPress={onPress}>
        {label ? (
          <Text style={styles.buttonLabel}>{label}</Text> // If label is passed, render it
        ) : (
          <FontAwesomeIcon icon={moodConfig[mood].icon} size={90} color="white" />
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
  button: {
    flex: 1,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 16,
    color: 'white',
  },
});
