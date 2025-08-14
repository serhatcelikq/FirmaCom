import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/Screens/LoginScreen';
import RegisterScreen from './src/Screens/RegisterScreen';
import TabBarNavigation from './src/Navigation/TabBarNavigation';
import ForgotPasswordScreeen from './src/Screens/ForgotPasswordScreeen';
import SigininDocumentsScreen from './src/Companents/SigininDocumentsScreen';
import DocumentsKnowlange from './src/Companents/DocumentsKnowlange';
import LineRequest from './src/Companents/LineRequest';
import LineRequestDetails from './src/Companents/LineRequestDetails';
import BankRequest from './src/Companents/BankRequest';
import BankRequestDetails from './src/Companents/BankRequestDetails';
import HgsRequest from './src/Companents/HgsRequest';
import HgsRequestDetails from './src/Companents/HgsRequestDetails';
import RequestDetailsScreen from './src/Companents/RequestDetailsScreen';
import WebSiteRequest from './src/Companents/WebSiteRequest';
import PhysicalPosRequest from './src/Companents/PhysicalPosRequest';
import PhysicalPosRequestDetails from './src/Companents/PhysicalPosRequestDetails';


const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreeen} options={{ headerShown: false }} />
        <Stack.Screen name="SigininDocumentsScreen" component={SigininDocumentsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TabBarNavigation" component={TabBarNavigation} options={{ headerShown: false }} />
        <Stack.Screen name="DocumentsKnowlange" component={DocumentsKnowlange} options={{ headerShown: false }} />
        <Stack.Screen name="LineRequest" component={LineRequest} options={{ headerShown: false }} />
        <Stack.Screen name="LineRequestDetails" component={LineRequestDetails} options={{ headerShown: false }} />
        <Stack.Screen name="BankRequest" component={BankRequest} options={{ headerShown: false }} />
        <Stack.Screen name="BankRequestDetails" component={BankRequestDetails} options={{ headerShown: false }} />
        <Stack.Screen name="HgsRequest" component={HgsRequest} options={{ headerShown: false }} />
        <Stack.Screen name="HgsRequestDetails" component={HgsRequestDetails} options={{ headerShown: false }} />
        <Stack.Screen name="PhysicalPosRequest" component={PhysicalPosRequest} options={{ headerShown: false }} />
        <Stack.Screen name="PhysicalPosRequestDetails" component={PhysicalPosRequestDetails} options={{ headerShown: false }} />
        <Stack.Screen name="RequestDetailsScreen" component={RequestDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="WebSiteRequest" component={WebSiteRequest} options={{ headerShown: false }} />
        
        



      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({})