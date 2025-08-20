<template>
  <q-page class="q-pb-xl">
    <!-- Posts when available -->
    <template v-if="posts.length > 0">
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
          :has-voted="post.hasVoted"
          :is-own-posts="post.user.id === profileStore.userDetails?.id"
          @update-post="handleUpdatePost"
        />
      </div>
    </template>

    <!-- Empty state when no posts -->
    <template v-else>
      <div class="empty-state q-pa-lg">
        <q-icon name="favorite" size="64px" color="grey-6" />
        <p class="text-grey-7 text-h6 q-mt-md">No favorite posts yet</p>
        <p class="text-grey-8 text-body2">Like some posts to see them here!</p>
      </div>
    </template>
  </q-page>
</template>

<script setup>
import Posts from "../../components/posts.vue";
import { useProfileStore } from "src/stores/profileStore";

function* generateDummyContent() {
  const userImages = [
    "https://avatar.iran.liara.run/public/girl",
    "https://avatar.iran.liara.run/public/boy",
    "https://avatar.iran.liara.run/public",
  ];
  const names = [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eve",
    "Frank",
    "Grace",
    "Hank",
    "Ivy",
    "Jack",
  ];
  const postContents = [
    "Hello world!",
    "This is a test post.",
    "I love coding.",
    "Today is a great day.",
    "I am learning new things.",
  ];
  for (let i = 1; i <= 10; i++) {
    yield {
      userImage: userImages[Math.floor(Math.random() * userImages.length)],
      username: names[Math.floor(Math.random() * names.length)],
      timeAgo: "Just now",
      postContent: `${
        postContents[Math.floor(Math.random() * postContents.length)]
      } Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum delectus, voluptatem laboriosam in veritatis modi nisi doloribus cupiditate optio accusantium.
 `,
      postImage: "https://placehold.co/800x400",
      votes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 50),
    };
  }
}

const posts = Array.from(generateDummyContent());
const profileStore = useProfileStore();

// Handle post updates from ViewQuestion component (for future use when real data is implemented)
const handleUpdatePost = (postId, updatedData) => {
  // This function will be used when real data is implemented
  // For now, it's a placeholder since we're using dummy data
  console.log("Post update received:", postId, updatedData);
};
</script>

<style scoped lang="scss">
.post-wrapper {
  &:not(:last-child) {
    border-bottom: 1px solid #aeaeb2;
  }
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 300px;
}
</style>
