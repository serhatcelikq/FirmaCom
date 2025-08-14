import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen';
import DocumentScreen from '../Screens/DocumentScreen';
import RequestScreen from '../Screens/RequestScreen';
import AgreementScreen from '../Screens/AgreementScreen';
import ProfilScreen from '../Screens/ProfilScreen';


const Tab = createBottomTabNavigator();

export default function TabBarNavigation() {
  return (
    <Tab.Navigator initialRouteName="HomeScreen"  options={{keyboardHidesTabBar: true,}}>
      <Tab.Screen name="HomeScreen" component={HomeScreen}  options={{ headerShown: false ,title:'Ana Sayfa',tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={require('../Assets/home.png')}
                style={{ width:25, height: 25, tintColor: focused ? '#1b46b5ff' : '#000000' }}
              />
            ), }} />
      <Tab.Screen name="DocumentScreen" component={DocumentScreen} options={{ headerShown: false ,title:'Belgeler',tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={require('../Assets/document.png')}
                style={{ width:25, height: 25, tintColor: focused ? '#1b46b5ff' : '#000000' }}
              />
            ), }} />
      <Tab.Screen name="RequestScreen" component={RequestScreen} options={{ headerShown: false ,title:'Talepler',tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={require('../Assets/folder.png')}
                style={{ width:25, height: 25, tintColor: focused ? '#1b46b5ff' : '#000000' }}
              />
            ), }} />
      <Tab.Screen name="AgreementScreen" component={AgreementScreen} options={{ headerShown: false ,title:'Sözleşmeler',tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={require('../Assets/signature.png')}
                style={{ width:25, height: 25, tintColor: focused ? '#1b46b5ff' : '#000000' }}
              />
            ), }} />
      <Tab.Screen name="ProfilScreen" component={ProfilScreen} options={{ headerShown: false ,title:'Profil',tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={require('../Assets/user.png')}
                style={{ width:25, height: 25, tintColor: focused ? '#1b46b5ff' : '#000000' }}
              />
            ), }} />

    </Tab.Navigator>
  );
}
