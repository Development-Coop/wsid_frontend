import { auth } from "./firebaseConfig";
import { api } from "boot/axios";
import { signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

export default async function googleSignIn() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    const response = await api.post("/auth/login-with-google", { idToken });
    localStorage.setItem("refresh-token", response?.data?.data?.refreshToken);
    localStorage.setItem("access-token", response?.data?.data?.accessToken);
    return response?.data;
  } catch (error) {
    console.error("Authentication failed:", error);
    throw error;
  }
}
