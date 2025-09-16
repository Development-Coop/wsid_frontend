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
      const rawPosts = response?.data?.data || [];
      // Return posts with merged voting status
      return mergePostsWithStoredVotingStatus(rawPosts);
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // Get user voting status for specific posts
  const getUserVotingStatus = async (postIds) => {
    try {
      const response = await api.post("vote/user-status", {
        postIds: postIds,
      });
      return response?.data?.data || {};
    } catch (error) {
      console.error("Error fetching user voting status:", error);
      return {};
    }
  };

  // Enhanced function to get posts with user voting status
  const getPostsWithUserStatus = async (posts, fetchUserStatus = true) => {
    if (!fetchUserStatus || !posts.length) return posts;

    try {
      const postIds = posts.map((post) => post.id);
      const userVotingStatus = await getUserVotingStatus(postIds);

      return posts.map((post) => ({
        ...post,
        hasVoted: userVotingStatus[post.id] || false,
      }));
    } catch (error) {
      console.error("Error fetching user voting status:", error);
      return posts;
    }
  };

  // Local storage functions for user voting status
  const getUserVotingStatusFromStorage = () => {
    try {
      const stored = localStorage.getItem("user-voting-status");
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Error reading voting status from storage:", error);
      return {};
    }
  };

  const saveUserVotingStatusToStorage = (postId, hasVoted) => {
    try {
      const currentStatus = getUserVotingStatusFromStorage();
      currentStatus[postId] = hasVoted;
      localStorage.setItem("user-voting-status", JSON.stringify(currentStatus));
    } catch (error) {
      console.error("Error saving voting status to storage:", error);
    }
  };

  // Enhanced function to merge posts with stored voting status
  //NOTE - We are now doing this from the backend so these methods that store as cookies are antiquated
  const mergePostsWithStoredVotingStatus = (posts) => {
    if (!posts.length) return posts;

    // const storedVotingStatus = getUserVotingStatusFromStorage();

    return posts.map((post) => ({
      ...post,
      // hasVoted: storedVotingStatus[post.id] || false,
    }));
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
    trendingPosts.value = mergePostsWithStoredVotingStatus(newPosts);
  }
  function setHomePosts(newPosts) {
    homePosts.value = mergePostsWithStoredVotingStatus(newPosts);
  }
  function updateTrendingPostInStore(postId, updatedData) {
    const idx = trendingPosts.value.findIndex((p) => p.id === postId);
    if (idx !== -1) {
      trendingPosts.value[idx] = {
        ...trendingPosts.value[idx],
        ...updatedData,
      };

      // Save voting status to local storage if it's being updated
      if (updatedData.hasVoted !== undefined) {
        saveUserVotingStatusToStorage(postId, updatedData.hasVoted);
      }
    }
    // Also update in homePosts if present
    const homeIdx = homePosts.value.findIndex((p) => p.id === postId);
    if (homeIdx !== -1) {
      homePosts.value[homeIdx] = {
        ...homePosts.value[homeIdx],
        ...updatedData,
      };

      // Save voting status to local storage if it's being updated
      if (updatedData.hasVoted !== undefined) {
        saveUserVotingStatusToStorage(postId, updatedData.hasVoted);
      }
    }
  }
  function updateHomePostInStore(postId, updatedData) {
    const idx = homePosts.value.findIndex((p) => p.id === postId);
    if (idx !== -1) {
      homePosts.value[idx] = { ...homePosts.value[idx], ...updatedData };

      // Save voting status to local storage if it's being updated
      if (updatedData.hasVoted !== undefined) {
        saveUserVotingStatusToStorage(postId, updatedData.hasVoted);
      }
    }
    // Also update in trendingPosts if present
    const trendingIdx = trendingPosts.value.findIndex((p) => p.id === postId);
    if (trendingIdx !== -1) {
      trendingPosts.value[trendingIdx] = {
        ...trendingPosts.value[trendingIdx],
        ...updatedData,
      };

      // Save voting status to local storage if it's being updated
      if (updatedData.hasVoted !== undefined) {
        saveUserVotingStatusToStorage(postId, updatedData.hasVoted);
      }
    }
  }

  function addNewPostToFeeds(newPost) {
    // Add to homePosts
    const homeUnique = [newPost, ...homePosts.value].filter(
      (post, index, self) => index === self.findIndex((p) => p.id === post.id)
    );
    homePosts.value = mergePostsWithStoredVotingStatus(homeUnique);
    // Add to trendingPosts
    const trendingUnique = [newPost, ...trendingPosts.value].filter(
      (post, index, self) => index === self.findIndex((p) => p.id === post.id)
    );
    trendingPosts.value = mergePostsWithStoredVotingStatus(trendingUnique);
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
    getUserVotingStatus,
    getPostsWithUserStatus,
    getUserVotingStatusFromStorage,
    saveUserVotingStatusToStorage,
    mergePostsWithStoredVotingStatus,
  };
});
