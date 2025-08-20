<template>
  <q-page class="q-pb-xl">
    <!-- Skeleton loaders when loading and no posts -->
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

    <!-- Posts when available -->
    <template v-else-if="posts.length > 0">
      <div v-for="post in posts" :key="post.id" class="post-wrapper">
        <Posts
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
          @update-post="handleUpdatePost"
        />
      </div>
    </template>

    <!-- Empty state when no posts and not loading -->
    <template v-else-if="!isLoading && posts.length === 0">
      <div class="empty-state q-pa-lg">
        <q-icon name="people" size="64px" color="grey-6" />
        <p class="text-grey-7 text-h6 q-mt-md">
          No posts from people you follow
        </p>
        <p class="text-grey-8 text-body2">
          Follow some people to see their posts here!
        </p>
      </div>
    </template>

    <!-- Loading spinner when loading more posts -->
    <q-spinner
      v-if="isLoading && posts.length > 0"
      color="primary"
      class="spinner q-mt-md"
    />
  </q-page>
</template>

<script setup>
import Posts from "../../components/posts.vue";
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { usePostStore } from "src/stores/postStore";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import { useProfileStore } from "src/stores/profileStore";

const posts = computed(() => postStore.homePosts);
const currentPage = ref(1); // Tracks the current page
const isLoading = ref(false); // Tracks the loading state
const hasMoreData = ref(true); // Tracks if more data is available
const postStore = usePostStore();
const profileStore = useProfileStore();
const $q = useQuasar();
const route = useRoute();

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
      const postsWithVotingStatus =
        postStore.mergePostsWithStoredVotingStatus(newPosts);

      const merged = [...postStore.homePosts, ...postsWithVotingStatus];
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

// Infinite scroll handler
const onScroll = async () => {
  const scrollTop = window.scrollY; // Current scroll position from top
  const viewportHeight = window.innerHeight; // Height of the visible area
  const documentHeight = document.documentElement.scrollHeight; // Total height of the document
  if (scrollTop + viewportHeight >= documentHeight - 80) {
    // Near the bottom of the page
    await fetchPosts();
  }
};

// Add event listeners
onMounted(async () => {
  await fetchPosts(); // Load initial posts

  // Restore scroll position if available
  const savedScrollPosition = sessionStorage.getItem("mobile-following-scroll");
  if (savedScrollPosition) {
    setTimeout(() => {
      window.scrollTo(0, parseInt(savedScrollPosition));
    }, 100);
  }

  window.addEventListener("scroll", onScroll);

  // Add focus event listener for when user returns to the page
  window.addEventListener("focus", handlePageFocus);
});

onUnmounted(() => {
  // Save scroll position before unmounting
  const currentScrollPosition = window.scrollY;
  sessionStorage.setItem(
    "mobile-following-scroll",
    currentScrollPosition.toString()
  );

  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("focus", handlePageFocus);
});

// Handle page focus (when user returns from another tab/app)
const handlePageFocus = async () => {
  // Reset pagination and fetch fresh posts
  currentPage.value = 1;
  hasMoreData.value = true;
  await fetchPosts();
};

// Watch for route changes to refresh posts when user returns from voting
watch(
  () => route.path,
  async (newPath, oldPath) => {
    // If user returns from view-question page, refresh posts to get updated vote data
    if (
      oldPath &&
      oldPath.includes("view-question") &&
      newPath.includes("following")
    ) {
      // Reset pagination and fetch fresh posts from beginning
      currentPage.value = 1;
      hasMoreData.value = true;
      await fetchPosts();
    }
  }
);

// Handle post updates from ViewQuestion component
const handleUpdatePost = (postId, updatedData) => {
  // Use the post store's update method to update the home posts
  postStore.updateHomePostInStore(postId, updatedData);
};
</script>

<style scoped lang="scss">
.q-page {
  display: grid;
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
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 300px;
}
</style>
