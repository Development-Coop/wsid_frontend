import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from 'boot/axios';

export const useAuthStore = defineStore('auth', () => {
  const userDetails = ref({
    name: "",
    phone_or_email: "",
    dob: "",
    password: "",
    username: "",
    profilePicture: null,
    bio: "",
  });

  const placeholderImage = ref(
    new URL("../assets/icons/placeholder-icon.svg", import.meta.url).href
  );

  const suggestions = ref([
    "@Doe.Alex123",
    "@Alex.Doe",
    "@123DoeAlex",
    "@User123",
    "@John.Doe",
    "@Jane.Doe",
    "@CoolUser",
  ]);

  const isValidUsername = ref(true);

  const filteredSuggestions = computed(() => {
    const searchTerm = userDetails.value.username.toLowerCase().replace("@", "");
    return suggestions.value.filter((suggestion) =>
      suggestion.toLowerCase().includes(searchTerm)
    );
  });

  const registerStep1 = async (userData) => {
    try {
      const response = await api.post('/auth/register-step1', {
        name: userData.name,
        email: userData.phone_or_email, // Assuming it's an email
        dateOfBirth: userData.dob.split('-').reverse().join('/') // Convert DD-MM-YYYY to YYYY/MM/DD
      });
      
      console.log("Registration step 1 successful:", response.data);
      userDetails.value = { ...userDetails.value, ...userData };
      return true;
    } catch (error) {
      console.error("Registration step 1 error:", error);
      return false;
    }
  };

  const registerStep2 = async (otp, email) => {
    try {
      const response = await api.post('/auth/register-step2', {
        otp: otp,
        email: email
      });
      
      if (response.data.status) {
        console.log("OTP verification successful:", response.data);
        return true;
      } else {
        console.error('OTP verification failed:', response.data.message);
        return false;
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      return false;
    }
  };

  const setPassword = (password) => {
    userDetails.value.password = password;
  };

  const setUsername = (username) => {
    userDetails.value.username = username;
  };

  const validateUsername = (input) => {
    const validPattern = /^[a-zA-Z0-9._]*$/;
    const noConsecutiveDotsPattern = /\.{2,}/;

    if (
      input.length > 15 ||
      !validPattern.test(input) ||
      noConsecutiveDotsPattern.test(input)
    ) {
      isValidUsername.value = false;
    } else {
      isValidUsername.value = true;
    }

    return isValidUsername.value;
  };

  const clearUserData = () => {
    userDetails.value = {
      name: "",
      phone_or_email: "",
      dob: "",
      password: "",
      username: "",
    };
  };

  const setProfilePicture = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        userDetails.value.profilePicture = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const clearProfilePicture = () => {
    userDetails.value.profilePicture = null;
  };

  const setBio = (newBio) => {
    userDetails.value.bio = newBio;
  };

  const bioLength = computed(() => userDetails.value.bio.length);

  const remainingBioChars = computed(() => 160 - bioLength.value);

  const isBioValid = computed(() => userDetails.value.bio.length > 0);

  const registerStep3 = async () => {
    try {
      const formData = new FormData();
      formData.append("email", userDetails.value.phone_or_email);
      formData.append("password", userDetails.value.password);
      formData.append("username", userDetails.value.username);
      
      // Convert base64 to Blob
      if (userDetails.value.profilePicture) {
        const response = await fetch(userDetails.value.profilePicture);
        const blob = await response.blob();
        formData.append("profilePic", blob, "profile.png");
      }
      
      formData.append("bio", userDetails.value.bio);

      const response = await api.post('/auth/register-step3', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("Registration step 3 successful:", response.data);
      return true;
    } catch (error) {
      console.error("Registration step 3 error:", error);
      return false;
    }
  };

  const login = async () => {
    const errors = ref({
      login: "",
    });
    errors.value.login = ""; // Clear previous errors
    try {
      const response = await api.post('/api/auth/login', {
        emailOrUsername: userDetails.value.phone_or_email,
        password: userDetails.value.password
      }, {
        headers: { 
          'Content-Type': 'application/json',
        }
      });
      
      console.log("Login successful:", response.data);
      // You might want to store the user token or other data here
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      errors.value.login = error.response?.data?.message || "Login failed. Please try again.";
      throw error;
    }
  };

  const clearErrors = () => {
    errors.value = {
      login: "",
    };
  };

  const errors = ref({
    phone_or_email: "",
    password: "",
    login: "",
  });

  return {
    userDetails,
    placeholderImage,
    suggestions,
    isValidUsername,
    filteredSuggestions,
    registerStep1,
    registerStep2,
    setPassword,
    setUsername,
    validateUsername,
    clearUserData,
    setProfilePicture,
    clearProfilePicture,
    setBio,
    bioLength,
    remainingBioChars,
    isBioValid,
    registerStep3,
    login,
    errors,
    clearErrors,
  };
});
