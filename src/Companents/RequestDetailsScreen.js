import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { verticalScale, scale, moderateScale } from '../utils/Responsive';

export default function RequestDetailsScreen({ route, navigation }) {
  const { requestId } = route.params;
  
  const handleSubmitRequest = () => {
    console.log('Talep gönderiliyor:', requestId);
  };

  const getRequestTitle = () => {
    const titles = {
      1: 'Hat Talebi',
      2: 'HGS Talebi', 
      3: 'Sanal Pos Talebi',
      4: 'Fiziksel POS Talebi',
      5: 'Web Sitesi',
      6: 'Bulut Hizmeti',
      7: 'Adres Değişikliği',
      8: 'Banka Hesabı Açılışı',
      9: 'Kep Talebi'
    };
    return titles[requestId] || 'Talep Detayı';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{getRequestTitle()}</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Talep Formu</Text>
          
          <View style={styles.formItem}>
            <Text style={styles.label}>Açıklama:</Text>
            <View style={styles.textArea}>
              <Text style={styles.placeholder}>Talebinizi detaylı bir şekilde açıklayın...</Text>
            </View>
          </View>
          
          <View style={styles.formItem}>
            <Text style={styles.label}>Öncelik:</Text>
            <View style={styles.dropdown}>
              <Text style={styles.dropdownText}>Normal</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitRequest}>
            <Text style={styles.submitButtonText}>Talebi Gönder</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    backgroundColor: '#1b46b5ff',
    paddingTop: verticalScale(50),
  },
  backButton: {
    marginRight: scale(16),
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: scale(16),
    fontWeight: '600',
  },
  title: {
    color: '#ffffff',
    fontSize: scale(18),
    fontWeight: 'bold',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: scale(16),
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(12),
    padding: scale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: scale(20),
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: verticalScale(20),
  },
  formItem: {
    marginBottom: verticalScale(16),
  },
  label: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#333333',
    marginBottom: verticalScale(8),
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: moderateScale(8),
    padding: scale(12),
    minHeight: verticalScale(100),
    backgroundColor: '#f9f9f9',
  },
  placeholder: {
    color: '#999999',
    fontSize: scale(14),
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: moderateScale(8),
    padding: scale(12),
    backgroundColor: '#f9f9f9',
  },
  dropdownText: {
    fontSize: scale(14),
    color: '#333333',
  },
  submitButton: {
    backgroundColor: '#1b46b5ff',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
    marginTop: verticalScale(24),
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: scale(16),
    fontWeight: '600',
    textAlign: 'center',
  },
});
