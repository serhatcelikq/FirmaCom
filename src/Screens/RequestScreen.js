import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Platform } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { verticalScale, scale, moderateScale } from '../utils/Responsive'
import requestData from '../Companents/Requestlist'
import { useNavigation } from '@react-navigation/native'

export default function RequestScreen() {
  console.log(requestData);
  const navigation = useNavigation();
  
  function RequestHandler(id) {
    if (id === 1) { // Hat Talebi ID'si 1
      navigation.navigate('LineRequest');
    } else if (id === 2) { // HGS Talebi ID'si 2
      navigation.navigate('HgsRequest');
    } else if (id === 4) { // Fiziksel POS Talebi ID'si 4
      navigation.navigate('PhysicalPosRequest');
    } else if (id === 5) { // Web Sitesi Talebi ID'si 5
      navigation.navigate('WebSiteRequest');
    } else if (id === 8) { // Banka Hesabı Açılışı ID'si 8
      navigation.navigate('BankRequest');
    } else {
      navigation.navigate('RequestDetailsScreen', { requestId: id });
    }
  }
  
  return (
    <LinearGradient
      colors={['#1b46b5ff', '#711EA2', '#1149D3']} 
      locations={[0, 0.6, 1]}                   
      start={{ x: 0, y: 0.3}}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.titleHeader}>Talep Oluşturun</Text>
        
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {requestData.map((item) => (
            <View key={item.id} style={styles.RequestItem}>
              <View style={styles.RequestHeader}>
                <Image 
                  source={require('../Assets/folder.png')} 
                  style={styles.RequestIcon} 
                />
                <View style={styles.RequestInfo}>
                  <Text style={styles.RequestName}>{item.name}</Text>
                </View>
              </View>
              
              <View style={styles.RequestActions}>
                <View style={styles.createButton}>
                  <TouchableOpacity 
                    style={{
                      width: '50%', 
                      backgroundColor: '#1b46b5ff', 
                      paddingVertical: verticalScale(8), 
                      borderRadius: moderateScale(18)
                    }} 
                    onPress={() => RequestHandler(item.id)}
                  >
                    <Text style={styles.createButtonText}>Oluştur</Text>
                  </TouchableOpacity>

                  <Image source={item.image} style={styles.requestIcon} />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleHeader: {
    marginTop: Platform.OS=='ios' ? verticalScale(80) : verticalScale(40), 
    fontSize: scale(24),
    fontWeight: 'bold',
    color: '#ffffff',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: scale(15),
  },
  scrollContent: {
    paddingBottom: verticalScale(20),
  },
  RequestItem: {
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(23),
    marginBottom: verticalScale(15),
    padding: moderateScale(15),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: verticalScale(20),
  },
  RequestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  RequestIcon: {
    width: scale(30),
    height: scale(30),
    tintColor: '#1b46b5ff',
    marginRight: scale(12),
  },
  RequestInfo: {
    flex: 1,
  },
  RequestName: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: verticalScale(4),
  },
  RequestActions: {
    marginTop: verticalScale(8),
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(6),
    flex: 0.48,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: scale(14),
    fontWeight: '600',
    textAlign: 'center',
  },
  requestIcon: {
    width: scale(35),
    height: scale(35),
    tintColor: '#1b46b5ff',
    marginLeft: scale(10),
  },
})
