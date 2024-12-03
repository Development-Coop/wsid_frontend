<template>
  <div class="flex no-wrap post">
    <q-img
      class="post-img"
      :src="userImage"
      spinner-color="primary"
      spinner-size="22px"
    />
    <div style="flex-grow: 1">
      <p>
        <span v-if="username" class="text-weight-medium">{{ username }}</span>
        <!-- Dynamic username -->
        <span v-if="timeAgo" class="text-grey-7"> • {{ timeAgo }}</span>
        <!-- Dynamic time -->
      </p>
      <p class="text-grey-9 q-mb-sm">
        <span v-if="postContent">{{ postContent }}</span>
        <!-- Dynamic post content -->
      </p>

      <!-- Twitter-style images layout -->
      <div v-if="postImages.length > 0" class="images-grid">
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
          />
          <!-- Overlay for more images if more than 4 -->
          <div v-if="index === 3 && postImages.length > 4" class="overlay-more">
            +{{ postImages.length - 4 }}
          </div>
        </div>
      </div>

      <div class="flex no-wrap items-center q-mt-md" style="gap: 10px">
        <span>{{ votes }} <span class="text-grey-7">Votes</span></span> •
        <span>{{ comments }} <span class="text-grey-7">Comments</span></span>
        <q-btn
          no-caps
          size="md"
          unelevated
          color="grey-12"
          text-color="black"
          label="Answer"
          class="q-ml-auto"
          :to="{ name: 'view-question' }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  postId: {
    type: String,
    required: true, // Required since it's used as the key
  },
  userImage: {
    type: String,
    default: "", // Default value for user profile image
  },
  userId: {
    type: String,
    required: true, // Required since it uniquely identifies the user
  },
  username: {
    type: String,
    default: "", // Default value for username
  },
  timeAgo: {
    type: String,
    default: "", // Default value for time since the post
  },
  postContent: {
    type: String,
    default: "", // Default value for post description
  },
  postImage: {
    type: String,
    default: "", // Default value for postImage
  },
  postImages: {
    type: Array,
    default: () => [], // Default as an empty array for post images
  },
  votes: {
    type: Number,
    default: 0, // Default value for vote count
  },
  comments: {
    type: Number,
    default: 0, // Default value for comment count
  },
});
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
  .images-grid {
    display: grid;
    gap: 4px;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    margin-top: 8px;
  }

  .image-wrapper {
    position: relative;
    width: 100%;
    height: 100px; /* Adjust as needed */
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
    top: 0;
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
  }
}
</style>
