import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { scale, verticalScale, moderateScale } from '../utils/Responsive';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  StatusBar.setBackgroundColor('#1b46b5ff');
  StatusBar.setBarStyle('light-content');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={['#1b46b5ff', '#711EA2', '#1149D3']}
        locations={[0, 0.6, 1]}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* Başlık */}
          <View style={styles.HeaderContanier}>
            <Text style={styles.HeaderContanierTitle}>KAYIT OL</Text>
            <Text
              style={[
                styles.HeaderContanierTitle,
                { fontSize: moderateScale(14), marginLeft: scale(3) },
              ]}
            >
              Yeni hesap oluşturun
            </Text>
          </View>

          {/* Form Alanı */}
          <View style={styles.LoginContanier}>
            {/* E-posta */}
            <View style={styles.TopUserInputContainer}>
              <Text style={styles.label}>E-posta adresi</Text>
              <View style={styles.InputContainer}>
                <Image
                  source={require('../Assets/email.png')}
                  style={{ width: scale(25), height: scale(25) }}
                />
                <TextInput
                  style={styles.inputholder}
                  placeholder=" E posta adresi"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Şifre */}
            <View style={styles.TopUserInputContainer}>
              <Text style={styles.label}>Şifre</Text>
              <View style={styles.InputContainer}>
                <Image
                  source={require('../Assets/unlock.png')}
                  style={{
                    width: scale(25),
                    height: scale(25),
                    marginRight: scale(8),
                  }}
                />
                <TextInput
                  style={[styles.inputholder, { flex: 1 }]}
                  placeholder="Şifre"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Image
                    source={
                      !showPassword
                        ? require('../Assets/blind.png')
                        : require('../Assets/eye.png')
                    }
                    style={{
                      width: scale(22),
                      height: scale(25),
                      marginRight: scale(25),
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Şifre Tekrar */}
            <View style={styles.TopUserInputContainer}>
              <Text style={styles.label}>Şifre Tekrar</Text>
              <View style={styles.InputContainer}>
                <Image
                  source={require('../Assets/unlock.png')}
                  style={{
                    width: scale(25),
                    height: scale(25),
                    marginRight: scale(8),
                  }}
                />
                <TextInput
                  style={[styles.inputholder, { flex: 1 }]}
                  placeholder="Şifre tekrar"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Image
                    source={
                      !showConfirmPassword
                        ? require('../Assets/blind.png')
                        : require('../Assets/eye.png')
                    }
                    style={{
                      width: scale(22),
                      height: scale(25),
                      marginRight: scale(25),
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Beni Hatırla */}
            <View style={styles.RememberMeContainer}>
              <View style={styles.leftSide}>
                <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
                  <View style={styles.BoxCheack}>
                    {rememberMe && (
                      <Image
                        source={require('../Assets/check.png')}
                        style={{
                          width: scale(15),
                          height: scale(15),
                          resizeMode: 'contain',
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                <Text style={styles.RememberMeText}>Beni hatırla</Text>
              </View>
            </View>

            {/* Kayıt Ol Butonu */}
            <TouchableOpacity
              style={styles.ButtonContainer}
              onPress={() => navigation.navigate('TabBarNavigation')}
            >
              <Text style={{ color: '#ffffff', fontSize: moderateScale(16) }}>
                Kayıt Ol
              </Text>
            </TouchableOpacity>

            {/* Veya çizgisi */}
            <View style={styles.lineContainer}>
              <View
                style={{
                  borderWidth: 1,
                  width: '40%',
                  borderColor: '#FFFFFF80',
                }}
              />
              <Text style={{ color: '#FFFFFF80', fontSize: moderateScale(14) }}>
                veya
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  width: '40%',
                  borderColor: '#FFFFFF80',
                }}
              />
            </View>

            {/* Google ile devam et */}
            <TouchableOpacity
              style={styles.ButtonGoogleContainer}
              onPress={() => navigation.navigate('TabBarNavigation')}
            >
              <View style={styles.pictureGoogleContainer}>
                <Image
                  source={require('../Assets/google.png')}
                  style={{
                    width: scale(25),
                    height: scale(25),
                    marginRight: scale(10),
                  }}
                />
                <Text
                  style={{
                    color: '#000000',
                    fontSize: moderateScale(16),
                    fontWeight: 'bold',
                  }}
                >
                  Google ile Devam et
                </Text>
              </View>
            </TouchableOpacity>

            {/* Girişe yönlendirme */}
            <View style={styles.HesapContanier}>
              <Text style={styles.HesapText}>Zaten hesabınız var mı?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('LoginScreen')}
              >
                <Text
                  style={[
                    styles.HesapText,
                    {
                      textDecorationLine: 'underline',
                      color: '#1E90FF',
                      marginLeft: scale(5),
                    },
                  ]}
                >
                  Buradan giriş yapın
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  HeaderContanier: {
    marginTop: verticalScale(40), // eski: 60
    marginLeft: scale(30), // eski: 40
  },
  HeaderContanierTitle: {
    marginBottom: verticalScale(10),
    fontSize: moderateScale(34),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: scale(3),
  },
  LoginContanier: {
    width: '90%', // eski: scale('100%') — scale yanlış çalışıyor olabilir
    height: verticalScale(500), // eski: 600
    marginTop: verticalScale(10), // eski: 20
    marginHorizontal: '5%',
    borderRadius: moderateScale(10),
  },
  TopUserInputContainer: {
    width: '100%',
    height: verticalScale(90),
    borderRadius: moderateScale(10),
    marginHorizontal: scale(10),
    marginTop: verticalScale(20),
    justifyContent: 'center',
  },
  label: {
    fontSize: moderateScale(14),
    color: '#ffffff',
    marginLeft: scale(8),
  },
  InputContainer: {
    paddingVertical: verticalScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: scale(10),
    marginTop: scale(6),
    borderRadius: moderateScale(10),
    backgroundColor: '#FFFFFF80',
  },
  inputholder: {
    paddingLeft: scale(10),
  },
  RememberMeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(16),
    paddingHorizontal: scale(10),
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  BoxCheack: {
    width: scale(20),
    height: scale(20),
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  RememberMeText: {
    marginLeft: scale(8),
    fontSize: moderateScale(14),
    color: '#ffffff',
  },
  ButtonContainer: {
    borderWidth: 1,
    borderColor: '#ffffff',
    backgroundColor: '#1b46b5ff',
    marginHorizontal: scale(7),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    marginTop: verticalScale(20), // eski: 30
    paddingVertical: verticalScale(14), // eski: 17
  },
  lineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(26),
    paddingHorizontal: scale(10),
  },
  ButtonGoogleContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: verticalScale(7),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    marginHorizontal: scale(7),
    marginTop: verticalScale(14), // eski: 20
  },
  pictureGoogleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: verticalScale(40),
  },
  HesapContanier: {
    flexDirection: 'row',
    marginTop: verticalScale(15), // eski: 20
    justifyContent: 'center',
  },
  HesapText: {
    fontSize: moderateScale(14),
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default RegisterScreen;
