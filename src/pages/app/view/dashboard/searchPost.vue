<template>
  <q-page class="q-pa-lg">
    <!-- Show skeleton loaders when loading -->
    <div v-if="isLoading" class="skeleton-container">
      <div v-for="i in 3" :key="i" class="skeleton-post q-mb-md">
        <q-skeleton type="QAvatar" size="48px" class="q-mr-md" />
        <div class="skeleton-content">
          <q-skeleton type="text" width="120px" class="q-mb-sm" />
          <q-skeleton type="text" width="80%" class="q-mb-sm" />
          <q-skeleton type="text" width="60%" />
        </div>
      </div>
    </div>

    <!-- Show posts if available -->
    <div v-else-if="posts.length > 0">
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
  </q-page>
</template>

<script setup>
import { defineProps, watch, ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { usePostStore } from "src/stores/postStore";
import Posts from "../../components/posts.vue";

const emit = defineEmits(["searching"]);

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
const posts = ref([]);
const isLoading = ref(false); // Added isLoading state

watch(
  () => props.searchText,
  (newText) => {
    if (debounceTimeout) clearTimeout(debounceTimeout); // Clear previous timeout
    debounceTimeout = setTimeout(async () => {
      debouncedSearchText.value = newText;
      if (debouncedSearchText.value) {
        await fetchPosts();
      } else {
        // Clear results when search text is empty
        posts.value = [];
        isLoading.value = false;
        emit("searching", false);
      }
    }, 300); // 300ms debounce delay
  }
);

const fetchPosts = async () => {
  isLoading.value = true; // Set loading to true
  emit("searching", true); // Emit searching event
  try {
    posts.value = await postStore.searchPost(debouncedSearchText.value);
  } catch (error) {
    $q.notify({
      message: "Failed to load posts. Please try again later.",
      color: "negative",
      position: "top",
      timeout: 3000,
      icon: "error",
    });
  } finally {
    isLoading.value = false; // Set loading to false
    emit("searching", false); // Emit searching event
  }
};

onMounted(async () => {
  if (props.searchText) {
    debouncedSearchText.value = props.searchText;
    await fetchPosts();
  }
});
</script>
<style lang="scss" scoped>
.q-page {
  display: grid;
  height: 100%;
  overflow-y: auto; // Ensures vertical scrolling is enabled
  -webkit-overflow-scrolling: touch;
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
}

.skeleton-container {
  padding: 16px;
  .skeleton-post {
    display: flex;
    align-items: center;
    padding: 12px 0;
    .skeleton-content {
      flex-grow: 1;
    }
  }
}
</style>
