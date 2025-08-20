<template>
  <q-page>
    <img
      v-if="user?.coverPic"
      :src="user?.coverPic"
      alt=""
      class="cover-img"
      style="height: 150px; width: 100%; object-fit: cover"
    />
    <div class="q-px-lg q-py-md">
      <div class="flex justify-end">
        <q-btn flat no-caps size="xs" to="/app/profile/edit-profile">
          <q-icon size="24px">
            <img src="~src/assets/icons/edit.svg" alt="edit" />
          </q-icon>
        </q-btn>
        <q-btn flat no-caps size="xs" to="/app/profile/settings">
          <q-icon size="24px">
            <img src="~src/assets/icons/settings.svg" alt="settings" />
          </q-icon>
        </q-btn>
      </div>
      <div class="flex no-wrap items-center profile-wrapper-top">
        <q-skeleton
          v-if="!user?.profilePic"
          type="QAvatar"
          size="100px"
          class="profile-img"
        />
        <q-img v-else class="profile-img" :src="user?.profilePic" />
        <div>
          <q-skeleton
            v-if="!user?.name"
            type="text"
            width="60%"
            class="q-mb-sm"
          />
          <p v-else class="text-h6 text-weight-medium">{{ user?.name }}</p>
          <q-skeleton v-if="!user?.bio" type="text" width="80%" />
          <p v-else class="text-grey-7">
            {{ user?.bio }}
          </p>
        </div>
      </div>
      <div class="flex justify-around q-my-lg">
        <div class="text-center">
          <q-skeleton
            v-if="!user?.followersCount"
            type="text"
            width="40px"
            class="q-mb-xs"
          />
          <p v-else class="text-h6 text-weight-medium text-primary">
            {{ user?.followersCount }}
          </p>
          <p>Followers</p>
        </div>
        <div class="text-center">
          <q-skeleton
            v-if="!user?.followingCount"
            type="text"
            width="40px"
            class="q-mb-xs"
          />
          <p v-else class="text-h6 text-weight-medium text-primary">
            {{ user?.followingCount }}
          </p>
          <p>Following</p>
        </div>
        <div class="text-center">
          <q-skeleton
            v-if="!user?.likesCount"
            type="text"
            width="40px"
            class="q-mb-xs"
          />
          <p v-else class="text-h6 text-weight-medium text-primary">
            {{ user?.likesCount }}
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
        <q-tab name="Posts" label="Posts" />
        <q-tab name="Activity" label="Activity" />
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-model="tab"
        animated
        :style="posts.length == 0 ? { backgroundColor: '#f1efef' } : {}"
      >
        <q-tab-panel :class="{ 'q-pa-lg': posts?.length == 0 }" name="Posts">
          <div
            v-if="!posts.length && !isLoading"
            class="text-center flex flex-col justify-center items-center h-full"
          >
            <div class="text-h6 text-weight-bold">No Posts Yet</div>
            <p class="q-mb-md text-grey-7">You don't have any posts yet</p>
          </div>
          <div v-else :class="['post-wrapper']">
            <q-spinner v-if="isLoading" color="primary" class="spinner" />
            <div v-for="post in posts" :key="post.id" class="post-container">
              <Posts
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
                :is-own-posts="true"
                @edit="editQuestion"
              />
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel class="q-pa-lg" name="Activity">
          <div class="activity-container">
            <q-icon
              name="timeline"
              size="48px"
              color="primary"
              class="q-mb-md"
            />
            <div class="text-h6 text-primary">No Activity Yet</div>
            <p class="text-grey-7 q-mt-sm">
              Stay tuned! Your activity history will be displayed here soon.
            </p>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useProfileStore } from "src/stores/profileStore";
import { usePostStore } from "src/stores/postStore";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import Posts from "../../../components/posts.vue";

const tab = ref("Posts");
const posts = ref([]);
const profileStore = useProfileStore();
const $q = useQuasar();
const postStore = usePostStore();
const currentPage = ref(1); // Tracks the current page
const isLoading = ref(false); // Tracks the loading state
const hasMoreData = ref(true);
const router = useRouter();

const user = computed(() => {
  return JSON.parse(JSON.stringify(profileStore?.userDetails));
});

const handleSubmit = async () => {
  try {
    await profileStore.getProfileDetails();
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
  }
};

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
const onScroll = async () => {
  const scrollTop = window.scrollY; // Current scroll position from top
  const viewportHeight = window.innerHeight; // Height of the visible area
  const documentHeight = document.documentElement.scrollHeight; // Total height of the document
  if (scrollTop + viewportHeight >= documentHeight - 80) {
    // Near the bottom of the page
    await fetchPosts();
  }
};

const editQuestion = (id) => {
  router.push({ path: "ask-question", query: { postId: id } });
};

// Add event listeners
onMounted(async () => {
  if (!user.value?.name) {
    await handleSubmit();
  }

  await fetchPosts(); // Load initial posts

  // Restore scroll position if available
  const savedScrollPosition = sessionStorage.getItem("mobile-profile-scroll");
  if (savedScrollPosition) {
    setTimeout(() => {
      window.scrollTo(0, parseInt(savedScrollPosition));
    }, 100);
  }

  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  // Save scroll position before unmounting
  const currentScrollPosition = window.scrollY;
  sessionStorage.setItem(
    "mobile-profile-scroll",
    currentScrollPosition.toString()
  );

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

.post-container {
  &:not(:last-child) {
    border-bottom: 1px solid #aeaeb2;
  }
}
</style>
