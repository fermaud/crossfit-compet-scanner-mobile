import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useAuth } from '../hooks/useAuth';

export default function CustomDrawerContent(props: any) {
  const { user, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        Alert.alert('Erreur', 'Identifiants incorrects');
      } else {
        setEmail('');
        setPassword('');
        props.navigation.closeDrawer();
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { supabase } = require('../config/supabase');
    await supabase.auth.signOut();
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CrossFit Scanner</Text>
        <Text style={styles.subtitle}>Menu</Text>
      </View>

      <View style={styles.content}>
        {user ? (
          // User is logged in
          <View style={styles.userSection}>
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>👋 Connecté</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
            
            <View style={styles.features}>
              <Text style={styles.featuresTitle}>Fonctionnalités disponibles:</Text>
              <Text style={styles.featureItem}>• Recherche avancée</Text>
              <Text style={styles.featureItem}>• Filtres par département</Text>
              <Text style={styles.featureItem}>• Sauvegarde de recherches</Text>
              <Text style={styles.featureItem}>• Rafraîchissement des données</Text>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Se déconnecter</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // User is not logged in
          <View style={styles.loginSection}>
            <Text style={styles.loginTitle}>Connexion</Text>
            <Text style={styles.loginSubtitle}>
              Connectez-vous pour accéder aux fonctionnalités avancées
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </Text>
            </TouchableOpacity>

            <View style={styles.guestInfo}>
              <Text style={styles.guestTitle}>Mode invité</Text>
              <Text style={styles.guestText}>
                Vous pouvez consulter les événements sans vous connecter.
                La connexion donne accès aux fonctionnalités avancées.
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>CrossFit Event Scanner</Text>
        <Text style={styles.version}>Version 1.0</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  userSection: {
    flex: 1,
  },
  userInfo: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  features: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 4,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginSection: {
    flex: 1,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 24,
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 16,
    color: '#F9FAFB',
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: '#6B7280',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  guestInfo: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginTop: 'auto',
  },
  guestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  guestText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  version: {
    fontSize: 12,
    color: '#6B7280',
  },
});
