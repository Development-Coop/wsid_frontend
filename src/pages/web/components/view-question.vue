<template>
  <div :class="{'q-pb-xl': !isPopup, 'custom-page': isPopup}">
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
            <p class="text-grey-9 q-mb-sm" style="font-weight: 600; word-break: break-word; overflow-wrap: anywhere;">
              <span>{{ postDetails?.title }}</span>
            </p>
            <p class="text-grey-9 q-mb-sm q-mt-sm" style="white-space: pre-wrap; word-break: break-word; overflow-wrap: anywhere;">{{ postDetails?.description }}</p>

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
          <q-tab name="Votes" :label="`Votes (${localTotalVotes})`" />
          <q-tab 
            name="Comments" 
            :label="`Comments (${localTotalComments})`"
            :disable="!selectedVote"
          />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" :class="[{'q-pb-lg': !isPopup}]">
          <q-tab-panel class="q-pa-lg" name="Votes">
            <div v-if="isOwner" class="owner-view-panel q-pa-md q-mb-md">
              <div class="text-center text-grey-7 flex items-center justify-center">
                <q-icon name="lock" color="primary" class="q-mr-sm" />
                <span>You cannot answer your own question.</span>
                <q-badge color="primary" class="q-ml-sm">Owner</q-badge>
              </div>
            </div>
            <div v-else-if="!selectedVote" class="q-gutter-md">
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
                  style="width: 58px; height: 58px; border-radius: 4px; cursor: pointer;"
                  @click.stop="openImage(option.image)"
                />
              </q-card>

              <!-- Add Submit Button -->
              <div class="submit-vote-btn q-mt-md">
                <q-btn
                  color="primary"
                  label="Submit Vote"
                  class="full-width"
                  :class="{ 'morphing': isAnimatingResults }"
                  no-caps
                  unelevated
                  :disable="!tempSelectedVote || isAnimatingResults || isOwner"
                  @click="submitVote"
                />
              </div>
            </div>
            <div v-else :class="['q-gutter-md', {'option-container-grid': isPopup && postDetails?.options?.length > 2}]">
              <q-card
                v-for="(option, index) in postDetails.options"
                :key="option.id"
                class="votes-result"
                flat
              >
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center" style="flex: 1; min-width: 0;">
                    <span class="q-mr-md text-truncate" style="flex: 1;">{{ option.text }}</span>
                    <div class="result-stats" :class="{ 'q-mr-md': option.image }">
                      <span class="percentage-text">{{ option.percentage }}%</span>
                      <span class="votes-count">{{ option.votesCount }} Votes</span>
                    </div>
                  </div>
                  <q-img
                    v-if="option.image"
                    loading="lazy"
                    :src="option.image"
                    spinner-color="primary"
                    spinner-size="16px"
                    fit="cover"
                    class="result-image"
                    @click.stop="openImage(option.image)"
                  >
                    <template #error>
                      <!-- Don't show anything if image fails to load -->
                    </template>
                  </q-img>
                </div>
                <q-linear-progress
                  size="8px"
                  :value="option.percentage / 100"
                  :color="option.trackColor"
                  :track-color="option.trackColor"
                  :class="{ 'water-ripple-effect': isAnimatingResults }"
                  :style="{ 'animation-delay': `${index * 150}ms` }"
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
                    <!-- User's Vote Display -->
                    <div v-if="comment?.userVote" class="user-vote-display q-mt-xs q-mb-sm">
                      <span class="vote-indicator">Voted: {{ comment.userVote.optionText }}</span>
                    </div>
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
                        <!-- User's Vote Display for Replies -->
                        <div v-if="reply?.userVote" class="user-vote-display q-mt-xs q-mb-sm">
                          <span class="vote-indicator">Voted: {{ reply.userVote.optionText }}</span>
                        </div>
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
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, onUnmounted, onMounted, nextTick, computed } from "vue";
import { useQuasar } from "quasar";
import { usePostStore } from "src/stores/postStore";
import { useProfileStore } from "src/stores/profileStore";

// Image
// import likeImage from 'src/assets/images/like.png';
import happyIcon from 'src/assets/icons/happy.svg';
// import dislikeImage from 'src/assets/images/dislike.png';
import sadIcon from 'src/assets/icons/sad.svg';
import fallbackImage from 'src/assets/icons/profile-user.png';

const postStore = usePostStore();
const profileStore = useProfileStore();
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

// Local reactive variables to track counts separately for real-time updates
const localTotalVotes = ref(0);
const localTotalComments = ref(0);

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

const emit = defineEmits(["fetch-new-post", "question-answered", "update-post"]);

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
const currentUserId = computed(() => profileStore.userDetails?.id);
const isOwner = computed(() => postDetails.value.user?.id && postDetails.value.user.id === currentUserId.value);

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
  } else {
    isLoading.value = false; // Set loading to false even if no postId
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

  // If older than 24 hours, show the actual date and time
  if (secondsAgo >= 86400) {
    const date = new Date(dateTime);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Format time as HH:MM AM/PM
    const timeOptions = { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    };
    const timeString = date.toLocaleTimeString('en-US', timeOptions);
    
    // Check if it's today or yesterday
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${timeString}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${timeString}`;
    } else {
      // For older dates, show full date
      const dateOptions = { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      };
      const dateString = date.toLocaleDateString('en-US', dateOptions);
      return `${dateString} at ${timeString}`;
    }
  }

  // For posts less than 24 hours old, use relative time
  if (secondsAgo < 60) {
    return `${secondsAgo} seconds ago`;
  } else if (secondsAgo < 3600) {
    const minutes = Math.floor(secondsAgo / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    const hours = Math.floor(secondsAgo / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
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

const toggleLike = async (commentId) => {
  try {
    // Find the comment in the local state
    const updateCommentLikes = (commentsList) => {
      return commentsList.map(comment => {
        if (comment.id === commentId) {
          // Create updated comment
          const updatedComment = { ...comment };
          
          if (comment.hasLiked) {
            // Remove like
            updatedComment.hasLiked = false;
            updatedComment.likesCount = Math.max(0, comment.likesCount - 1);
          } else {
            // Add like
            updatedComment.hasLiked = true;
            updatedComment.likesCount = comment.likesCount + 1;
            
            // Remove dislike if present
            if (comment.hasDisliked) {
              updatedComment.hasDisliked = false;
              updatedComment.dislikesCount = Math.max(0, comment.dislikesCount - 1);
            }
          }
          
          return updatedComment;
        }
        
        // Check nested replies
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: updateCommentLikes(comment.replies)
          };
        }
        
        return comment;
      });
    };

    // Update local state immediately
    comments.value = updateCommentLikes(comments.value);
    
    // Make API call in background
    await postStore.addLike(commentId);
    
    // Refresh comments to ensure consistency (optional - you might skip this for better UX)
    // await fetchComments(postDetails.value.id);
  } catch (error) {
    console.error('Error toggling like:', error);
    // Revert changes on error by refetching
    await fetchComments(postDetails.value.id);
    
    $q.notify({
      color: "negative",
      message: "Failed to update like. Please try again.",
      position: "top",
      icon: "error",
      autoClose: true,
    });
  }
};

const toggleDislike = async (commentId) => {
  try {
    // Find the comment in the local state
    const updateCommentDislikes = (commentsList) => {
      return commentsList.map(comment => {
        if (comment.id === commentId) {
          // Create updated comment
          const updatedComment = { ...comment };
          
          if (comment.hasDisliked) {
            // Remove dislike
            updatedComment.hasDisliked = false;
            updatedComment.dislikesCount = Math.max(0, comment.dislikesCount - 1);
          } else {
            // Add dislike
            updatedComment.hasDisliked = true;
            updatedComment.dislikesCount = comment.dislikesCount + 1;
            
            // Remove like if present
            if (comment.hasLiked) {
              updatedComment.hasLiked = false;
              updatedComment.likesCount = Math.max(0, comment.likesCount - 1);
            }
          }
          
          return updatedComment;
        }
        
        // Check nested replies
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: updateCommentDislikes(comment.replies)
          };
        }
        
        return comment;
      });
    };

    // Update local state immediately
    comments.value = updateCommentDislikes(comments.value);
    
    // Make API call in background
    await postStore.addDislike(commentId);
    
    // Refresh comments to ensure consistency (optional - you might skip this for better UX)
    // await fetchComments(postDetails.value.id);
  } catch (error) {
    console.error('Error toggling dislike:', error);
    // Revert changes on error by refetching
    await fetchComments(postDetails.value.id);
    
    $q.notify({
      color: "negative",
      message: "Failed to update dislike. Please try again.",
      position: "top",
      icon: "error",
      autoClose: true,
    });
  }
};

const fetchComments = async (postId) => {
  try {
    comments.value = await postStore.getCommentsList(postId);
    
    const newCommentCount = countTotalComments(comments.value);
    totalComments.value = newCommentCount;
    localTotalComments.value = newCommentCount;
    
    comments.value = comments.value.map((comment) => ({
      ...comment,
      showAllReplies: false
    }));
  } catch (error) {
    console.error('Error fetching comments:', error);
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
    const newVoteCount = postDetails.value.options.reduce((sum, i) => sum + i.votesCount, 0);
    totalVotes.value = newVoteCount;
    localTotalVotes.value = newVoteCount;
    
    postDetails.value.options = calculateOptionsWithColors(postDetails.value.options, totalVotes.value);
  } catch (error) {
    console.error('Error in fetchPostDetails:', error);
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
    
    // Emit the updated comment count to parent components
    const postId = route?.query?.postId || props?.postId;
    emit('update-post', postId, { 
      commentsCount: localTotalComments.value
    });
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

const isAnimatingResults = ref(false);

// Modified submitVote function with water ripple animation
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

    // Button morphing animation
    const submitButton = document.querySelector('.submit-vote-btn .q-btn');
    if (submitButton) {
      submitButton.classList.add('morphing');
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
    
    // Trigger water ripple animation after results load
    setTimeout(() => {
      animateResults();
    }, 300);
    
    emit('update-post', postId, { 
      hasVoted: true, 
      votesCount: localTotalVotes.value
    });
    emit('question-answered');
    
    // Clean up button animation
    setTimeout(() => {
      if (submitButton) {
        submitButton.classList.remove('morphing');
      }
    }, 1500);
    
  } catch (e) {
    // Clean up button animation on error
    const submitButton = document.querySelector('.submit-vote-btn .q-btn');
    if (submitButton) {
      submitButton.classList.remove('morphing');
    }
    
    $q.notify({
      color: "negative",
      message: "Please try again.",
      position: "top",
      icon: "error",
      autoClose: true,
    });
  }
};

// Water ripple animation function
const animateResults = () => {
  isAnimatingResults.value = true;
  
  // Get all progress bars and animate them with staggered timing
  const progressBars = document.querySelectorAll('.votes-result .q-linear-progress');
  
  progressBars.forEach((bar, index) => {
    setTimeout(() => {
      // Add water ripple effect
      bar.classList.add('water-ripple-effect');
      
      // Reset and animate the Quasar progress bar
      const progressTrack = bar.querySelector('.q-linear-progress__track');
      if (progressTrack) {
        progressTrack.style.transform = 'scaleX(0)';
        progressTrack.style.transformOrigin = 'left';
        
        setTimeout(() => {
          progressTrack.style.transition = 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
          progressTrack.style.transform = 'scaleX(1)';
        }, 50);
      }
    }, index * 150); // Stagger each bar by 150ms
  });
  
  // Clean up animation state
  setTimeout(() => {
    isAnimatingResults.value = false;
    progressBars.forEach(bar => {
      bar.classList.remove('water-ripple-effect');
    });
  }, 2500);
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #000;

  &:hover {
    background-position: 0 0;
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &.selected-option {
    background-color: var(--option-color);
    color: #fff;
    animation: selection-bounce 0.6s ease-out;
  }
}

.votes-result {
  height: auto;
  min-height: 70px;
  background-color: #f0f2f5;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 12px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  
  .result-stats {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
    
    .percentage-text {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
      line-height: 1.2;
    }
    
    .votes-count {
      font-size: 12px;
      color: #666;
      line-height: 1.2;
    }
  }
  
  .result-image {
    width: 48px;
    height: 48px;
    border-radius: 6px;
    cursor: pointer;
    transition: transform 0.2s ease;
    flex-shrink: 0;
    
    &:hover {
      transform: scale(1.05);
    }
  }
  
  .q-linear-progress {
    position: absolute;
    bottom: 0;
    left: 0px;
    margin-top: 8px;
    overflow: hidden;
    
    // Water ripple effect
    &.water-ripple-effect {
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
          transparent, 
          rgba(255,255,255,0.7), 
          transparent
        );
        animation: water-shimmer 1.5s ease-out;
        z-index: 2;
        pointer-events: none;
      }
      
      &::after {
        content: '';
        position: absolute;
        top: -50%;
        left: 50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
        animation: water-ripple 1.2s ease-out;
        transform: translate(-50%, -50%) scale(0);
        z-index: 1;
        pointer-events: none;
      }
    }
    
    // Ensure Quasar's track is visible
    :deep(.q-linear-progress__track) {
      transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: left;
    }
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

.user-vote-display {
  .vote-indicator {
    font-size: 12px;
    color: #ff6600;
    font-weight: 500;
    background-color: rgba(255, 102, 0, 0.1);
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-block;
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
  
  .q-btn {
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    
    &.morphing {
      background: linear-gradient(45deg, #4ecdc4, #45b7d1) !important;
      animation: button-morph 1.5s ease-in-out;
      transform: scale(1.05);
    }
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }
  }
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

@keyframes water-shimmer {
  0% { 
    left: -100%; 
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% { 
    left: 100%; 
    opacity: 0;
  }
}

@keyframes water-ripple {
  0% { 
    transform: translate(-50%, -50%) scale(0); 
    opacity: 1; 
  }
  50% {
    opacity: 0.6;
  }
  100% { 
    transform: translate(-50%, -50%) scale(1); 
    opacity: 0; 
  }
}

// Button morphing animation
@keyframes button-morph {
  0% { 
    border-radius: 12px; 
    transform: scale(1.05);
  }
  25% { 
    border-radius: 50px; 
    transform: scale(0.98);
  }
  50% { 
    border-radius: 12px; 
    transform: scale(1.08);
  }
  75% { 
    border-radius: 50px; 
    transform: scale(1.02);
  }
  100% { 
    border-radius: 12px; 
    transform: scale(1.05);
  }
}

// Selection bounce animation
@keyframes selection-bounce {
  0% { 
    transform: scale(1); 
  }
  50% { 
    transform: scale(1.05) translateY(-2px);
  }
  100% { 
    transform: scale(1.02) translateY(-1px);
  }
}

// Keep all your existing styles unchanged
.vote-options.disabled-option {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}

// Add smooth transitions to existing elements
.q-linear-progress {
  transition: all 0.3s ease;
}

// Ensure animations work well with Quasar's deep selectors
:deep(.q-linear-progress__track) {
  will-change: transform;
}

:deep(.q-btn__content) {
  transition: all 0.3s ease;
}

.popup-container {
  width: 100%;
  max-width: 100vw;
  min-width: unset;
  padding: 8px;
  background: #fff;
  position: relative;
  border-radius: 10px;
}
@media (min-width: 600px) {
  .popup-container {
    max-width: 500px;
    margin: 0 auto;
    border-radius: 12px;
    padding: 24px;
  }
}
.owner-view-panel {
  background: #f8fafc;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  .vote-options.owner-disabled {
    opacity: 0.7;
    filter: grayscale(1);
    cursor: not-allowed;
    .text-grey-6 {
      font-weight: 500;
    }
  }
}
</style>