import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';

export default function QuestionScreen() {
  const [question, setQuestion] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.centeredTextContainer}>
        {question.length > 0 && (
          <Text style={styles.questionText}>{question}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a question or statement..."
          placeholderTextColor="#ddd"
          onChangeText={setQuestion}
          value={question}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#975BFB',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  centeredTextContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  input: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#fff',
    borderRadius: 8,
    color: '#000',
  },
  questionText: {
    fontSize: 38,
    color: '#fff',
    textAlign: 'center',
  },
});
