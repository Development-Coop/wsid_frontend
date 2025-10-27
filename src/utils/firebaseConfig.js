import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey:
    process.env.VUE_APP_FB_API_KEY || "AIzaSyC1n2gEO1FshQGPwPBQxOcyucO1udJ7y08",
  authDomain:
    process.env.VUE_APP_FB_AUTH_DOMAIN || "wsid-3b236.firebaseapp.com",
  projectId: process.env.VUE_APP_FB_PROJECT_ID || "wsid-3b236",
  appId: process.env.VUE_APP_FB_APP_ID || "1:180937901593:web:f0ccea18856cc029d00c88",
  measurementId: process.env.VUE_APP_FB_MEASUREMENT_ID || "G-0DCP15K3SL",
};

// Initialize Firebase App
const firebaseApp = initializeApp(firebaseConfig);

// Export Auth
const auth = getAuth(firebaseApp);

// Initialize Analytics synchronously
let analytics = null;

try {
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(firebaseApp);
    console.log('✅ Firebase Analytics initialized');
  }
} catch (error) {
  console.error('❌ Error initializing Firebase Analytics:', error);
}

export { auth, analytics };