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

  const getProfileDetails = async () => {
    try {
      const response = await api.get("/user/view");
      const data = response?.data?.data;
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
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateProfileDetails = async (data) => {
    try {
      const response = await api.put("user/edit", data);
      console.log(response);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    userDetails,
    getProfileDetails,
    updateProfileDetails,
  };
});
