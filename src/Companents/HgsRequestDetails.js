import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Platform,
  Alert
} from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { verticalScale, scale, moderateScale } from '../utils/Responsive'
import { useNavigation, useRoute } from '@react-navigation/native'

export default function HgsRequestDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const provider = route.params?.provider || { name: 'PTT', logo: require('../Assets/hgsrequestikon/ptthgs.png') };
  
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [uploadedVehicleDocument, setUploadedVehicleDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDocumentUpload = () => {
    setIsLoading(true);
    // Simüle belge yükleme
    setTimeout(() => {
      setUploadedDocument({
        name: 'kimlik_belgesi.pdf',
        size: '2.5 MB',
        type: 'pdf'
      });
      setIsLoading(false);
      Alert.alert('Başarılı', 'Kimlik belgesi yüklendi');
    }, 1500);
  };

  const handleRemoveDocument = () => {
    Alert.alert(
      'Belgeyi Kaldır', 
      'Kimlik belgesini kaldırmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Kaldır', 
          style: 'destructive',
          onPress: () => {
            setUploadedDocument(null);
            Alert.alert('Bilgi', 'Belge kaldırıldı');
          }
        }
      ]
    );
  };

  const handleVehicleDocumentUpload = () => {
    setIsLoading(true);
    // Simüle araç ruhsatı yükleme
    setTimeout(() => {
      setUploadedVehicleDocument({
        name: 'arac_ruhsati.pdf',
        size: '1.8 MB',
        type: 'pdf'
      });
      setIsLoading(false);
      Alert.alert('Başarılı', 'Araç ruhsatı yüklendi');
    }, 1500);
  };

  const handleRemoveVehicleDocument = () => {
    Alert.alert(
      'Belgeyi Kaldır', 
      'Araç ruhsatını kaldırmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Kaldır', 
          style: 'destructive',
          onPress: () => {
            setUploadedVehicleDocument(null);
            Alert.alert('Bilgi', 'Araç ruhsatı kaldırıldı');
          }
        }
      ]
    );
  };

  const handleSubmitRequest = () => {
    if (!uploadedDocument) {
      Alert.alert('Uyarı', 'Lütfen kimlik belgenizi yükleyiniz');
      return;
    }

    setIsLoading(true);
    // Simüle talep gönderme
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Başarılı', 
        'HGS talebi başarıyla gönderildi!\n\nTalep numaranız: HGS-2025-001',
        [
          { text: 'Tamam', onPress: () => navigation.goBack() }
        ]
      );
    }, 2000);
  };

  const handleShowVehicleInfo = () => {
    Alert.alert(
      'Araç Filo Tablosu Bilgilendirmesi',
      '1️⃣ Öncelikle belgeyi hazırlayın\n\nFilo araçları belgesi genelde filo kiralama şirketi veya firma yetkilisi tarafından düzenlenir ve şu bilgileri içerir:\n\n• Araç plakaları listesi\n• Marka / model bilgileri\n• Şasi numaraları\n• Kiralama süresi veya mülkiyet bilgisi\n• Yetkili imza ve kaşe\n\n2️⃣ Kurumun istediği formata uygun hale getirin\n\nE-imza ile imzalanmış PDF olması gerekli',
      [{ text: 'Tamam' }]
    );
  };

  const isSubmitDisabled = !uploadedDocument || isLoading;

  return (
    <LinearGradient
      colors={['#1b46b5ff', '#711EA2', '#1149D3']} 
      locations={[0, 0.6, 1]}                   
      start={{ x: 0, y: 0.3}}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* Header */}
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
          <TouchableOpacity 
            style={styles.infoButton}
            onPress={handleShowVehicleInfo}
          >
            <Text style={styles.alertIcon}>!</Text>
            <Text style={styles.infoLabel}>BİLGİLENDİRME</Text>
          </TouchableOpacity>
        </View>
        
        {/* Title */}
        <Text style={styles.titleHeader}>HGS Talebi</Text>
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Açıklama Metni */}
        <Text style={styles.descriptionText}>
          HGS talebinizi tamamlamak için gerekli belgeleri yükleyerek talep oluşturun.
        </Text>

        {/* HGS Sağlayıcı Kartı */}
        <View style={styles.providerSection}>
          <View style={styles.providerCard}>
            <Image 
              source={provider.logo} 
              style={styles.providerLogo} 
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Kimlik Belgesi Alanı */}
        <View style={styles.documentSection}>
          {!uploadedDocument ? (
            <TouchableOpacity 
              style={styles.documentInputField}
              onPress={handleDocumentUpload}
              disabled={isLoading}
            >
              <Text style={styles.documentInputText}>
                {isLoading ? 'Yükleniyor...' : 'Kimlik Belgesi'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.uploadedFileContainer}>
              <Text style={styles.uploadedFileName}>{uploadedDocument.name}</Text>
              <Text style={styles.uploadedFileSize}>{uploadedDocument.size} - {uploadedDocument.type}</Text>
              <TouchableOpacity 
                style={styles.removeFileButton}
                onPress={handleRemoveDocument}
              >
                <Text style={styles.removeFileText}>×</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Araç Ruhsatı Yükle */}
        <TouchableOpacity 
          style={styles.vehicleUploadButton}
          onPress={handleVehicleDocumentUpload}
          disabled={isLoading}
        >
          <Image 
            source={require('../Assets/upload.png')} 
            style={styles.uploadButtonIcon}
          />
          <Text style={styles.vehicleUploadText}>
            {isLoading ? 'Yükleniyor...' : 'Araç Filo Tablosunu Yükle'}
          </Text>
        </TouchableOpacity>

        {/* Araç Ruhsatı Yüklenen Dosya */}
        {uploadedVehicleDocument && (
          <View style={styles.uploadedFileContainer}>
            <Text style={styles.uploadedFileName}>{uploadedVehicleDocument.name}</Text>
            <Text style={styles.uploadedFileSize}>{uploadedVehicleDocument.size} - {uploadedVehicleDocument.type}</Text>
            <TouchableOpacity 
              style={styles.removeFileButton}
              onPress={handleRemoveVehicleDocument}
            >
              <Text style={styles.removeFileText}>×</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Talebi Gönderin Butonu */}
        <TouchableOpacity 
          style={[
            styles.submitButton,
            isSubmitDisabled && styles.disabledSubmitButton
          ]}
          onPress={handleSubmitRequest}
          disabled={isSubmitDisabled}
        >
          <Image 
            source={require('../Assets/send.png')} 
            style={styles.submitButtonIcon}
          />
          <Text style={[
            styles.submitButtonText,
            isSubmitDisabled && styles.disabledButtonText
          ]}>
            {isLoading ? 'Gönderiliyor...' : 'Talebi Gönderin'}
          </Text>
        </TouchableOpacity>
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
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  infoButton: {
    width: scale(100),
    height: scale(50),
    borderRadius: moderateScale(8),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(5),
    paddingHorizontal: scale(5),
  },
  alertIcon: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: verticalScale(2),
  },
  infoLabel: {
    fontSize: scale(8),
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: scale(10),
    numberOfLines: 1,
    adjustsFontSizeToFit: true,
  },
  titleHeader: {
    fontSize: scale(24),
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    width: '100%',
    marginBottom: verticalScale(15),
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: scale(20),
    marginTop: verticalScale(20),
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
  },
  descriptionText: {
    color: '#ffffff',
    fontSize: scale(16),
    lineHeight: scale(22),
    textAlign: 'left',
    marginBottom: verticalScale(30),
    opacity: 0.9,
  },
  providerSection: {
    marginBottom: verticalScale(30),
  },
  providerCard: {
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(12),
    padding: moderateScale(20),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  providerLogo: {
    width: '100%',
    height: verticalScale(110),
    transform: [{ scale: 1.2 }], // Yakınlaştırma oranı
  },
  documentSection: {
    marginBottom: verticalScale(20),
  },
  documentInputField: {
    borderWidth: 2,
    borderColor: '#4F8EF7',
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    backgroundColor: '#ffffff',
    marginBottom: verticalScale(15),
  },
  documentInputText: {
    fontSize: scale(16),
    color: '#4F8EF7',
    fontWeight: '500',
  },
  uploadedFileContainer: {
    backgroundColor: '#4F8EF7',
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(15),
  },
  uploadedFileName: {
    fontSize: scale(14),
    color: '#ffffff',
    fontWeight: '600',
    flex: 1,
  },
  uploadedFileSize: {
    fontSize: scale(12),
    color: '#ffffff',
    opacity: 0.8,
    marginRight: scale(10),
  },
  removeFileButton: {
    width: scale(24),
    height: scale(24),
    borderRadius: moderateScale(12),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeFileText: {
    color: '#ffffff',
    fontSize: scale(16),
    fontWeight: 'bold',
  },
  vehicleUploadButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(15),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  uploadButtonIcon: {
    width: scale(20),
    height: scale(20),
    marginRight: scale(10),
    tintColor: '#666666',
  },
  vehicleUploadText: {
    fontSize: scale(16),
    color: '#666666',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#4F8EF7',
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(18),
    paddingHorizontal: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(20),
    shadowColor: '#4F8EF7',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  submitButtonIcon: {
    width: scale(20),
    height: scale(20),
    marginRight: scale(12),
    tintColor: '#ffffff',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: scale(18),
    fontWeight: 'bold',
  },
  disabledSubmitButton: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledButtonText: {
    color: '#888888',
  },
})
