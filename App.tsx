import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import EventListScreen from './src/screens/EventListScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <EventListScreen />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
