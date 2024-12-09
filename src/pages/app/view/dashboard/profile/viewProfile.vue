<template>
  <q-page>
    <img
      v-if="userDetails?.coverPic"
      :src="userDetails?.coverPic"
      alt=""
      class="cover-img"
      style="height: 150px; width: 100%; object-fit: cover"
    />
    <div class="q-px-lg q-py-md">
      <div class="flex no-wrap items-center profile-wrapper-top">
        <q-img class="profile-img" :src="userDetails?.profilePic" />
        <div>
          <p class="text-h6 text-weight-medium">{{ userDetails?.name }}</p>
          <p class="text-grey-7">
            {{ userDetails?.bio }}
          </p>
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
      <div class="flex justify-around q-my-lg">
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
        <!-- <q-tab name="Posts" label="Posts" />
        <q-tab name="Activity" label="Activity" /> -->
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-model="tab"
        animated
        :style="posts.length == 0 ? { backgroundColor: '#f1efef' } : {}"
      >
        <q-tab-panel :class="{ 'q-pa-lg': posts?.length == 0 }" name="Posts">
          <div :class="['post-wrapper']">
            <q-spinner v-if="isLoading" color="primary" class="spinner" />
            <div v-for="post in posts" :key="post.id" class="post-container">
              <Posts
                class="q-pa-md"
                :post-id="post.id"
                :user-image="post.user.profilePicUrl"
                :user-id="post.user.id"
                :username="post.user.name"
                :time-ago="post.timeAgo"
                :post-content="post.description"
                :post-images="post.images"
                :votes="post.votesCount"
                :comments="post.commentsCount"
                :is-own-posts="true"
                @edit="editQuestion"
              />
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useQuasar, Loading } from "quasar";
import { useProfileStore } from "src/stores/profileStore";
import Posts from "../../../components/posts.vue";
import { usePostStore } from "src/stores/postStore";
import { useRoute, useRouter } from "vue-router";

const tab = ref("Posts");
const profileStore = useProfileStore();
const userDetails = ref({});
const $q = useQuasar();

const posts = ref([]);
const currentPage = ref(1); // Tracks the current page
const isLoading = ref(false); // Tracks the loading state
const hasMoreData = ref(true); // Tracks if more data is available
const postStore = usePostStore();
const router = useRouter();
const route = useRoute();
const hovered = ref(false);

const getFollowLabel = computed(() => {
  const isFollowing = userDetails.value?.isFollowing; // Check if the user is followed
  if (hovered.value) {
    return isFollowing ? "Unfollow" : "Follow";
  }
  return isFollowing ? "Following" : "Follow";
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
      uid: userDetails.value?.id,
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

const toggleFollow = async () => {
  try {
    Loading.show();
    const req = {
      targetUserId: userDetails.value.id,
    };
    await postStore.followUser(req);
    await getDetails(userDetails.value.id);
  } catch (e) {
    $q.notify({
      color: "negative",
      message:
        e.response?.data?.message || "Something went wrong!. Please try again.",
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
      isFollowing: data?.isFollowing,
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
    height: 100%;
    min-height: 400px;
  }
}
.profile-wrapper-top {
  gap: 20px;
  .profile-img {
    flex-shrink: 0;
    height: 100px;
    width: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #000;
  }
}

.post-wrapper {
  display: grid;
}
.spinner {
  justify-self: center;
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

.post-container {
  &:not(:last-child) {
    border-bottom: 1px solid #aeaeb2;
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
</style>
