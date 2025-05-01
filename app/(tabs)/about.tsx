import { Text, View, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>MindWaves is an application that offers as solutions to mindfulness learning
        through the use of AI, data represenation and interactive rubrics that help teachers pinpoint every students
        stregths, weaknesses and insecurities.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(151, 91, 251)',
    justifyContent: 'center',
    alignItems: 'center',

  },
  text: {
    color: '#fff',
    margin: 20
  },
});
