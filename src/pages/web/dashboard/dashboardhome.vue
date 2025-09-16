<template>
  <div class="q-pa-lg" style="max-width: 600px; margin: 0 auto">
    <div class="post-container">
      <div class="post-wrapper">
        <template v-if="isLoading && posts.length === 0">
          <div v-for="n in 5" :key="n" class="skeleton-post q-pa-md">
            <div class="flex no-wrap">
              <q-skeleton
                type="QAvatar"
                size="44px"
                style="flex-shrink: 0"
                class="q-mr-md"
              />
              <div class="full-width">
                <q-skeleton type="text" width="40%" class="q-mb-sm" />
                <q-skeleton type="text" width="60%" class="q-mb-sm" />
                <q-skeleton type="text" width="80%" class="q-mb-md" />
                <div class="flex q-gutter-md">
                  <q-skeleton type="text" width="20%" />
                  <q-skeleton type="text" width="20%" />
                </div>
              </div>
            </div>
          </div>
        </template>
        <Posts
          v-for="post in posts"
          :key="post.id"
          class="q-pa-md"
          :post-id="post.id"
          :user-image="post.user.profilePicUrl"
          :user-id="post.user.id"
          :username="post.user.name"
          :time-ago="post.createdAt"
          :post-title="post.title"
          :post-content="post.description"
          :post-images="post.images"
          :votes="post.votesCount"
          :comments="post.commentsCount"
          :has-voted="post.hasVoted"
          :is-own-posts="post.user.id === profileStore.userDetails?.id"
          @update-post="updatePost"
        />
        <q-spinner v-if="isLoading && posts.length > 0" color="primary" />
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
        @question-answered="handleQuestionAnswered"
        @update-post="updatePost"
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
      <AskQuestion :is-popup="true" @close="closePopup" />
      <q-btn
        flat
        round
        dense
        icon="close"
        class="close-button"
        @click="showAskQuePopup = false"
      />
    </div>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import Posts from "../components/posts.vue";
import { usePostStore } from "src/stores/postStore";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
// components
import ViewQuestion from "src/pages/web/components/view-question.vue";
import AskQuestion from "src/components/ask-question.vue";
import { useProfileStore } from "src/stores/profileStore";

const postStore = usePostStore();
const profileStore = useProfileStore();
const posts = computed(() => postStore.homePosts);
const currentPage = ref(1); // Tracks the current page
const isLoading = ref(false); // Tracks the loading state
const hasMoreData = ref(true); // Tracks if more data is available
const showViewQuePopup = ref(false);
const route = useRoute();
const router = useRouter();
const showAskQuePopup = ref(false);
const $q = useQuasar();

const closeModal = () => {
  showViewQuePopup.value = false;
  router.replace({
    path: router.currentRoute.value.path, // Keep the current path
    query: {}, // Clear the query object
  });
};

const closePopup = () => {
  showAskQuePopup.value = false;
  // No need to fetch new posts when just closing the ask question popup
};

// Function to handle question answered - don't close modal, let user see results
const handleQuestionAnswered = () => {
  // Don't close the modal here - let the user see the results and close manually
};

//UPDATE:- This function was reloading the page. That is not a good approach, we should only be updating one post
// const fetchNewPosts = async () => {
//   isLoading.value = true;

//   try {
//     // Fetch new posts
//     const newPosts = await postStore.getPostList({
//       all: true,
//       page: 1,
//       limit: 10,
//       sortBy: "createdAt",
//       order: "desc",
//     });
//     posts.value = newPosts;
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     // Optional: Show a notification to the user
//     $q.notify({
//       message: "Failed to load posts. Please try again later.",
//       color: "negative",
//       position: "top",
//       timeout: 3000,
//       icon: "error",
//     });
//   } finally {
//     isLoading.value = false; // Reset the loading flag
//   }
// };

//NOTE:- instead, this function will be used which will update only one individual post after it has been answered
const updatePost = (postId, updatedData) => {
  postStore.updateHomePostInStore(postId, updatedData);
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
      // Merge posts with stored voting status from local storage
      console.log(newPosts)

      const merged = [...postStore.homePosts, ...newPosts];
      const unique = merged.filter(
        (post, index, self) => index === self.findIndex((p) => p.id === post.id)
      );
      postStore.setHomePosts(unique);
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
  // Check for query params immediately
  const openAskQuestion = route?.query?.openAskQuestion;
  const postId = route?.query?.postId;

  if (openAskQuestion) {
    showAskQuePopup.value = true;
    // Clear the query parameter after opening
    router.replace({
      path: router.currentRoute.value.path,
      query: {},
    });
  }

  if (postId) {
    showViewQuePopup.value = true;
  }

  // Handle data fetching separately
  await fetchPosts();
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});

// Add this watch effect
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.openAskQuestion) {
      showAskQuePopup.value = true;
      // Clear the query parameter after opening
      router.replace({
        path: router.currentRoute.value.path,
        query: {},
      });
    }

    if (newQuery.postId) {
      showViewQuePopup.value = true;
    }
  },
  { immediate: true } // This will run the watcher immediately on component creation
);
</script>

<style lang="scss" scoped>
html,
body {
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
.skeleton-post {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.q-spinner {
  display: block;
  margin: 20px auto;
}
.question-box {
  flex-grow: 1;
  background-color: #fff5f2;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  button {
    width: 100%;
    padding: 4px 20px;
  }
}
.user-avatar {
  height: 44px;
  width: 44px;
  border-radius: 50%;
  border: 2px solid #eaeaea;
  object-fit: cover;
  flex-shrink: 0;
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
  gap: 18px;
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
