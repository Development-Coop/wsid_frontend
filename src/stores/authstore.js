import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { api } from "boot/axios";

export const useAuthStore = defineStore("auth", () => {
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
    const searchTerm = userDetails.value.username
      .toLowerCase()
      .replace("@", "");
    return suggestions.value.filter((suggestion) =>
      suggestion.toLowerCase().includes(searchTerm)
    );
  });

  const restoreUserFromSession = () => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      userDetails.value = JSON.parse(storedUser);
    }
  };

  const registerStep1 = async (userData) => {
    try {
      const response = await api.post("/auth/register-step1", {
        name: userData.name,
        email: userData.phone_or_email, // Assuming it's an email
        dateOfBirth: userData.dob.split("-").reverse().join("/"), // Convert DD-MM-YYYY to YYYY/MM/DD
      });

      console.log("Registration step 1 successful:", response.data);
      userDetails.value = { ...userDetails.value, ...userData };
      sessionStorage.setItem("user", JSON.stringify(userDetails.value));
      return response?.data;
    } catch (error) {
      console.error("Registration step 1 error:", error);
      return error?.response?.data?.message || "Something went wrong!";
    }
  };

  const registerStep2 = async (otp, email) => {
    try {
      const response = await api.post("/auth/register-step2", {
        otp: otp,
        email: email,
      });
      return response?.data;
    } catch (error) {
      console.error("Error during OTP verification:", error);
      return error?.response?.data?.message || "Something went wrong!";
    }
  };

  const setPassword = (password) => {
    restoreUserFromSession();
    userDetails.value.password = password;
    sessionStorage.setItem("user", JSON.stringify(userDetails.value));
  };

  const setUsername = (username) => {
    restoreUserFromSession();
    userDetails.value.username = username;
    sessionStorage.setItem("user", JSON.stringify(userDetails.value));
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
    restoreUserFromSession();
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        userDetails.value.profilePicture = reader.result;
        sessionStorage.setItem("user", JSON.stringify(userDetails.value));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearProfilePicture = () => {
    userDetails.value.profilePicture = null;
  };

  const setBio = (newBio) => {
    restoreUserFromSession();
    userDetails.value.bio = newBio;
    sessionStorage.setItem("user", JSON.stringify(userDetails.value));
  };

  const bioLength = computed(() => userDetails.value.bio.length);

  const remainingBioChars = computed(() => 160 - bioLength.value);

  const isBioValid = computed(() => userDetails.value.bio.length > 0);

  const registerStep3 = async () => {
    try {
      restoreUserFromSession();
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

      const response = await api.post("/auth/register-step3", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Registration step 3 successful:", response.data);
      sessionStorage.clear();
      localStorage.setItem("refresh-token", response?.data?.data?.refreshToken);
      localStorage.setItem("access-token", response?.data?.data?.accessToken);
      return response?.data;
    } catch (error) {
      console.error("Registration step 3 error:", error);
      return error?.response?.data?.message || "Something went wrong!";
    }
  };

  const login = async () => {
    const errors = ref({
      login: "",
    });
    errors.value.login = ""; // Clear previous errors
    try {
      const response = await api.post(
        "/auth/login",
        {
          emailOrUsername: userDetails.value.phone_or_email,
          password: userDetails.value.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("refresh-token", response?.data?.data?.refreshToken);
      localStorage.setItem("access-token", response?.data?.data?.accessToken);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      errors.value.login =
        error.response?.data?.message || "Login failed. Please try again.";
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    const errors = ref({
      fp: "",
    });
    errors.value.fp = ""; // Clear previous errors
    try {
      const response = await api.post(
        "/auth/forgot-password",
        {
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.status;
    } catch (error) {
      return false;
    }
  };

  const resetPassword = async (email, otp, password) => {
    try {
      const response = await api.post(
        "/auth/reset-password",
        {
          email,
          otp,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response?.data;
    } catch (error) {
      return error?.response?.data?.message || "Something went wrong!";
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
    forgotPassword,
    resetPassword,
  };
});
