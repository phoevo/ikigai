import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';
import Button from '../components/MoodButton';
import { useState } from "react";
import { getAdviceFromClaude, getCoachAdviceFromClaude } from '../ai';
import { getTeacherAdviceFromClaude } from '../ai';
import Markdown from 'react-native-markdown-display';
import { useRef } from 'react';
import MoodButton from '../components/MoodButton';
import Square from '../animations/square';
import SquareSpin from '../animations/squareSpin';
import Yoyo from '../animations/yoyo';
import Waves from '../animations/waves';
import HeartAnimation from '../animations/heart';
import BubbleBreathingExercise from '../animations/bubble';
import IntroScreen from '../components/Intro';


// Define types
type Mood = "happy" | "neutral" | "sad" | "bully" | "tired" | "stressed" | "sore";
type Context = 'work' | 'home' | 'outside' | 'school' | "training" | null;
type AloneOrWithPeople = 'alone' | 'with_people' | null;
type SchoolRole = 'student' | 'teacher' | null;
type TrainingRole = "athlete" | "coach" | null;




export default function Index() {
  const [adviceShown, setAdviceShown] = useState(false);
  const [adviceText, setAdviceText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedContext, setSelectedContext] = useState<Context>(null);
  const [selectedCompany, setSelectedCompany] = useState<AloneOrWithPeople>(null);
  const [selectedSchoolRole, setSelectedSchoolRole] = useState<SchoolRole>(null);
  const [selectedTrainingRole, setSelectedTrainingRole] = useState<TrainingRole>(null);
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([]);
  const [results, setResults] = useState<{
    totalMoods: number;
    moodCounts: Record<Mood, number>;
    happyPercentage: string;
    neutralPercentage: string;
    sadPercentage: string;
    bullyPercentage: string;
    tiredPercentage: string;
    stressedPercentage: string;
    sorePercentage: string;
  } | null>(null);
  const [moodCounter, setMoodCounter] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [viewAnimations, setViewAnimations] = useState(false);
  const [viewBubble, setViewBubble] = useState(false);
  const [viewHeart, setViewHeart] = useState(false);
  const [viewSquare, setViewSquare] = useState(false);






  async function getAdvice(mood: Mood) {
    console.log("Mood selected:", mood);
    console.log("Current context:", selectedContext);
    console.log("Current school role:", selectedSchoolRole);

    if (selectedContext === "school" && selectedSchoolRole === "teacher" ||
      selectedContext === "training" && selectedTrainingRole === "coach") {
      console.log("Adding mood to the list for later analysis...");
      setSelectedMoods((prevMoods) => [...prevMoods, mood]);
      setMoodCounter((prevCount) => prevCount + 1);
      return;
    }

    console.log("Fetching advice from AI...");
    setLoading(true);
    try {
      const generatedAdvice = await getAdviceFromClaude(mood, selectedContext, selectedCompany, selectedSchoolRole, selectedTrainingRole);
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
    setSelectedTrainingRole(null);
    setSelectedMoods([]);
    setResults(null);
    setMoodCounter(0);
  }


  const handleScrollDown = () => {
    console.log("Scrolled");
    setTimeout(() => {
      if (!scrollViewRef.current) {
        console.log("No ScrollView");
        return;
      }
      scrollViewRef.current.scrollToEnd({ animated: true });
    }, 100);
  };

  async function finishSelection() {
    console.log("Finishing selection...");

    // Count occurrences of each mood
    const moodCounts = selectedMoods.reduce((acc, mood) => {
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as Record<Mood, number>);

    const totalMoods = selectedMoods.length;
    const happyCount = moodCounts["happy"] || 0;
    const neutralCount = moodCounts["neutral"] || 0;
    const sadCount = moodCounts["sad"] || 0;
    const bullyCount = moodCounts["bully"] || 0;
    const tiredCount = moodCounts["tired"] || 0;
    const stressedCount = moodCounts["stressed"] || 0;
    const soreCount = moodCounts["sore"] || 0;

    // Calculate percentages
    const happyPercentage = totalMoods ? ((happyCount / totalMoods) * 100).toFixed(2) : "0";
    const neutralPercentage = totalMoods ? ((neutralCount / totalMoods) * 100).toFixed(2) : "0";
    const sadPercentage = totalMoods ? ((sadCount / totalMoods) * 100).toFixed(2) : "0";
    const bullyPercentage = totalMoods ? ((bullyCount / totalMoods) * 100).toFixed(2) : "0";
    const tiredPercentage = totalMoods ? ((tiredCount / totalMoods) * 100).toFixed(2) : "0";
    const stressedPercentage = totalMoods ? ((stressedCount / totalMoods) * 100).toFixed(2) : "0";
    const sorePercentage = totalMoods ? ((soreCount / totalMoods) * 100).toFixed(2) : "0";


    // Display results and allow for further analysis
    setResults({
      totalMoods,
      moodCounts,
      happyPercentage,
      neutralPercentage,
      sadPercentage,
      bullyPercentage,
      tiredPercentage,
      stressedPercentage,
      sorePercentage
    });
  }


  async function furtherAnalysis(){
    setLoading(true);
    try {
      const generatedAdvice = await getTeacherAdviceFromClaude(selectedMoods);
      if (generatedAdvice) {
        setAdviceText(generatedAdvice);
        setAdviceShown(true);
      }
    } catch (error) {
      console.error("Error fetching AI advice:", error);
    } finally {
      setLoading(false);
    }
  }

  async function furtherAnalysis2(){
    setLoading(true);
    try {
      const generatedAdvice = await getCoachAdviceFromClaude(selectedMoods);
      if (generatedAdvice) {
        setAdviceText(generatedAdvice);
        setAdviceShown(true);
      }
    } catch (error) {
      console.error("Error fetching AI advice:", error);
    } finally {
      setLoading(false);
    }
  }

  function selectAnimations() {
    setViewAnimations(prevView => !prevView)
    console.log(viewAnimations);
  }

  console.log(viewAnimations);

  function displayBubble(){
    setViewBubble(prevView => !prevView)
  }

  function displayHeart(){
    setViewHeart(prevView => !prevView)
  }

  function displaySquare(){
    setViewSquare(prevView => !prevView)
  }

  const [showIntro, setShowIntro] = useState(true);

  const buttonColors: string[] = ['#fd4949', '#40d63d', '#444cf6', '#ff9741', '#ca3bff'];

  return showIntro ? (
    <IntroScreen onFinish={() => setShowIntro(false)} />
  ) : (
    <ScrollView
      ref={scrollViewRef}
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Where are you?</Text>
      </View>

      <View style={styles.contextContainer}>
        {['work', 'home', 'outside', 'school', 'training'].map((context, index) => (
          <Button
            key={context}
            onPress={() => {
              console.log('Context selected:', context);
              setSelectedContext(context as Context);
              setSelectedSchoolRole(null);
              setSelectedTrainingRole(null);
              setSelectedMoods([]);
              setSelectedCompany(null);
            }}
            mood="neutral"
            label={context}
            variant="context"
            renderDelay={500}
            customStyle={[
              styles.contextButton,
              selectedContext === context && styles.selectedContextButton,
              { backgroundColor: buttonColors[index] }, // Dynamically assigning color using index
            ]}
          />
        ))}
      </View>


      {/* <Button
          onPress={selectAnimations}
          mood='neutral'
          label={viewAnimations ? 'Hide Exercises' : "Breathing Exercises"}
          customStyle={styles.selectAgainButton}
          renderDelay={1000}
          /> */}

      {viewAnimations && (<View style={styles.animationDisplay}>
        <Button label='Bubbles'
        customStyle={styles.contextButton}
        onPress={displayBubble}/>
        {viewBubble && <BubbleBreathingExercise/>}

        <Button label='Heart'
        customStyle={styles.contextButton}
        onPress={displayHeart}/>
        {viewHeart && <HeartAnimation/>}

        <Button label='Square'
        customStyle={styles.contextButton}
        onPress={displaySquare}/>
        {viewSquare && <Square/>}

        </View>)}







      {/* Show role selection only if "school" is selected */}
      {selectedContext === 'school' && (
         //<ScrollView ref={scrollViewRef} style={styles.scrollContainer}>
         <>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Are you a student or a teacher?</Text>
          </View>



          <View style={styles.contextContainer}>
          <View style={styles.contextContainer}>
      <Button
        onPress={() => {
          console.log("School role selected: student");
          setSelectedSchoolRole("student");
        }}
        label='Student'
        renderDelay={0}
        customStyle={[
          styles.contextButton,
          selectedSchoolRole === "student" && styles.selectedContextButton,
          ]}
        ></Button>

  <Button
    onPress={() => {
      handleScrollDown()
      setSelectedSchoolRole("teacher")
    }}
    mood="neutral"
    label="Teacher"
    renderDelay={100}
    customStyle={[
      styles.contextButton,
      selectedSchoolRole === "teacher" && styles.selectedContextButton,
    ]}
      />
      </View>
          </View>
      {/* </ScrollView> */}
        </>
      )}

{selectedContext === 'training' && (
        <>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Are you an athlete or a coach?</Text>
          </View>

          <View style={styles.contextContainer}>
          <View style={styles.contextContainer}>
      <Button
        onPress={() => {
          console.log("Training role selected: Athlete");
          setSelectedTrainingRole("athlete");
        }}
        label='Athlete'
        renderDelay={0}
        customStyle={[
          styles.contextButton,
          selectedTrainingRole === "athlete" && styles.selectedContextButton,
          ]}
        ></Button>

  <Button
    onPress={() => {
      console.log("Training role selected: coach");
      setSelectedTrainingRole("coach");
    }}
    mood="neutral"
    label="Coach"
    renderDelay={100}
    customStyle={[
      styles.contextButton,
      selectedTrainingRole === "coach" && styles.selectedContextButton,
    ]}
  />
</View>
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
  <Button
    onPress={() => {
      console.log("Company selected: alone");
      setSelectedCompany("alone");
    }}
    mood="neutral"
    label="Alone"
    renderDelay={0}
    customStyle={[
      styles.contextButton,
      selectedCompany === "alone" && styles.selectedContextButton,
    ]}
  />

  <Button
    onPress={() => {
      console.log("Company selected: with_people");
      setSelectedCompany("with_people");
    }}
    mood="neutral"
    label="With People"
    renderDelay={100}
    customStyle={[
      styles.contextButton,
      selectedCompany === "with_people" && styles.selectedContextButton,
    ]}
  />
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

            <View style={styles.moodsContainer}>
              <Button onPress={() => getAdvice('happy')} mood="happy" renderDelay={0} />
              <Text style={{color:"white"}}>Happy</Text>
            </View>
            <View style={styles.moodsContainer}>
              <Button onPress={() => getAdvice('neutral')} mood="neutral" renderDelay={50} />
              <Text style={{color:"white"}}>Neutral</Text>
            </View>
            <View style={styles.moodsContainer}>
              <Button onPress={() => getAdvice('sad')} mood="sad" renderDelay={100} />
              <Text style={{color:"white"}}>Sad</Text>
            </View>
            <View style={styles.moodsContainer}>
              <Button onPress={() => getAdvice('bully')} mood="bully" renderDelay={150} />
              <Text style={{color:"white"}}>Bullied</Text>
            </View>
            <View style={styles.moodsContainer}>
              <Button onPress={() => getAdvice('tired')} mood="tired" renderDelay={200} />
              <Text style={{color:"white"}}>Tired</Text>
            </View>
            <View style={styles.moodsContainer}>
              <Button onPress={() => getAdvice('stressed')} mood="stressed" renderDelay={250} />
              <Text style={{color:"white"}}>Stressed</Text>
            </View>

          </View>
        </>
      )}

      {/* Show mood buttons for school or training roles */}
      {((selectedContext === "school" && selectedSchoolRole) ||
      (selectedContext === "training" && selectedTrainingRole)) && (
        <>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Select how you're feeling</Text>
          </View>
          <View style={styles.moodContainer}>
            <View style={styles.moodsContainer}>
              <Button onPress={() => getAdvice('happy')} mood="happy" renderDelay={0} />
              <Text style={{color:"white"}}>Happy</Text>
            </View>
            <View style={styles.moodsContainer}>
              <Button onPress={() => getAdvice('neutral')} mood="neutral" renderDelay={50} />
              <Text style={{color:"white"}}>Neutral</Text>
            </View>
            <View style={styles.moodsContainer}>
              <Button onPress={() => getAdvice('sad')} mood="sad" renderDelay={100} />
              <Text style={{color:"white"}}>Sad</Text>
            </View>

            {selectedContext === "school" && selectedSchoolRole && (
              <>
            <View style={styles.moodsContainer}>
              <Button onPress={() => getAdvice('bully')} mood="bully" renderDelay={150} />
              <Text style={{color:"white"}}>Bullied</Text>
            </View>
            <View style={styles.moodsContainer}>
              <Button onPress={() => getAdvice('tired')} mood="tired" renderDelay={200} />
              <Text style={{color:"white"}}>Tired</Text>
            </View>
            <View style={styles.moodsContainer}>
              <Button onPress={() => getAdvice('stressed')} mood="stressed" renderDelay={250} />
              <Text style={{color:"white"}}>Stressed</Text>
            </View>
            </>
            )}

            {selectedContext === "training" && selectedTrainingRole && (
               <>
               <View style={styles.moodsContainer}>
                 <Button onPress={() => getAdvice('sore')} mood="sore" renderDelay={150} />
                 <Text style={{color:"white"}}>Sore</Text>
               </View>
               <View style={styles.moodsContainer}>
                 <Button onPress={() => getAdvice('tired')} mood="tired" renderDelay={200} />
                 <Text style={{color:"white"}}>Tired</Text>
               </View>
               <View style={styles.moodsContainer}>
                 <Button onPress={() => getAdvice('stressed')} mood="stressed" renderDelay={250} />
                 <Text style={{color:"white"}}>Stressed</Text>
               </View>
               </>
            )}


          </View>
        </>
      )}

      {/* Display selected moods if School > Teacher */}
      {((selectedContext === "school" && selectedSchoolRole === "teacher") ||
      (selectedContext === "training" && selectedTrainingRole === "coach")) && selectedMoods.length > 0 && (
        <>

        <View style={styles.moodsContainer}>
          <Text style={styles.title}>Selected Moods:
          <Text style={styles.selectedMoodsList}>{moodCounter}</Text>
          </Text>
          <View>


          </View>
        </View>
        </>
      )}



      {((selectedContext === "school" && selectedSchoolRole === "teacher") ||
      (selectedContext === "training" && selectedTrainingRole === "coach")) && selectedMoods.length >= 2 && (
        <>
        <View style={styles.finishButtonContainer}>
          <Button onPress={finishSelection} label="Finish Selection" customStyle={styles.finishButton} />
        </View>
        {handleScrollDown()}
        </>
      )}


     {results && (
  <View style={styles.mainResults}>
  <View style={styles.resultsContainer}>
    <Text style={styles.resultsTitle}>Selection Results:</Text>
    <Text style={styles.resultsSubtitle}>Total Moods Selected: {results.totalMoods}</Text>

      <View style={styles.resultsCols}>

      <View style={styles.resultsCol1}>
  <Text style={styles.resultText}>Happy: {results.moodCounts.happy || 0}</Text>
  <Text style={styles.resultText}>Neutral: {results.moodCounts.neutral || 0}</Text>
  <Text style={styles.resultText}>Sad: {results.moodCounts.sad || 0}</Text>

  {selectedContext === "school" && selectedSchoolRole === "teacher" && (
    <>
  <Text style={styles.resultText}>Bullied: {results.moodCounts.bully || 0}</Text>
  <Text style={styles.resultText}>Tired: {results.moodCounts.tired || 0}</Text>
  <Text style={styles.resultText}>Stressed: {results.moodCounts.stressed || 0}</Text>
  </>
  )}

{selectedContext === "training" && selectedTrainingRole === "coach" && (
    <>
  <Text style={styles.resultText}>Sore: {results.moodCounts.sore || 0}</Text>
  <Text style={styles.resultText}>Tired: {results.moodCounts.tired || 0}</Text>
  <Text style={styles.resultText}>Stressed: {results.moodCounts.stressed || 0}</Text>
  </>
  )}

  </View>

    <View style={styles.resultsCol2}>
    <Text style={styles.resultText}>{results.happyPercentage}%</Text>
    <Text style={styles.resultText}>{results.neutralPercentage}%</Text>
    <Text style={styles.resultText}>{results.sadPercentage}%</Text>

    {selectedContext === "school" && selectedSchoolRole === "teacher" && (
      <>
    <Text style={styles.resultText}>{results.bullyPercentage}%</Text>
    <Text style={styles.resultText}>{results.tiredPercentage}%</Text>
    <Text style={styles.resultText}>{results.stressedPercentage}%</Text>
    </>
    )}

    {selectedContext === "training" && selectedTrainingRole === "coach" && (
      <>
    <Text style={styles.resultText}>{results.sorePercentage}%</Text>
    <Text style={styles.resultText}>{results.tiredPercentage}%</Text>
    <Text style={styles.resultText}>{results.stressedPercentage}%</Text>
    </>
    )}

    </View>
</View>


  </View>
  <View style={styles.finishButtonContainer}>
  <Button
  onPress={async () => {
    if (selectedContext === "school") {
      await furtherAnalysis();
    } else {
      await furtherAnalysis2();
    }
  }}
  mood="neutral"
  label="Further Analysis"
  customStyle={styles.furtherButton}
/>
        <Button
            onPress={resetAdvice}
            mood="neutral"
            label="Select Again"
            customStyle={styles.selectAgainButton}
        />


    </View>


  </View>


)}

{handleScrollDown()}

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
      <>
          <Button
            onPress={resetAdvice}
            mood="neutral"
            label="Select Again"
            customStyle={styles.selectAgainButton}
          />
{/*
          <Button
          onPress={selectAnimations}
          mood='neutral'
          label='Breathing Exercises'
          customStyle={styles.selectAgainButton}
          ></Button> */}

        <Button
          onPress={selectAnimations}
          mood='neutral'
          label={viewAnimations ? 'Hide Exercises' : "Breathing Exercises"}
          customStyle={styles.selectAgainButton}
          />

      {viewAnimations && (<View style={styles.animationDisplay}>
        <Button label='Bubbles'
        customStyle={styles.contextButton}
        onPress={displayBubble}/>
        {viewBubble && <BubbleBreathingExercise/>}

        <Button label='Heart'
        customStyle={styles.contextButton}
        onPress={displayHeart}/>
        {viewHeart && <HeartAnimation/>}

        <Button label='Square'
        customStyle={styles.contextButton}
        onPress={displaySquare}/>
        {viewSquare && <Square/>}

        </View>)}

          </>
      )}
      {handleScrollDown()}


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#975BFB',
    fontWeight: 300

  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  titleContainer: {
    marginBottom: 10,
    fontWeight: 200,
  },
  title: {
    fontSize: 35,
    color: 'black',
  },
  contextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "center",
    alignItems: 'center',
    padding: 10,
    gap: 10,
    fontWeight: 300,
    color: "white",
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
    color:"white",
    fontSize: 20,
  },
  moodText: {
    fontSize: 18,
    color: '#FFD700',
  },
  loadingContainer: {
    marginTop: 20,
  },
  adviceContainer: {
    marginHorizontal: 2,
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  selectAgainButton: {
    backgroundColor: 'rgb(254, 254, 254)',
    alignSelf:"center",
    minWidth: 150,
    maxHeight: 50,
  },
  contextButton: {
    backgroundColor: 'rgb(255, 255, 255)',
    minWidth: 100,
    maxHeight: 50,
    margin: 0,
    color: "white",
  },
  selectedContextButton: {
    backgroundColor: 'rgb(255, 255, 255)',
  },
  finishButtonContainer: {
    marginTop: 10,
    gap: 0,

  },
  finishButton: {
    backgroundColor: 'rgb(255, 255, 255)',
    alignSelf: "center",
    justifyContent: "center",
    minWidth: 150,
    maxHeight: 50,
  },

  furtherButton: {
    backgroundColor: 'rgb(31, 136, 240)',
    alignSelf: "center",
    justifyContent: "center",
    minWidth: 150,
    maxHeight: 50,
    borderColor: "white",
    borderWidth: 2,
  },

  resultsContainer: {
    padding: 20,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 10,
    gap: 5,
    flexDirection: "column",
  },
  resultsTitle: {
    alignSelf: "center",
    fontSize: 30,
    color: "black",
  },

  resultsSubtitle:{
    alignSelf: "center",
    fontSize: 20,
    color: "white",
    paddingBottom: 20,
  },

  resultsCols:{
    flexDirection: "row",
    gap: 50,
  },
  resultsCol1:{
    justifyContent: "flex-start",
    alignItems:"flex-start",
    gap: 5,
  },
  resultsCol2:{
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 5,

  },

  resultText: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',

  },
  mainResults: {
    justifyContent:"center",
    alignItems:"center",

  },
  animationDisplay:{
    flex: 1,
    alignItems:"center",
    justifyContent: "center",
  },

});

const markdownStyles = {
  text: { color: '#fff', fontSize: 20 },
  strong: { fontSize: 20, color: '#FFD700' },
  list_item: { color: '#fff', fontSize: 20 },
  paragraph: { marginBottom: 40 },
  heading1: { fontSize: 28, fontWeight: 'bold', color: '#FFD700', marginBottom: 20 },
  heading2: { fontSize: 24, fontWeight: 'bold', color: '#FFA500', marginBottom: 20 },
  heading3: { fontSize: 20, alignSelf:"center", fontWeight: 'bold', color: '#FF6347', margin: 20 },
};
