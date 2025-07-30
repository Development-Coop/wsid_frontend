<template>
  <q-page style="max-width: 600px; margin: 0 auto">
    <!-- Sticky Header with Search -->
    <div class="q-pa-md">
      <div class="search-bar">
        <q-input
          v-model="searchText"
          outlined
          placeholder="Search..."
          :dense="true"
          :clearable="true"
          class="q-pa-sm q-mb-md"
          :rules="[
            (val) => val?.length >= 3 || 'Please enter at least 3 characters',
          ]"
          :error="searchText?.length > 0 && searchText?.length < 3"
          error-message="Please enter at least 3 characters"
          @update:model-value="handleSearch"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <template v-if="searchText?.length >= 3">
        <q-tabs
          v-model="searchBy"
          dense
          no-caps
          align="justify"
          narrow-indicator
          class="search-tabs"
        >
          <q-tab name="accounts" label="Accounts" />
          <q-tab name="posts" label="Posts" />
        </q-tabs>

        <q-tab-panels v-model="searchBy" animated>
          <q-tab-panel name="accounts">
            <template v-if="isLoading">
              <div v-for="n in 3" :key="n" class="user-wrapper">
                <div class="user-info">
                  <q-skeleton type="QAvatar" size="48px" class="q-mr-md" />
                  <q-skeleton type="text" width="120px" />
                </div>
                <q-skeleton type="QBtn" width="100px" />
              </div>
            </template>
            <template v-else>
              <div v-if="users.length > 0">
                <div v-for="user in users" :key="user.id" class="user-wrapper">
                  <div class="user-info">
                    <q-avatar
                      size="48px"
                      class="q-mr-md"
                      @click="goToProfile(user.id)"
                    >
                      <q-img
                        class="post-img"
                        :src="user.profilePicUrl || fallbackImage"
                        spinner-color="primary"
                        spinner-size="22px"
                      >
                        <template #error>
                          <img
                            :src="fallbackImage"
                            alt="Fallback Image"
                            class="post-img"
                            style="
                              border: none;
                              width: 100%;
                              height: 100%;
                              padding: 4px;
                            "
                          />
                        </template>
                      </q-img>
                    </q-avatar>
                    <div
                      class="user-details cursor-pointer"
                      @click="goToProfile(user.id)"
                    >
                      <p>{{ user.name }}</p>
                    </div>
                  </div>
                  <div class="follow-button-wrapper">
                    <q-btn
                      :label="user.isFollowing ? 'Following' : 'Follow'"
                      :color="user?.isFollowing ? 'positive' : 'primary'"
                      :outline="user.isFollowing"
                      size="md"
                      class="follow-btn"
                      @click="toggleFollow(user?.id)"
                    />
                  </div>
                </div>
              </div>

              <!-- Fallback message when no users are available -->
              <div v-else-if="searchText" class="no-users">
                <q-icon name="people_alt" size="64px" color="grey-6" />
                <p class="text-grey-7 text-h6">No users found</p>
              </div>
            </template>
          </q-tab-panel>

          <q-tab-panel name="posts">
            <template v-if="isLoading">
              <div v-for="n in 3" :key="n" class="post-wrapper">
                <div class="skeleton-post q-pa-md">
                  <div class="flex no-wrap">
                    <q-skeleton
                      type="QAvatar"
                      size="44px"
                      style="flex-shrink: 0"
                      class="q-mr-md"
                    />
                    <div class="full-width">
                      <q-skeleton type="text" width="30%" class="q-mb-sm" />
                      <q-skeleton type="text" width="60%" class="q-mb-sm" />
                      <q-skeleton type="text" width="80%" class="q-mb-md" />
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div v-if="posts?.length > 0">
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
                  />
                </div>
              </div>

              <!-- Fallback message when no posts are available -->
              <div v-else-if="searchText" class="no-posts">
                <q-icon name="inbox" size="64px" color="grey-6" />
                <p class="text-grey-7 text-h6">No posts available</p>
              </div>
            </template>
          </q-tab-panel>
        </q-tab-panels>
      </template>
      <template v-else>
        <div class="initial-state">
          <q-icon name="search" size="64px" color="grey-6" />
          <p class="text-grey-7 text-h6">Search for users or posts</p>
          <p class="text-grey-8">
            Enter at least 3 characters to start searching
          </p>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onUnmounted, computed } from "vue";
// import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { usePostStore } from "src/stores/postStore";
import Posts from "../components/posts.vue";
import { useProfileStore } from "src/stores/profileStore";
import { useRouter } from "vue-router";
import fallbackImage from "src/assets/icons/profile-user.png";

const $q = useQuasar();
const postStore = usePostStore();
const posts = computed(() => postStore.posts);

const searchBy = ref("accounts");
const searchText = ref("");
const users = ref([]);
const isLoading = ref(false);
const profileStore = useProfileStore();
const router = useRouter();

// Create debounced version of fetch accounts
let searchTimeout = null;

const handleSearch = (value) => {
  // Clear any existing timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  // Only search if we have 3 or more characters
  if (value?.length >= 3) {
    isLoading.value = true;
    // Set new timeout
    searchTimeout = setTimeout(() => {
      fetchAccounts();
      fetchPosts();
    }, 500); // 500ms delay
  } else {
    // Clear results if less than 3 characters
    users.value = [];
    postStore.setPosts([]); // Clear posts when search text is less than 3
    isLoading.value = false;
  }
};

const fetchAccounts = async () => {
  try {
    users.value = await postStore.searchProfile(searchText?.value);
  } catch (error) {
    $q.notify({
      message: "Failed to load users. Please try again later.",
      color: "negative",
      position: "top",
      timeout: 3000,
      icon: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

const fetchPosts = async () => {
  try {
    const newPosts = await postStore.searchPost(searchText?.value);
    postStore.setPosts(newPosts);
  } catch (error) {
    $q.notify({
      message: "Failed to load posts. Please try again later.",
      color: "negative",
      position: "top",
      timeout: 3000,
      icon: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

// Clean up timeout on component unmount
onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});

const loggedInUser = computed(() => {
  return JSON.parse(JSON.stringify(profileStore?.userDetails));
});

const goToProfile = (id) => {
  if (id === loggedInUser.value.id) {
    router.push({ name: "web-dashboard-profile" });
  } else {
    router.push({ name: "web-dashboard-view-profile", query: { uid: id } });
  }
};

const toggleFollow = async (id) => {
  try {
    isLoading.value = true;
    const req = {
      targetUserId: id,
    };
    await postStore.followUser(req);
    users.value.forEach((i) => {
      if (i.id === id) {
        i.isFollowing = !i.isFollowing;
      }
    });
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
    isLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
.search-tabs {
  border-radius: 8px;
  background: white;
  padding: 4px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .q-tab {
    border-radius: 6px;
    transition: all 0.3s ease;

    &.q-tab--active {
      background-color: #000;
      color: #fff;
    }

    &:hover:not(.q-tab--active) {
      background-color: #f8f8f8;
    }
  }
}

.user-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f1f1;
  padding: 12px 0;
  transition: background-color 0.2s ease;
  background: white;

  &:hover {
    background-color: #f8f8f8;
  }

  &:last-child {
    border-bottom: none;
  }
}

.q-tab-panels {
  background-color: white;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-details {
  display: flex;
  flex-direction: column;
  p {
    font-size: 16px;
    font-weight: 500;
  }
}

.follow-button-wrapper {
  margin-left: 16px;
  .follow-btn {
    transition: all 0.3s ease;
    text-transform: none;
    border-radius: 8px;
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
}

.no-users,
.no-posts {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 400px;
  color: #6c757d;
  padding: 32px;
  background: white;
  border-radius: 12px;
  margin: 16px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.post-wrapper {
  display: grid;
  margin-bottom: 20px;
}

.skeleton-post {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.post-img {
  flex-shrink: 0;
  height: 44px;
  width: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #aeaeb2;
}

.search-bar {
  :deep(.q-field__control) {
    border: none !important;
    &:before {
      border: none !important;
    }
  }
  .q-field {
    padding: 10px 10px 30px 10px;
    border-radius: 8px;
    transition: all 0.3s ease;
    background: white;

    &:hover,
    &:focus-within {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
  }
}

.initial-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 400px;
  color: #6c757d;
  padding: 32px;
  background: white;
  border-radius: 12px;
  margin: 16px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  p {
    margin: 8px 0;

    &.text-h6 {
      font-weight: 500;
    }
  }
}
</style>
