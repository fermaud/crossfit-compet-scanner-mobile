import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import EventListScreen from './EventListScreen';

export default function HomeScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    const { error } = await signIn(email, password);
    if (error) {
      Alert.alert('Erreur', 'Identifiants incorrects');
    }
  };

  if (user) {
    return <EventListScreen />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CrossFit Event Scanner</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F9FAFB',
    textAlign: 'center',
    marginBottom: 40,
  },
  welcome: {
    fontSize: 18,
    color: '#F9FAFB',
    textAlign: 'center',
    marginBottom: 20,
  },
  info: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 16,
    color: '#F9FAFB',
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

