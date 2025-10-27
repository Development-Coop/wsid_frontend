import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey:
    process.env.VUE_APP_FB_API_KEY || "AIzaSyC1n2gEO1FshQGPwPBQxOcyucO1udJ7y08",
  authDomain:
    process.env.VUE_APP_FB_AUTH_DOMAIN || "wsid-3b236.firebaseapp.com",
  projectId: process.env.VUE_APP_FB_PROJECT_ID || "wsid-3b236",
    appId: "1:180937901593:web:f0ccea18856cc029d00c88",
    measurementId: "G-0DCP15K3SL",

};

// Initialize Firebase App
const firebaseApp = initializeApp(firebaseConfig);

// Export Auth and Google Auth Provider
const auth = getAuth(firebaseApp);

const analytics = getAnalytics(firebaseApp);


export { auth, analytics };
