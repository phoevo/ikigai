import { Stack } from 'expo-router';
import { LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text } from 'react-native';
import Index from './(tabs)';


LogBox.ignoreAllLogs(true);



export default function RootLayout () {
  return (
  <>
    <StatusBar style="light"/>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
           headerShown: false
         }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  </>

  );
}
