<template>
  <q-page class="q-pa-lg">
    <!-- Show posts if available -->
    <div v-if="posts.length > 0">
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
  </q-page>
</template>

<script setup>
import { defineProps, watch, ref, onMounted } from "vue";
import { useQuasar, Loading } from "quasar";
import { usePostStore } from "src/stores/postStore";
import Posts from "../../components/posts.vue";

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
    Loading.hide();
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
</style>
