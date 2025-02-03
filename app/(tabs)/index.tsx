import { View, StyleSheet, Text } from 'react-native';
import Button from '../components/Button';
import { useState } from "react";

// Define mood types explicitly
type Mood = 'happy' | 'neutral' | 'sad';

export default function Index() {
  const [adviceShown, setAdviceShown] = useState<boolean>(false); // Type for adviceShown
  const [adviceText, setAdviceText] = useState<string>(''); // Type for adviceText

  // Define function with typed mood argument
  function toggleAdviceShown(mood: Mood): void {
    setAdviceShown(true);

    switch (mood) {
      case 'happy':
        setAdviceText('Keep up the great work! Stay positive.');
        break;
      case 'neutral':
        setAdviceText('It’s okay to have neutral days. Take it easy.');
        break;
      case 'sad':
        setAdviceText('It’s okay to feel sad. Take some time to relax.');
        break;
      default:
        setAdviceText('');
    }
  }

  // Function to reset the advice
  function resetAdvice(): void {
    setAdviceText('');
    setAdviceShown(false);
  }

  return (
    <View style={styles.container}>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          Select how you're feeling right now
        </Text>
      </View>

      <View style={styles.moodContainer}>
        <Button onPress={() => toggleAdviceShown('happy')} mood="happy" />
        <Button onPress={() => toggleAdviceShown('neutral')} mood="neutral" />
        <Button onPress={() => toggleAdviceShown('sad')} mood="sad" />
      </View>

      {/* Display the advice text if shown */}
      <View style={styles.titleContainer}>
        {adviceShown && <Text style={styles.title}>{adviceText}</Text>}
      </View>

      {/* Show the "Select Again" button after advice is shown */}
      {adviceShown && (
        <View style={styles.selectAgainContainer}>
          <Button
            onPress={resetAdvice}
            mood="neutral" // You can keep the mood here, but apply custom style below
            label="Select Again" // Add label to the Button
            customStyle={styles.selectAgainButton} // Pass custom style for the "Select Again" button
          />
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  moodContainer: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
    padding: 20,
    gap: 10,
  },
  container: {
    flex: 1,
    display:"flex",
    backgroundColor: 'rgb(30, 40, 50)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    marginTop: 0,
    marginBottom: 0,
  },
  title: {
    fontSize: 24,
    color: '#fff',
  },
  selectAgainContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20, // Add some margin to space out the button
    width: '100%',  // Ensures the container takes up the full width
    alignSelf: 'center', // Centers the container horizontally
  },
  selectAgainButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: 'rgb(35, 45, 55)',
    borderRadius: 20,
    minWidth: 100,
    maxHeight:70,
  },

});
