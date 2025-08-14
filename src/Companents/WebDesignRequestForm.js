import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

const WebDesignRequestForm = () => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async () => {
    // Form doğrulama
    if (!email.trim()) {
      Alert.alert('Hata', 'Lütfen email adresinizi giriniz.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Hata', 'Lütfen geçerli bir email adresi giriniz.');
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert('Hata', 'Lütfen cep telefonu numaranızı giriniz.');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Hata', 'Lütfen geçerli bir cep telefonu numarası giriniz. (Örnek: 05XXXXXXXXX)');
      return;
    }

    setIsSubmitting(true);

    try {
      // Burada API çağrısı yapılabilir
      // Şimdilik sadece başarı mesajı gösteriyoruz
      
      setTimeout(() => {
        setIsSubmitting(false);
        Alert.alert(
          'Başarılı',
          'Web sitesi tasarımı için görüşme talebiniz alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.',
          [
            {
              text: 'Tamam',
              onPress: () => {
                // Form temizle
                setEmail('');
                setPhoneNumber('');
              },
            },
          ]
        );
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Hata', 'Talep gönderilirken bir hata oluştu. Lütfen tekrar deneyiniz.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>
        
        {/* Email Alanı */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Adresi *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="ornek@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Telefon Alanı */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cep Telefonu *</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="05XXXXXXXXX"
            keyboardType="phone-pad"
            maxLength={11}
          />
        </View>

        {/* Bilgilendirme Metni */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Web sitesi tasarımı için görüşme talebinizi gönderdikten sonra, 
            uzmanlarımız sizinle en kısa sürede iletişime geçecektir.
          </Text>
        </View>

        {/* Gönder Butonu */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Gönderiliyor...' : 'Talep Gönder'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  infoText: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#6c757d',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WebDesignRequestForm;
