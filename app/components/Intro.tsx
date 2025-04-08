// components/IntroScreen.js
import { faSmileBeam } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { rgbaColor } from 'react-native-reanimated/lib/typescript/Colors';


const messages = [
  {
    content: (
      <Text>
        <Text style={{ color: '#ff3b3b' }}>Your</Text> mission is to float on the waves of <Text style={{ color: '#ff3b3b' }}>life.</Text> {/*red*/}
      </Text>
    ),
    duration: 4000,
  },
  {
    content: (
      <Text>
        <Text style={{ color: '#03C758' }}>Life</Text> is not flat. {/*green*/}
      </Text>
    ),
    duration: 3000,
  },
  {
    content: (
      <Text>
        Therefore, here's an easy tool to use on the <Text style={{ color: '#1BA5FF' }}>spot</Text>. {/*blue*/}
      </Text>
    ),
    duration: 5000,
  },
  {
    content: (
      <Text>
        You don’t have to be an expert, your <Text style={{ color: '#FFAF30' }}>life is yours.</Text>{/*orange*/}
      </Text>
    ),
    duration: 5000,
  },
  {
    content: (
      <Text>
        You choose when and where to use this <Text style={{ color: '#03C758' }}>powerful</Text> and
        <Text style={{ color: '#03C758' }}> helpful</Text> app anytime and anywhere in the day.{/*green*/}
      </Text>
    ),
    duration: 5000,
  },

  {
    content: <Text>Let's Get Started</Text>,
    duration: 3000,
  },
];


const IntroScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const currentMessage = messages[messageIndex];
    const halfDuration = currentMessage.duration / 2;

    const animate = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: halfDuration,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: halfDuration,
          useNativeDriver: true,
        }),
      ]).start(() => {
        const nextIndex = messageIndex + 1;
        if (nextIndex < messages.length) {
          setMessageIndex(nextIndex);
        } else {
          onFinish?.();
        }
      });
    };

    animate();
  }, [messageIndex]);

  return (
    <View style={styles.container}>
      <>
      <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
        {messages[messageIndex].content}
      </Animated.Text>
      </>
      <>
      <TouchableOpacity
        onPress={onFinish}
        style={{
        marginTop: 30,
        backgroundColor: 'rgb(118, 38, 255)',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        justifyContent: "flex-end",

  }}
>
    <Text style={{ color: 'white', fontSize: 16 }}>
      Skip
    </Text>
  </TouchableOpacity>
    </>
</View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#975BFF',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Helvetica',
    gap: 70,

  },
  text: {
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
    paddingHorizontal: 20,
    fontFamily: 'Helvetica',
    fontWeight: 300,
    height: 200,
  },
});

export default IntroScreen;
