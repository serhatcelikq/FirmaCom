import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Platform } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { verticalScale, scale, moderateScale } from '../utils/Responsive'
import { useNavigation } from '@react-navigation/native'

export default function LineRequest() {
  const navigation = useNavigation();

  const operators = [
    {
      id: 1,
      name: 'Turkcell',
      logo: require('../Assets/linerequestikon/turkcell.png'),
      backgroundColor: '#ffffff', // Beyaz background
      description: 'Türkiye\'nin en büyük GSM operatörü'
    },
    {
      id: 2,
      name: 'Türk Telekom',
      logo: require('../Assets/linerequestikon/TürkTelekom.png'),
      backgroundColor: '#ffffff', // Beyaz background
      description: 'Türkiye\'nin yerli operatörü'
    },
    {
      id: 3,
      name: 'Vodafone',
      logo: require('../Assets/linerequestikon/vodafone.png'),
      backgroundColor: '#ffffff', // Beyaz background
      description: 'Global network operatörü'
    }
  ];

  const handleOperatorSelect = (operator) => {
    // Operatör seçimi sonrası işlem
    console.log('Seçilen operatör:', operator.name);
    // LineRequestDetails sayfasına yönlendir
    navigation.navigate('LineRequestDetails', { operator: operator });
  };

  return (
    <LinearGradient
      colors={['#1b46b5ff', '#711EA2', '#1149D3']} 
      locations={[0, 0.6, 1]}                   
      start={{ x: 0, y: 0.3}}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image 
              source={require('../Assets/down.png')} 
              style={styles.backIcon} 
            />
          </TouchableOpacity>
          <Text style={styles.titleHeader}>Hat Talebi</Text>
          <View style={styles.placeholder} />
        </View>
        
        <Text style={styles.subtitle}>Operatörünüzü seçin</Text>
        
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {operators.map((operator) => (
            <TouchableOpacity 
              key={operator.id} 
              style={[
                styles.operatorCard,
                { backgroundColor: operator.backgroundColor }
              ]}
              onPress={() => handleOperatorSelect(operator)}
              activeOpacity={0.7}
              android_ripple={{
                color: 'rgba(0,0,0,0.1)',
                borderless: false,
                radius: moderateScale(100)
              }}
            >
              <View style={styles.operatorContainer}>
                <Image 
                  source={operator.logo} 
                  style={styles.operatorMainLogo} 
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          ))}
          
          {/* Alt bilgi kısmı */}
          <View style={styles.infoSection}>
            <Image 
              source={require('../Assets/document.png')} 
              style={styles.infoIcon} 
            />
            <Text style={styles.infoText}>
              Hat talebi için operatörünüzü seçtikten sonra gerekli bilgileri doldurunuz.
            </Text>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    marginTop: Platform.OS=='ios' ? verticalScale(60) : verticalScale(20),
    marginBottom: verticalScale(10),
  },
  backButton: {
    width: scale(30),
    height: scale(30),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: scale(20),
    height: scale(20),
    tintColor: '#ffffff',
    transform: [{ rotate: '90deg' }],
  },
  placeholder: {
    width: scale(40),
  },
  titleHeader: {
    marginTop: Platform.OS === 'ios' ? verticalScale(10) : verticalScale(30),
    fontSize: scale(24),
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: scale(16),
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: verticalScale(30),
    opacity: 0.9,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: scale(15),
  },
  scrollContent: {
    paddingBottom: verticalScale(20),
  },
  operatorCard: {
    borderRadius: moderateScale(20),
    marginBottom: verticalScale(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  operatorContainer: {
    padding: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: verticalScale(140),
    overflow: 'hidden',
  },
  operatorMainLogo: {
    width: '100%',
    height: verticalScale(110),
    transform: [{ scale: 1.3 }], // Yakınlaştırma oranı (1.5x)

  },
  infoSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: moderateScale(15),
    padding: moderateScale(20),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(20),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoIcon: {
    width: scale(24),
    height: scale(24),
    tintColor: '#ffffff',
    marginRight: scale(12),
  },
  infoText: {
    flex: 1,
    color: '#ffffff',
    fontSize: scale(14),
    lineHeight: scale(20),
    opacity: 0.9,
  },
})