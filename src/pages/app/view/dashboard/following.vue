<template>
  <q-page class="q-pb-xl">
    <div v-for="post in posts" :key="post.id" class="post-wrapper">
      <Posts
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
      />
    </div>
    <q-spinner v-if="isLoading" color="primary" class="spinner q-mt-md" />
  </q-page>
</template>

<script setup>
import Posts from "../../components/posts.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { usePostStore } from "src/stores/postStore";
import { useQuasar } from "quasar";

const posts = ref([]);
const currentPage = ref(1); // Tracks the current page
const isLoading = ref(false); // Tracks the loading state
const hasMoreData = ref(true); // Tracks if more data is available
const postStore = usePostStore();
const $q = useQuasar();

// Function to fetch posts
const fetchPosts = async () => {
  if (isLoading.value || !hasMoreData.value) return;

  isLoading.value = true;
  try {
    const newPosts = await postStore.getPostList({
      all: true,
      page: currentPage.value,
      limit: 10,
      sortBy: "createdAt",
      order: "desc",
    });
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

let scrollTimeout;

const onScroll = async () => {
  if (scrollTimeout) return; // Skip if a timeout is active
  scrollTimeout = setTimeout(async () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + viewportHeight >= documentHeight - 50) {
      await fetchPosts();
    }
    scrollTimeout = null; // Reset timeout
  }, 100); // Adjust debounce delay as needed
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

<style scoped lang="scss">
.q-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto; // Ensures vertical scrolling is enabled
  -webkit-overflow-scrolling: touch; // Adds smooth scrolling for mobile browsers
}
.post-wrapper {
  display: grid;
  &:not(:last-child) {
    border-bottom: 1px solid #aeaeb2;
  }
}
.spinner {
  justify-self: center;
}
</style>
