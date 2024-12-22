import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.VUE_APP_FB_API_KEY || "AIzaSyC1n2gEO1FshQGPwPBQxOcyucO1udJ7y08",
    authDomain: process.env.VUE_APP_FB_AUTH_DOMAIN || "wsid-3b236.firebaseapp.com",
    projectId: process.env.VUE_APP_FB_PROJECT_ID || "wsid-3b236",
  };

// Initialize Firebase App
const firebaseApp = initializeApp(firebaseConfig);

// Export Auth and Google Auth Provider
const auth = getAuth(firebaseApp);

export { auth };