import { Image, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import { Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient';
import { scale,verticalScale,moderateScale } from '../utils/Responsive';
import { firebaseAuth } from '../../firebase.config';



export default function LoginScreen() {
  const navigation = useNavigation();
  
  const [secureText, setSecureText] = useState(true);
  const [rememberme, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  function RemmeberHandler(value) {
    setRememberMe(value);
  }

  // Google ile giriş fonksiyonu
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await firebaseAuth.signInWithGoogle();
      
      if (result.success) {
        Alert.alert('Başarılı', 'Google ile giriş yapıldı!');
        navigation.navigate('TabBarNavigation');
      } else {
        Alert.alert('Hata', result.error || 'Google ile giriş yapılamadı');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      {Platform.OS === 'ios' && (
        <View style={{  backgroundColor: '#1b46b5ff' }} />
      )}
      <StatusBar barStyle="light-content"  backgroundColor="#1b46b5ff"/>

      
<LinearGradient
  colors={['#1b46b5ff', '#711EA2', '#1149D3']} // mavi → mor → mavi
  locations={[0, 0.6, 1]}                    // mor renk daha erken başlar, daha geç biter
  start={{ x: 0, y: 0.3}}
  end={{ x: 1, y: 1 }}
  style={{ flex: 1 }}
>
  <View style={styles.container}>
    <View style={styles.HeaderContanier}>
      
         <Text style={styles.HeaderContanierTitle}>GİRİŞ</Text>
         <Text style={[styles.HeaderContanierTitle,{fontSize:moderateScale(14),marginLeft: scale(3)}]}>Kurum hesabınıza hızlıca giriş yapın</Text>

    </View>
    <View style={styles.LoginContanier}>
   <View style={styles.TopUserInputContainer}>
      <Text style={{fontSize: moderateScale(14), color: '#ffffff',marginLeft: scale(8)}}>E-posta adresi</Text>
      <View style={styles.InputContainer}>
        <Image source={require('../Assets/email.png')} style={{width: scale(25), height: scale(25)}}/>
         <TextInput 
           style={styles.inputholder} 
           placeholder='E posta adresi'
           placeholderTextColor="#666"
         />
      </View>
   </View>
  <View style={styles.TopUserInputContainer}>
  <Text style={{ fontSize: moderateScale(14), color: '#ffffff', marginLeft: scale(8) }}>
    Şifre
  </Text>

  <View style={styles.InputContainer}>
    <Image
      source={require('../Assets/unlock.png')}
      style={{ width: scale(25), height: scale(25), marginRight: scale(8) }}
    />

    <TextInput
      style={styles.inputholder}
      placeholder="Şifre"
      placeholderTextColor="#666"
      secureTextEntry={secureText}
    />

    <TouchableOpacity onPress={() => setSecureText(!secureText)}>
      <Image
        source={
          secureText
            ? require('../Assets/blind.png') // Göz kapalı ikonu
            : require('../Assets/eye.png')      // Göz açık ikonu
        }
        style={{ width: scale(22), height: scale(25), marginRight: scale(15),resizeMode: 'contain' }}
      />
    </TouchableOpacity>
  </View>
</View>
<View style={styles.RememberMeContainer}>
  <View style={styles.leftSide}>
    <TouchableOpacity onPress={() => setRememberMe(!rememberme)}>
      <View style={styles.BoxCheack}>
        {rememberme && (
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

  <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
    <Text style={styles.linkText}>Şifrenizi mi Unuttunuz?</Text>
  </TouchableOpacity>
</View>
     <TouchableOpacity style={styles.ButtonContainer} onPress={() => navigation.navigate('TabBarNavigation')}>
      <Text style={{ color: '#ffffff', fontSize: moderateScale(16) }}>Giriş Yap</Text>
     </TouchableOpacity>
     <View style={styles.lineContainer}>
      <View style={{borderWidth:1,width:'40%',borderColor:'#FFFFFF80'}}/>
      <Text style={{color:'#FFFFFF80',fontSize:moderateScale(14)}}>veya</Text>
      <View style={{borderWidth:1,width:'40%',borderColor:'#FFFFFF80'}}/>
     </View>
    <TouchableOpacity style={styles.ButtonGoogleContainer} onPress={handleGoogleSignIn} disabled={isLoading}>
      <View style={styles.pictureGoogleContainer}>
        <Image source={require('../Assets/google.png')} style={{width: scale(25), height: scale(25), marginRight: scale(10)}}/>
         <Text style={{color: '#000000', fontSize: moderateScale(16),fontWeight: 'bold'}}>
           {isLoading ? 'Giriş yapılıyor...' : 'Google ile Devam et'}
         </Text>
      </View>
     
    </TouchableOpacity>
    <View style={styles.HesapContanier}>
      <Text style={styles.HesapText}>hesabınız yok mu?</Text>
      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
 <Text style={[styles.HesapText,{textDecorationLine: 'underline',color: '#1E90FF',marginLeft: scale(5)}]}>Buradan kaydolun</Text>
      </TouchableOpacity>
      
    </View>
    </View>
         
  </View>
</LinearGradient>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
   
  },
  HeaderContanier:
{
   marginTop: verticalScale(80),
   marginLeft: scale(40),
  },
  HeaderContanierTitle: {
    marginBottom: verticalScale(10),
   fontSize: moderateScale(34),
   fontWeight: 'bold',
   color: '#FFFFFF',
   marginLeft: scale(3),
},
LoginContanier: {
 
  width: '88%',
  height: verticalScale(600),
  borderRadius: moderateScale(10),
  marginHorizontal: scale(20),
  marginTop: verticalScale(20),

 
 
},
TopUserInputContainer:
{
  width: '100%',
  height: Platform.OS === 'ios' ? verticalScale(85) : verticalScale(90),
  borderRadius: moderateScale(10),
  marginHorizontal: scale(1),
  marginTop: verticalScale(20),
  justifyContent: 'center',
 
},
InputContainer:
{
    
    paddingVertical: Platform.OS === 'ios' ? verticalScale(15) : verticalScale(10), 
    paddingHorizontal: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(6),
    borderRadius: moderateScale(10),
    backgroundColor: '#FFFFFF80',
    minHeight: Platform.OS === 'ios' ? verticalScale(50) : verticalScale(45),
   
},
inputholder:
{
    flex: 1,
    paddingLeft: scale(10),
    paddingRight: scale(10),
    fontSize: moderateScale(14),
    color: '#000000',
    minHeight: Platform.OS === 'ios' ? verticalScale(20) : verticalScale(15),

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
  marginLeft: scale(9),
  fontSize: moderateScale(14),
  color: '#ffffff',
},

linkText: {
  color: '#ffffff',
  textDecorationLine: 'underline',
  fontSize: moderateScale(14),
},
ButtonContainer:
{
  borderWidth:1,
  borderColor: '#ffffff',
  backgroundColor: '#1b46b5ff',
  paddingVertical: verticalScale(17),
 width: '100%',
  borderRadius: moderateScale(10),
  alignItems: 'center',
  marginTop: verticalScale(30),
 
},
lineContainer:
{
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: verticalScale(26),
  paddingHorizontal: scale(10),
},
ButtonGoogleContainer:
{ 
  backgroundColor: '#ffffff',
  paddingVertical: verticalScale(7),
  borderRadius: moderateScale(10),
  alignItems: 'center',
  marginTop: verticalScale(20),
width: '100%',
 
},
pictureGoogleContainer:
{
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: verticalScale(40)
 
},
HesapContanier:
{
  flexDirection: 'row',
  
 
  marginTop: verticalScale(20),
  paddingHorizontal: scale(10),
},

HesapText:
{
  fontSize: moderateScale(14),
  color: '#FFFFFF',
  textAlign: 'center',
},

})

