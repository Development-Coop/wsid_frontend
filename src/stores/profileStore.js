import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from 'boot/axios';

export const useProfileStore = defineStore('profile', () => {
    const userDetails = ref({
        "id": "",
        "name": "",
        "dateOfBirth": "",
        "username": "",
        "profilePic": "",
        "bio": "bio",
        "createdAt": "",
        "likesCount": 0,
        "followersCount": 0,
        "followingCount": 0
    });

    const getProfileDetails = async () => {
        try {
            const response = await api.get('/user/view', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access-token')}`
                }
            });
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
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return {
        userDetails,
        getProfileDetails
    };
});