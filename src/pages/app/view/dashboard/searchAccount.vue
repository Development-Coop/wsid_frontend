<template>
  <q-page class="q-pa-lg">
    <!-- Show users if available -->
    <div v-if="users.length > 0">
      <div v-for="user in users" :key="user.id" class="user-wrapper">
        <div class="user-info">
          <q-avatar size="48px" class="q-mr-md" @click="goToProfile(user.id)">
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
  </q-page>
</template>

<script setup>
import { defineProps, watch, ref, onMounted, computed } from "vue";
import { useQuasar, Loading } from "quasar";
import { usePostStore } from "src/stores/postStore";
import { useProfileStore } from "src/stores/profileStore";
import { useRouter } from "vue-router";

const props = defineProps({
  searchText: {
    type: String,
    required: true,
  },
});

let debounceTimeout;
const debouncedSearchText = ref("");
const $q = useQuasar();
const postStore = usePostStore();
const users = ref([]);
const profileStore = useProfileStore();
const router = useRouter();

const loggedInUser = computed(() => {
  return JSON.parse(JSON.stringify(profileStore?.userDetails));
});

watch(
  () => props.searchText,
  (newText) => {
    if (debounceTimeout) clearTimeout(debounceTimeout); // Clear previous timeout
    debounceTimeout = setTimeout(async () => {
      debouncedSearchText.value = newText;
      if (debouncedSearchText.value) {
        await fetchPosts();
      }
    }, 300); // 300ms debounce delay
  }
);

const fetchPosts = async () => {
  try {
    Loading.show();
    users.value = await postStore.searchProfile(debouncedSearchText.value);
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

onMounted(async () => {
  if (props.searchText) {
    debouncedSearchText.value = props.searchText;
    await fetchPosts();
  }
});

const goToProfile = (id) => {
  if (id === loggedInUser.value.id) {
    router.push({ name: "view-profile" });
  } else {
    router.push({ name: "view", query: { uid: id } });
  }
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
<style lang="scss" scoped>
.q-page {
  display: grid;
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
  color: #6c757d; /* Neutral grey color */
}
</style>
