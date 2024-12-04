<template>
  <div class="q-pa-lg">
    <div class="q-mb-sm text-body1 text-weight-bold text-grey-7">
      Recent questions from people you follow
    </div>
    <div ref="postContainer" class="post-wrapper">
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
      />
      <q-spinner v-if="isLoading" color="primary" />
    </div>
  </div>
</template>

<script setup>
import Posts from "../components/posts.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { usePostStore } from "src/stores/postStore";

const posts = ref([]);
const currentPage = ref(1); // Tracks the current page
const isLoading = ref(false); // Tracks the loading state
const hasMoreData = ref(true); // Tracks if more data is available
const postContainer = ref(null); // Ref for the container
const postStore = usePostStore();

// Function to fetch posts
const fetchPosts = async () => {
  if (isLoading.value || !hasMoreData.value) return;

  isLoading.value = true;
  try {
    const newPosts = await postStore.getTrendingList();
    // Check if newPosts contains data
    if (newPosts.length > 0) {
      posts.value = [...posts.value, ...newPosts];
      currentPage.value++;
    } else {
      hasMoreData.value = false; // No more data to load
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  } finally {
    isLoading.value = false;
  }
};

// Infinite scroll handler
const onScroll = () => {
  const container = postContainer.value;
  if (
    container.scrollTop + container.clientHeight >=
    container.scrollHeight - 50 // Trigger when near the bottom
  ) {
    fetchPosts();
  }
};

// Add event listeners
onMounted(async () => {
  await fetchPosts(); // Load initial posts
  postContainer.value?.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  postContainer.value?.removeEventListener("scroll", onScroll);
});
</script>

<style scoped>
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
}
</style>
