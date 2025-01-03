import { defineStore } from "pinia";
// import { ref } from "vue";
import { api } from "boot/axios";

export const usePostStore = defineStore("post", () => {

  const createPost = async (data) => {
    try {
      await api.post("post/create", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updatePost = async (data, postId) => {
    try {
      await api.put(`post/update/${postId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getPostList = async ({ all = true, page = 1, limit = 10, sortBy = "createdAt", order = "desc", uid = "" }) => {
    try {
      // Construct the query string with the provided parameters
      const queryParams = new URLSearchParams({
        all: all.toString(),
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        order,
        uid,
      });

      // Make a GET request with the constructed query string
      const response = await api.get(`post/get?${queryParams.toString()}`);

      return response?.data?.data?.posts || [];
    } catch (error) {
      console.error(error);
      return []
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await api.delete(`post/delete/${postId}`);
      return response.data; // Return response if needed
    } catch (error) {
      console.error("Error deleting the post:", error.response?.data || error.message);
      throw error;
    }
  };

  const getPostDetails = async (postId) => {
    try {
      const response = await api.get(`post/get/${postId}`);
      return response?.data?.data; // Return response if needed
    } catch (error) {
      console.error("Error deleting the post:", error.response?.data || error.message);
      throw error;
    }
  };

  const getTrendingList = async ({ all = true, page = 1, limit = 10, sortBy = "createdAt", order = "desc" }) => {
    try {
      const queryParams = new URLSearchParams({
        all: all.toString(),
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        order,
      });
      // Make a GET request with the constructed query string
      const response = await api.get(`post/trending?${queryParams.toString()}`, {
        headers: {
          "Content-Type": "application/json"
        },
      });
      return response?.data?.data?.posts || [];
    } catch (error) {
      console.error(error);
      return []
    }
  };

  const createVote = async (data) => {
    try {
      await api.post("vote/create", data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const createComment = async (data) => {
    try {
      await api.post("comment/create", data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getCommentsList = async (postId) => {
    try {
      // Make a GET request with the constructed query string
      const response = await api.get(`comment/get/${postId}`, {
        headers: {
          "Content-Type": "application/json"
        },
      });
      return response?.data?.data || [];
    } catch (error) {
      console.error(error);
      return []
    }
  };

  const addLike = async (postId) => {
    try {
      await api.post(`comment/like/${postId}`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const addDislike = async (postId) => {
    try {
      await api.post(`comment/dislike/${postId}`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const followUser = async (data) => {
    try {
      await api.post("user/follow", data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const searchProfile = async (text) => {
    try {
      // Make a GET request with the constructed query string
      const response = await api.get(`user/search?query=${text}`, {
        headers: {
          "Content-Type": "application/json"
        },
      });
      return response?.data?.data || [];
    } catch (error) {
      console.error(error);
      return []
    }
  };

  const searchPost = async (text) => {
    try {
      // Make a GET request with the constructed query string
      const response = await api.get(`post/search?query=${text}`, {
        headers: {
          "Content-Type": "application/json"
        },
      });
      return response?.data?.data || [];
    } catch (error) {
      console.error(error);
      return []
    }
  };

  return {
    createPost,
    getPostList,
    deletePost,
    getPostDetails,
    updatePost,
    getTrendingList,
    createVote,
    createComment,
    getCommentsList,
    addLike,
    addDislike,
    followUser,
    searchProfile,
    searchPost
  };
});
