<template>
  <q-page class="q-pb-xl">
    <div v-for="post in posts" :key="post.username" class="post-wrapper">
      <Posts
        class="q-pa-md"
        :user-image="post.userImage"
        :username="post.username"
        :time-ago="post.timeAgo"
        :post-content="post.postContent"
        :post-image="post.postImage"
        :votes="post.votes"
        :comments="post.comments"
      />
    </div>
  </q-page>
</template>

<script setup>
import Posts from "../../components/posts.vue";

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
</script>

<style scoped lang="scss">
.post-wrapper {
  &:not(:last-child) {
    border-bottom: 1px solid #aeaeb2;
  }
}
</style>
