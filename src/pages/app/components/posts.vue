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
      <q-img
        v-if="postImage"
        :src="postImage"
        spinner-color="white"
        fit="contain"
      />
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
  userImage: {
    type: String,
    default: "", // Default value for userImage
  },
  username: {
    type: String,
    default: "", // Default value for username
  },
  timeAgo: {
    type: String,
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
  votes: {
    type: Number,
    default: 0, // Default value for votes
  },
  comments: {
    type: Number,
    default: 0, // Default value for comments
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
}
</style>
