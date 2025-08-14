import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Platform } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { verticalScale, scale, moderateScale } from '../utils/Responsive'
import { useNavigation } from '@react-navigation/native'

export default function PhysicalPosRequest() {
  const navigation = useNavigation();

  const posProviders = [
    {
      id: 1,
      name: 'Akbank POS',
      logo: require('../Assets/physicalposikon/akbank.png'),
      backgroundColor: '#ffffff',
      description: 'Güvenli fiziksel POS çözümleri'
    },
    {
      id: 2,
      name: 'Denizbank POS',
      logo: require('../Assets/physicalposikon/denizbank.png'),
      backgroundColor: '#ffffff',
      description: 'Kapsamlı ödeme çözümleri'
    },
    {
      id: 3,
      name: 'Garanti BBVA POS',
      logo: require('../Assets/physicalposikon/garantibank.png'),
      backgroundColor: '#ffffff',
      description: 'Dijital ödeme teknolojileri'
    },
    {
      id: 4,
      name: 'Halkbank POS',
      logo: require('../Assets/physicalposikon/halbank.png'),
      backgroundColor: '#ffffff',
      description: 'Güvenilir POS hizmetleri'
    },
    {
      id: 5,
      name: 'Şekerbank POS',
      logo: require('../Assets/physicalposikon/sekerbank.png'),
      backgroundColor: '#ffffff',
      description: 'Profesyonel ödeme çözümleri'
    },
    {
      id: 6,
      name: 'İş Bankası POS',
      logo: require('../Assets/physicalposikon/turkiyeisbank.png'),
      backgroundColor: '#ffffff',
      description: 'Kurumsal POS hizmetleri'
    },
    {
      id: 7,
      name: 'Yapı Kredi POS',
      logo: require('../Assets/physicalposikon/yapıkredibank.png'),
      backgroundColor: '#ffffff',
      description: 'Modern ödeme sistemleri'
    },
    {
      id: 8,
      name: 'Ziraat POS',
      logo: require('../Assets/physicalposikon/ziraatbank.png'),
      backgroundColor: '#ffffff',
      description: 'Milli POS çözümleri'
    },
    {
      id: 9,
      name: 'QNB Finansbank POS',
      logo: require('../Assets/physicalposikon/qnbfinansbank.png'),
      backgroundColor: '#ffffff',
      description: 'Uluslararası standartlarda POS'
    },
    {
      id: 10,
      name: 'Vakıfbank POS',
      logo: require('../Assets/physicalposikon/vakifbank.png'),
      backgroundColor: '#ffffff',
      description: 'Güvenli ödeme altyapısı'
    },
    {
      id: 11,
      name: 'Kuveyt Türk POS',
      logo: require('../Assets/physicalposikon/kuveytturkbank.png'),
      backgroundColor: '#ffffff',
      description: 'Katılım bankacılığı POS'
    },
    {
      id: 12,
      name: 'HepsiPay',
      logo: require('../Assets/physicalposikon/hepsipay.png'),
      backgroundColor: '#ffffff',
      description: 'Dijital ödeme platformu'
    },
    {
      id: 13,
      name: 'Papara',
      logo: require('../Assets/physicalposikon/papara.png'),
      backgroundColor: '#ffffff',
      description: 'Mobil ödeme çözümleri'
    },
    {
      id: 14,
      name: 'Param',
      logo: require('../Assets/physicalposikon/param.png'),
      backgroundColor: '#ffffff',
      description: 'Esnek ödeme sistemleri'
    },
    {
      id: 15,
      name: 'PayTR',
      logo: require('../Assets/physicalposikon/paytr.png'),
      backgroundColor: '#ffffff',
      description: 'Online ödeme altyapısı'
    },
    {
      id: 16,
      name: 'PayU',
      logo: require('../Assets/physicalposikon/payu.png'),
      backgroundColor: '#ffffff',
      description: 'Güvenli ödeme sistemi'
    },
    {
      id: 17,
      name: 'SiPay',
      logo: require('../Assets/physicalposikon/sipay.png'),
      backgroundColor: '#ffffff',
      description: 'Akıllı ödeme çözümleri'
    },
    {
      id: 18,
      name: 'İninal',
      logo: require('../Assets/physicalposikon/ininal.png'),
      backgroundColor: '#ffffff',
      description: 'Ön ödemeli kart sistemi'
    }
  ];

  const handlePosSelect = (posProvider) => {
    console.log('Seçilen POS sağlayıcısı:', posProvider.name);
    navigation.navigate('PhysicalPosRequestDetails', { posProvider: posProvider });
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
          <Text style={styles.titleHeader}>Fiziksel POS Talebi</Text>
          <View style={styles.placeholder} />
        </View>
        
        <Text style={styles.subtitle}>POS Sağlayıcınızı seçin</Text>
        
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {posProviders.map((posProvider) => (
            <TouchableOpacity 
              key={posProvider.id} 
              style={[
                styles.posCard,
                { backgroundColor: posProvider.backgroundColor }
              ]}
              onPress={() => handlePosSelect(posProvider)}
              activeOpacity={0.7}
              android_ripple={{
                color: 'rgba(0,0,0,0.1)',
                borderless: false,
                radius: moderateScale(100)
              }}
            >
              <View style={styles.posContainer}>
                <Image 
                  source={posProvider.logo} 
                  style={styles.posMainLogo} 
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
              Fiziksel POS cihazı talebi için sağlayıcınızı seçtikten sonra gerekli bilgileri doldurunuz.
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
  posCard: {
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
  posContainer: {
    padding: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: verticalScale(140),
    overflow: 'hidden',
  },
  posMainLogo: {
    width: '100%',
    height: verticalScale(110),
    transform: [{ scale: 1.3 }],
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
