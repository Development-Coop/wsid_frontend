<template>
  <div class="q-pa-lg">
    <div class="ask-question-container q-mb-lg">
      <q-img
        :src="user?.profilePic"
        class="user-avatar cursor-pointer"
        spinner-color="primary"
        spinner-size="20px"
        @click="router.push({name: 'web-dashboard-profile'})"
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
    <div class="post-container">
      <div class="post-wrapper">
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
        <q-spinner v-if="isLoading" color="primary" />
      </div>
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
        @close="closePopup"
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
import { useQuasar } from "quasar";
// components
import ViewQuestion from "src/pages/app/view/dashboard/view-question.vue";
import AskQuestion from "src/pages/app/view/dashboard/ask-question.vue";

const posts = ref([]);
const currentPage = ref(1); // Tracks the current page
const isLoading = ref(false); // Tracks the loading state
const hasMoreData = ref(true); // Tracks if more data is available
const postStore = usePostStore();
const profileStore = useProfileStore();
const showViewQuePopup = ref(false);
const route = useRoute();
const router = useRouter();
const showAskQuePopup = ref(false);
const $q = useQuasar();

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

const closePopup = async() => {
  showAskQuePopup.value=false;
  await fetchNewPosts();
};

const fetchNewPosts = async () => {
  isLoading.value = true;

  try {
    // Fetch new posts
    const newPosts = await postStore.getPostList({
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
  // Prevent duplicate requests or unnecessary calls
  if (isLoading.value || !hasMoreData.value) return;

  isLoading.value = true;

  try {
    // Fetch new posts
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

const onScroll = async () => {
  const scrollTop = window.scrollY; // Current scroll position from top
  const viewportHeight = window.innerHeight; // Height of the visible area
  const documentHeight = document.documentElement.scrollHeight; // Total height of the document
  if (scrollTop + viewportHeight >= documentHeight - 50) {
    // Near the bottom of the page
    await fetchPosts();
  }
};

onMounted(async () => {
  await fetchPosts(); // Load initial posts
  window.addEventListener("scroll", onScroll); // Attach to window scroll
  const postId = route?.query?.postId;
  if (postId) {
    showViewQuePopup.value = true;
  }
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
