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

export default function BankRequestDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const bank = route.params?.bank || { name: 'Akbank', logo: require('../Assets/bankrequestikon/akbank.png') };
  
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [uploadedSignature, setUploadedSignature] = useState(null);
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

  const handleSignatureUpload = () => {
    setIsLoading(true);
    // Simüle imza örneği yükleme
    setTimeout(() => {
      setUploadedSignature({
        name: 'imza_ornegi.pdf',
        size: '1.2 MB',
        type: 'pdf'
      });
      setIsLoading(false);
      Alert.alert('Başarılı', 'İmza örneği yüklendi');
    }, 1500);
  };

  const handleRemoveSignature = () => {
    Alert.alert(
      'Belgeyi Kaldır', 
      'İmza örneğini kaldırmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Kaldır', 
          style: 'destructive',
          onPress: () => {
            setUploadedSignature(null);
            Alert.alert('Bilgi', 'İmza örneği kaldırıldı');
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
        'Banka hesap açılış talebi başarıyla gönderildi!\n\nTalep numaranız: BHA-2025-001',
        [
          { text: 'Tamam', onPress: () => navigation.goBack() }
        ]
      );
    }, 2000);
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
          <Text style={styles.titleHeader}>Banka Hesap Açılışı</Text>
        </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Açıklama Metni */}
        <Text style={styles.descriptionText}>
          Banka hesap açılış talebinizi tamamlamak için gerekli belgeleri yükleyerek talep oluşturun.
        </Text>

        {/* Banka Kartı */}
        <View style={styles.bankSection}>
          <View style={styles.bankCard}>
            <Image 
              source={bank.logo} 
              style={styles.bankLogo} 
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

        {/* İmza Örneği Yükle */}
        <TouchableOpacity 
          style={styles.signatureUploadButton}
          onPress={handleSignatureUpload}
          disabled={isLoading}
        >
          <Image 
            source={require('../Assets/upload.png')} 
            style={styles.uploadButtonIcon}
          />
          <Text style={styles.signatureUploadText}>
            {isLoading ? 'Yükleniyor...' : 'İmza Örneği Yükle'}
          </Text>
        </TouchableOpacity>

        {/* İmza Örneği Yüklenen Dosya */}
        {uploadedSignature && (
          <View style={styles.uploadedFileContainer}>
            <Text style={styles.uploadedFileName}>{uploadedSignature.name}</Text>
            <Text style={styles.uploadedFileSize}>{uploadedSignature.size} - {uploadedSignature.type}</Text>
            <TouchableOpacity 
              style={styles.removeFileButton}
              onPress={handleRemoveSignature}
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(20),
    marginTop: Platform.OS === 'ios' ? verticalScale(60) : verticalScale(20),
    marginBottom: Platform.OS === 'ios' ? verticalScale(40) : verticalScale(30),
  },
  titleHeader: {
    marginTop:  Platform.OS === 'ios' ? verticalScale(40) : verticalScale(50),
    fontSize: scale(28),
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: scale(20),
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
  bankSection: {
    marginBottom: verticalScale(30),
  },
  bankCard: {
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
  bankLogo: {
    width: '100%',
    height: verticalScale(110),
    transform: [{ scale: 1.3 }], // Yakınlaştırma oranı
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
  signatureUploadButton: {
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
  signatureUploadText: {
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
