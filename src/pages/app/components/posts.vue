<template>
  <div class="flex no-wrap post q-pa-md">
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
    <div style="flex-grow: 1">
      <div
        class="flex items-center no-wrap cursor-pointer"
        @click.self="openPost('')"
      >
        <div style="flex-grow: 1" class="cursor-pointer" @click="goToProfile">
          <p>
            <span v-if="username" class="text-weight-medium">{{
              username
            }}</span>
            <!-- Dynamic username -->
            <span v-if="timeAgo" class="text-grey-7">
              • {{ calculateTimeAgo }}</span
            >
            <!-- Dynamic time -->
          </p>
        </div>
        <!-- Three Dots Dropdown Menu -->
        <q-btn-dropdown
          v-if="isOwnPosts"
          flat
          dense
          icon="more_vert"
          class="menu-btn"
          no-caps
          no-icon-animation
          content-class="no-arrow"
        >
          <q-list>
            <q-item v-close-popup clickable @click="emit('edit', postId)">
              <q-item-section> Edit </q-item-section>
            </q-item>
            <q-item v-close-popup clickable @click="onDelete">
              <q-item-section> Delete </q-item-section>
            </q-item>
          </q-list>

          <!-- <q-list v-else>
            <q-item v-close-popup clickable @click="sharePost">
              <q-item-section> Copy link </q-item-section>
            </q-item>
          </q-list> -->
        </q-btn-dropdown>
      </div>
      <p
        class="text-grey-9 q-mb-md q-mt-sm cursor-pointer"
        style="white-space: pre-wrap; word-break: break-word; overflow-wrap: anywhere"
        @click.self="openPost('')"
      >
        <span v-if="postContent">{{ postContent }}</span>
        <!-- Dynamic post content -->
      </p>

      <!-- Twitter-style images layout -->
      <div v-if="postImages.length > 0" class="post-images-grid q-mb-sm">
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

      <div
        class="flex no-wrap items-center"
        style="gap: 10px; margin-top: 16px"
        @click.self="openPost('')"
      >
        <span class="cursor-pointer" @click="openPost('')"
          >{{ votes }} <span class="text-grey-7">Votes</span></span
        >
        •
        <span class="cursor-pointer" @click="openPost('Comments')"
          >{{ comments }} <span class="text-grey-7">Comments</span></span
        >
        <q-btn
          no-caps
          size="md"
          unelevated
          color="grey-12"
          text-color="black"
          label="Answer"
          class="q-ml-auto"
          style="cursor: pointer"
          @click="openPost('')"
        />
      </div>
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
</template>

<script setup>
import { usePostStore } from "src/stores/postStore";
import { useQuasar, Loading } from "quasar";
import { ref, computed, onUnmounted, onMounted } from "vue";
import { useProfileStore } from "src/stores/profileStore";
import { useRouter } from "vue-router";
import fallbackImage from "src/assets/icons/profile-user.png";

const postStore = usePostStore();
const $q = useQuasar();
const profileStore = useProfileStore();
const router = useRouter();
const currentImage = ref("");
const isDialogOpen = ref(false);

const emit = defineEmits(["deleted", "edit", "update-post"]);
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
const goToProfile = () => {
  if (props.userId === user.value.id) {
    router.push({ name: "view-profile" });
  } else {
    router.push({ name: "view", query: { uid: props.userId } });
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

// const sharePost = () => {
//   const baseUrl = `${window.location.origin}/#/app/view-question?postId=${props.postId}`;
//   copyToClipboard(baseUrl);
//   $q.notify({
//     message: "Copied to clipboard",
//     color: "positive",
//     position: "top",
//     timeout: 3000,
//     icon: "check_circle",
//   });
// };

const openPost = (tab = "Votes") => {
  router.push({ name: "view-question", query: { postId: props.postId, tab } });
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
  // background-color: #fff;
  gap: 16px;
  border-radius: 10px;
  // box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  // padding: 16px;

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
    max-height: 500px;
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
    top: 0px;
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
  // margin: 8px;
  border-radius: 8px;
  object-fit: cover;
}

.large-image {
  min-width: 300px;
  height: auto;
  max-height: 80vh; /* Limit height for better UX */
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
</style>
