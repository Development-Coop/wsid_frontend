<template>
  <div>
    <div class="q-pa-lg profile">
      <div class="flex justify-end">
        <q-btn flat no-caps class="q-pa-none" to="/web/profile/edit-profile">
          <q-icon size="24px" class="q-mr-md">
            <img src="~src/assets/icons/edit.svg" alt="edit" />
          </q-icon>
        </q-btn>
        <q-btn flat no-caps class="q-pa-none" to="/web/settings">
          <q-icon size="24px">
            <img src="~src/assets/icons/settings.svg" alt="settings" />
          </q-icon>
        </q-btn>
      </div>
      <div class="flex no-wrap items-center profile-wrapper">
        <q-img class="profile-img" :src="user?.profilePic" />
        <div>
          <p class="text-h6 text-weight-medium">{{ user?.name }}</p>
          <p class="text-grey-7">
            {{ user?.bio }}
          </p>
        </div>
      </div>
      <div class="flex justify-around q-my-lg">
        <div class="text-center">
          <p class="text-h6 text-weight-medium text-primary">
            {{ user?.followersCount }}
          </p>
          <p>Followers</p>
        </div>
        <div class="text-center">
          <p class="text-h6 text-weight-medium text-primary">
            {{ user?.followingCount }}
          </p>
          <p>Following</p>
        </div>
        <div class="text-center">
          <p class="text-h6 text-weight-medium text-primary">
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

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel class="q-pa-lg" name="Posts">
          <div
            v-if="!posts.length"
            class="text-center flex flex-col justify-center items-center h-full"
          >
            <div class="text-h6 text-weight-bold">Ask Question</div>
            <p class="q-mb-md text-grey-7">You don't have any posts yet</p>
            <q-btn
              v-motion-pop
              :delay="100"
              no-caps
              size="md"
              to="/app/ask-question"
              label="Ask Question"
              color="primary"
              unelevated
            />
          </div>
          <div v-else ref="postContainer" class="post-wrapper">
            <q-spinner v-if="isLoading" color="primary" />
            <div class="ask-question-container">
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
                  to="/app/ask-question"
                  label="Ask a Question"
                  class="ask-question-btn"
                  unelevated
                />
              </div>
            </div>
            <Posts
              v-for="post in posts"
              :key="post.id"
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
            />
          </div>
        </q-tab-panel>

        <q-tab-panel class="q-pa-lg" name="Activity">
          <div class="text-h6">Activity</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useProfileStore } from "src/stores/profileStore";
import Posts from "../components/posts.vue";
import { usePostStore } from "src/stores/postStore";

const tab = ref("Posts");
const profileStore = useProfileStore();
const user = computed(() => {
  return JSON.parse(JSON.stringify(profileStore?.userDetails));
});

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
});

onUnmounted(() => {
  postContainer.value?.removeEventListener("scroll", onScroll);
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
}
.post-wrapper {
  display: grid;
  gap: 26px;
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
</style>
