import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Platform,
  Alert,
  TextInput
} from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { verticalScale, scale, moderateScale } from '../utils/Responsive'
import { useNavigation, useRoute } from '@react-navigation/native'

export default function PhysicalPosRequestDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const posProvider = route.params?.posProvider || { 
    name: 'Akbank POS', 
    logo: require('../Assets/physicalposikon/akbank.png') 
  };
  
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [uploadedSignature, setUploadedSignature] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    taxNumber: '',
    contactPerson: '',
    phoneNumber: '',
    email: '',
    address: '',
    monthlyVolume: '',
    businessType: '',
    notes: ''
  });

  const handleDocumentUpload = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUploadedDocument({
        name: 'vergi_levhasi.pdf',
        size: '1.8 MB',
        type: 'pdf'
      });
      setIsLoading(false);
      Alert.alert('Başarılı', 'Vergi levhası yüklendi');
    }, 1500);
  };

  const handleRemoveDocument = () => {
    Alert.alert(
      'Belgeyi Kaldır', 
      'Vergi levhasını kaldırmak istediğinizden emin misiniz?',
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
    setTimeout(() => {
      setUploadedSignature({
        name: 'imza_sirkular.pdf',
        size: '950 KB',
        type: 'pdf'
      });
      setIsLoading(false);
      Alert.alert('Başarılı', 'İmza sirküleri yüklendi');
    }, 1500);
  };

  const handleRemoveSignature = () => {
    Alert.alert(
      'Belgeyi Kaldır', 
      'İmza sirküleri kaldırmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Kaldır', 
          style: 'destructive',
          onPress: () => {
            setUploadedSignature(null);
            Alert.alert('Bilgi', 'Belge kaldırıldı');
          }
        }
      ]
    );
  };

  const handleSubmit = () => {
    // Form validasyonu
    if (!formData.companyName || !formData.taxNumber || !formData.contactPerson || 
        !formData.phoneNumber || !formData.email || !uploadedDocument || !uploadedSignature) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm zorunlu alanları doldurun ve gerekli belgeleri yükleyin.');
      return;
    }

    Alert.alert(
      'Talep Gönder',
      `${posProvider.name} için fiziksel POS talebi gönderilsin mi?`,
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Gönder', 
          style: 'default',
          onPress: () => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              Alert.alert('Başarılı', 'Fiziksel POS talebiniz başarıyla gönderildi. En kısa sürede size dönüş yapılacaktır.', [
                { text: 'Tamam', onPress: () => navigation.navigate('RequestScreen') }
              ]);
            }, 2000);
          }
        }
      ]
    );
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
          <Text style={styles.titleHeader}>POS Talep Formu</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Seçilen POS Sağlayıcısı */}
          <View style={styles.selectedPosCard}>
            <Image 
              source={posProvider.logo} 
              style={styles.selectedPosLogo} 
              resizeMode="contain"
            />
            <Text style={styles.selectedPosText}>{posProvider.name}</Text>
          </View>

          {/* Form Alanları */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Şirket Bilgileri</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Şirket Adı *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Şirket adınızı girin"
                placeholderTextColor="#999"
                value={formData.companyName}
                onChangeText={(text) => updateFormData('companyName', text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Vergi Numarası *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Vergi numaranızı girin"
                placeholderTextColor="#999"
                value={formData.taxNumber}
                onChangeText={(text) => updateFormData('taxNumber', text)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>İş Türü</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Faaliyet alanınızı belirtin"
                placeholderTextColor="#999"
                value={formData.businessType}
                onChangeText={(text) => updateFormData('businessType', text)}
              />
            </View>
          </View>

          {/* İletişim Bilgileri */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Yetkili Kişi *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Yetkili kişi adı"
                placeholderTextColor="#999"
                value={formData.contactPerson}
                onChangeText={(text) => updateFormData('contactPerson', text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefon Numarası *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="0XXX XXX XX XX"
                placeholderTextColor="#999"
                value={formData.phoneNumber}
                onChangeText={(text) => updateFormData('phoneNumber', text)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-posta Adresi *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="ornek@email.com"
                placeholderTextColor="#999"
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Adres</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="İş yeri adresinizi girin"
                placeholderTextColor="#999"
                value={formData.address}
                onChangeText={(text) => updateFormData('address', text)}
                multiline={true}
                numberOfLines={3}
              />
            </View>
          </View>

          {/* İş Bilgileri */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>İş Bilgileri</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Aylık İşlem Hacmi (TL)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Tahmini aylık ciro"
                placeholderTextColor="#999"
                value={formData.monthlyVolume}
                onChangeText={(text) => updateFormData('monthlyVolume', text)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notlar</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Özel taleplerinizi belirtin"
                placeholderTextColor="#999"
                value={formData.notes}
                onChangeText={(text) => updateFormData('notes', text)}
                multiline={true}
                numberOfLines={4}
              />
            </View>
          </View>

          {/* Belge Yükleme */}
          <View style={styles.documentSection}>
            <Text style={styles.sectionTitle}>Gerekli Belgeler</Text>
            
            {/* Vergi Levhası */}
            <View style={styles.documentItem}>
              <View style={styles.documentHeader}>
                <Image 
                  source={require('../Assets/document.png')} 
                  style={styles.documentIcon} 
                />
                <Text style={styles.documentTitle}>Vergi Levhası *</Text>
              </View>
              
              {uploadedDocument ? (
                <View style={styles.uploadedDocument}>
                  <View style={styles.fileInfo}>
                    <Image 
                      source={require('../Assets/file.png')} 
                      style={styles.fileIcon} 
                    />
                    <View style={styles.fileDetails}>
                      <Text style={styles.fileName}>{uploadedDocument.name}</Text>
                      <Text style={styles.fileSize}>{uploadedDocument.size}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={handleRemoveDocument}
                  >
                    <Text style={styles.removeButtonText}>Kaldır</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={handleDocumentUpload}
                  disabled={isLoading}
                >
                  <Image 
                    source={require('../Assets/upload.png')} 
                    style={styles.uploadIcon} 
                  />
                  <Text style={styles.uploadButtonText}>
                    {isLoading ? 'Yükleniyor...' : 'Belge Yükle'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* İmza Sirküleri */}
            <View style={styles.documentItem}>
              <View style={styles.documentHeader}>
                <Image 
                  source={require('../Assets/signature.png')} 
                  style={styles.documentIcon} 
                />
                <Text style={styles.documentTitle}>İmza Sirküleri *</Text>
              </View>
              
              {uploadedSignature ? (
                <View style={styles.uploadedDocument}>
                  <View style={styles.fileInfo}>
                    <Image 
                      source={require('../Assets/file.png')} 
                      style={styles.fileIcon} 
                    />
                    <View style={styles.fileDetails}>
                      <Text style={styles.fileName}>{uploadedSignature.name}</Text>
                      <Text style={styles.fileSize}>{uploadedSignature.size}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={handleRemoveSignature}
                  >
                    <Text style={styles.removeButtonText}>Kaldır</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={handleSignatureUpload}
                  disabled={isLoading}
                >
                  <Image 
                    source={require('../Assets/upload.png')} 
                    style={styles.uploadIcon} 
                  />
                  <Text style={styles.uploadButtonText}>
                    {isLoading ? 'Yükleniyor...' : 'Belge Yükle'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Gönder Butonu */}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'İşlem Yapılıyor...' : 'Talep Gönder'}
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
    fontSize: scale(20),
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(30),
  },
  selectedPosCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: moderateScale(15),
    padding: moderateScale(20),
    alignItems: 'center',
    marginBottom: verticalScale(25),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedPosLogo: {
    width: scale(80),
    height: scale(60),
    marginBottom: verticalScale(10),
  },
  selectedPosText: {
    color: '#ffffff',
    fontSize: scale(16),
    fontWeight: '600',
  },
  formSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: moderateScale(15),
    padding: moderateScale(20),
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: scale(18),
    fontWeight: 'bold',
    marginBottom: verticalScale(15),
  },
  inputGroup: {
    marginBottom: verticalScale(15),
  },
  inputLabel: {
    color: '#ffffff',
    fontSize: scale(14),
    marginBottom: verticalScale(8),
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(12),
    fontSize: scale(14),
    color: '#333',
  },
  textArea: {
    height: verticalScale(80),
    textAlignVertical: 'top',
  },
  documentSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: moderateScale(15),
    padding: moderateScale(20),
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  documentItem: {
    marginBottom: verticalScale(20),
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  documentIcon: {
    width: scale(20),
    height: scale(20),
    tintColor: '#ffffff',
    marginRight: scale(10),
  },
  documentTitle: {
    color: '#ffffff',
    fontSize: scale(16),
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: moderateScale(10),
    padding: moderateScale(15),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
  },
  uploadIcon: {
    width: scale(20),
    height: scale(20),
    tintColor: '#ffffff',
    marginRight: scale(10),
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: scale(14),
    fontWeight: '500',
  },
  uploadedDocument: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: moderateScale(10),
    padding: moderateScale(15),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileIcon: {
    width: scale(20),
    height: scale(20),
    tintColor: '#ffffff',
    marginRight: scale(12),
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    color: '#ffffff',
    fontSize: scale(14),
    fontWeight: '500',
  },
  fileSize: {
    color: '#ffffff',
    fontSize: scale(12),
    opacity: 0.8,
    marginTop: verticalScale(2),
  },
  removeButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(6),
  },
  removeButtonText: {
    color: '#ff6b6b',
    fontSize: scale(12),
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(15),
    paddingVertical: verticalScale(18),
    alignItems: 'center',
    marginTop: verticalScale(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  submitButtonText: {
    color: '#1b46b5ff',
    fontSize: scale(16),
    fontWeight: 'bold',
  },
})
