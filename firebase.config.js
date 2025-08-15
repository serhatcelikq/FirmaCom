import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Firebase konfigürasyon bilgileri
// Bu bilgileri Firebase Console'dan alın
const firebaseConfig = {
  apiKey: "AIzaSyCjTuBhBH26jt_X2tLeLG9P9YOo4SdShyw",
  authDomain: "firmacommm.firebaseapp.com",
  projectId: "firmacommm",
  storageBucket: "firmacommm.firebasestorage.app",
  messagingSenderId: "133076138558",
  appId: "1:133076138558:android:e8733ae75c330558b96f6f",

};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Firebase servislerini export et
export { auth };
export default app;

// Firebase Authentication yardımcı fonksiyonları
export const firebaseAuth = {
  // Email ile giriş
  signInWithEmail: async (email, password) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Email ile kayıt
  signUpWithEmail: async (email, password) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Çıkış yap
  signOut: async () => {
    try {
      await auth().signOut();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Şifre sıfırlama
  resetPassword: async (email) => {
    try {
      await auth().sendPasswordResetEmail(email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Mevcut kullanıcıyı al
  getCurrentUser: () => {
    return auth().currentUser;
  },

  // Auth state değişikliklerini dinle
  onAuthStateChanged: (callback) => {
    return auth().onAuthStateChanged(callback);
  },

  // Google ile giriş
  signInWithGoogle: async () => {
    try {
      // Google Sign-In işlemini başlat
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Google kullanıcı bilgilerini al
      const { idToken } = await GoogleSignin.signIn();
      
      // Google credential oluştur
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
      // Firebase ile giriş yap
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      return { success: false, error: error.message };
    }
  },

  // Google hesabından çıkış
  signOutFromGoogle: async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
