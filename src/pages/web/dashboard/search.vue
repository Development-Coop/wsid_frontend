<template>
  <q-page>
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
        >
          <q-tab name="accounts" label="Accounts" />
          <q-tab name="posts" label="Posts" />
        </q-tabs>

        <q-tab-panels v-model="searchBy" animated>
          <q-tab-panel name="accounts">
            <div v-if="users.length > 0">
              <div v-for="user in users" :key="user.id" class="user-wrapper">
                <div class="user-info">
                  <q-avatar
                    size="48px"
                    class="q-mr-md"
                    @click="goToProfile(user.id)"
                  >
                    <img :src="user.profilePicUrl" alt="User Avatar" />
                  </q-avatar>
                  <div class="user-details" @click="goToProfile(user.id)">
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
          </q-tab-panel>

          <q-tab-panel name="posts">
            <div v-if="posts?.length > 0">
              <div v-for="post in posts" :key="post.id" class="post-wrapper">
                <Posts
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
              </div>
            </div>

            <!-- Fallback message when no posts are available -->
            <div v-else-if="searchText" class="no-posts">
              <q-icon name="inbox" size="64px" color="grey-6" />
              <p class="text-grey-7 text-h6">No posts available</p>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
// import { useRoute } from "vue-router";
import { useQuasar, Loading } from "quasar";
import { usePostStore } from "src/stores/postStore";
import Posts from "../components/posts.vue";
const $q = useQuasar();
const postStore = usePostStore();

const searchBy = ref("accounts");
const searchText = ref("");
const users = ref([]);
const posts = ref([]);

// Create debounced version of fetch accounts
let searchTimeout = null;

const handleSearch = (value) => {
  // Clear any existing timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  // Only search if we have 3 or more characters
  if (value?.length >= 3) {
    // Set new timeout
    searchTimeout = setTimeout(() => {
      fetchAccounts();
      fetchPosts();
    }, 500); // 500ms delay
  } else {
    // Clear results if less than 3 characters
    users.value = [];
  }
};

const fetchAccounts = async () => {
  try {
    Loading.show();
    users.value = await postStore.searchProfile(searchText?.value);
  } catch (error) {
    $q.notify({
      message: "Failed to load posts. Please try again later.",
      color: "negative",
      position: "top",
      timeout: 3000,
      icon: "error",
    });
  } finally {
    Loading.hide();
  }
};

const fetchPosts = async () => {
  try {
    Loading.show();
    posts.value = await postStore.searchPost(searchText?.value);
  } catch (error) {
    $q.notify({
      message: "Failed to load posts. Please try again later.",
      color: "negative",
      position: "top",
      timeout: 3000,
      icon: "error",
    });
  } finally {
    Loading.hide();
  }
};

// Clean up timeout on component unmount
onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});

const goToProfile = () => {
  //   if (props.userId === loggedInUser.value.id) {
  //     router.push({ name: "view-profile" });
  //   } else {
  //     router.push({ name: "view", query: { uid: id } });
  //   }
};

const toggleFollow = async (id) => {
  try {
    Loading.show();
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
    Loading.hide();
  }
};
</script>

<style scoped>
:deep(.q-tabs) {
  border-radius: 8px;
  .q-tab {
    background-color: #fff;
    width: 100%;
    &.q-tab--active {
      background-color: #000;
      color: #fff;
    }
  }
}

.user-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f1f1;
  padding: 12px 0;

  &:last-child {
    border-bottom: none;
  }
}

.q-tab-panels {
  background-color: transparent;
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
  }
}

.follow-button-wrapper {
  margin-left: 16px;
  .follow-btn {
    transition: background-color 0.3s ease, color 0.3s ease;
    text-transform: none;
    &:hover {
      cursor: pointer;
      background-color: #f5f5f5;
    }
  }
}
.no-users {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  min-height: 400px;
  color: #6c757d; /* Neutral grey color */
}

.post-wrapper {
  display: grid;
  &:not(:last-child) {
    border-bottom: 1px solid #aeaeb2;
  }
}

.no-posts {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 400px;
}
</style>
