import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { scale, verticalScale, moderateScale } from '../utils/Responsive';
import { firebaseAuth } from '../../firebase.config';
import { useNavigation } from '@react-navigation/native';

const ProfilScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kullanıcı durumunu dinle
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      console.log('👤 Auth state changed:', user?.email || 'No user');
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      const result = await firebaseAuth.signOutFromGoogle();
      if (result.success) {
        Alert.alert('Başarılı', 'Çıkış yapıldı');
        navigation.navigate('LoginScreen');
      } else {
        Alert.alert('Hata', 'Çıkış yapılamadı');
      }
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#1b46b5ff', '#711EA2', '#1149D3']} 
        locations={[0, 0.6, 1]}                   
        start={{ x: 0, y: 0.3}}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#1b46b5ff', '#711EA2', '#1149D3']} 
      locations={[0, 0.6, 1]}                   
      start={{ x: 0, y: 0.3}}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>PROFİL</Text>
          <Text style={styles.headerSubtitle}>Hesap Bilgileriniz</Text>
        </View>

        {user ? (
          <View style={styles.profileContainer}>
            {/* Profil Fotoğrafı */}
            <View style={styles.profileImageContainer}>
              {user.photoURL ? (
                <Image 
                  source={{ uri: user.photoURL }} 
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.defaultProfileImage}>
                  <Text style={styles.defaultProfileText}>
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </Text>
                </View>
              )}
            </View>

            {/* Kullanıcı Bilgileri */}
            <View style={styles.userInfoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Ad Soyad:</Text>
                <Text style={styles.infoValue}>
                  {user.displayName || 'Belirtilmemiş'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>E-posta:</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Kullanıcı ID:</Text>
                <Text style={styles.infoValue}>{user.uid}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Giriş Yöntemi:</Text>
                <Text style={styles.infoValue}>
                  {user.providerData[0]?.providerId === 'google.com' ? 'Google' : 'E-posta'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>E-posta Doğrulama:</Text>
                <Text style={[styles.infoValue, user.emailVerified ? styles.verified : styles.notVerified]}>
                  {user.emailVerified ? 'Doğrulanmış ✓' : 'Doğrulanmamış ✗'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Hesap Oluşturma:</Text>
                <Text style={styles.infoValue}>
                  {new Date(user.metadata.creationTime).toLocaleDateString('tr-TR')}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Son Giriş:</Text>
                <Text style={styles.infoValue}>
                  {new Date(user.metadata.lastSignInTime).toLocaleDateString('tr-TR')}
                </Text>
              </View>
            </View>

            {/* Çıkış Butonu */}
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <Text style={styles.signOutButtonText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.noUserContainer}>
            <Text style={styles.noUserText}>Kullanıcı girişi yapılmamış</Text>
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={styles.loginButtonText}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default ProfilScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginTop: verticalScale(60),
    marginBottom: verticalScale(30),
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: verticalScale(5),
  },
  headerSubtitle: {
    fontSize: moderateScale(14),
    color: '#ffffff80',
  },
  loadingText: {
    fontSize: moderateScale(18),
    color: '#ffffff',
    textAlign: 'center',
    marginTop: verticalScale(100),
  },
  profileContainer: {
    marginHorizontal: scale(20),
    backgroundColor: '#ffffff20',
    borderRadius: moderateScale(15),
    padding: scale(20),
    marginBottom: verticalScale(20),
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  profileImage: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  defaultProfileImage: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: '#ffffff30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  defaultProfileText: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userInfoContainer: {
    marginBottom: verticalScale(20),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff20',
  },
  infoLabel: {
    fontSize: moderateScale(14),
    color: '#ffffff',
    fontWeight: '600',
    flex: 1,
  },
  infoValue: {
    fontSize: moderateScale(14),
    color: '#ffffff',
    flex: 2,
    textAlign: 'right',
  },
  verified: {
    color: '#4CAF50',
  },
  notVerified: {
    color: '#FF6B6B',
  },
  signOutButton: {
    backgroundColor: '#FF4444',
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  signOutButtonText: {
    color: '#ffffff',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  noUserContainer: {
    alignItems: 'center',
    marginTop: verticalScale(50),
    marginHorizontal: scale(20),
  },
  noUserText: {
    fontSize: moderateScale(18),
    color: '#ffffff',
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(30),
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#1b46b5ff',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
});
