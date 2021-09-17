import React from 'react';
// React Native Library for Navigation
// import { createAppContainer, createStackNavigator, createBottomTabNavigator, getActiveChildNavigationOptions } from 'react-navigation';
import {NavigationContainer, DrawerActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// Pages for Navigation
import LandingScreen from '../pages/LandingScreen';
import HomeScreen from '../pages/HomeScreen';
import RegisterSceen from '../pages/RegisterSceen';
import LoginScreen from '../pages/LoginScreen';
import ForgotPasswordScreen from '../pages/ForgotPasswordScreen';
import ForgotPasswordSentScreen from '../pages/ForgotPasswordSentScreen';
import VerifikasiHPScreen from '../pages/VerifikasiHPScreen';
import VerifikasiNomorScreen from '../pages/VerifikasiNomorScreen'
import JournalScreen from '../pages/Journal'
// Import Component
import SplashScreen from '../pages/SplashScreen';
import AddJournalScreen from '../pages/Add Journal';
import JournalDetailScreen from '../pages/Journal Detail';

import AddFeedbackScreen from '../pages/Add Feedback';

const Stack = createStackNavigator();

// Make the AppIndex available to other parts of the application for Navigating between screens
const AppStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#1E2171',
            borderColor: '#1E2171',
          },
          headerTintColor: '#fff',
        }}>

        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Register"
          component={RegisterSceen}
          options={{headerShown: false}}
        />
      
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{headerShown: false}}
        />
      
        <Stack.Screen
          name="ForgotPasswordSent"
          component={ForgotPasswordSentScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="VerifikasiHP"
          component={VerifikasiHPScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="VerifikasiNomor"
          component={VerifikasiNomorScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Journal"
          component={JournalScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailJournal"
          component={JournalDetailScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddJournal"
          component={AddJournalScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddFeedback"
          component={AddFeedbackScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;


