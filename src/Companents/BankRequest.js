import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Platform } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { verticalScale, scale, moderateScale } from '../utils/Responsive'
import { useNavigation } from '@react-navigation/native'

export default function BankRequest() {
  const navigation = useNavigation();

  const banks = [
    {
      id: 1,
      name: 'Akbank',
      logo: require('../Assets/bankrequestikon/akbank.png'),
      backgroundColor: '#ffffff',
      description: 'Türkiye\'nin öncü bankası'
    },
    {
      id: 2,
      name: 'Denizbank',
      logo: require('../Assets/bankrequestikon/denizbank.png'),
      backgroundColor: '#ffffff',
      description: 'Güçlü ve güvenilir bankacılık'
    },
    {
      id: 3,
      name: 'Garanti BBVA',
      logo: require('../Assets/bankrequestikon/garantibank.png'),
      backgroundColor: '#ffffff',
      description: 'Türkiye\'nin dijital bankası'
    },
    {
      id: 4,
      name: 'Kuveyt Türk',
      logo: require('../Assets/bankrequestikon/kuveytturkbank.png'),
      backgroundColor: '#ffffff',
      description: 'Katılım bankacılığı'
    },
    {
      id: 5,
      name: 'Sekerbank',
      logo: require('../Assets/bankrequestikon/sekerbank.png'),
      backgroundColor: '#ffffff',
      description: 'Güvenilir bankacılık hizmetleri'
    },
    {
      id: 6,
      name: 'Türkiye İş Bankası',
      logo: require('../Assets/bankrequestikon/turkiyeisbank.png'),
      backgroundColor: '#ffffff',
      description: 'Türkiye\'nin bankası'
    },
    {
      id: 7,
      name: 'Yapı Kredi',
      logo: require('../Assets/bankrequestikon/yapıkredibank.png'),
      backgroundColor: '#ffffff',
      description: 'Her zaman yanınızda'
    },
    {
      id: 8,
      name: 'Ziraat Bankası',
      logo: require('../Assets/bankrequestikon/ziraatbank.png'),
      backgroundColor: '#ffffff',
      description: 'Milli bankamız'
    },
    {
      id: 9,
      name: 'Halkbank',
      logo: require('../Assets/bankrequestikon/halkbank.png'),
      backgroundColor: '#ffffff',
      description: 'Milli bankamız'
    },
    {
      id: 10,
      name: 'QNB Finansbank',
      logo: require('../Assets/bankrequestikon/qnbfinansbank.png'),
      backgroundColor: '#ffffff',
      description: 'Milli bankamız'
    },
    {
      id: 11,
      name: 'VakıfBank',
      logo: require('../Assets/bankrequestikon/vakifbank.png'),
      backgroundColor: '#ffffff',
      description: 'Milli bankamız'
    }
  ];

  const handleBankSelect = (bank) => {
    // Banka seçimi sonrası işlem
    console.log('Seçilen banka:', bank.name);
    // BankRequestDetails sayfasına yönlendir
    navigation.navigate('BankRequestDetails', { bank: bank });
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
          <Text style={styles.titleHeader}>Banka Hesap Açılışı</Text>
          <View style={styles.placeholder} />
        </View>
        
        <Text style={styles.subtitle}>Bankanızı seçin</Text>
        
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {banks.map((bank) => (
            <TouchableOpacity 
              key={bank.id} 
              style={[
                styles.bankCard,
                { backgroundColor: bank.backgroundColor }
              ]}
              onPress={() => handleBankSelect(bank)}
              activeOpacity={0.7}
              android_ripple={{
                color: 'rgba(0,0,0,0.1)',
                borderless: false,
                radius: moderateScale(100)
              }}
            >
              <View style={styles.bankContainer}>
                <Image 
                  source={bank.logo} 
                  style={styles.bankMainLogo} 
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
              Banka hesap açılışı için bankanızı seçtikten sonra gerekli bilgileri doldurunuz.
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
  bankCard: {
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
  bankContainer: {
    padding: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: verticalScale(140),
    overflow: 'hidden',
  },
  bankMainLogo: {
    width: '100%',
    height: verticalScale(110),
    transform: [{ scale: 1.3 }], // Yakınlaştırma oranı
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
