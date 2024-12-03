import { defineStore } from "pinia";
// import { ref } from "vue";
import { api } from "boot/axios";

export const usePostStore = defineStore("post", () => {

  const createPost = async (data) => {
    try {
      const response = await api.post("post/create", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      });
      console.log(response);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updatePost = async (data, postId) => {
    try {
      const response = await api.put(`post/update/${postId}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      });
      console.log(response);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getPostList = async ({ all = true, page = 1, limit = 10, sortBy = "createdAt", order = "desc" }) => {
    try {
      // Construct the query string with the provided parameters
      const queryParams = new URLSearchParams({
        all: all.toString(),
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        order,
      });

      // Make a GET request with the constructed query string
      const response = await api.get(`post/get?${queryParams.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      });

      console.log(response.data);
      return response?.data?.data?.posts || [];
    } catch (error) {
      console.error(error);
      return []
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await api.delete(`post/delete/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      });
      return response.data; // Return response if needed
    } catch (error) {
      console.error("Error deleting the post:", error.response?.data || error.message);
      throw error;
    }
  };

  const getPostDetails = async (postId) => {
    try {
      const response = await api.get(`post/get/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      });
      return response?.data?.data; // Return response if needed
    } catch (error) {
      console.error("Error deleting the post:", error.response?.data || error.message);
      throw error;
    }
  };

  return {
    createPost,
    getPostList,
    deletePost,
    getPostDetails,
    updatePost
  };
});
