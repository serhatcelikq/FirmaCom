import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Platform, Alert } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { verticalScale, scale, moderateScale } from '../utils/Responsive'
import { useNavigation } from '@react-navigation/native'

export default function HgsRequest() {
  const navigation = useNavigation();

  const hgsProviders = [
    {
      id: 1,
      name: 'PTT',
      logo: require('../Assets/hgsrequestikon/ptthgs.png'),
      backgroundColor: '#ffffff',
      description: 'PTT Hızlı Geçiş Sistemi'
    },
    {
      id: 2,
      name: 'Ziraat Bankası',
      logo: require('../Assets/hgsrequestikon/ziraatbank.png'),
      backgroundColor: '#ffffff',
      description: 'Ziraat Bankası Hızlı Geçiş Sistemi'
    },
    {
      id: 3,
      name: 'Türkiye İş Bankası',
      logo: require('../Assets/hgsrequestikon/turkiyeisbank.png'),
      backgroundColor: '#ffffff',
      description: 'Türkiye İş Bankası Hızlı Geçiş Sistemi'
    },
    {
      id: 4,
      name: 'QNB Finansbank',
      logo: require('../Assets/hgsrequestikon/qnbfinansbank.png'),
      backgroundColor: '#ffffff',
      description: 'QNB Finansbank Hızlı Geçiş Sistemi'
    },{
      id: 5,
      name: 'Akbank',
      logo: require('../Assets/hgsrequestikon/akbank.png'),
      backgroundColor: '#ffffff',
      description: 'Akbank Hızlı Geçiş Sistemi'
    },
    {
      id: 6,
      name: 'Halkbank',
      logo: require('../Assets/hgsrequestikon/halbank.png'),
      backgroundColor: '#ffffff',
      description: 'Halkbank Hızlı Geçiş Sistemi'
    }, {
      id: 7,
      name: 'Yapı Kredi',
      logo: require('../Assets/hgsrequestikon/yapıkredibank.png'),
      backgroundColor: '#ffffff',
      description: 'Yapı Kredi Hızlı Geçiş Sistemi'
    },
   {
      id: 8,
      name: 'Garanti BBVA',
      logo: require('../Assets/hgsrequestikon/garantibank.png'),
      backgroundColor: '#ffffff',
      description: 'Garanti BBVA Hızlı Geçiş Sistemi'
    },
    {
      id: 9,
      name: 'Denizbank',
      logo: require('../Assets/hgsrequestikon/denizbank.png'),
      backgroundColor: '#ffffff',
      description: 'Denizbank Hızlı Geçiş Sistemi'
    },
    
  
   
  ];

  const handleHgsProviderSelect = (provider) => {
    // HGS sağlayıcı seçimi sonrası işlem
    console.log('Seçilen HGS sağlayıcı:', provider.name);
    // HGS detay sayfasına yönlendir
    navigation.navigate('HgsRequestDetails', { provider: provider });
  };

  const handleShowInfo = () => {
    Alert.alert(
      'HGS Başvuru Bilgilendirmesi',
      'Kurumsal (Şirket) Başvurularında ek olarak:\n\n• Şirket yetkilisinin imza sirküleri\n• Vergi levhası fotokopisi\n• Yetkili kişinin kimlik fotokopisi\n\n💡 Notlar:\n\nBaşvuruyu PTT\'den yaparsanız, HGS etiketi hemen teslim edilir.\n\nBankalardan yapılan HGS başvurularında, etiketi banka şubesi verir ve hesabınıza bağlanır.\n\nYeni araç alındığında ruhsat çıkmadan fatura ile başvuru kabul edilebiliyor (bazı PTT şubelerinde).',
      [{ text: 'Tamam' }]
    );
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
          <Text style={styles.titleHeader}>HGS Talebi</Text>
          <TouchableOpacity 
            style={styles.infoButton}
            onPress={handleShowInfo}
          >
            <Text style={styles.alertIcon}>!</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.subtitle}>HGS sağlayıcınızı seçin</Text>
        
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {hgsProviders.map((provider) => (
            <TouchableOpacity 
              key={provider.id} 
              style={[
                styles.providerCard,
                { backgroundColor: provider.backgroundColor }
              ]}
              onPress={() => handleHgsProviderSelect(provider)}
              activeOpacity={0.7}
              android_ripple={{
                color: 'rgba(0,0,0,0.1)',
                borderless: false,
                radius: moderateScale(100)
              }}
            >
              <View style={styles.providerContainer}>
                <Image 
                  source={provider.logo} 
                  style={styles.providerMainLogo} 
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
              HGS talebinizi tamamlamak için HGS sağlayıcınızı seçtikten sonra gerekli bilgileri doldurunuz.
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
    marginTop: Platform.OS === 'ios' ? verticalScale(60) : verticalScale(20),
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
  infoButton: {
    width: scale(30),
    height: scale(30),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertIcon: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: '#ffffffff',
    textAlign: 'center',
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
  providerCard: {
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
  providerContainer: {
    padding: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: verticalScale(140),
    overflow: 'hidden',
  },
  providerMainLogo: {
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
