import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "boot/axios";

export const usePostStore = defineStore("post", () => {
  const posts = ref([]); // Centralized post list
  const trendingPosts = ref([]); // Trending feed
  const homePosts = ref([]); // Home feed

  const createPost = async (data) => {
    try {
      await api.post("post/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
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
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getPostList = async ({
    all = true,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
    uid = "",
  }) => {
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
      return [];
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await api.delete(`post/delete/${postId}`);
      return response.data; // Return response if needed
    } catch (error) {
      console.error(
        "Error deleting the post:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const getPostDetails = async (postId) => {
    try {
      const response = await api.get(`post/get/${postId}`);
      return response?.data?.data; // Return response if needed
    } catch (error) {
      console.error(
        "Error deleting the post:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const getTrendingList = async ({
    all = true,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
  }) => {
    try {
      const queryParams = new URLSearchParams({
        all: all.toString(),
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        order,
      });
      // Make a GET request with the constructed query string
      const response = await api.get(
        `post/trending?${queryParams.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response?.data?.data?.posts || [];
    } catch (error) {
      console.error(error);
      return [];
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
          "Content-Type": "application/json",
        },
      });
      return response?.data?.data || [];
    } catch (error) {
      console.error(error);
      return [];
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
          "Content-Type": "application/json",
        },
      });
      return response?.data?.data || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const searchPost = async (text) => {
    try {
      // Make a GET request with the constructed query string
      const response = await api.get(`post/search?query=${text}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response?.data?.data || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // Set posts (for initial fetch or replace)
  function setPosts(newPosts) {
    posts.value = newPosts;
  }
  // Update a single post by id
  function updatePostInStore(postId, updatedData) {
    const idx = posts.value.findIndex((p) => p.id === postId);
    if (idx !== -1) {
      posts.value[idx] = { ...posts.value[idx], ...updatedData };
    }
  }

  function setTrendingPosts(newPosts) {
    trendingPosts.value = newPosts;
  }
  function setHomePosts(newPosts) {
    homePosts.value = newPosts;
  }
  function updateTrendingPostInStore(postId, updatedData) {
    const idx = trendingPosts.value.findIndex((p) => p.id === postId);
    if (idx !== -1) {
      trendingPosts.value[idx] = {
        ...trendingPosts.value[idx],
        ...updatedData,
      };
    }
    // Also update in homePosts if present
    const homeIdx = homePosts.value.findIndex((p) => p.id === postId);
    if (homeIdx !== -1) {
      homePosts.value[homeIdx] = {
        ...homePosts.value[homeIdx],
        ...updatedData,
      };
    }
  }
  function updateHomePostInStore(postId, updatedData) {
    const idx = homePosts.value.findIndex((p) => p.id === postId);
    if (idx !== -1) {
      homePosts.value[idx] = { ...homePosts.value[idx], ...updatedData };
    }
    // Also update in trendingPosts if present
    const trendingIdx = trendingPosts.value.findIndex((p) => p.id === postId);
    if (trendingIdx !== -1) {
      trendingPosts.value[trendingIdx] = {
        ...trendingPosts.value[trendingIdx],
        ...updatedData,
      };
    }
  }

  function addNewPostToFeeds(newPost) {
    // Add to homePosts
    const homeUnique = [newPost, ...homePosts.value].filter(
      (post, index, self) => index === self.findIndex((p) => p.id === post.id)
    );
    homePosts.value = homeUnique;
    // Add to trendingPosts
    const trendingUnique = [newPost, ...trendingPosts.value].filter(
      (post, index, self) => index === self.findIndex((p) => p.id === post.id)
    );
    trendingPosts.value = trendingUnique;
  }

  return {
    posts,
    trendingPosts,
    homePosts,
    setPosts,
    setTrendingPosts,
    setHomePosts,
    updatePostInStore,
    updateTrendingPostInStore,
    updateHomePostInStore,
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
    searchPost,
    addNewPostToFeeds,
  };
});
