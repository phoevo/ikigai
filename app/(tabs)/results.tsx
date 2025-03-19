import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Define the types for the props
type ResultsPageProps = {
  selectedContext: string | null;
  selectedCompany: string | null;
  selectedSchoolRole: string | null;
  selectedMoods: string[];
};

const ResultsPage: React.FC<ResultsPageProps> = ({
  selectedContext,
  selectedCompany,
  selectedSchoolRole,
  selectedMoods,
}) => {
  return (
    <View style={styles.container}>
        <Text>No moods selected.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2C3E50',
  },
  title: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  moodsTitle: {
    fontSize: 18,
    color: '#FFD700',
    marginTop: 20,
  },
  moodItem: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ResultsPage;
