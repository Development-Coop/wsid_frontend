import { OAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { api } from "boot/axios";

export default async function appleSignIn() {
  const provider = new OAuthProvider('apple.com');
  provider.addScope("email");
  provider.addScope("name");
  try {
    const result = await signInWithPopup(auth, provider);

    // The signed-in user info
    const user = result?.user;

    // Get ID Token
    const idToken = await user.getIdToken();

    const response = await api.post("/auth/login-with-apple",{ idToken });
    localStorage.setItem("refresh-token", response?.data?.data?.refreshToken);
    localStorage.setItem("access-token", response?.data?.data?.accessToken);
    return response?.data;
  } catch (error) {
    console.error("Apple Sign-In failed:", error);
    throw error;
  }
}