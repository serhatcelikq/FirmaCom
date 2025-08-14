import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient';


export default function HomeScreen() {
  const navigation = useNavigation();

  return (
        <LinearGradient
             colors={['#1b46b5ff', '#711EA2', '#1149D3']} 
             locations={[0, 0.6, 1]}                   
             start={{ x: 0, y: 0.3}}
             end={{ x: 1, y: 1 }}
             style={{ flex: 1 }}
           >
             <View style={styles.container}>
               <View style={styles.HeaderContainer}>
                        
               </View>
             </View>
           </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container:
  {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  HeaderContainer: {
    // Add your styles for the header container here
  },
})