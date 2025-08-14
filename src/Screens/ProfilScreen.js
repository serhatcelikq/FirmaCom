import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const ProfilScreen = () => {
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
  );
};

export default ProfilScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  HeaderContainer :
  {

  },

});
