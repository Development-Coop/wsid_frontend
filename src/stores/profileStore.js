import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "boot/axios";

export const useProfileStore = defineStore("profile", () => {
  const userDetails = ref({
    id: "",
    name: "",
    dateOfBirth: "",
    username: "",
    profilePic: "",
    bio: "bio",
    createdAt: "",
    likesCount: 0,
    followersCount: 0,
    followingCount: 0,
    coverPic: "",
  });

  const getProfileDetails = async (uid="") => {
    try {
      const response = await api.get(`user/view?uid=${uid}`);
      const data = response?.data?.data;
      if (!uid) {
        userDetails.value = {
          id: data?.user?.id,
          name: data?.user?.name,
          dateOfBirth: data?.user?.dateOfBirth,
          username: data?.user?.username,
          profilePic: data?.user?.profilePic,
          bio: data?.user?.bio,
          createdAt: data?.user?.createdAt,
          likesCount: data?.likesCount,
          followersCount: data?.followersCount,
          followingCount: data?.followingCount,
          coverPic: data?.user?.coverPic,
        };
      } else {
        return data;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateProfileDetails = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("username", data.username);

      // Convert base64 to Blob
      if (data.profilePic && !(typeof data.profilePic === "string" && data.profilePic.startsWith("http"))) {
        const response = await fetch(data.profilePic);
        const blob = await response.blob();
        formData.append("profilePic", blob, "profile.png");
      }
      formData.append("bio", data.bio);
      formData.append("dateOfBirth", data.dateOfBirth);
      await api.post("user/edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await getProfileDetails();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteAccount = async (password) => {
    try {
      console.log("Calling delete account API with password...");
      
      // Check if we have an access token
      const accessToken = localStorage.getItem('access-token');
      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }
      
      const response = await api.delete("user/delete-account", {
        data: { password }, // Send password in request body
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
      });
  
      console.log("Delete account response:", response.data);
      return response.data;
      
    } catch (error) {
      console.error("Delete account API error:", error);
      console.error("Error response:", error.response);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      
      // Re-throw the error so the component can handle it
      throw error;
    }
  };

  return {
    userDetails,
    getProfileDetails,
    updateProfileDetails,
    deleteAccount,
  };
});
