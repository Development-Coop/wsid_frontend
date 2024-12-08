<template>
  <div class="q-pa-lg">
    <div class="ask-question-container q-mb-lg">
      <q-img
        :src="user?.profilePic"
        class="user-avatar"
        spinner-color="primary"
        spinner-size="20px"
      />
      <div class="question-box">
        <q-btn
          flat
          icon="add"
          color="rgba(255, 87, 50, 0.08)"
          label="Ask a Question"
          class="ask-question-btn"
          unelevated
          @click="showAskQuePopup=true"
        />
      </div>
    </div>
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

  <q-dialog v-model="showViewQuePopup" persistent>
    <div class="popup-container">
      <ViewQuestion
        v-if="showViewQuePopup"
        :post-id="route?.query?.postId"
        :is-popup="true"
        @close="closeModal"
      />
      <q-btn
        flat
        round
        dense
        icon="close"
        class="close-button"
        @click="closeModal"
      />
    </div>
  </q-dialog>
  <q-dialog v-model="showAskQuePopup" persistent>
    <div class="popup-container">
      <AskQuestion
        :is-popup="true"
        @close="showAskQuePopup=false"
      />
      <q-btn
        flat
        round
        dense
        icon="close"
        class="close-button"
        @click="showAskQuePopup=false"
      />
    </div>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import Posts from "../components/posts.vue";
import { usePostStore } from "src/stores/postStore";
import { useProfileStore } from "src/stores/profileStore";
import { useRoute, useRouter } from "vue-router";
// components
import ViewQuestion from "src/pages/app/view/dashboard/view-question.vue";
import AskQuestion from "src/pages/app/view/dashboard/ask-question.vue";

const posts = ref([]);
const currentPage = ref(1); // Tracks the current page
const isLoading = ref(false); // Tracks the loading state
const hasMoreData = ref(true); // Tracks if more data is available
const postContainer = ref(null); // Ref for the container
const postStore = usePostStore();
const profileStore = useProfileStore();
const showViewQuePopup = ref(false);
const route = useRoute();
const router = useRouter();
const showAskQuePopup = ref(false);

const user = computed(() => {
  return JSON.parse(JSON.stringify(profileStore?.userDetails));
});

const closeModal = () => {
  showViewQuePopup.value = false;
  router.replace({
    path: router.currentRoute.value.path, // Keep the current path
    query: {}, // Clear the query object
  });
}

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
    container.scrollTop + container.clientHeight >= container.scrollHeight - 50 // Trigger when near the bottom
  ) {
    fetchPosts();
  }
};

// Add event listeners
onMounted(async () => {
  await fetchPosts(); // Load initial posts
  postContainer.value?.addEventListener("scroll", onScroll);
  const postId = route?.query?.postId;
  if (postId) {
    showViewQuePopup.value = true;

  }
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
.post-container {
  height: 100vh; /* Adjust height as needed */
  overflow-y: auto;
  padding: 16px;
}
.q-spinner {
  display: block;
  margin: 20px auto;
}
.question-box {
  flex-grow: 1;
  background-color: #fff5f2;
  padding: 4px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-avatar {
  height: 44px;
  width: 44px;
  border-radius: 50%;
  border: 2px solid #eaeaea;
  object-fit: cover;
}
.ask-question-btn {
  font-weight: 500;
  color: #f15b29;
}

:deep(.q-btn__content) {
  text-transform: none;
}
.ask-question-container {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 10px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  gap: 24px;
  text-transform: none;
}

.popup-container {
  width: 90vw;
  max-width: 600px;
  padding: 16px;
  background: #fff;
  position: relative;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}
</style>
