import { View, StyleSheet, Text, ScrollView } from 'react-native';
import Button from '../components/Button';
import { useState } from "react";
import { getAdviceFromMistral } from '../ai';
import Markdown from 'react-native-markdown-display';

// Define mood types explicitly
type Mood = 'happy' | 'neutral' | 'sad';

export default function Index() {
  const [adviceShown, setAdviceShown] = useState<boolean>(false);
  const [adviceText, setAdviceText] = useState<string>('');

  async function getAdvice(mood: Mood) {
    try {
      const generatedAdvice = await getAdviceFromMistral(mood);
      if (generatedAdvice) {
        console.log(generatedAdvice);
        setAdviceText(generatedAdvice);
        setAdviceShown(true);
      }
    } catch (error) {
      console.error("Error fetching advice:", error);
    }
  }

  function resetAdvice(): void {
    setAdviceText('');
    setAdviceShown(false);
  }

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled" // Ensures buttons are clickable
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          Select how you're feeling right now
        </Text>
      </View>

      <View style={styles.moodContainer}>
        <Button onPress={() => getAdvice('happy')} mood="happy" />
        <Button onPress={() => getAdvice('neutral')} mood="neutral" />
        <Button onPress={() => getAdvice('sad')} mood="sad" />
      </View>

      {adviceShown && (
        <View style={styles.adviceContainer}>
          <Markdown style={markdownStyles}>{adviceText}</Markdown>
        </View>
      )}

      {adviceShown && (
        <View style={styles.selectAgainContainer}>
          <Button
            onPress={resetAdvice}
            mood="neutral"
            label="Select Again"
            customStyle={styles.selectAgainButton}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: 'rgb(30, 40, 50)',
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50, // Prevents content from being cut off at the bottom
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
    padding: 20,
    gap: 10,
  },
  titleContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    color: '#fff',
  },
  adviceContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  selectAgainContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  selectAgainButton: {
    backgroundColor: 'rgb(35, 45, 55)',
    borderRadius: 20,
    minWidth: 100,
    maxHeight: 70,
  },
});

const markdownStyles = {
  text: { color: '#fff', fontSize: 18 },
  strong: { fontWeight: 'bold', color: '#FFD700' },
  list_item: { color: '#fff', fontSize: 16 },
};
