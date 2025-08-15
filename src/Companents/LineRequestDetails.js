import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Platform,
  Alert,
  Modal,
  FlatList,
  Dimensions
} from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { verticalScale, scale, moderateScale } from '../utils/Responsive'
import { useNavigation, useRoute } from '@react-navigation/native'
import DocumentPicker from 'react-native-document-picker'
import RNFS from 'react-native-fs'
import CryptoJS from 'crypto-js'
import Pdf from 'react-native-pdf'

export default function LineRequestDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const operator = route.params?.operator || { name: 'Turkcell', logo: require('../Assets/linerequestikon/turkcell.png') };
  
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [uploadedSignature, setUploadedSignature] = useState(null);
  const [isDocumentLoading, setIsDocumentLoading] = useState(false);
  const [isSignatureLoading, setIsSignatureLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [savedDocuments, setSavedDocuments] = useState([]);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [currentPdfUri, setCurrentPdfUri] = useState('');
  const [currentPdfName, setCurrentPdfName] = useState('');

  // Base64 decode fonksiyonu (SigininDocumentsScreen'deki ile aynı)
  const base64Decode = (str) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let result = '';
    let i = 0;
    
    str = str.replace(/=+$/, '');
    
    while (i < str.length) {
      const encoded1 = chars.indexOf(str.charAt(i++));
      const encoded2 = chars.indexOf(str.charAt(i++));
      const encoded3 = chars.indexOf(str.charAt(i++));
      const encoded4 = chars.indexOf(str.charAt(i++));
      
      const bitmap = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;
      
      result += String.fromCharCode((bitmap >> 16) & 255);
      if (encoded3 !== 64) result += String.fromCharCode((bitmap >> 8) & 255);
      if (encoded4 !== 64) result += String.fromCharCode(bitmap & 255);
    }
    
    return result;
  };

  // Basit XOR şifre çözme fonksiyonu
  const simpleDecrypt = (encryptedData, key) => {
    try {
      const data = base64Decode(encryptedData);
      let decrypted = '';
      for (let i = 0; i < data.length; i++) {
        const keyChar = key.charCodeAt(i % key.length);
        const dataChar = data.charCodeAt(i);
        decrypted += String.fromCharCode(dataChar ^ keyChar);
      }
      return decrypted;
    } catch (error) {
      throw new Error('Şifre çözme hatası');
    }
  };

  // Kaydedilen dosyaları listele
  const loadSavedDocuments = async () => {
    try {
      setIsDocumentLoading(true);
      
      const documentsPath = Platform.OS === 'ios' 
        ? RNFS.DocumentDirectoryPath 
        : RNFS.ExternalDirectoryPath;
      
      const firmaComDir = `${documentsPath}/FirmaCom_Documents`;
      
      console.log('📁 Documents klasör yolu:', documentsPath);
      console.log('📁 FirmaCom klasör yolu:', firmaComDir);
      
      // Klasör var mı kontrol et
      const dirExists = await RNFS.exists(firmaComDir);
      console.log('📁 FirmaCom klasörü var mı:', dirExists);
      
      if (!dirExists) {
        console.log('⚠️ FirmaCom klasörü bulunamadı');
        setSavedDocuments([]);
        setIsDocumentLoading(false);
        return;
      }
      
      // Klasördeki dosyaları oku
      const files = await RNFS.readDir(firmaComDir);
      console.log('📁 Klasördeki tüm dosyalar:', files.map(f => f.name));
      
      // Sadece metadata dosyalarını filtrele - hem _metadata.json hem _metadata(1).json formatlarını dahil et
      const metadataFiles = files.filter(file => 
        /.*_metadata(\(\d+\))?\.json$/.test(file.name)
      );
      console.log('📄 Metadata dosyaları:', metadataFiles.map(f => f.name));
      
      const documents = [];
      
      for (const file of metadataFiles) {
        try {
          console.log(`📄 Metadata dosyası okunuyor: ${file.name}`);
          const metadataContent = await RNFS.readFile(file.path, 'utf8');
          console.log(`📄 Metadata içeriği uzunluk: ${metadataContent.length}`);
          
          const metadata = JSON.parse(metadataContent);
          console.log(`📄 Metadata parse edildi:`, {
            originalFileName: metadata.originalFileName,
            savedFileName: metadata.savedFileName,
            displayName: metadata.displayName,
            encryptedPath: metadata.encryptedPath
          });
          
          // Şifreli dosyanın var olup olmadığını kontrol et
          const encryptedFileExists = await RNFS.exists(metadata.encryptedPath);
          console.log(`📄 Şifreli dosya var mı (${metadata.encryptedPath}):`, encryptedFileExists);
          
          if (encryptedFileExists) {
            // DisplayName priority: metadata.displayName > savedFileName > encryptedFileName > originalFileName
            const displayName = metadata.displayName || metadata.savedFileName || metadata.encryptedFileName || metadata.originalFileName;
            
            console.log('📄 Dosya yüklendi:', {
              originalFileName: metadata.originalFileName,
              savedFileName: metadata.savedFileName,
              displayName: displayName,
              documentNameDesc: metadata.documentNameDesc
            });
            
            // Benzersiz ID oluştur - dosya adının tamamını kullan
            const uniqueId = file.name; // .json uzantısı ile birlikte tam dosya adı
            
            documents.push({
              ...metadata,
              id: uniqueId, // Benzersiz ID: örneğin "calismaruhsativeizinlerini_metadata(1).json"
              metadataPath: file.path,
              displayName: displayName
            });
          } else {
            console.log(`⚠️ Şifreli dosya bulunamadı: ${metadata.encryptedPath}`);
          }
        } catch (error) {
          console.log(`❌ Metadata okuma hatası (${file.name}):`, error.message);
        }
      }
      
      // Tarihe göre sırala (en yeniden en eskiye)
      documents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      console.log('📁 Toplam yüklenen dosya sayısı:', documents.length);
      console.log('📁 Dosya listesi:');
      documents.forEach((doc, index) => {
        console.log(`${index + 1}. ${doc.displayName} (orijinal: ${doc.originalFileName})`);
      });
      
      setSavedDocuments(documents);
      setIsDocumentLoading(false);
      
    } catch (error) {
      console.error('Kaydedilen dosyalar yüklenirken hata:', error);
      Alert.alert('Hata', 'Kaydedilen dosyalar yüklenirken hata oluştu');
      setIsDocumentLoading(false);
    }
  };

  // Şifreli dosyayı çöz ve kullan
  const selectSavedDocument = async (document) => {
    try {
      setIsDocumentLoading(true);
      
      // Şifreli dosyayı oku
      const encryptedContent = await RNFS.readFile(document.encryptedPath, 'utf8');
      
      let decryptedBase64;
      
      // Şifreleme tipine göre çöz
      if (document.encryptionType === 'CryptoJS_AES') {
        try {
          const decryptedBytes = CryptoJS.AES.decrypt(encryptedContent, document.encryptionKey);
          decryptedBase64 = decryptedBytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
          throw new Error('CryptoJS şifre çözme hatası');
        }
      } else {
        // Simple XOR şifre çözme
        decryptedBase64 = simpleDecrypt(encryptedContent, document.encryptionKey);
      }
      
      // Geçici dosya oluştur
     
      
      console.log('Temp dosya oluşturuluyor:', {
        displayName: document.displayName,
        savedFileName: document.savedFileName,
        originalFileName: document.originalFileName,
        kullanilan: fileName,
        tempFileName: tempFileName
      });
      
      // Base64 geçerliliğini kontrol et ve temizle
      if (!decryptedBase64 || decryptedBase64.trim() === '') {
        throw new Error('Şifre çözme işlemi başarısız - boş veri');
      }
      
      // Base64 formatını kontrol et ve temizle
      console.log('Ham base64 ilk 100 karakter:', decryptedBase64.substring(0, 100));
      
      // Base64 data: prefix'ini kaldır
      let cleanBase64 = decryptedBase64;
      if (cleanBase64.startsWith('data:')) {
        const commaIndex = cleanBase64.indexOf(',');
        if (commaIndex !== -1) {
          cleanBase64 = cleanBase64.substring(commaIndex + 1);
        }
      }
      
      // Tüm whitespace karakterlerini ve geçersiz karakterleri kaldır
      cleanBase64 = cleanBase64.replace(/\s/g, ''); // Whitespace kaldır
      cleanBase64 = cleanBase64.replace(/[^A-Za-z0-9+/=]/g, ''); // Sadece geçerli base64 karakterleri bırak
      
      if (cleanBase64.length === 0) {
        throw new Error('Geçersiz base64 verisi - temizleme sonrası veri kalmadı');
      }
      
      // Base64 padding kontrolü ve düzeltmesi
      while (cleanBase64.length % 4 !== 0) {
        cleanBase64 += '=';
      }
      
      // Final validasyon - daha esnek regex
      const base64Regex = /^[A-Za-z0-9+/]+={0,3}$/; // 0-3 padding karakterine izin ver
      if (!base64Regex.test(cleanBase64)) {
        console.log('⚠️ Base64 format uyarısı var ama PDF header tespit edildi, devam ediliyor...');
      } else {
        console.log('✅ Base64 format doğrulaması başarılı');
      }
      
      console.log('Temizlenmiş base64 uzunluk:', cleanBase64.length);
      console.log('Temizlenmiş base64 ilk 100 karakter:', cleanBase64.substring(0, 100));
      
      // PDF header kontrolü (JVBERi0 = %PDF-1 in base64)
      if (cleanBase64.startsWith('JVBERi0')) {
        console.log('✅ PDF dosyası tespit edildi (base64)');
      } else {
        console.log('⚠️ PDF header tespit edilemedi, ilk 20 karakter:', cleanBase64.substring(0, 20));
      }
      
      // Geçici dosya oluştur
      const tempDir = Platform.OS === 'ios' 
        ? RNFS.DocumentDirectoryPath 
        : RNFS.CachesDirectoryPath;
      
      // DisplayName kullan, fallback olarak originalFileName
      const fileName = document.displayName || document.savedFileName || document.originalFileName;
      const tempFileName = `temp_${fileName}`;
      const tempFilePath = `${tempDir}/${tempFileName}`;
      
      console.log('Temp dosya oluşturuluyor:', {
        displayName: document.displayName,
        savedFileName: document.savedFileName,
        originalFileName: document.originalFileName,
        kullanilan: fileName,
        tempFileName: tempFileName
      });
      
      // Base64'ü dosyaya yaz - Platform spesifik
      try {
        console.log('Base64 dosya yazma başlıyor...');
        console.log('Platform:', Platform.OS);
        console.log('Yazılacak base64 başlangıcı:', cleanBase64.substring(0, 50));
        console.log('Base64 uzunluk:', cleanBase64.length);
        console.log('Dosya yolu:', tempFilePath);
        
        // Android için alternatif base64 yazma yöntemi
        if (Platform.OS === 'android') {
          try {
            console.log('Android: Base64 string olarak yazma denemesi...');
            await RNFS.writeFile(tempFilePath, cleanBase64, 'base64');
            console.log('✅ Android base64 string yazma başarılı');
          } catch (androidError) {
            console.log('❌ Android base64 string hatası:', androidError.message);
            console.log('Android: Binary yazma denemesi...');
            
            try {
              // Base64'ü binary string'e çevir
              console.log('Base64 decode işlemi başlıyor...');
              const binaryString = base64ToArrayBuffer(cleanBase64);
              console.log('Base64 decode başarılı, binary uzunluk:', binaryString.length);
              
              // Binary data'yı ascii encoding ile yaz
              await RNFS.writeFile(tempFilePath, binaryString, 'ascii');
              console.log('✅ Android binary yazma başarılı');
            } catch (binaryError) {
              console.log('❌ Android binary yazma hatası:', binaryError.message);
              
              // Son deneme: Daha agresif temizleme
              try {
                let finalBase64 = decryptedBase64
                  .replace(/data:[^;]*;base64,/gi, '') // Data URL prefix'ini kaldır
                  .replace(/\r?\n|\r/g, '') // Satır sonları
                  .replace(/\s+/g, '') // Tüm boşluklar
                  .replace(/[^A-Za-z0-9+/=]/g, ''); // Geçersiz karakterler
                
                // Padding düzelt
                while (finalBase64.length % 4 !== 0) {
                  finalBase64 += '=';
                }
                
                console.log('Son deneme base64 uzunluk:', finalBase64.length);
                
                if (finalBase64.length > 0) {
                  await RNFS.writeFile(tempFilePath, finalBase64, 'base64');
                  console.log('✅ Base64 son deneme ile düzeltildi');
                } else {
                  throw new Error('Base64 verisi tamamen bozuk');
                }
              } catch (finalError) {
                console.log('❌ Son deneme de başarısız:', finalError.message);
                throw new Error(`Dosya bozuk - PDF verisi okunamıyor. Lütfen dosyayı yeniden kaydedin ve tekrar deneyin.`);
              }
            }
          }
        } else {
          // iOS için normal yazma
          await RNFS.writeFile(tempFilePath, cleanBase64, 'base64');
          console.log('✅ iOS base64 yazma başarılı');
        }
        
        console.log('✅ Dosya başarıyla yazıldı:', tempFilePath);
        
      } catch (writeError) {
        console.error('❌ Dosya yazma hatası detayı:', writeError);
        
        // Base64 geçerliliğini test et (React Native uyumlu)
        try {
          // Base64 formatını kontrol et
          const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
          if (!base64Regex.test(cleanBase64)) {
            throw new Error('Base64 format hatası');
          }
          
          // Base64 uzunluk kontrolü (4'ün katı olmalı)
          if (cleanBase64.length % 4 !== 0) {
            throw new Error('Base64 uzunluk hatası');
          }
          
          console.log('Base64 format kontrolü geçti, uzunluk:', cleanBase64.length);
        } catch (base64Error) {
          console.error('❌ Base64 geçersiz:', base64Error);
          console.log('Hatalı base64 örneği:', cleanBase64.substring(0, 200));
          
          // Son deneme: Daha agresif temizleme
          try {
            let finalBase64 = decryptedBase64
              .replace(/data:[^;]*;base64,/gi, '') // Data URL prefix'ini kaldır
              .replace(/\r?\n|\r/g, '') // Satır sonları
              .replace(/\s+/g, '') // Tüm boşluklar
              .replace(/[^A-Za-z0-9+/=]/g, ''); // Geçersiz karakterler
            
            // Padding düzelt
            while (finalBase64.length % 4 !== 0) {
              finalBase64 += '=';
            }
            
            console.log('Son deneme base64 uzunluk:', finalBase64.length);
            
            if (finalBase64.length > 0) {
              cleanBase64 = finalBase64;
              console.log('✅ Base64 son deneme ile düzeltildi');
            } else {
              throw new Error('Base64 verisi tamamen bozuk');
            }
          } catch (finalError) {
            console.log('❌ Son deneme de başarısız:', finalError.message);
            throw new Error(`Dosya bozuk - PDF verisi okunamıyor. Lütfen dosyayı yeniden kaydedin ve tekrar deneyin.`);
          }
        }
        
        throw new Error(`Dosya yazma hatası: ${writeError.message}`);
      }
      
      // Dosya var mı kontrol et
      const fileExists = await RNFS.exists(tempFilePath);
      console.log('Dosya varlık kontrolü:', fileExists);
      
      if (!fileExists) {
        throw new Error('Geçici dosya oluşturulamadı');
      }
      
      // Dosya boyutunu hesapla
      const fileStats = await RNFS.stat(tempFilePath);
      const fileSizeInMB = (fileStats.size / (1024 * 1024)).toFixed(1);
      
      setUploadedDocument({
        name: document.displayName || document.savedFileName || document.originalFileName,
        size: `${fileSizeInMB} MB`,
        type: 'pdf',
        uri: `file://${tempFilePath}`,
        isFromSaved: true,
        originalDocument: document
      });
      
      setShowDocumentModal(false);
      setIsDocumentLoading(false);
      
      Alert.alert('Başarılı', `${document.displayName || document.savedFileName || document.originalFileName} seçildi`);
      
    } catch (error) {
      console.error('Dosya seçme hatası:', error);
      Alert.alert('Hata', 'Dosya açılırken hata oluştu');
      setIsDocumentLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR') + ' ' + date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const handleDocumentUpload = async () => {
    try {
      // Önce kaydedilen dosyaları yükle
      await loadSavedDocuments();
      
      // Modal'ı aç
      setShowDocumentModal(true);
      
    } catch (error) {
      console.error('Dosya listesi yüklenirken hata:', error);
      Alert.alert('Hata', 'Kaydedilen dosyalar yüklenirken hata oluştu');
    }
  };

  const handleRemoveDocument = () => {
    Alert.alert(
      'Belgeyi Kaldır', 
      'Kuruluş Sözleşmesini kaldırmak istediğinizden emin misiniz?',
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

  const handleViewDocument = () => {
    if (uploadedDocument && uploadedDocument.uri) {
      console.log('PDF görüntüleme başlıyor...');
      console.log('PDF URI:', uploadedDocument.uri);
      console.log('PDF Name:', uploadedDocument.name);
      
      setCurrentPdfUri(uploadedDocument.uri);
      setCurrentPdfName(uploadedDocument.name);
      setShowPdfModal(true);
    } else {
      Alert.alert('Hata', 'PDF dosyası bulunamadı');
    }
  };

  const handleSignatureUpload = async () => {
    try {
      setIsSignatureLoading(true);
      
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        allowMultiSelection: false,
      });

      if (result && result.length > 0) {
        const document = result[0];
        
        // Dosya boyutunu MB cinsinden hesapla
        const fileSizeInMB = (document.size / (1024 * 1024)).toFixed(1);
        
        setUploadedSignature({
          name: document.name,
          size: `${fileSizeInMB} MB`,
          type: 'pdf',
          uri: document.uri,
          originalDocument: document
        });
        
        Alert.alert('Başarılı', `${document.name} dosyası seçildi`);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // Kullanıcı seçimi iptal etti
        console.log('İmza dosyası seçimi iptal edildi');
      } else {
        console.error('İmza dosyası seçme hatası:', error);
        Alert.alert('Hata', 'İmza dosyası seçilirken bir hata oluştu');
      }
    } finally {
      setIsSignatureLoading(false);
    }
  };

  const handleRemoveSignature = () => {
    Alert.alert(
      'Belgeyi Kaldır', 
      'İmza Sirkülerini kaldırmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Kaldır', 
          style: 'destructive',
          onPress: () => {
            setUploadedSignature(null);
            Alert.alert('Bilgi', 'İmza sirkülerini kaldırıldı');
          }
        }
      ]
    );
  };

  const handleSubmitRequest = () => {
    if (!uploadedDocument) {
      Alert.alert('Uyarı', 'Lütfen Kuruluş Sözleşmesini yükleyiniz');
      return;
    }

    if (!uploadedSignature) {
      Alert.alert('Uyarı', 'Lütfen İmza Sirkülerini yükleyiniz');
      return;
    }

    setIsSubmitLoading(true);
    // Simüle talep gönderme
    setTimeout(() => {
      setIsSubmitLoading(false);
      Alert.alert(
        'Başarılı', 
        'Hat talebi başarıyla gönderildi!\n\nTalep numaranız: HT-2025-001',
        [
          { text: 'Tamam', onPress: () => navigation.goBack() }
        ]
      );
    }, 2000);
  };

  const isSubmitDisabled = !uploadedDocument || !uploadedSignature || isSubmitLoading;

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
          <Text style={styles.titleHeader}>Hat Talebi</Text>
        </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Açıklama Metni */}
        <Text style={styles.descriptionText}>
          Hat talebinizi tamamlamak için gerekli belgeleri yükleyerek talep oluşturun.
        </Text>

        {/* Operatör Kartı */}
        <View style={styles.operatorSection}>
          <View style={styles.operatorCard}>
            <Image 
              source={operator.logo} 
              style={styles.operatorLogo} 
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Kuruluş Sözleşmesi Alanı */}
        <View style={styles.documentSection}>
          {!uploadedDocument ? (
            <TouchableOpacity 
              style={styles.documentInputField}
              onPress={handleDocumentUpload}
              disabled={isDocumentLoading}
            >
              <Text style={styles.documentInputText}>
               Kuruluş Sözleşmesini Yükle
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.uploadedFileContainer}
              onPress={handleViewDocument}
              activeOpacity={0.8}
            >
              <View style={styles.fileInfoContainer}>
                <Text style={styles.uploadedFileName}>{uploadedDocument.name}</Text>
                <Text style={styles.uploadedFileSize}>{uploadedDocument.size} - {uploadedDocument.type}</Text>
              </View>
              <TouchableOpacity 
                style={styles.removeFileButton}
                onPress={handleRemoveDocument}
              >
                <Text style={styles.removeFileText}>×</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        </View>

        {/* İmza Sirkülerini Yükle */}
        <View style={styles.signatureSection}>
          {!uploadedSignature ? (
            <TouchableOpacity 
              style={styles.signatureUploadButton}
              onPress={handleSignatureUpload}
              disabled={isSignatureLoading}
            >
              <Image 
                source={require('../Assets/upload.png')} 
                style={styles.uploadButtonIcon}
              />
              <Text style={styles.signatureUploadText}>
                {isSignatureLoading ? 'Yükleniyor...' : 'İmza Sirkülerini Yükle'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.uploadedFileContainer}
              onPress={() => {
                if (uploadedSignature && uploadedSignature.uri) {
                  setCurrentPdfUri(uploadedSignature.uri);
                  setCurrentPdfName(uploadedSignature.name);
                  setShowPdfModal(true);
                }
              }}
              activeOpacity={0.8}
            >
              <View style={styles.fileInfoContainer}>
                <Text style={styles.uploadedFileName}>{uploadedSignature.name}</Text>
                <Text style={styles.uploadedFileSize}>{uploadedSignature.size} - {uploadedSignature.type}</Text>
              </View>
              <TouchableOpacity 
                style={styles.removeFileButton}
                onPress={handleRemoveSignature}
              >
                <Text style={styles.removeFileText}>×</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        </View>

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
            {isSubmitLoading ? 'Gönderiliyor...' : 'Talebi Gönderin'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
    
    {/* Kaydedilen Dosyalar Modal */}
    <Modal
      visible={showDocumentModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowDocumentModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Kaydedilen Belgeler</Text>
            <TouchableOpacity 
              onPress={() => setShowDocumentModal(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>×</Text>
            </TouchableOpacity>
          </View>
          
          {isDocumentLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Yükleniyor...</Text>
            </View>
          ) : savedDocuments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Image 
                source={require('../Assets/folder.png')} 
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>Henüz kaydedilmiş belge bulunmuyor</Text>
              <Text style={styles.emptySubText}>Belgeler sayfasından PDF kaydetmeyi deneyin</Text>
            </View>
          ) : (
            <ScrollView 
              style={styles.documentScrollContainer}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.documentScrollContent}
            >
              {savedDocuments.map((item, index) => (
                <View key={item.id}>
                  <TouchableOpacity 
                    style={styles.documentItem}
                    onPress={() => selectSavedDocument(item)}
                  >
                    <View style={styles.documentInfo}>
                      <View style={styles.documentHeader}>
                        <Image 
                          source={require('../Assets/file.png')} 
                          style={styles.documentIcon}
                        />
                        <View style={styles.documentDetails}>
                          <Text style={styles.documentName} numberOfLines={1}>
                            {item.displayName || item.savedFileName || item.originalFileName}
                          </Text>
                          <Text style={styles.documentType}>
                            {item.documentNameDesc || item.documentType}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.documentMeta}>
                        <Text style={styles.documentSize}>
                          {formatFileSize(item.fileSize)}
                        </Text>
                        <Text style={styles.documentDate}>
                          {formatDate(item.createdAt)}
                        </Text>
                      </View>
                    </View>
                    <Image 
                      source={require('../Assets/down.png')} 
                      style={styles.selectIcon}
                    />
                  </TouchableOpacity>
                  {index < savedDocuments.length - 1 && <View style={styles.separator} />}
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
    
    {/* PDF Görüntüleme Modal */}
    <Modal
      visible={showPdfModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowPdfModal(false)}
    >
      <View style={styles.pdfModalContainer}>
        <View style={styles.pdfModalContent}>
          <View style={styles.pdfModalHeader}>
            <Text style={styles.pdfModalTitle}>PDF Önizleme</Text>
            <TouchableOpacity 
              onPress={() => setShowPdfModal(false)}
              style={styles.pdfModalCloseButton}
            >
              <Text style={styles.pdfModalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={true}
            bounces={true}
          >
            {currentPdfUri && (
              <View style={{ flex: 1, minHeight: Dimensions.get('window').height * 0.7 }}>
                <Text style={styles.pdfFileName}>
                  {currentPdfName}
                </Text>
                
                {Platform.OS === 'ios' ? (
                  // iOS için PDF config
                  <Pdf
                    source={{ 
                      uri: currentPdfUri,
                      cache: false,
                    }}
                    style={styles.pdfViewer}
                    onLoadComplete={(numberOfPages, filePath) => {
                      console.log(`iOS PDF yüklendi: ${numberOfPages} sayfa, dosya: ${filePath}`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                      console.log(`iOS Sayfa değişti: ${page}/${numberOfPages}`);
                    }}
                    onError={(error) => {
                      console.log('iOS PDF yükleme hatası:', error);
                      Alert.alert('PDF Hatası', `iOS PDF yüklenemedi: ${JSON.stringify(error)}`);
                    }}
                    enablePaging={true}
                    horizontal={false}
                    fitPolicy={0}
                    spacing={0}
                  />
                ) : (
                  // Android için PDF config
                  <Pdf
                    source={{ 
                      uri: currentPdfUri,
                      cache: false
                    }}
                    style={styles.pdfViewer}
                    onLoadComplete={(numberOfPages, filePath) => {
                      console.log(`✅ Android PDF başarıyla yüklendi: ${numberOfPages} sayfa, dosya: ${filePath}`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                      console.log(`Android Sayfa değişti: ${page}/${numberOfPages}`);
                    }}
                    onError={(error) => {
                      console.log('❌ Android PDF yükleme hatası:', error);
                      console.log('PDF URI:', currentPdfUri);
                      
                      let errorMsg = 'Android PDF yüklenemedi';
                      if (currentPdfUri.startsWith('content://')) {
                        errorMsg += '\n\n🔧 Çözüm: Dosyayı yeniden seçin';
                      } else {
                        errorMsg += `\n\nHata: ${error.message || JSON.stringify(error)}`;
                      }
                      
                      Alert.alert('PDF Hatası', errorMsg);
                    }}
                    spacing={10}
                    enablePaging={true}
                    horizontal={false}
                    fitPolicy={2}
                    minScale={0.5}
                    maxScale={3.0}
                    enableDoubleTapZoom={true}
                    enableAntialiasing={true}
                  />
                )}
              </View>
            )}
            
            {!currentPdfUri && (
              <View style={styles.noPdfContainer}>
                <Text style={styles.noPdfText}>PDF URI bulunamadı</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
    
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
  backButton: {
    width: scale(40),
    height: scale(40),
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
  operatorSection: {
    marginBottom: verticalScale(30),
  },
  operatorCard: {
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
  operatorLogo: {
    width: '100%',
    height: verticalScale(110),
    transform: [{ scale: 1.3 }], // Yakınlaştırma oranı (1.5x)

  },
  operatorName: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
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
    textAlign: 'center',
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
  fileInfoContainer: {
    flex: 1,
    marginRight: scale(10),
  },
  uploadedFileName: {
    fontSize: scale(14),
    color: '#ffffff',
    fontWeight: '600',
  },
  uploadedFileSize: {
    fontSize: scale(12),
    color: '#ffffff',
    opacity: 0.8,
    marginTop: verticalScale(2),
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
  signatureSection: {
    marginBottom: verticalScale(20),
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(15),
    width: '100%',
    maxHeight: '85%',
    minHeight: '60%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4F8EF7',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: scale(18),
    fontWeight: 'bold',
  },
  modalCloseButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: moderateScale(15),
    width: scale(30),
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#ffffff',
    fontSize: scale(18),
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: scale(40),
    alignItems: 'center',
  },
  loadingText: {
    fontSize: scale(16),
    color: '#666666',
  },
  emptyContainer: {
    padding: scale(40),
    alignItems: 'center',
  },
  emptyIcon: {
    width: scale(60),
    height: scale(60),
    tintColor: '#cccccc',
    marginBottom: verticalScale(15),
  },
  emptyText: {
    fontSize: scale(16),
    color: '#666666',
    textAlign: 'center',
    marginBottom: verticalScale(5),
  },
  emptySubText: {
    fontSize: scale(14),
    color: '#999999',
    textAlign: 'center',
  },
  documentScrollContainer: {
    flex: 1,
    maxHeight: verticalScale(400), // Modal içinde maksimum yükseklik artırıldı
    paddingHorizontal: scale(15),
  },
  documentScrollContent: {
    flexGrow: 1,
    paddingVertical: verticalScale(15),
    paddingBottom: verticalScale(25),
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: moderateScale(10),
    padding: scale(15),
    marginVertical: verticalScale(5),
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  documentInfo: {
    flex: 1,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  documentIcon: {
    width: scale(24),
    height: scale(24),
    tintColor: '#4F8EF7',
    marginRight: scale(10),
  },
  documentDetails: {
    flex: 1,
  },
  documentName: {
    fontSize: scale(14),
    fontWeight: '600',
    color: '#333333',
    marginBottom: verticalScale(2),
  },
  documentType: {
    fontSize: scale(12),
    color: '#4F8EF7',
    fontWeight: '500',
  },
  documentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: scale(34),
  },
  documentSize: {
    fontSize: scale(12),
    color: '#666666',
  },
  documentDate: {
    fontSize: scale(12),
    color: '#666666',
  },
  selectIcon: {
    width: scale(10),
    height: scale(20),
    tintColor: '#4F8EF7',
    transform: [{ rotate: '-90deg' }],
  },
  separator: {
    height: verticalScale(10),
  },
  pdfModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: scale(20),
    paddingVertical: verticalScale(20),
    marginTop: Platform.OS === 'ios' ? verticalScale(80) : verticalScale(80),
    height: Platform.OS === 'ios' ? verticalScale(600) : verticalScale(600),
  },
  pdfModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(15),
    width: '100%',
    height: '93%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  pdfModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(15),
    backgroundColor: '#4F8EF7',
    borderTopLeftRadius: moderateScale(15),
    borderTopRightRadius: moderateScale(15),
  },
  pdfModalTitle: {
    color: '#ffffff',
    fontSize: scale(18),
    fontWeight: 'bold',
  },
  pdfModalCloseButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: moderateScale(15),
    width: scale(30),
    height: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfModalCloseText: {
    color: '#ffffff',
    fontSize: scale(18),
    fontWeight: 'bold',
  },
  pdfFileName: {
    color: '#000',
    fontSize: scale(16),
    textAlign: 'center',
    marginVertical: verticalScale(10),
    paddingHorizontal: scale(15),
    fontWeight: '500',
  },
  pdfViewer: {
    width: '100%',
    height: Dimensions.get('window').height * 0.65,
    backgroundColor: '#ffffff',
  },
  noPdfContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: verticalScale(200),
  },
  noPdfText: {
    color: '#000',
    fontSize: scale(16),
  },
})
