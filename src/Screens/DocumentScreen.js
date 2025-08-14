import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Platform } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { verticalScale,scale,moderateScale } from '../utils/Responsive'
import data from '../Companents/Documentslist'
import SigininDocumentsScreen from '../Companents/SigininDocumentsScreen'
import { useNavigation } from '@react-navigation/native'

export default function DocumentScreen() {
  console.log(data);
  const navigation = useNavigation();
  function SigininHandler(id) {
    navigation.navigate('SigininDocumentsScreen', { documentId: id });
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
        <Text style={styles.titleHeader}>İlgili Belgeleri Yükleyin</Text>
        
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {data.map((item) => (
            
            
         <View key={item.id} style={styles.DocumentItem}>
              <View style={styles.DocumentHeader}>
                <Image 
                  source={require('../Assets/document.png')} 
                  style={styles.DocumentIcon} 
                />
                <View style={styles.DocumentInfo}>
                  <Text style={styles.DocumentName}>{item.name}</Text>
                  
                </View>
              </View>
              
              <View style={styles.DocumentActions}>
                <View style={styles.uploadButton}>
                  <TouchableOpacity style={{width: '50%', backgroundColor: '#1b46b5ff', paddingVertical: verticalScale(8), borderRadius: moderateScale(18)}} onPress={() => SigininHandler(item.id)}>
                    <Text style={styles.uploadButtonText}>Yükle</Text>
                  </TouchableOpacity>

                  <Image source={item.image} style={styles.uploadIcon} />
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
    marginTop: Platform.OS === 'ios' ? verticalScale(80) : verticalScale(40),
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
  DocumentItem: {
  
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
  DocumentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  DocumentIcon: {
    width: scale(30),
    height: scale(30),
    tintColor: '#1b46b5ff',
    marginRight: scale(12),
  },
  DocumentInfo: {
    flex: 1,
  },
  DocumentName: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: verticalScale(4),
  },
  DocumentDate: {
    fontSize: scale(12),
    color: '#666666',
  },
  DocumentActions: {
    
    marginTop: verticalScale(8),
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
  
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(6),
    flex: 0.48,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: scale(14),
    fontWeight: '600',
    textAlign: 'center',
  },
  uploadIcon: {
    width: scale(35),
    height: scale(35),
    tintColor:'#1b46b5ff',
    marginLeft: scale(10),
  },
  viewButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(6),
    borderWidth: 1,
    borderColor: '#1b46b5ff',
    flex: 0.48,
  },
  viewButtonText: {
    color: '#1b46b5ff',
    fontSize: scale(14),
    fontWeight: '600',
    textAlign: 'center',
  },
})