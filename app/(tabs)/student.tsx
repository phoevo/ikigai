import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';


export default function StudentScreen() {
  const [responses, setResponses] = useState<string[]>([]);
  const [results, setResults] = useState<null | Record<string, any>>(null);
  const scrollViewRef = useRef<ScrollView>(null);

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

  const rubricOptions = [
    {
      emoji: '✅',
      level: 'Confident',
      description: 'I understood everything clearly.',
      studentSay: '“I got this!”',
    },
    {
      emoji: '💡',
      level: 'Assured',
      description: 'I mostly understood but had to think a bit.',
      studentSay: '“Makes sense now.”',
    },
    {
      emoji: '😐',
      level: 'Uncertain',
      description: 'I’m not sure I got it right.',
      studentSay: '“I think I followed?”',
    },
    {
      emoji: '❗️',
      level: 'Doubtful',
      description: 'I struggled and didn’t fully get it.',
      studentSay: '“This was hard.”',
    },
    {
      emoji: '❌',
      level: 'Insecure',
      description: 'I didn’t understand it at all.',
      studentSay: '“I’m lost.”',
    },
  ];

  const handleSelect = (level: string) => {
    setResponses(prev => [...prev, level]);
  };

  const handleFinish = () => {
    const total = responses.length;

    const counts: Record<string, number> = {};
    rubricOptions.forEach(opt => {
      counts[opt.level] = responses.filter(r => r === opt.level).length;
    });

    const percentages: Record<string, number> = {};
    rubricOptions.forEach(opt => {
      percentages[opt.level] = total > 0 ? Math.round((counts[opt.level] || 0) / total * 100) : 0;
    });

    setResults({
      totalSelections: total,
      counts,
      percentages,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} ref={scrollViewRef}>
      <Text style={styles.title}>How did that feel?</Text>

      <FlatList
        data={rubricOptions}
        keyExtractor={(item) => item.level}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.option}
            onPress={() => {handleSelect(item.level)}}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <View style={styles.textContainer}>
              <Text style={styles.level}>{item.level}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.studentSay}>You might say: {item.studentSay}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.optionsList}
      />


<View style={styles.selectionCountContainer}>
  <Text style={styles.selectionCountText}>
    Total Selected: {responses.length}
  </Text>

  <TouchableOpacity style={styles.finishButton} onPress={() => {
  handleFinish();
  handleScrollDown();
}}>
    <Text style={styles.finishText}>Finish</Text>
  </TouchableOpacity>
</View>


      {results && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Selection Results:</Text>
          <Text style={styles.resultsSubtitle}>Total Selections: {results.totalSelections}</Text>

          <View style={styles.resultsCols}>
            <View style={styles.resultsCol1}>
              {rubricOptions.map(opt => (
                <Text style={styles.resultText} key={opt.level}>
                  {opt.level}: {results.counts[opt.level] || 0}
                </Text>
              ))}
            </View>
            <View style={styles.resultsCol2}>
              {rubricOptions.map(opt => (
                <Text style={styles.resultText} key={opt.level + '_p'}>
                  {results.percentages[opt.level]}%
                </Text>
              ))}
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#975BFB',
    paddingTop: 10,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 24,
  },
  optionsList: {
    gap: 12,
    paddingBottom: 20,
  },
  option: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 12,
    marginBottom: 1,
  },
  emoji: {
    fontSize: 28,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  level: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  studentSay: {
    fontSize: 14,
    color: '#777',
    fontStyle: 'italic',
    marginTop: 6,
  },
  finishButton: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  finishText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#975BFB',
  },
  resultsContainer: {
    marginTop: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  resultsSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    color: '#555',
  },
  resultsCols: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultsCol1: {
    flex: 1,
  },
  resultsCol2: {
    flex: 1,
    alignItems: 'flex-end',
  },
  resultText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
  },

  selectionCountContainer: {
    alignItems: 'center',
    marginTop: 10,
  },

  selectionCountText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
});
