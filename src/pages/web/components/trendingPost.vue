<template>
  <div class="post cursor-pointer" @click.self="openPost('')">
    <!-- Header with user image, details, and action menu -->
    <div class="flex items-center no-wrap" @click.self="openPost('')">
      <q-img
        class="post-img cursor-pointer"
        :src="userImage"
        spinner-color="primary"
        spinner-size="22px"
        @click="goToProfile"
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
      <div
        style="flex-grow: 1"
        class="q-ml-sm cursor-pointer"
        @click="goToProfile"
      >
        <p>
          <span v-if="username" class="text-weight-medium">{{ username }}</span>
          <!-- Dynamic username -->
          <span v-if="timeAgo" class="text-grey-7">
            • {{ calculateTimeAgo }}</span>
          <!-- Dynamic time -->
        </p>
      </div>
      <!-- Three Dots Dropdown Menu -->
      <q-btn-dropdown
        flat
        dense
        icon="more_vert"
        class="menu-btn"
        no-caps
        no-icon-animation
        content-class="no-arrow"
      >
        <q-list v-if="isOwnPosts">
          <q-item v-close-popup clickable @click="emit('edit', postId)">
            <q-item-section> Edit </q-item-section>
          </q-item>
          <q-item v-close-popup clickable @click="onDelete">
            <q-item-section> Delete </q-item-section>
          </q-item>
        </q-list>

        <q-list v-else>
          <q-item v-close-popup clickable @click="sharePost">
            <q-item-section> Copy link </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <!-- Post Content -->
    <p :class="['text-grey-9','q-mt-md', { 'q-mb-md': postImages.length == 0}]" @click.self="openPost('')">
      <span v-if="postContent">{{ postContent }}</span>
      <!-- Dynamic post content -->
    </p>

    <!-- Single Post Image -->
    <q-img
      v-if="postImage"
      :src="postImage"
      spinner-color="white"
      fit="contain"
      class="q-mb-sm"
    />

    <!-- Multiple Post Images Grid -->
    <div v-if="postImages.length > 0" class="post-images-grid q-mb-md">
      <div
        v-for="(image, index) in postImages.slice(0, 4)"
        :key="index"
        class="image-wrapper"
      >
        <q-img
          :src="image"
          spinner-color="white"
          fit="cover"
          class="image-item"
          style="cursor: pointer"
          @click="openImage(image)"
        />
        <!-- Overlay for additional images -->
        <div
          v-if="index === 3 && postImages.length > 4"
          class="overlay-more cursor-pointer"
          @click="openPost('')"
        >
          +{{ postImages.length - 4 }}
        </div>
      </div>
    </div>

    <!-- Footer with votes, comments, and action button -->
    <div
      class="flex no-wrap items-center"
      style="gap: 10px;"
      @click.self="openPost('')"
    >
      <span style="cursor: pointer" @click="openPost('')">{{ votes }} <span class="text-grey-7">Votes</span></span>
      •
      <span style="cursor: pointer" @click="openPost('Comments')">{{ comments }} <span class="text-grey-7">Comments</span></span>
      <!-- <q-btn
        no-caps
        size="md"
        unelevated
        color="grey-12"
        text-color="black"
        label="Answer"
        class="q-ml-auto"
        style="cursor: pointer"
        @click="openPost('')"
      /> -->
    </div>
  </div>
  <q-dialog v-model="isDialogOpen" @hide="isDialogOpen = false">
    <q-card class="q-pa-none">
      <q-img
        :src="currentImage"
        spinner-color="primary"
        spinner-size="22px"
        class="large-image"
      />
      <q-btn
        flat
        round
        dense
        icon="close"
        class="close-button"
        @click="isDialogOpen = false"
      />
    </q-card>
  </q-dialog>
  <q-dialog v-model="showViewQuePopup" persistent>
    <div class="popup-container">
      <ViewQuestion
        v-if="showViewQuePopup"
        :post-id="postId"
        :is-popup="true"
        :tab-value="tabValue"
        @close="showViewQuePopup = false"
        @fetch-new-post="$emit('fetch-new-post')"
      />
      <q-btn
        flat
        round
        dense
        icon="close"
        class="close-button"
        @click="showViewQuePopup = false"
      />
    </div>
  </q-dialog>
</template>

<script setup>
import { usePostStore } from "src/stores/postStore";
import { useQuasar, Loading, copyToClipboard } from "quasar";
import { ref, computed, onUnmounted, onMounted } from "vue";
import { useProfileStore } from "src/stores/profileStore";
import { useRouter } from "vue-router";
import fallbackImage from "src/assets/icons/profile-user.png";

// components
import ViewQuestion from "./viewQue.vue";

const postStore = usePostStore();
const $q = useQuasar();
const profileStore = useProfileStore();
const router = useRouter();

const props = defineProps({
  postId: {
    type: String,
    required: true, // Required since it's used as the key
  },
  userImage: {
    type: String,
    default: "", // Default value for userImage
  },
  username: {
    type: String,
    default: "", // Default value for username
  },
  timeAgo: {
    type: [String, Number],
    default: "", // Default value for timeAgo
  },
  postContent: {
    type: String,
    default: "", // Default value for postContent
  },
  postImage: {
    type: String,
    default: "", // Default value for postImage
  },
  postImages: {
    type: Array,
    default: () => [], // Default value for postImages as an empty array
  },
  votes: {
    type: Number,
    default: 0, // Default value for votes
  },
  comments: {
    type: Number,
    default: 0, // Default value for comments
  },
  isOwnPosts: {
    type: Boolean,
    default: false, // Default value for comments
  },
  userId: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["deleted", "edit", "fetch-new-post"]);

const isDialogOpen = ref(false);
const currentImage = ref("");
const showViewQuePopup = ref(false);
const tabValue = ref("");

const openPost = (tab = "Votes") => {
  showViewQuePopup.value = true;
  tabValue.value = tab;
};

const goToProfile = () => {
  if (props.userId === user.value.id) {
    router.push({ name: "web-dashboard-profile" });
  } else {
    router.push({
      name: "web-dashboard-view-profile",
      query: { uid: props.userId },
    });
  }
};

const openImage = (image) => {
  currentImage.value = image;
  isDialogOpen.value = true;
};

const user = computed(() => {
  return JSON.parse(JSON.stringify(profileStore?.userDetails));
});

let interval;
onMounted(() => {
  interval = setInterval(() => {
    now.value = Date.now();
  }, 1000); // Update every second
});

onUnmounted(() => {
  clearInterval(interval); // Cleanup on component unmount
});

const now = ref(Date.now());
const calculateTimeAgo = computed(() => {
  const secondsAgo = Math.floor((now.value - props.timeAgo) / 1000);

  if (secondsAgo < 60) {
    return `${secondsAgo} seconds ago`;
  } else if (secondsAgo < 3600) {
    const minutes = Math.floor(secondsAgo / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (secondsAgo < 86400) {
    const hours = Math.floor(secondsAgo / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (secondsAgo < 604800) {
    const days = Math.floor(secondsAgo / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (secondsAgo < 2419200) {
    const weeks = Math.floor(secondsAgo / 604800);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else {
    const months = Math.floor(secondsAgo / 2419200);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }
});

const sharePost = () => {
  const baseUrl = `${window.location.origin}/#/web/dashboard/home?postId=${props.postId}`;
  copyToClipboard(baseUrl);
  $q.notify({
    message: "Copied to clipboard",
    color: "positive",
    position: "top",
    timeout: 3000,
    icon: "check_circle",
  });
};

const onDelete = async () => {
  try {
    Loading.show();
    await postStore.deletePost(props.postId);
    $q.notify({
      message: "Successfully deleted!",
      color: "positive",
      position: "top",
      timeout: 3000,
      icon: "check_circle",
    });
    emit("deleted", true);
  } catch (e) {
    $q.notify({
      color: "negative",
      message:
        e?.response?.data?.message ||
        "Something went wrong!. Please try again.",
      position: "top",
      icon: "error",
      autoClose: true,
    });
  } finally {
    Loading.hide();
  }
};
</script>

<style scoped lang="scss">
.post {
  background-color: #fff;
  gap: 16px;
  // border-radius: 10px;
  // box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;

  .post-img {
    flex-shrink: 0;
    height: 44px;
    width: 44px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #aeaeb2;
  }

  .post-images-grid {
    display: grid;
    gap: 4px;
    grid-template-columns: repeat(2, 1fr);
    margin-top: 8px;
    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .image-wrapper {
    position: relative;
    width: 100%;
    height: 100%; /* Adjust as needed */
    max-height: 200px;
    overflow: hidden;
    border-radius: 4px;
  }

  .image-item {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .overlay-more {
    position: absolute;
    top: 7px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 1rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
  }
}

:deep(.q-btn) {
  .q-btn-dropdown__arrow {
    display: none;
  }
}

.image-item {
  width: 100px; /* Adjust as needed */
  height: 100px; /* Adjust as needed */
  border-radius: 8px;
  object-fit: cover;
}

.large-image {
  min-width: 300px;
  height: auto;
  max-height: 80vh; /* Limit height for better UX */
}

.popup-container {
  min-width: 600px;
  padding: 16px;
  background: #fff;
  position: relative;
}
@media (min-width: 600px) {
  .q-dialog__inner--minimized > div {
    max-width: 700px;
  }
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}

.menu-btn {
    transform: rotate(90deg);
}
</style>
