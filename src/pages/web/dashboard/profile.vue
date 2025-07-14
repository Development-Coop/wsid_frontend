<template>
  <div style="max-width: 600px; margin: 0 auto">
    <div>
      <div class="q-pa-lg profile">
        <div class="flex justify-end">
          <q-btn
            flat
            no-caps
            class="q-pa-none cursor-pointer"
            @click="showEditProfilePopup = true"
          >
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
          <q-img
            v-if="user?.profilePic"
            class="profile-img"
            :src="user.profilePic"
            alt="Profile Picture"
          >
            <template #error>
              <img
                :src="fallbackImage"
                alt="Fallback Image"
                class="post-img"
                style="border: none; width: 100%; height: 100%; padding: 4px"
              />
            </template>
          </q-img>
          <div v-else class="profile-placeholder">
            {{ user?.name?.charAt(0).toUpperCase() || "?" }}
          </div>
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
          <q-tab-panel class="q-py-lg q-px-none" name="Posts">
            <div
              v-if="!posts.length && !isLoading"
              class="text-center flex flex-col justify-center items-center h-full"
            >
              <div class="text-h6 text-weight-bold">Ask Question</div>
              <p class="q-mb-md text-grey-7">You don't have any posts yet</p>
              <q-btn
                v-motion-pop
                :delay="100"
                no-caps
                size="md"
                label="Ask Question"
                color="primary"
                unelevated
                @click="showPopup = true"
              />
            </div>
            <div v-else :class="['post-wrapper']">
              <template v-if="isLoading && posts.length === 0">
                <div v-for="n in 5" :key="n" class="skeleton-post q-pa-md">
                  <div class="flex no-wrap">
                    <q-skeleton type="QAvatar" size="44px" style="flex-shrink: 0;" class="q-mr-md" />
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
              <q-spinner v-if="isLoading && posts.length > 0" color="primary" class="spinner" />
              <!-- <div v-else class="ask-question-container">
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
                    @click="showPopup = true"
                  />
                </div>
              </div> -->
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
                :is-own-posts="true"
                @edit="editQuestion"
              />
            </div>
          </q-tab-panel>

          <q-tab-panel
            class="q-py-lg q-px-none activity-section text-center"
            name="Activity"
          >
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
    </div>
  </div>

  <q-dialog v-model="showPopup" persistent>
    <div class="popup-container">
      <AskQuestion :is-popup="true" :post-id="editPostId" @close="closePopup" />
      <q-btn
        flat
        round
        dense
        icon="close"
        class="close-button"
        @click="closePopup"
      />
    </div>
  </q-dialog>
  <q-dialog v-model="showEditProfilePopup" persistent>
    <div class="popup-container">
      <EditProfile :is-popup="true" @close="showEditProfilePopup = false" />
      <q-btn
        flat
        round
        dense
        icon="close"
        class="close-button"
        @click="showEditProfilePopup = false"
      />
    </div>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useProfileStore } from "src/stores/profileStore";
import Posts from "../components/posts.vue";
import { usePostStore } from "src/stores/postStore";
import AskQuestion from "src/components/ask-question.vue";
import EditProfile from "src/pages/app/view/dashboard/profile/editProfile.vue";

import fallbackImage from "src/assets/icons/profile-user.png";

const tab = ref("Posts");
const profileStore = useProfileStore();
const user = computed(() => {
  return JSON.parse(JSON.stringify(profileStore?.userDetails));
});

const posts = computed(() => postStore.posts);
const currentPage = ref(1); // Tracks the current page
const isLoading = ref(false); // Tracks the loading state
const hasMoreData = ref(true); // Tracks if more data is available
const postStore = usePostStore();
const showPopup = ref(false);
const editPostId = ref("");
const showEditProfilePopup = ref(false);

// Function to fetch posts
const fetchPosts = async (fetch = false) => {
  if ((isLoading.value || !hasMoreData.value) && !fetch) return;

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

const fetchNewPosts = async () => {
  isLoading.value = true;
  try {
    const newPosts = await postStore.getPostList({
      all: false,
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      order: "desc",
    });
    posts.value = newPosts;
  } catch (error) {
    console.error("Error fetching posts:", error);
  } finally {
    isLoading.value = false;
  }
};

const editQuestion = (id) => {
  editPostId.value = id;
  showPopup.value = true;
};

const closePopup = async () => {
  showPopup.value = false;
  editPostId.value = "";
  await fetchNewPosts();
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

  & .profile-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: $primary; // SCSS variable for primary color
    color: #ffffff; // SCSS variable for text color
    font-size: 36px; // Adjust font size as needed
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
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
.skeleton-post {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
