<template>
  <div>
    <div class="q-pa-lg profile">
      <div class="flex no-wrap items-center profile-wrapper">
        <q-img class="profile-img" :src="userDetails?.profilePic">
          <template #error>
            <img :src="fallbackImage" alt="Fallback Image" class="post-img" style="border: none;width: 100%;height: 100%;padding: 4px;" />
          </template>
        </q-img>
        <div class="profile-details">
          <p class="text-h6 text-weight-medium">{{ userDetails?.name }}</p>
          <p class="text-grey-7">{{ userDetails?.bio }}</p>
        </div>
        <div class="follow-button-wrapper">
          <q-btn
            :label="getFollowLabel"
            :color="userDetails?.isFollowing ? 'primary' : 'positive'"
            :outline="!userDetails.isFollowing"
            class="follow-btn"
            @mouseenter="hovered = true"
            @mouseleave="hovered = false"
            @click="toggleFollow"
          />
        </div>
      </div>
      <div class="flex justify-around q-mt-lg">
        <div class="text-center">
          <p class="text-h6 text-weight-medium text-primary">
            {{ userDetails?.followersCount }}
          </p>
          <p>Followers</p>
        </div>
        <div class="text-center">
          <p class="text-h6 text-weight-medium text-primary">
            {{ userDetails?.followingCount }}
          </p>
          <p>Following</p>
        </div>
        <div class="text-center">
          <p class="text-h6 text-weight-medium text-primary">
            {{ userDetails?.likesCount }}
          </p>
          <p>Likes</p>
        </div>
      </div>
    </div>
    <q-card flat>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <!-- <q-tab name="Posts" label="Posts" /> -->
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel class="q-pa-lg" name="Posts">
          <div
            v-if="!posts.length && !isLoading"
            class="text-center flex flex-col justify-center items-center h-full"
          >
            <p class="q-mb-md text-grey-7">No posts yet</p>
          </div>
          <div v-else :class="['post-wrapper']">
            <q-spinner v-if="isLoading" color="primary" class="spinner" />
            <Posts
              v-for="post in posts"
              :key="post.id"
              class="q-pa-md"
              :post-id="post.id"
              :user-image="post.user.profilePicUrl"
              :user-id="post.user.id"
              :username="post.user.name"
              :time-ago="post.timeAgo"
              :post-title="post.title"
              :post-content="post.description"
              :post-images="post.images"
              :votes="post.votesCount"
              :comments="post.commentsCount"
              :is-own-posts="false"
            />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useQuasar, Loading } from "quasar";
import { useProfileStore } from "src/stores/profileStore";
import Posts from "../components/posts.vue";
import { usePostStore } from "src/stores/postStore";
import { useRoute, useRouter } from "vue-router";

import fallbackImage from 'src/assets/icons/profile-user.png';

const tab = ref("Posts");
const profileStore = useProfileStore();
const userDetails = ref({});
const $q = useQuasar();

const postStore = usePostStore();
const posts = computed(() => postStore.posts);
const currentPage = ref(1); // Tracks the current page
const isLoading = ref(false); // Tracks the loading state
const hasMoreData = ref(true); // Tracks if more data is available
const router = useRouter();
const route = useRoute();
const hovered = ref(false);

const getFollowLabel = computed(() => {
  const isFollowing = userDetails.value?.isFollowing; // Check if the user is followed
  if (hovered.value) {
    return isFollowing ? 'Unfollow' : 'Follow';
  }
  return isFollowing ? 'Following' : 'Follow';
});

// Function to fetch posts
const fetchPosts = async () => {
  if (isLoading.value || !hasMoreData.value) return;

  isLoading.value = true;
  try {
    const newPosts = await postStore.getPostList({
      all: false,
      page: currentPage.value,
      limit: 10,
      sortBy: "createdAt",
      order: "desc",
      uid: userDetails.value?.id
    });
    // Check if newPosts contains data
    if (newPosts.length > 0) {
      const merged = [...postStore.posts, ...newPosts];
      const unique = merged.filter((post, index, self) => index === self.findIndex(p => p.id === post.id));
      postStore.setPosts(unique);
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

const toggleFollow = async () => {
  try {
    Loading.show();
    const req = {
      targetUserId: userDetails.value.id
    }
    await postStore.followUser(req);
    await getDetails(userDetails.value.id);
  } catch(e) {
    $q.notify({
      color: "negative",
      message:
        e.response?.data?.message ||
        "Something went wrong!. Please try again.",
      position: "top",
      icon: "error",
      autoClose: true,
    });
  } finally {
    Loading.hide();
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

const getDetails = async (id) => {
  Loading.show();
  try {
    const data = await profileStore.getProfileDetails(id);
    userDetails.value = {
      id: data?.user?.id,
      name: data?.user?.name,
      dateOfBirth: data?.user?.dateOfBirth,
      username: data?.user?.username,
      profilePic: data?.user?.profilePic,
      bio: data?.user?.bio,
      createdAt: data?.user?.createdAt,
      likesCount: data?.likesCount,
      followersCount: data?.followersCount,
      followingCount: data?.followingCount,
      coverPic: data?.user?.coverPic,
      isFollowing: data?.isFollowing
    };
  } catch (error) {
    $q.notify({
      color: "negative",
      message:
        error.response?.data?.message ||
        "Something went wrong!. Please try again.",
      position: "top",
      icon: "error",
      autoClose: true,
    });
  } finally {
    Loading.hide();
  }
};

// Add event listeners
onMounted(async () => {
  const userId = route?.query?.uid;
  if (userId) {
    await getDetails(userId);
  } else {
    router.back();
  }
  await fetchPosts(); // Load initial posts
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<style scoped lang="scss">
.q-page {
  display: grid;
  grid-template-rows: auto 1fr;
  .q-tab-panels {
    background-color: #f1efef;
    height: 100%;
  }
}
.profile {
  background: rgba(255, 255, 255, 1);
}
.q-tab-panels {
  background: rgba(240, 242, 245, 1);
}
.profile-wrapper {
  gap: 20px;
  .profile-img {
    flex-shrink: 0;
    height: 100px;
    width: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #000;
  }
  .profile-details {
    .text-grey-7 {
      font-size: 14px;
      color: #555;
    }
  }

  .follow-button-wrapper {
    margin-left: 16px;
    .follow-btn {
      transition: background-color 0.3s ease, color 0.3s ease;
      &:hover {
        cursor: pointer;
        background-color: #f5f5f5;
      }
    }
  }
}
.post-wrapper {
  display: grid;
  gap: 26px;
  &-loader {
    justify-content: center;
  }
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

.user-avatar {
  height: 44px;
  width: 44px;
  border-radius: 50%;
  border: 2px solid #eaeaea;
  object-fit: cover;
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

.ask-question-btn {
  font-weight: 500;
  color: #f15b29;
}

:deep(.q-btn__content) {
  text-transform: none;
}
.activity-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%; /* Ensures full height usage */
  background: white;
  padding: 24px;
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
.spinner {
  justify-self: center;
}
</style>
