import { Image, StyleSheet, Text, TouchableOpacity, View, Modal, Dimensions, Alert, Platform, ScrollView } from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient';
import DocumentPicker from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import data from './Documentslist';
import { scale,verticalScale,moderateScale } from '../utils/Responsive';
import { useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import CryptoJS from 'crypto-js';

export default function SigininDocumentsScreen({ route }) {
  const { documentId } = route.params;
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState(0);
  const [pdfUri, setPdfUri] = useState('');
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const filtredDocument = data.find(doc => doc.id === documentId);
  const navigation = useNavigation();
  
  function DocHandler(id) {
    navigation.navigate('DocumentsKnowlange', { documentId: id });
  }

  const selectPDF = async () => {
    try {
      // Android için özel konfigürasyon
      const pickerConfig = {
        type: [DocumentPicker.types.pdf],
        allowMultiSelection: false,
      };
      
      // Platform bazında copyTo ayarı
      if (Platform.OS === 'ios') {
        pickerConfig.copyTo = 'documentDirectory';
      } else if (Platform.OS === 'android') {
        // Android için cachesDirectory veya documentDirectory
        pickerConfig.copyTo = 'cachesDirectory'; // Android'de daha güvenilir
      }
      
      console.log('DocumentPicker config:', pickerConfig);
      
      const result = await DocumentPicker.pick(pickerConfig);
      
      if (result && result.length > 0) {
        const selectedFile = result[0];
        console.log('Seçilen dosya detayları:', {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          uri: selectedFile.uri,
          fileCopyUri: selectedFile.fileCopyUri
        });
        
        // Platform bazında URI seçimi
        let fileUri = selectedFile.uri;
        
        if (Platform.OS === 'ios') {
          // iOS için öncelikle fileCopyUri kullan
          if (selectedFile.fileCopyUri) {
            fileUri = selectedFile.fileCopyUri;
            console.log('iOS için fileCopyUri kullanılıyor:', fileUri);
          } else {
            console.log('iOS için uri kullanılıyor:', fileUri);
          }
        } else if (Platform.OS === 'android') {
          // Android için fileCopyUri'yi tercih et
          if (selectedFile.fileCopyUri) {
            fileUri = selectedFile.fileCopyUri;
            console.log('✅ Android için fileCopyUri kullanılıyor:', fileUri);
          } else {
            console.log('⚠️ Android için content URI kullanılıyor (önizleme sorunlu olabilir):', fileUri);
            // Content URI'yi kabul et ama kullanıcıyı uyar
            Alert.alert(
              '⚠️ Uyarı',
              'Dosya geçici olarak kopyalanamadı. Önizleme çalışmayabilir, ancak kaydetme işlemi normal şekilde çalışacaktır.',
              [{ text: 'Tamam' }]
            );
          }
        }
        
        setIsFileUploaded(true);
        setUploadedFileName(selectedFile.name);
        setUploadedFileSize(selectedFile.size);
        setPdfUri(fileUri);
        
        console.log('Final PDF URI set:', fileUri);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Dosya seçimi iptal edildi');
      } else {
        console.error('Dosya seçim hatası:', err);
        Alert.alert('Hata', `Dosya seçim hatası: ${err.message || err}`);
      }
    }
  };
  const SavePdflocal = async () => {
    if (!pdfUri || !uploadedFileName) {
      Alert.alert('Hata', 'Gönderilecek PDF dosyası bulunamadı');
      return;
    }

    setIsSending(true);

    try {
      console.log('PDF şifreli olarak kaydediliyor:', {
        pdfUri,
        uploadedFileName,
        documentType: filtredDocument.name
      });

      let base64Data;
      let useRNFS = false;
      
      // Önce RNFS ile okumayı dene (normal file:// URI'ler için)
      if (pdfUri.startsWith('file://') && !pdfUri.includes('content://')) {
        try {
          console.log('RNFS ile dosya okunmaya çalışılıyor...');
          base64Data = await RNFS.readFile(pdfUri, 'base64');
          console.log('RNFS ile PDF okundu, boyut:', base64Data.length);
          useRNFS = true;
        } catch (rnfsError) {
          console.log('RNFS hatası, fetch yöntemine geçiliyor:', rnfsError.message);
          useRNFS = false;
        }
      }
      
      // RNFS başarısız olursa veya content:// URI ise fetch kullan
      if (!useRNFS) {
        console.log('Fetch yöntemi kullanılıyor...');
        
        try {
          const response = await fetch(pdfUri);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const blob = await response.blob();
          console.log('Blob oluşturuldu, boyut:', blob.size);
          
          // Blob'u base64'e çevir
          const reader = new FileReader();
          base64Data = await new Promise((resolve, reject) => {
            reader.onload = () => {
              const result = reader.result;
              const base64 = result.split(',')[1]; // data:application/pdf;base64, kısmını çıkar
              resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          
          console.log('Fetch ile PDF okundu, boyut:', base64Data.length);
          
        } catch (fetchError) {
          console.error('Fetch hatası:', fetchError);
          throw new Error(`Dosya okunamadı: ${fetchError.message}`);
        }
      }
      
      // Şifreleme işlemini yap
      await encryptAndSaveData(base64Data);
      
    } catch (error) {
      console.error('PDF kaydetme hatası:', error);
      Alert.alert('Hata', `PDF kaydedilirken hata oluştu:\n${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  // iOS simulatör için güvenli anahtar oluşturucu
  const generateSecureKey = () => {
    try {
      // Önce CryptoJS'in secure random'ını dene
      return CryptoJS.lib.WordArray.random(256/8).toString();
    } catch (error) {
      console.log('CryptoJS secure random hatası, alternatif yöntem kullanılıyor...');
      // Alternatif: Math.random() ile anahtar oluştur
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 64; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }
  };

  // React Native uyumlu Base64 encode/decode fonksiyonları
  const base64Encode = (str) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let result = '';
    let i = 0;
    
    while (i < str.length) {
      const a = str.charCodeAt(i++);
      const b = i < str.length ? str.charCodeAt(i++) : 0;
      const c = i < str.length ? str.charCodeAt(i++) : 0;
      
      const bitmap = (a << 16) | (b << 8) | c;
      
      result += chars.charAt((bitmap >> 18) & 63);
      result += chars.charAt((bitmap >> 12) & 63);
      result += chars.charAt((bitmap >> 6) & 63);
      result += chars.charAt(bitmap & 63);
    }
    
    // Padding
    const padLength = str.length % 3;
    if (padLength > 0) {
      const padCount = 3 - padLength;
      result = result.slice(0, -padCount) + '='.repeat(padCount);
    }
    
    return result;
  };

  const base64Decode = (str) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let result = '';
    let i = 0;
    
    // Remove padding
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

  // Basit XOR şifreleme (React Native uyumlu)
  const simpleEncrypt = (data, key) => {
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      const keyChar = key.charCodeAt(i % key.length);
      const dataChar = data.charCodeAt(i);
      encrypted += String.fromCharCode(dataChar ^ keyChar);
    }
    return base64Encode(encrypted); // React Native uyumlu base64 encode
  };

  // Basit XOR şifre çözme (React Native uyumlu)
  const simpleDecrypt = (encryptedData, key) => {
    try {
      const data = base64Decode(encryptedData); // React Native uyumlu base64 decode
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

  // Şifreleme ve kaydetme işlemlerini ayrı fonksiyon
  const encryptAndSaveData = async (base64Data) => {
    try {
      // iOS simulatör uyumlu şifreleme anahtarı oluştur
      const encryptionKey = generateSecureKey();
      console.log('Şifreleme anahtarı oluşturuldu, uzunluk:', encryptionKey.length);
      
      // PDF içeriğini şifrele (Dual encryption system)
      let encryptedData;
      let encryptionType;
      
      try {
        // Önce CryptoJS AES'i dene
        encryptedData = CryptoJS.AES.encrypt(base64Data, encryptionKey).toString();
        encryptionType = 'CryptoJS_AES';
        console.log('CryptoJS AES ile şifrelendi, boyut:', encryptedData.length);
      } catch (cryptoError) {
        console.log('CryptoJS AES hatası, basit şifreleme kullanılıyor:', cryptoError.message);
        // Fallback: Basit XOR şifreleme
        encryptedData = simpleEncrypt(base64Data, encryptionKey);
        encryptionType = 'Simple_XOR';
        console.log('Basit XOR ile şifrelendi, boyut:', encryptedData.length);
      }
      
      // Kayıt klasörü yolunu belirle
      const documentsPath = Platform.OS === 'ios' 
        ? RNFS.DocumentDirectoryPath 
        : RNFS.ExternalDirectoryPath;
      
      const firmaComDir = `${documentsPath}/FirmaCom_Documents`;
      
      // FirmaCom klasörü yoksa oluştur
      try {
        const dirExists = await RNFS.exists(firmaComDir);
        if (!dirExists) {
          await RNFS.mkdir(firmaComDir);
          console.log('📁 FirmaCom_Documents klasörü oluşturuldu');
        }
      } catch (dirError) {
        console.log('Klasör oluşturma hatası:', dirError.message);
        throw new Error(`Kayıt klasörü oluşturulamadı: ${dirError.message}`);
      }

      // Benzersiz dosya adı oluşturma fonksiyonu
      const generateUniqueFileName = async (baseName, extension, directory) => {
        let counter = 0;
        let fileName = `${baseName}.${extension}`;
        let filePath = `${directory}/${fileName}`;
        
        // Dosya varsa sayaç ekleyerek yeni isim oluştur
        while (await RNFS.exists(filePath)) {
          counter++;
          fileName = `${baseName}(${counter}).${extension}`;
          filePath = `${directory}/${fileName}`;
        }
        
        return { fileName, filePath };
      };
      
      // Dosya adı şablonunu oluştur - namedesc kullanarak
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      const time = new Date().toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }).replace(/:/g, '-');
      
      // namedesc'den dosya adı oluştur (Türkçe karakterleri temizle)
      const sanitizedNameDesc = filtredDocument.namedesc
        .replace(/[ıİĞğÜüŞşÖöÇç]/g, (char) => {
          const map = {
            'ı': 'i', 'İ': 'I', 'Ğ': 'G', 'ğ': 'g',
            'Ü': 'U', 'ü': 'u', 'Ş': 'S', 'ş': 's',
            'Ö': 'O', 'ö': 'o', 'Ç': 'C', 'ç': 'c'
          };
          return map[char] || char;
        })
        .replace(/[^a-zA-Z0-9\s]/g, '') // Özel karakterleri kaldır
        .replace(/\s+/g, '') // Boşlukları kaldır
        .toLowerCase();
      
      console.log('Orijinal namedesc:', filtredDocument.namedesc);
      console.log('Temizlenmiş namedesc:', sanitizedNameDesc);
      
      // Benzersiz şifreli dosya adı oluştur (namedesc + .pdf)
      const encryptedBaseName = sanitizedNameDesc; // Sadece namedesc kullan
      const encryptedFileInfo = await generateUniqueFileName(encryptedBaseName, 'pdf', firmaComDir);
      
      // Benzersiz metadata dosya adı oluştur 
      const metadataBaseName = `${sanitizedNameDesc}_metadata`;
      const metadataFileInfo = await generateUniqueFileName(metadataBaseName, 'json', firmaComDir);
      
      console.log('Kayıt klasörü:', firmaComDir);
      console.log('Şifreli dosya yolu:', encryptedFileInfo.filePath);
      console.log('Metadata dosya yolu:', metadataFileInfo.filePath);
      console.log('Şifreleme tipi:', encryptionType);
      
      // Şifreli dosyayı kaydet
      try {
        await RNFS.writeFile(encryptedFileInfo.filePath, encryptedData, 'utf8');
        console.log('📄 Şifreli dosya kaydedildi:', encryptedFileInfo.fileName);
      } catch (writeError) {
        console.log('RNFS yazma hatası:', writeError.message);
        throw new Error(`Dosya yazma hatası: ${writeError.message}`);
      }
      
      // Metadata dosyası oluştur (şifreleme anahtarı ile birlikte)
      const metadata = {
        originalFileName: uploadedFileName,
        savedFileName: encryptedFileInfo.fileName, // Kaydedilen PDF dosya adı (sayaç dahil)
        displayName: encryptedFileInfo.fileName, // Modal'da gösterilecek ad (sayaç dahil)
        encryptedFileName: encryptedFileInfo.fileName, // Geriye uyumluluk için
        encryptionKey: encryptionKey,
        documentType: filtredDocument.name,
        documentNameDesc: filtredDocument.namedesc, // namedesc'i metadata'ya ekle
        baseFileName: sanitizedNameDesc, // Temizlenmiş base ad (sayaç olmadan)
        createdAt: new Date().toISOString(),
        fileSize: uploadedFileSize,
        encryptedPath: encryptedFileInfo.filePath,
        encryptionType: encryptionType // Doğru şifreleme tipini kullan
      };
      
      console.log('📄 Metadata içeriği:');
      console.log('  - originalFileName:', metadata.originalFileName);
      console.log('  - savedFileName:', metadata.savedFileName);
      console.log('  - displayName:', metadata.displayName);
      console.log('  - documentNameDesc:', metadata.documentNameDesc);
      
      try {
        await RNFS.writeFile(metadataFileInfo.filePath, JSON.stringify(metadata, null, 2), 'utf8');
        console.log('📄 Metadata dosyası kaydedildi:', metadataFileInfo.fileName);
      } catch (metaError) {
        console.log('Metadata yazma hatası:', metaError.message);
        // Metadata hatası önemli değil, ana dosya kaydedildi
      }
      
      // Klasör içeriğini kontrol et
      try {
        const files = await RNFS.readDir(firmaComDir);
        console.log('📁 FirmaCom_Documents klasör içeriği:');
        files.forEach(file => {
          console.log(`├── 📄 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
        });
      } catch (listError) {
        console.log('Klasör içeriği okunamadı:', listError.message);
      }
      
      Alert.alert(
        '✅ Başarılı', 
        `${filtredDocument.namedesc} başarıyla kaydedildi!\n\n📁 Kayıt yeri: FirmaCom_Documents\n📄 Dosya adı: ${encryptedFileInfo.fileName}\n📄 Metadata: ${metadataFileInfo.fileName}`,
        [
          {
            text: 'Tamam',
            onPress: () => {
              // Başarılı kayıt sonrası temizlik
              setIsFileUploaded(false);
              setUploadedFileName('');
              setUploadedFileSize(0);
              setPdfUri('');
              setShowPdfModal(false);
            }
          }
        ]
      );
      
    } catch (error) {
      throw error; // Ana fonksiyona hata fırlat
    }
  };
  const cancelUpload = () => {
    setIsFileUploaded(false);
    setUploadedFileName('');
    setUploadedFileSize(0);
    setPdfUri('');
    setShowPdfModal(false);
  };

  // Dosya boyutunu MB'ye çevir
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const showPdfPreview = () => {
    console.log('=== PDF PREVIEW START ===');
    console.log('Platform:', Platform.OS);
    console.log('pdfUri:', pdfUri);
    console.log('showPdfModal BEFORE:', showPdfModal);
    console.log('uploadedFileName:', uploadedFileName);
    
    if (pdfUri) {
      console.log('URI detayları:');
      console.log('- Original URI:', pdfUri);
      console.log('- URI Type:', pdfUri.startsWith('content://') ? 'Content URI' : pdfUri.startsWith('file://') ? 'File URI' : 'Other');
      
      // Android için özel URI işlemi
      if (Platform.OS === 'android') {
        console.log('Android PDF önizleme hazırlanıyor...');
        
        // Content URI kontrolü
        if (pdfUri.startsWith('content://')) {
          console.log('⚠️ Android Content URI algılandı, dosya kopyalanmış URI tercih edilmeli');
          Alert.alert(
            'PDF Önizleme', 
            'Android\'de PDF görüntüleme için dosya kopyalanmalı. Dosyayı yeniden seçer misiniz?',
            [
              { text: 'İptal', style: 'cancel' },
              { 
                text: 'Yeniden Seç', 
                onPress: () => {
                  console.log('Dosya yeniden seçiliyor...');
                  selectPDF();
                }
              }
            ]
          );
          return;
        }
        
        // File URI formatını kontrol et
        if (!pdfUri.startsWith('file://')) {
          console.log('Android için file:// prefix ekleniyor');
        }
      }
      
      console.log('Modal açılıyor - setShowPdfModal(true) çağrılıyor...');
      
      // State güncellemesini zorunlu olarak yap
      setShowPdfModal(prevState => {
        console.log('setShowPdfModal callback - prevState:', prevState);
        console.log('setShowPdfModal callback - new state: true');
        return true;
      });
      
      console.log('Modal açılıyor...');
    } else {
      console.log('PDF URI bulunamadı!');
      Alert.alert('Hata', 'PDF dosyası bulunamadı');
    }
    console.log('=== PDF PREVIEW END ===');
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
          colors={['#1b46b5ff', '#711EA2', '#1149D3']} 
          locations={[0, 0.6, 1]}                   
          start={{ x: 0, y: 0.3}}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        > 
          <View style={styles.container}>
      <View style={styles.DocumentHeaderContainer}>
        <Text style={styles.DocumentHeaderTitle}>{filtredDocument.name}</Text>
        <View style={styles.DocumentsubtitleContainer}>
            <Image source={require('../Assets/virgo.png')} style={{ width: scale(24), height: verticalScale(24), tintColor: '#ffffff' }}/>
          <Text style={styles.DocumentHeaderSubtitle}>E imzanızı takınız</Text>
        </View>
       
      </View>
      <View style={styles.contentsContainer}>
       <View style={styles.contentsImageContainer}>
        <Image source={require('../Assets/save.png')} style={{ width: scale(350), height: verticalScale(350), alignSelf: 'center', marginTop: verticalScale(10) }}/>

       </View>
       <Text style={styles.contentsText}>
         {isFileUploaded 
           ? `${filtredDocument.namedesc} başarıyla sisteme yüklendi.` 
           : `${filtredDocument.namedesc} sisteme yüklemek için "Dosya Yükle" butonuna basınız.`
         }
       </Text>
       {/* Buton ve dosya bilgileri yanyana */}
       <View style={styles.uploadContainer}>
         <TouchableOpacity style={[styles.uploadButton, isFileUploaded && styles.uploadedButton]} onPress={isFileUploaded ? showPdfPreview : selectPDF}>
          <Image 
            source={isFileUploaded ? require('../Assets/check.png') : require('../Assets/upload.png')} 
            style={{ width: scale(24), height: verticalScale(24), tintColor: '#ffffff' }}
          />
          <Text style={{ color: '#ffffff', marginLeft: scale(10) }}>
            {isFileUploaded ? 'Belge Yüklendi' : 'Dosya Yükle'}
          </Text>
         </TouchableOpacity>
         
         {/* Dosya bilgileri ve çarpı butonu yanında */}
         {isFileUploaded && (
           <View style={styles.fileInfoContainer}>
             <View style={styles.fileInfoWrapper}>
               <Text style={styles.fileName} numberOfLines={1}>
                 {uploadedFileName}
               </Text>
               <Text style={styles.fileSize}>
                 {formatFileSize(uploadedFileSize)}
               </Text>
             </View>
             <TouchableOpacity onPress={cancelUpload} style={styles.fileCloseButton}>
               <Text style={styles.fileCloseText}>✕</Text>
             </TouchableOpacity>
           </View>
         )}
       </View>
      </View>
      <View style={styles.DownloadContainer}>
        <View style={styles.DownloadgeneralContainer}>
  <TouchableOpacity 
    style={[
      styles.DownuploadButton, 
      (!isFileUploaded || isSending) && styles.disabledButton
    ]} 
    onPress={SavePdflocal}
    disabled={!isFileUploaded || isSending}
  >
                <Text style={{ color: '#ffffff', marginRight: scale(10) }}>
                  {isSending ? 'Kaydediliyor...' : 'Dosyayı Kaydet'}
                </Text>
                 <Image source={require('../Assets/send.png')} style={{ width: scale(24), height: verticalScale(24), tintColor: '#ffffff' }}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.DownrightuploadButton } onPress={() => DocHandler(filtredDocument.id)}>
                  <Text style={{ color: '#396be8ff', marginRight: scale(10) }}>Kuruluş Bilgileri</Text>
              </TouchableOpacity>
        </View>
            
      </View>
      </View>

      </LinearGradient>
        
      {/* PDF Modal */}
      {console.log('Modal render - showPdfModal:', showPdfModal)}
        <Modal
          visible={showPdfModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            console.log('Modal kapatılıyor...');
            setShowPdfModal(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>PDF Önizleme</Text>
                <TouchableOpacity 
                  onPress={() => {
                    console.log('X butonu basıldı');
                    setShowPdfModal(false);
                  }}
                  style={styles.modalCloseButton}
                >
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
              {console.log('Modal içinde - pdfUri:', pdfUri)}
              <ScrollView 
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={true}
                bounces={true}
              >
                {pdfUri && (
                  <View style={{ flex: 1, minHeight: Dimensions.get('window').height * 0.7 }}>
                    <Text style={{ color: '#000', fontSize: 16, textAlign: 'center', marginVertical: 10 }}>
                      {uploadedFileName}
                    </Text>
                    {Platform.OS === 'ios' ? (
                      // iOS için özel PDF config
                      <Pdf
                        source={{ 
                          uri: pdfUri,
                          cache: false, // iOS'ta cache false daha iyi çalışıyor
                        }}
                        style={{
                          width: '100%',
                          height: Dimensions.get('window').height * 0.6,
                          backgroundColor: '#ffffff',
                        }}
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
                        fitPolicy={0} // iOS için fitWidth
                        spacing={0}
                      />
                    ) : (
                      // Android için PDF config
                      <Pdf
                        source={{ 
                          uri: pdfUri,
                          cache: false // Android'de cache false deneyelim
                        }}
                        style={{
                          width: '100%',
                          height: Dimensions.get('window').height * 0.6,
                          backgroundColor: '#ffffff',
                        }}
                        onLoadComplete={(numberOfPages, filePath) => {
                          console.log(`✅ Android PDF başarıyla yüklendi: ${numberOfPages} sayfa, dosya: ${filePath}`);
                        }}
                        onPageChanged={(page, numberOfPages) => {
                          console.log(`Android Sayfa değişti: ${page}/${numberOfPages}`);
                        }}
                        onError={(error) => {
                          console.log('❌ Android PDF yükleme hatası:', error);
                          console.log('PDF URI:', pdfUri);
                          console.log('URI Type:', pdfUri.startsWith('content://') ? 'Content URI' : pdfUri.startsWith('file://') ? 'File URI' : 'Other');
                          
                          // Detaylı hata mesajı
                          let errorMsg = 'Android PDF yüklenemedi';
                          if (pdfUri.startsWith('content://')) {
                            errorMsg += '\n\n🔧 Çözüm: Dosyayı yeniden seçin ve "cachesDirectory" kopyasını kullanın';
                          } else {
                            errorMsg += `\n\nHata: ${error.message || JSON.stringify(error)}`;
                          }
                          
                          Alert.alert('PDF Hatası', errorMsg, [
                            { text: 'Tamam' },
                            { 
                              text: 'Yeniden Seç', 
                              onPress: () => {
                                setShowPdfModal(false);
                                setTimeout(() => selectPDF(), 500);
                              }
                            }
                          ]);
                        }}
                        spacing={10}
                        enablePaging={true}
                        horizontal={false}
                        fitPolicy={2} // Android için fitBoth deneyelim
                        minScale={0.5}
                        maxScale={3.0}
                        // Android için ek ayarlar
                        enableDoubleTapZoom={true}
                        enableAntialiasing={true}
                      />
                    )}
                  </View>
                )}
                {!pdfUri && (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                    <Text style={{ color: '#000', fontSize: 16 }}>PDF URI bulunamadı</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
        
    </View>
  );
}

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        
    },
    DocumentHeaderContainer:
    {
justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(80),
      
    },
    DocumentHeaderTitle:
    {
   fontSize: moderateScale(26),
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: verticalScale(10),
    },
    DocumentsubtitleContainer:
    {
        flexDirection: 'row',
        alignItems: 'center',
        
        marginBottom: verticalScale(20),
    },
    DocumentHeaderSubtitle:
    {    
        fontSize: moderateScale(13),
        color: '#fff',
        marginLeft: scale(10),
        fontWeight: '500',
      
    },
    contentsContainer:
    {
     
        width: '90%',
        height: verticalScale(450),
        marginHorizontal: scale(20),
        borderRadius: moderateScale(10),
    },
    contentsText:
    {
        fontSize: moderateScale(14),
        color: '#ffffff',
        marginHorizontal: scale(15),
        marginTop: verticalScale(10),
        
    },
    uploadContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: verticalScale(30),
        marginHorizontal: scale(15),
        flexWrap: 'wrap',
    },
    uploadButton:
    {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#396be8ff',
        paddingVertical: verticalScale(13),
        paddingHorizontal: scale(15),
        borderRadius: moderateScale(10),
        minWidth: scale(140),
        marginRight: scale(10),
    },
    uploadedButton:
    {
        backgroundColor: '#28a745', // Yeşil renk
    },
    fileInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: moderateScale(8),
        paddingVertical: Platform.OS === 'ios' ? verticalScale(10) : verticalScale(7),
        paddingHorizontal: scale(7),
      
        flex: 1,
        minWidth: scale(140),
    },
    fileInfoWrapper: {
        flex: 1,
     
    },
    fileName: {
        color: '#ffffff',
        fontSize: moderateScale(14),
        fontWeight: '600',
        marginBottom: verticalScale(2),
        flexShrink: 1,
    },
    fileSize: {
        color: '#ffffff',
        fontSize: moderateScale(12),
        opacity: 0.8,
    },
    fileCloseButton: {
        backgroundColor: '#ff4444',
        borderRadius: moderateScale(12),
        width: scale(24),
        height: verticalScale(24),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: scale(10),
    },
    fileCloseText: {
        color: '#ffffff',
        fontSize: moderateScale(12),
        fontWeight: 'bold',
    },
    DownloadContainer:
    {      flex: 1,
        
        marginTop: verticalScale(80),
       
        width: '100%',
        height: verticalScale(120),
    
        backgroundColor:'#000000',
    },
    DownloadgeneralContainer:
    {
flexDirection: 'row',
 justifyContent: 'space-between',
   marginTop: verticalScale(10),
    },
    DownuploadButton:
    {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#396be8ff',
        height: verticalScale(50),
        borderRadius: moderateScale(10),
        marginTop: verticalScale(20),
        marginLeft: scale(20),
        paddingHorizontal: scale(20),
    },
    DownrightuploadButton:
    {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        height: verticalScale(50),
        borderRadius: moderateScale(10),
        marginTop: verticalScale(20),
        marginRight: scale(20),
        paddingHorizontal: scale(20),
    },
    disabledButton: {
        backgroundColor: '#666666',
        opacity: 0.6,
    },
    modalContainer: {
       
       
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: scale(26),
        paddingVertical: verticalScale(20),
        marginTop: Platform.OS === 'ios' ? verticalScale(95) : verticalScale(100),
        height: Platform.OS === 'ios' ? verticalScale(530) : verticalScale(530), // Ekran yüksekliğine göre ayarlandı
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: moderateScale(15),
        width: '95%',
        height: '85%',
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
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: scale(15),
        backgroundColor: '#396be8ff',
        borderTopLeftRadius: moderateScale(10),
        borderTopRightRadius: moderateScale(10),
    },
    modalTitle: {
        color: '#ffffff',
        fontSize: moderateScale(18),
        fontWeight: 'bold',
    },
    modalCloseButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: moderateScale(15),
        width: scale(30),
        height: verticalScale(30),
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseText: {
        color: '#ffffff',
        fontSize: moderateScale(18),
        fontWeight: 'bold',
    },
    pdfViewer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
})