import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { verticalScale, scale, moderateScale } from '../utils/Responsive';
import WebDesignRequestForm from './WebDesignRequestForm';

const WebSiteRequest = () => {
  return (
    <LinearGradient
      colors={['#1b46b5ff', '#711EA2', '#1149D3']} 
      locations={[0, 0.6, 1]}                   
      start={{ x: 0, y: 0.3}}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.titleHeader}>Web Sitesi Tasarımı Görüşme Talebi</Text>
        
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.description}>
              Web sitesi tasarımı ihtiyaçlarınız için görüşme talebinde bulunun. 
              Uzmanlarımız sizinle en kısa sürede iletişime geçecektir.
            </Text>
            
            <View style={styles.formWrapper}>
              <WebDesignRequestForm />
            </View>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleHeader: {
    marginTop: Platform.OS === 'ios' ? verticalScale(80) : verticalScale(40), 
    fontSize: scale(20),
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: verticalScale(20),
    paddingHorizontal: scale(20),
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: scale(15),
  },
  scrollContent: {
    paddingBottom: verticalScale(20),
  },
  contentContainer: {
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(23),
    padding: moderateScale(20),
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
  },
  description: {
    fontSize: scale(16),
    marginBottom: verticalScale(20),
    color: '#555',
    textAlign: 'center',
    lineHeight: scale(22),
  },
  formWrapper: {
    marginTop: verticalScale(10),
  },
});

export default WebSiteRequest;
