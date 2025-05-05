<template>
  <q-page :class="{'q-pb-xl': !isPopup, 'custom-page': isPopup}">
    <div v-if="!isPopup" class="flex justify-between q-pa-md sticky-header">
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
    <template v-if="isLoading">
      <div class="q-pa-md">
        <div class="flex no-wrap post">
          <q-skeleton type="QAvatar" size="44px" style="flex-shrink: 0;" class="q-mr-md" />
          <div class="full-width">
            <q-skeleton type="text" width="30%" class="q-mb-sm" />
            <q-skeleton type="text" width="60%" class="q-mb-sm" />
            <q-skeleton type="text" width="80%" class="q-mb-md" />
          </div>
        </div>
      </div>
      <q-card flat style="border-top: 1px solid #dddddd">
        <div class="q-pa-lg">
          <div class="q-gutter-md">
            <div v-for="n in 4" :key="n" class="skeleton-vote-option">
              <q-skeleton type="text" width="100%" />
            </div>
          </div>
        </div>
      </q-card>
    </template>
    <template v-else>
      <div class="q-pa-md">
        <div class="flex no-wrap post">
          <q-img
            class="post-img"
            :src="postDetails?.user?.profilePicUrl"
            spinner-color="primary"
            spinner-size="22px"
          >
            <template #error>
              <img :src="fallbackImage" alt="Fallback Image" class="post-img" style="border: none;width: 100%;height: 100%;padding: 4px;" />
            </template>
          </q-img>
          <div style="flex-grow: 1">
            <p style="margin-bottom: 4px;">
              <span class="text-weight-medium">{{
                postDetails?.user?.name
              }}</span>
              <!-- Dynamic username -->
              <span v-show="postDetails?.user?.name" class="text-grey-7"> • {{ calculateTimeAgo(postDetails.createdAt) }}</span>
              <!-- Dynamic time -->
            </p>
            <p class="text-grey-9 q-mb-sm" style="font-weight: 600;">
              <span>{{ postDetails?.title }}</span>
            </p>
            <p class="text-grey-9 q-mb-sm q-mt-sm" style="white-space: pre-wrap;">{{ postDetails?.description }}</p>

            <div
              v-if="postDetails?.images?.length > 0"
              class="flex q-gutter-md q-mt-md"
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
          <q-tab name="Votes" :label="`Votes (${totalVotes})`" />
          <q-tab 
            name="Comments" 
            :label="`Comments (${totalComments})`"
            :disable="!selectedVote"
          />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" :class="[{'q-pb-lg': !isPopup}]">
          <q-tab-panel class="q-pa-lg" name="Votes">
            <div v-if="!selectedVote" class="q-gutter-md">
              <q-card
                v-for="option in postDetails.options"
                :key="option.id"
                class="vote-options"
                :class="{ 
                  'selected-option': tempSelectedVote === option.id,
                  'disabled-option': !!selectedVote
                }"
                :style="{
                  '--option-color': option.trackColor,
                  'background': tempSelectedVote === option.id ? option.trackColor : 'transparent'
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
                  @click.stop="openImage(option.image)"
                />
              </q-card>

              <!-- Add Submit Button -->
              <div class="submit-vote-btn q-mt-md">
                <q-btn
                  color="primary"
                  label="Submit Vote"
                  class="full-width"
                  no-caps
                  unelevated
                  :disable="!tempSelectedVote"
                  @click="submitVote"
                />
              </div>
            </div>
            <div v-else :class="['q-gutter-md', {'option-container-grid': isPopup && postDetails?.options?.length > 2}]">
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
            <div v-if="!selectedVote" class="text-center q-mt-md">
              <p class="text-grey-7">Please vote to see and add comments</p>
            </div>
            <template v-else>
              <div v-if="comments?.length === 0" :class="['text-center', { 'q-mt-md': !isPopup }]">
                <p class="text-grey-7">Break the silence, leave a comment!</p>
              </div>
              <div v-else class="comments-list">
                <div v-for="comment in comments" :key="comment.id" class="flex no-wrap post">
                  <q-img
                    class="post-img"
                    :src="comment?.createdBy?.profilePicUrl"
                    spinner-color="primary"
                    spinner-size="22px"
                  >
                    <template #error>
                      <img :src="fallbackImage" alt="Fallback Image" class="post-img" style="border: none;width: 100%;height: 100%;padding: 4px;" />
                    </template>
                  </q-img>
                  <div style="flex-grow: 1">
                    <p>
                      <span class="text-weight-medium">{{ comment?.createdBy?.name }}</span>
                      <span class="text-grey-7"> • {{ calculateTimeAgo(comment?.createdAt) }}</span>
                    </p>
                    <!-- <p class="text-weight-medium text-weight-bold">{{ comment.text }}</p> -->
                    <p class="text-grey-9 q-mt-xs">
                      <span>{{ comment?.text }}</span>
                    </p>
                    <p class="flex items-center q-mt-sm q-mb-md">
                      <span class="q-mr-md cursor-pointer" @click="focusReplyInput(comment?.id)">Reply</span>
                      <span 
                        class="like-container q-mr-md flex items-center cursor-pointer"
                        @click="toggleLike(comment?.id)"
                      >
                        <div 
                          class="like-icon-wrapper q-mr-sm" 
                          :class="{ 'liked-outline': comment?.hasLiked }"
                        >
                          <img
                            :src="happyIcon"
                            alt="like-icon"
                            style="height: 20px;"
                          />
                        </div>
                        <span
                          :class="{ 'liked-text': comment?.hasLiked }"
                        >
                          {{ comment?.likesCount }}
                        </span>
                      </span>
                      <span 
                        class="like-container q-mr-md flex items-center cursor-pointer"
                        @click="toggleDislike(comment?.id)"
                      >
                        <div 
                          class="like-icon-wrapper q-mr-sm" 
                          :class="{ 'liked-outline': comment?.hasDisliked }"
                        >
                          <img
                            :src="sadIcon"
                            alt="dislike-icon"
                            style="height: 20px;"
                          />
                        </div>
                        <span
                          :class="{ 'liked-text': comment?.hasDisliked }"
                        >
                          {{ comment?.dislikesCount }}
                        </span>
                      </span>
                    </p>
                    <div
                      v-for="reply in (comment.showAllReplies ? comment.replies : comment.replies.slice(0, 1))"
                      :key="reply.id"
                      class="flex no-wrap post"
                    >
                      <q-img
                        class="post-img"
                        :src="reply.createdBy.profilePicUrl"
                        spinner-color="primary"
                        spinner-size="22px"
                      >
                        <template #error>
                          <img :src="fallbackImage" alt="Fallback Image" class="post-img" style="border: none;width: 100%;height: 100%;padding: 4px;" />
                        </template>
                      </q-img>
                      <div style="flex-grow: 1">
                        <p>
                          <span class="text-weight-medium">{{ reply?.createdBy?.name }}</span>
                          <span class="text-grey-7"> • {{ calculateTimeAgo(reply?.createdAt) }}</span>
                        </p>
                        <p class="text-grey-9 q-mb-xs">
                          <span>{{ reply?.text }}</span>
                        </p>
                        <p class="flex items-center q-mt-sm q-mb-md">
                          <span class="q-mr-md cursor-pointer" @click="focusReplyInput(comment?.id)">Reply</span>
                          <span 
                            class="like-container q-mr-md flex items-center cursor-pointer"
                            @click="toggleLike(reply.id)"
                          >
                            <div 
                              class="like-icon-wrapper q-mr-sm" 
                              :class="{ 'liked-outline': reply?.hasLiked }"
                            >
                              <img
                                :src="happyIcon"
                                alt="like-icon"
                                style="height: 20px;"
                              />
                            </div>
                            <span
                              :class="[{ 'liked-text': reply?.hasLiked }]"
                            >
                              {{ reply?.likesCount }}
                            </span>
                          </span>
                          <span 
                            class="like-container q-mr-md flex items-center cursor-pointer"
                            @click="toggleDislike(reply?.id)"
                          >
                            <div 
                              class="like-icon-wrapper q-mr-sm" 
                              :class="{ 'liked-outline': reply?.hasDisliked }"
                            >
                              <img
                                :src="sadIcon"
                                alt="dislike-icon"
                                style="height: 20px;"
                              />
                            </div>
                            <span
                              :class="{ 'liked-text': reply?.hasDisliked }"
                            >
                              {{ reply?.dislikesCount }}
                            </span>
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      v-if="comment?.replies?.length > 1"
                      class="text-md q-mb-md cursor-pointer show-more"
                      @click="comment.showAllReplies = !comment?.showAllReplies"
                    >
                      {{ comment?.showAllReplies ? "Hide replies" : "View more replies" }}
                    </button>
                  </div>
                </div>
              </div>
              <div :class="['q-pa-md','w-full','bg-white', { 'input-container': !isPopup, 'input-container-popup': isPopup }]">
                <q-input ref="replyInput" v-model="text" maxlength="1000" outlined @keyup.enter="addComment">
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
            </template>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </template>

    <q-dialog v-model="dialog" @hide="closeDialog">
      <q-card class="image-preview-container">
        <q-btn
          round
          flat
          dense
          icon="close"
          class="close-button"
          color="white"
          @click="closeDialog"
        />
        <q-img :src="imageSrc" spinner-color="primary" spinner-size="22px" />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, onUnmounted, onMounted, nextTick } from "vue";
import { useQuasar } from "quasar";
import { usePostStore } from "src/stores/postStore";

// Image
// import likeImage from 'src/assets/images/like.png';
import happyIcon from 'src/assets/icons/happy.svg';
// import dislikeImage from 'src/assets/images/dislike.png';
import sadIcon from 'src/assets/icons/sad.svg';
import fallbackImage from 'src/assets/icons/profile-user.png';

const postStore = usePostStore();
const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const tab = ref("Votes");
const text = ref("");
const dialog = ref(false); // Control dialog visibility
const imageSrc = ref(""); // Store image source
const selectedVote = ref(null); // Track the selected vote option
const totalVotes = ref(0);
const totalComments = ref(0);
const comments = ref([]);
const commentParentId = ref(null);
const replyInput = ref(null);

// Add new ref for temporary selection
const tempSelectedVote = ref(null);

const props = defineProps({
  postId: {
    type: String,
    default: "",
  },
  isPopup: {
    type: Boolean,
    default: false,
  },
  tabValue : {
    type: String,
    default: "",
  }
});

const emit = defineEmits(["fetch-new-post"]);

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

const isLoading = ref(true);

let interval;
onMounted(async () => {
  interval = setInterval(() => {
    now.value = Date.now();
  }, 1000); // Update every second
  const postId = route?.query?.postId || props?.postId;
  if (postId) {
    await fetchPostDetails(postId);
    await fetchComments(postId);
    isLoading.value = false; // Set loading to false after data is loaded
  }
  const tabValue = route?.query?.tab || props?.tabValue || "Votes";
  if (tabValue) tab.value = tabValue;
});

onUnmounted(() => {
  clearInterval(interval); // Cleanup on component unmount
});

const now = ref(Date.now());
const calculateTimeAgo = (dateTime) => {
  const secondsAgo = Math.floor((now.value - dateTime) / 1000);

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
};

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

const focusReplyInput = async(commentId) => {
  commentParentId.value = commentId; // Set the comment being replied to
  // Wait for the DOM to update and then focus the input box
  await nextTick(() => {
    const inputElement = replyInput.value?.$el.querySelector('input');
    console.log(inputElement, ":::")
    if (inputElement) {
      inputElement.focus();
    }
  });
}

const countTotalComments = (comments) => {
  let count = 0;

  const traverse = (commentList) => {
    for (const comment of commentList) {
      count++; // Count the current comment
      if (comment.replies && comment.replies.length > 0) {
        traverse(comment.replies); // Recursively count replies
      }
    }
  };

  traverse(comments);
  return count;
};

const toggleLike = async (postId) => {
  try {
    await postStore.addLike(postId);
    await fetchComments(postDetails.value.id);
  } catch (error) {
    console.error(error)
  }
};

const toggleDislike = async (postId) => {
  try {
    await postStore.addDislike(postId);
    await fetchComments(postDetails.value.id);
  } catch (error) {
    console.error(error)
  }
};

const fetchComments = async (postId) => {
  try {
    comments.value = await postStore.getCommentsList(postId);
    totalComments.value = countTotalComments(comments.value);
    comments.value = comments.value.map((comment) => ({
      ...comment,
      showAllReplies: false
    }));
  } catch (error) {
    $q.notify({
      color: "negative",
      message: "Failed to fetch post details. Please try again.",
      position: "top",
      icon: "error",
      autoClose: true,
    });
  }
};

const fetchPostDetails = async (postId) => {
  try {
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
    totalVotes.value = postDetails.value.options.reduce((sum, i) => sum + i.votesCount, 0);
    postDetails.value.options = calculateOptionsWithColors(postDetails.value.options, totalVotes.value);
  } catch (error) {
    $q.notify({
      color: "negative",
      message: "Failed to fetch post details. Please try again.",
      position: "top",
      icon: "error",
      autoClose: true,
    });
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
    const data = {
      "postId": postDetails.value.id,
      "text": text.value,
      ...(
        commentParentId.value ? { parentId: commentParentId.value } : {}
      )
    }
    await postStore.createComment(data);
    await fetchComments(postDetails.value.id);
    text.value = "";
    commentParentId.value = null;
    emit("fetch-new-post");
  } catch (e) {
    $q.notify({
      color: "negative",
      message: "Please try again.",
      position: "top",
      icon: "error",
      autoClose: true,
    });
  }
}

// Modify showVotesResult to handle temporary selection
const showVotesResult = (option) => {
  tempSelectedVote.value = option; // Just store the selection temporarily
};

// Add new function to handle final submission
const submitVote = async () => {
  try {
    if (!tempSelectedVote.value) {
      $q.notify({
        color: "negative",
        message: "Please select an option",
        position: "top",
        icon: "error",
      });
      return;
    }

    selectedVote.value = tempSelectedVote.value;
    const data = {
      "postId": postDetails.value.id,
      "optionId": tempSelectedVote.value
    }
    await postStore.createVote(data);
    const postId = route?.query?.postId || props?.postId;
    if (postId) {
      await fetchPostDetails(postId);
    }
    emit("fetch-new-post");
  } catch (e) {
    $q.notify({
      color: "negative",
      message: "Please try again.",
      position: "top",
      icon: "error",
      autoClose: true,
    });
  }
};
</script>

<style scoped lang="scss">
.q-page {
  height: 100%;
  overflow-y: auto; // Ensures vertical scrolling is enabled
  -webkit-overflow-scrolling: touch;
}
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
  background: linear-gradient(to right, var(--option-color) 0%, var(--option-color) 50%, transparent 50%);
  background-size: 200% 100%;
  background-position: 100% 0;
  transition: all 0.3s ease;
  color: #000;

  &:hover {
    background-position: 0 0;
  }

  &.selected-option {
    background-color: var(--option-color);
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

.comments-list {
  display: grid;
  grid-gap: 12px;
  .show-more {
    background: transparent;
    font-weight: 600;
  }
}

.custom-page {
  display: grid;
  grid-template-rows: auto !important;
  min-height: fit-content !important;
  position: relative;
}
.option-container-grid {
  display: grid;
  grid-template-columns: auto;
  grid-gap: 16px;
}
.input-container {
  position: fixed;
  left: 0;
  bottom: 0;
  &-popup {
    position: sticky;
    bottom: 0;
    left: 0;
  }
}

.like-container {
  .like-icon-wrapper {
    display: inline-block;
    border-radius: 50%; // Circular border
    display: grid;
  }

  .like-icon {
    height: 20px; // Icon size
    transition: filter 0.3s ease; // Smooth transition for hover effects
  }

  .liked-text {
    color: #f15b29; // Highlight text color
    font-weight: 800; // Make text bold
  }
}

.submit-vote-btn {
  margin-top: 24px;
  position: sticky;
  bottom: 16px;
  z-index: 1;
}

.image-preview-container {
  position: relative;
  background: transparent;
  padding: 0;

  .close-button {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 2;
    background: rgba(0, 0, 0, 0.5);
  }

  :deep(.q-img) {
    min-width: 500px;
    max-width: 90vw;
  }
}
</style>
