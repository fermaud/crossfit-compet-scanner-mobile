import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import EventListScreen from '../screens/EventListScreen';
import LoginScreen from '../screens/LoginScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#374151' },
        headerTintColor: '#F9FAFB',
        headerTitleStyle: { fontWeight: 'bold' },
        drawerStyle: { backgroundColor: '#1F2937' },
      }}
    >
      <Drawer.Screen 
        name="Events" 
        component={EventListScreen}
        options={{
          title: 'CrossFit Event Scanner',
          drawerLabel: 'Événements',
        }}
      />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={DrawerNavigator} />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ 
            presentation: 'modal',
            headerShown: true,
            headerStyle: { backgroundColor: '#374151' },
            headerTintColor: '#F9FAFB',
            title: 'Connexion'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}