<template>
  <div class="q-pa-lg">
    <div class="q-mb-sm text-body1 text-weight-bold text-grey-7">
      Recent questions from people you follow
    </div>
    <div
      :class="['post-wrapper', { 'post-wrapper-loader': isLoading && posts?.length == 0 }]"
    >
      <Posts
        v-for="post in posts"
        :key="post.id"
        class="q-pa-md"
        :post-id="post.id"
        :user-image="post.user.profilePicUrl"
        :user-id="post.user.id"
        :username="post.user.name"
        :time-ago="post.createdAt"
        :post-content="post.description"
        :post-images="post.images"
        :votes="post.votesCount"
        :comments="post.commentsCount"
        @fetch-new-post="fetchNewPosts()"
      />
      <q-spinner v-if="isLoading" color="primary" class="spinner" />
    </div>
  </div>
</template>

<script setup>
import Posts from "../components/posts.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { usePostStore } from "src/stores/postStore";
import { useQuasar } from "quasar";

const posts = ref([]);
const currentPage = ref(1); // Tracks the current page
const isLoading = ref(false); // Tracks the loading state
const hasMoreData = ref(true); // Tracks if more data is available
const postStore = usePostStore();
const $q = useQuasar();

const fetchNewPosts = async () => {
  isLoading.value = true;

  try {
    // Fetch new posts
    const newPosts = await postStore.getTrendingList({
      all: true,
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      order: "desc",
    });
    posts.value = newPosts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    // Optional: Show a notification to the user
    $q.notify({
      message: "Failed to load posts. Please try again later.",
      color: "negative",
      position: "top",
      timeout: 3000,
      icon: "error",
    });
  } finally {
    isLoading.value = false; // Reset the loading flag
  }
};

// Function to fetch posts
const fetchPosts = async () => {
  if (isLoading.value || !hasMoreData.value) return;

  isLoading.value = true;
  try {
    const newPosts = await postStore.getTrendingList({
      all: true,
      page: currentPage.value,
      limit: 10,
      sortBy: "createdAt",
      order: "desc",
    });
    // Check if newPosts contains data
    // Check if there are new posts
    if (newPosts.length > 0) {
      // Append new posts to the existing list
      posts.value.push(...newPosts); // Using .push() for better performance
      currentPage.value++; // Increment the page number
    } else {
      hasMoreData.value = false; // No more data to load
    }
  } catch (error) {
    $q.notify({
      message: "Failed to load posts. Please try again later.",
      color: "negative",
      position: "top",
      timeout: 3000,
      icon: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

// Infinite scroll handler
const onScroll = async () => {
  const scrollTop = window.scrollY; // Current scroll position from top
  const viewportHeight = window.innerHeight; // Height of the visible area
  const documentHeight = document.documentElement.scrollHeight; // Total height of the document
  if (scrollTop + viewportHeight >= documentHeight - 50) {
    // Near the bottom of the page
    await fetchPosts();
  }
};

// Add event listeners
onMounted(async () => {
  await fetchPosts(); // Load initial posts
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<style lang="scss" scoped>
html, body {
  height: 100%;
  overflow-y: scroll;
}
.profile-wrapper {
  gap: 12px;
  .profile-img {
    flex-shrink: 0;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #000;
  }
}
.post-wrapper {
  display: grid;
  gap: 26px;
  &-loader {
    justify-content: center;
  }
}
.spinner {
  justify-self: center;
}
</style>
