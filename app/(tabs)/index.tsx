import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';
import Button from '../components/MoodButton';
import { useState } from "react";
import { getAdviceFromClaude } from '../ai';
import Markdown from 'react-native-markdown-display';

// Define types
type Mood = "reallyHappy" | "happy" | "neutral" | "sad" | "reallySad" | "bully";
type Context = 'work' | 'home' | 'outside' | 'school' | null;
type AloneOrWithPeople = 'alone' | 'with_people' | null;
type SchoolRole = 'student' | 'teacher' | null;

export default function Index() {
  const [adviceShown, setAdviceShown] = useState(false);
  const [adviceText, setAdviceText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedContext, setSelectedContext] = useState<Context>(null);
  const [selectedCompany, setSelectedCompany] = useState<AloneOrWithPeople>(null);
  const [selectedSchoolRole, setSelectedSchoolRole] = useState<SchoolRole>(null);
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([]);
  const [results, setResults] = useState<{
    totalMoods: number;
    moodCounts: Record<Mood, number>;
    neutralPercentage: string;
    sadPercentage: string;
    reallySadPercentage: string;
    bullyPercentage: string;
  } | null>(null);

  async function getAdvice(mood: Mood) {
    console.log("Mood selected:", mood);
    console.log("Current context:", selectedContext);
    console.log("Current school role:", selectedSchoolRole);

    if (selectedContext === "school" && selectedSchoolRole === "teacher") {
      console.log("Adding mood to the list for later analysis...");
      setSelectedMoods((prevMoods) => [...prevMoods, mood]);
      return;
    }

    console.log("Fetching advice from AI...");
    setLoading(true);
    try {
      const generatedAdvice = await getAdviceFromClaude(mood, selectedContext, selectedCompany, selectedSchoolRole);
      if (generatedAdvice) {
        console.log("AI Response:", generatedAdvice);
        setAdviceText(generatedAdvice);
        setAdviceShown(true);
      }
    } catch (error) {
      console.error("Error fetching advice:", error);
    } finally {
      setLoading(false);
    }
  }

  function resetAdvice(): void {
    console.log("Resetting selections...");
    setAdviceText('');
    setAdviceShown(false);
    setSelectedContext(null);
    setSelectedCompany(null);
    setSelectedSchoolRole(null);
    setSelectedMoods([]);
  }

  function finishSelection() {
    console.log("Finishing selection...");

    // Count occurrences of each mood
    const moodCounts = selectedMoods.reduce((acc, mood) => {
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as Record<Mood, number>);

    const totalMoods = selectedMoods.length;
    const neutralCount = moodCounts["neutral"] || 0;
    const sadCount = moodCounts["sad"] || 0;
    const reallySadCount = moodCounts["reallySad"] || 0;
    const bullyCount = moodCounts["bully"] || 0;

    // Calculate percentages
    const neutralPercentage = totalMoods ? ((neutralCount / totalMoods) * 100).toFixed(2) : "0";
    const sadPercentage = totalMoods ? ((sadCount / totalMoods) * 100).toFixed(2) : "0";
    const reallySadPercentage = totalMoods ? ((reallySadCount / totalMoods) * 100).toFixed(2) : "0";
    const bullyPercentage = totalMoods ? ((bullyCount / totalMoods) * 100).toFixed(2) : "0";

    console.log("Total moods selected:", totalMoods);
    console.log("Mood counts:", moodCounts);
    console.log("Neutral %:", neutralPercentage);
    console.log("Sad %:", sadPercentage);
    console.log("Really Sad %:", reallySadPercentage);
    console.log("Bully %:", bullyPercentage);

    setResults({
      totalMoods,
      moodCounts,
      neutralPercentage,
      sadPercentage,
      reallySadPercentage,
      bullyPercentage,
    });
  }


  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Where are you?</Text>
      </View>

      <View style={styles.contextContainer}>
        {['work', 'home', 'outside', 'school'].map((context) => (
          <Button
            key={context}
            onPress={() => {
              console.log("Context selected:", context);
              setSelectedContext(context as Context);
              setSelectedSchoolRole(null);
              setSelectedMoods([]);
              setSelectedCompany(null);
            }}
            mood="neutral"
            label={context.replace('_', ' ')}
            variant='context'
            customStyle={[
              styles.contextButton,
              selectedContext === context && styles.selectedContextButton,
            ]}
          />
        ))}
      </View>

      {/* Show role selection only if "school" is selected */}
      {selectedContext === 'school' && (
        <>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Are you a student or teacher?</Text>
          </View>

          <View style={styles.contextContainer}>
            {['student', 'teacher'].map((role) => (
              <Button
                key={role}
                onPress={() => {
                  console.log("School role selected:", role);
                  setSelectedSchoolRole(role as SchoolRole);
                }}
                mood="neutral"
                label={role.replace('_', ' ')}
                customStyle={[
                  styles.contextButton,
                  selectedSchoolRole === role && styles.selectedContextButton,
                ]}
              />
            ))}
          </View>
        </>
      )}

      {/* Show AloneOrWithPeople only for "work", "home", or "outside" contexts */}
      {['work', 'home', 'outside'].includes(selectedContext as string) && (
        <>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Are you alone or with people?</Text>
          </View>

          <View style={styles.contextContainer}>
            {['alone', 'with_people'].map((company) => (
              <Button
                key={company}
                onPress={() => {
                  console.log("Company selected:", company);
                  setSelectedCompany(company as AloneOrWithPeople);
                }}
                mood="neutral"
                label={company === 'alone' ? 'Alone' : 'With People'}
                customStyle={[
                  styles.contextButton,
                  selectedCompany === company && styles.selectedContextButton,
                ]}
              />
            ))}
          </View>
        </>
      )}

      {/* Show mood buttons only if AloneOrWithPeople is selected for work/home/outside */}
      {selectedCompany !== null && selectedContext !== "school" && (
        <>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Select how you're feeling</Text>
          </View>

          <View style={styles.moodContainer}>
            <Button onPress={() => getAdvice('reallyHappy')} mood="reallyHappy" />
            <Button onPress={() => getAdvice('happy')} mood="happy" />
            <Button onPress={() => getAdvice('neutral')} mood="neutral" />
            <Button onPress={() => getAdvice('sad')} mood="sad" />
            <Button onPress={() => getAdvice('reallySad')} mood="reallySad" />
            <Button onPress={() => getAdvice('bully')} mood="bully" />
          </View>
        </>
      )}

      {/* Show mood buttons for school roles */}
      {selectedContext === "school" && selectedSchoolRole && (
        <>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Select how you're feeling</Text>
          </View>
          <View style={styles.moodContainer}>
            <Button onPress={() => getAdvice('reallyHappy')} mood="reallyHappy" />
            <Button onPress={() => getAdvice('happy')} mood="happy" />
            <Button onPress={() => getAdvice('neutral')} mood="neutral" />
            <Button onPress={() => getAdvice('sad')} mood="sad" />
            <Button onPress={() => getAdvice('reallySad')} mood="reallySad" />
            <Button onPress={() => getAdvice('bully')} mood="bully"/>
          </View>
        </>
      )}

      {/* Display selected moods if School > Teacher */}
      {selectedContext === "school" && selectedSchoolRole === "teacher" && selectedMoods.length > 0 && (
        <View style={styles.moodsContainer}>
          <Text style={styles.title}>Selected Moods (Teacher):</Text>
          <View style={styles.selectedMoodsList}>
            {selectedMoods.map((mood, index) => (
              <Text key={index} style={styles.moodText}> {mood.replace(/([A-Z])/g, ' $1').trim()}</Text>
            ))}
          </View>
        </View>
      )}

      {/* Display "Finish Selection" button after two moods are added */}
      {selectedContext === "school" && selectedSchoolRole === "teacher" && selectedMoods.length >= 2 && (
        <View style={styles.finishButtonContainer}>
          <Button onPress={finishSelection} mood="neutral" label="Finish Selection" customStyle={styles.finishButton} />
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : (
        adviceShown && (
          <View style={styles.adviceContainer}>
            <Markdown style={markdownStyles}>{adviceText}</Markdown>
          </View>
        )
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
      {results && (
  <View style={styles.resultsContainer}>
    <Text style={styles.title}>Selection Results:</Text>
    <Text style={styles.resultText}>Total Moods Selected: {results.totalMoods}</Text>
    {Object.entries(results.moodCounts).map(([mood, count]) => (
      <Text key={mood} style={styles.resultText}>
        {mood.replace(/([A-Z])/g, ' $1').trim()}: {count}
      </Text>
    ))}
    <Text style={styles.resultText}>Neutral: {results.neutralPercentage}%</Text>
    <Text style={styles.resultText}>Sad: {results.sadPercentage}%</Text>
    <Text style={styles.resultText}>Really Sad: {results.reallySadPercentage}%</Text>
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
    paddingBottom: 50,
  },
  titleContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    color: '#fff',
  },
  contextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "center",
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  moodsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  selectedMoodsList: {
    marginTop: 10,
    alignItems: 'center',
  },
  moodText: {
    fontSize: 18,
    color: '#FFD700',
  },
  loadingContainer: {
    marginTop: 20,
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
  contextButton: {
    backgroundColor: 'rgb(50, 60, 70)',
    borderRadius: 20,
    minWidth: 100,
    maxHeight: 50,
  },
  selectedContextButton: {
    backgroundColor: 'rgb(80, 100, 120)',
  },
  finishButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  finishButton: {
    backgroundColor: 'rgb(70, 90, 110)',
    borderRadius: 20,
    minWidth: 200,
    maxHeight: 50,
  },
  resultsContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgb(40, 50, 60)',
    borderRadius: 10,
  },
  resultText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },

});

const markdownStyles = {
  text: { color: '#fff', fontSize: 18 },
  strong: { fontSize: 20, color: '#FFD700' },
  list_item: { color: '#fff', fontSize: 16 },
};
