<template>
  <q-page class="q-pb-xl">
    <div class="flex justify-between q-pa-md sticky-header">
      <q-btn
        no-caps
        block
        unelevated
        size="md"
        color="grey-12"
        text-color="black"
        label="Back"
        style="width: 80px"
        @click="router.back()"
      />
    </div>
    <div class="q-pa-md">
      <div class="flex no-wrap post">
        <q-img
          class="post-img"
          src="https://avatar.iran.liara.run/public/girl"
          spinner-color="primary"
          spinner-size="22px"
        />
        <div style="flex-grow: 1">
          <p style="margin-bottom: 4px;">
            <span class="text-weight-medium">{{
              postDetails?.user?.name
            }}</span>
            <!-- Dynamic username -->
            <span class="text-grey-7"> • {{ calculateTimeAgo }}</span>
            <!-- Dynamic time -->
          </p>
          <p class="text-grey-9 q-mb-sm">
            <span>{{ postDetails?.title }}</span>
          </p>
          <p>{{ postDetails?.description }}</p>

          <div
            v-if="postDetails?.images?.length > 0"
            class="flex q-gutter-md q-mt-sm"
            style="border-top: 1px solid #dddddd"
          >
            <div
              v-for="(image, index) in postDetails?.images"
              :key="index"
              class="image-wrapper"
            >
              <q-img
                loading="lazy"
                :src="image"
                spinner-color="primary"
                spinner-size="20px"
                fit="cover"
                style="
                width: 58px;
                height: 58px;
                border-radius: 4px;
                cursor: pointer;
              "
                @click="openImage(image)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-card flat style="border-top: 1px solid #dddddd">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="Votes" :label="totalVotes" />
        <q-tab name="Comments" label="Comments (1)" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" class="q-pb-lg">
        <q-tab-panel class="q-pa-lg" name="Votes">
          <div v-if="!selectedVote" class="q-gutter-md q-mb-xl">
            <q-card
              v-for="option in postDetails.options"
              :key="option.id"
              class="vote-options"
              :class="{ 
                'selected-option': selectedVote === option.id,
                'disabled-option': !!selectedVote
              }"
              flat
              @click="!!!selectedVote && showVotesResult(option.id)"
            >
              {{ option.text }}
              <q-img
                loading="lazy"
                :src="option.image"
                spinner-color="primary"
                spinner-size="20px"
                fit="cover"
                style="
                  width: 58px;
                  height: 58px;
                  border-radius: 4px;
                  cursor: pointer;
                "
              />
            </q-card>
          </div>
          <div v-else class="q-gutter-md">
            <q-card
              v-for="option in postDetails.options"
              :key="option.id"
              class="votes-result"
              flat
            >
              <div class="flex items-center justify-between w-full">
                <span class="q-mr-md">{{ option.text }}</span>
                <span class="q-ml-auto q-mr-md">{{ option.percentage }}%</span>
                <span>•</span>
                <span class="q-ml-md">{{ option.votesCount }} Votes</span>
              </div>
              <q-linear-progress
                size="8px"
                :value="option.percentage / 100"
                :color="option.trackColor"
                :track-color="option.trackColor"
              />
            </q-card>
          </div>
        </q-tab-panel>
        <q-tab-panel class="q-pa-lg" name="Comments">
          <div class="flex no-wrap post">
            <q-img
              class="post-img"
              src="https://avatar.iran.liara.run/public/girl"
              spinner-color="primary"
              spinner-size="22px"
            />
            <div style="flex-grow: 1">
              <p>
                <span class="text-weight-medium">Kal Azar</span>
                <span class="text-grey-7"> • 30 mins ago</span>
              </p>
              <p class="text-weight-medium text-weight-bold">
                Choose Option B: Figma
              </p>
              <p class="text-grey-9">
                <span>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad,
                  suscipit!
                </span>
              </p>
              <p class="flex items-center q-mt-sm q-mb-md">
                <span class="q-mr-md cursor-pointer">Reply</span>
                <span class="q-mr-md flex items-center cursor-pointer">
                  <img
                    src="../../../../assets/icons/happy.svg"
                    alt="like-icon"
                    srcset=""
                    class="q-mr-xs"
                  />
                  2
                </span>
                <span class="q-mr-sm flex items-center">
                  <img
                    src="../../../../assets/icons/sad.svg"
                    alt="like-icon"
                    srcset=""
                    class="q-mr-xs"
                  />2
                </span>
              </p>
              <div class="flex no-wrap post">
                <q-img
                  class="post-img"
                  src="https://avatar.iran.liara.run/public/girl"
                  spinner-color="primary"
                  spinner-size="22px"
                />
                <div style="flex-grow: 1">
                  <p>
                    <span class="text-weight-medium">Kal Azar</span>
                    <span class="text-grey-7"> • 30 mins ago</span>
                  </p>
                  <p class="text-grey-9 q-mb-sm">
                    <span>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Ad, suscipit!
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="q-pa-md fixed w-full bg-white" style="bottom: 0; left: 0">
            <q-input v-model="text" outlined>
              <template #after>
                <q-btn
                  round
                  dense
                  color="primary"
                  unelevated
                  icon="north_east"
                  @click="addComment"
                />
              </template>
            </q-input>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <q-dialog v-model="dialog" @hide="closeDialog">
      <q-img :src="imageSrc" spinner-color="primary" spinner-size="22px" />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, computed, onUnmounted, onMounted } from "vue";
import { useQuasar, Loading } from "quasar";
import { usePostStore } from "src/stores/postStore";

const postStore = usePostStore();
const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const tab = ref("Votes");
const text = ref("");
const dialog = ref(false); // Control dialog visibility
const imageSrc = ref(""); // Store image source
const selectedVote = ref(null); // Track the selected vote option
const totalVotes = ref("Votes (0)")

const postDetails = ref({
  id: "",
  description: "",
  images: [],
  createdBy: "",
  createdAt: null,
  title: "",
  updatedAt: null,
  user: {
    id: "",
    name: "",
    profilePicUrl: "",
  },
  options: [],
});

let interval;
onMounted(async () => {
  interval = setInterval(() => {
    now.value = Date.now();
  }, 1000); // Update every second
  const postId = route.query.postId;
  if (postId) {
    await fetchPostDetails(postId);
  }
});

onUnmounted(() => {
  clearInterval(interval); // Cleanup on component unmount
});

const now = ref(Date.now());
const calculateTimeAgo = computed(() => {
  const secondsAgo = Math.floor((now.value - postDetails.value.createdAt) / 1000);

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

const calculateOptionsWithColors = (options, totalCount) => {
  const colors = ['red', 'orange', 'blue', 'green', 'purple'];
  return options.map((option, index) => {
    const percentage = totalCount > 0 ? (option.votesCount / totalCount) * 100 : 0;
    return {
      ...option,
      percentage: Math.round(percentage),
      trackColor: colors[index % colors.length],
    };
  });
};

const fetchPostDetails = async (postId) => {
  try {
    Loading.show();
    const data = await postStore.getPostDetails(postId);
    // Populate the fields with fetched data
    postDetails.value = {
      id: data?.id || "",
      description: data?.description || "",
      images: data?.images || [],
      createdBy: data?.createdBy || "",
      createdAt: data?.createdAt || null,
      title: data?.title || "",
      updatedAt: data?.updatedAt || null,
      user: {
        id: data?.user?.id || "",
        name: data.user?.name || "",
        profilePicUrl: data?.user?.profilePicUrl || "",
      },
      options: data.options || [],
    };
    selectedVote.value = postDetails.value.options.find((option) => option.hasVoted)?.id || "";
    let totalCount = postDetails.value.options.reduce((sum, i) => sum + i.votesCount, 0);
    totalVotes.value = `Vote (${totalCount})`;
    postDetails.value.options = calculateOptionsWithColors(postDetails.value.options, totalCount);
  } catch (error) {
    $q.notify({
      color: "negative",
      message: "Failed to fetch post details. Please try again.",
      position: "top",
      icon: "error",
      autoClose: true,
    });
  } finally {
    Loading.hide();
  }
};

const openImage = (src) => {
  imageSrc.value = src; // Set the image source
  dialog.value = true; // Open the dialog
};

const closeDialog = () => {
  dialog.value = false; // Close the dialog
};

const addComment = async () => {
  try {
    Loading.show();
    const data = {
      "postId": postDetails.value.id,
      "text": text.value
      //"parentId": "wmWtCqfndNt5eDxCwCEB"
    }
    await postStore.createComment(data);
  } catch (e) {
    $q.notify({
      color: "negative",
      message: "Please try again.",
      position: "top",
      icon: "error",
      autoClose: true,
    });
  } finally {
    Loading.hide();
  }
}

const showVotesResult = async (option) => {
  try {
    Loading.show();
    const data = {
      "postId": postDetails.value.id,
      "optionId": option
    }
    await postStore.createVote(data);
    selectedVote.value = option; // Set the selected option
    await fetchPostDetails(postDetails.value.id);
  } catch (e) {
    $q.notify({
      color: "negative",
      message: "Please try again.",
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
  gap: 16px;
  .post-img {
    flex-shrink: 0;
    height: 44px;
    width: 44px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #aeaeb2;
  }
}
:deep(.q-tab__label) {
  text-transform: none;
}
.vote-options {
  height: 60px;
  border: 1px solid #dfe2e8;
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 16px 0px 16px 16px;
  justify-content: space-between;
  font-weight: 500;
  cursor: pointer;

  &.selected-option {
    background-color: #f49d37;
    color: #fff;
  }
}
.votes-result {
  height: 55px;
  background-color: #f0f2f5;
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 10px;
  font-weight: 500;
  .q-linear-progress {
    position: absolute;
    bottom: 0;
    left: 0px;
  }
}

.vote-options.disabled-option {
  opacity: 0.5;
  pointer-events: none; /* Prevent any interaction */
  cursor: not-allowed;
}
</style>
