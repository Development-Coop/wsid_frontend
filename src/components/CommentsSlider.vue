<template>
  <section>
    <div class="card-list">
      <div
        v-for="(comment, index) in commentsList1.concat(commentsList1)"
        :key="index"
        :class="[`comments-list-${index}`, 'primary-list', 'slide-left']"
      >
        <span>
          <img
            :src="shuffledEmojisList1[index % shuffledEmojisList1.length]"
            alt="Emoji"
          />
        </span>
        <CommentCard :image-src="comment.imgSrc" :text="comment.comment" />
      </div>
    </div>

    <div class="card-list">
      <div
        v-for="(comment, index) in commentsList2.concat(commentsList1)"
        :key="index"
        :class="[`comments-list-${index}`, 'secondary-list', 'slide-right']"
      >
        <span>
          <img
            :src="shuffledEmojisList2[index % shuffledEmojisList2.length]"
            alt="Emoji"
          />
        </span>
        <CommentCard :image-src="comment.imgSrc" :text="comment.comment" />
      </div>
    </div>

    <div class="card-list">
      <div
        v-for="(comment, index) in commentsList3.concat(commentsList3)"
        :key="index"
        :class="[`comments-list-${index}`, 'primary-list', 'slide-left']"
      >
        <span>
          <img
            :src="shuffledEmojisList3[index % shuffledEmojisList3.length]"
            alt="Emoji"
          />
        </span>
        <CommentCard :image-src="comment.imgSrc" :text="comment.comment" />
      </div>
    </div>

    <div class="card-list">
      <div
        v-for="(comment, index) in commentsList4.concat(commentsList4)"
        :key="index"
        :class="[`comments-list-${index}`, 'secondary-list', 'slide-right']"
      >
        <span>
          <img
            :src="shuffledEmojisList4[index % shuffledEmojisList4.length]"
            alt="Emoji"
          />
        </span>
        <CommentCard :image-src="comment.imgSrc" :text="comment.comment" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from "vue";
import CommentCard from "./CommentCard.vue";
import { ref } from "vue";

const commentsList1 = ref([
  {
    imgSrc: new URL("../assets/icons/sample-profile-1.svg", import.meta.url).href,
    comment: "I have long hair and need trim. What’s the perfect haircut for my face shape?",
  },
  {
    imgSrc: new URL("../assets/icons/sample-profile-2.svg", import.meta.url).href,
    comment: "Is this goal worth the cost?",
  },
  {
    imgSrc: new URL("../assets/icons/sample-profile-3.svg", import.meta.url).href,
    comment: "Just came into some extra cash. How should I spend $10,000?",
  },
  {
    imgSrc: new URL("../assets/icons/sample-profile-4.svg", import.meta.url).href,
    comment: "2484 Votes (65%)",
  },
  {
    imgSrc: new URL("../assets/icons/sample-profile-1.svg", import.meta.url).href,
    comment: "What is the best tea to lose belly fat really quickly?",
  },
]);

const commentsList2 = ref([
  {
    imgSrc: new URL("../assets/icons/sample-profile-2.svg", import.meta.url).href,
    comment: "Should I go back to school for computer science as a 38 year old?",
  },
  {
    imgSrc: new URL("../assets/icons/sample-profile-3.svg", import.meta.url).href,
    comment: "Where do should I travel next?",
  },
  {
    imgSrc: new URL("../assets/icons/sample-profile-4.svg", import.meta.url).href,
    comment: "What’s a good action movie to show someone that hates action flicks?",
  },
  {
    imgSrc: new URL("../assets/icons/sample-profile-1.svg", import.meta.url).href,
    comment: "What day of the week is best to break up with someone?",
  },
  {
    imgSrc: new URL("../assets/icons/sample-profile-2.svg", import.meta.url).href,
    comment: "175 Votes (55%)",
  },
]);

const commentsList3 = ref([
  {
    imgSrc: new URL("../assets/icons/sample-profile-1.svg", import.meta.url).href,
    comment: "Is this goal worth the cost?",
  },
  {
    imgSrc: new URL("../assets/icons/sample-profile-2.svg", import.meta.url).href,
    comment: "That makes perfect sense to me.",
  },
  {
    imgSrc: new URL("../assets/icons/sample-profile-3.svg", import.meta.url).href,
    comment: "I’ve been thinking about changing things up. What should I name my kid?",
  },
  {
    imgSrc: new URL("../assets/icons/sample-profile-4.svg", import.meta.url).href,
    comment: "What should improve today the house or the car?",
  },
  {
    imgSrc: new URL("../assets/icons/sample-profile-1.svg", import.meta.url).href,
    comment: "I strongly agree",
  },
]);

const commentsList4 = ref([
  {
    imgSrc: new URL("../assets/icons/sample-profile-2.svg", import.meta.url).href,
    comment: "Should I break the law to save a loved one?",
  },
  {
    imgSrc: new URL("../assets/icons/sample-profile-3.svg", import.meta.url).href,
    comment: "Which Martial Art is right for me?",
  },
  {
    imgSrc: new URL("../assets/icons/sample-profile-4.svg", import.meta.url).href,
    comment: "2484 Votes (65%)",
  },
  {
    imgSrc: new URL("../assets/icons/sample-profile-3.svg", import.meta.url).href,
    comment: "Which is worse, failing or never trying?",
  },
  {
    imgSrc: new URL("../assets/icons/sample-profile-4.svg", import.meta.url).href,
    comment: "388 Votes (12%)",
  },
]);

// Shuffle function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

// Shuffle each list
shuffleArray(commentsList1.value);
shuffleArray(commentsList2.value);
shuffleArray(commentsList3.value);
shuffleArray(commentsList4.value);

const emojis = ref([
  new URL("../assets/emoji/ok-hand.webp", import.meta.url).href,
  new URL("../assets/emoji/smirking-face.webp", import.meta.url).href,
  new URL("../assets/emoji/thinking-face.webp", import.meta.url).href,
  new URL("../assets/emoji/thumbs-up.webp", import.meta.url).href,
  new URL("../assets/emoji/face-hearts.webp", import.meta.url).href,
  new URL("../assets/emoji/face-glass.webp", import.meta.url).href,
  new URL("../assets/emoji/victory-hand.webp", import.meta.url).href,
  new URL("../assets/emoji/man.webp", import.meta.url).href,
]);

const shuffledEmojisList1 = ref([]);
const shuffledEmojisList2 = ref([]);
const shuffledEmojisList3 = ref([]);
const shuffledEmojisList4 = ref([]);

const shuffleEmojis = (emojiList) => {
  // Create a copy of the emojis array and shuffle it
  const shuffled = [...emojiList];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

// Call shuffleEmojis for each card list
onMounted(() => {
  shuffledEmojisList1.value = shuffleEmojis(emojis.value);
  shuffledEmojisList2.value = shuffleEmojis(emojis.value);
  shuffledEmojisList3.value = shuffleEmojis(emojis.value);
  shuffledEmojisList4.value = shuffleEmojis(emojis.value);
});
</script>

<style scoped lang="scss">
section {
  display: grid;
  gap: 30px;
  width: 100%;
  overflow-x: hidden;
  .card-list {
    display: flex;
    gap: 32px;
    position: relative;
    @media screen and (max-width: 992px) {
      gap: 16px;
    }

    span img {
      width: 50px;
      height: 50px;
    }

    .card {
      width: 430px;
      height: 76px;
      background-color: #f3f3f3;
      border-radius: 10px;
      flex-shrink: 0; /* Ensure cards do not shrink */
      @media (max-width: 768px) {
        .card {
          width: 150px; /* Smaller card size for mobile */
        }
      }
    }

    /* Primary list (left to right) */
    .primary-list {
      display: flex;
      gap: 32px;
      align-items: center;
      animation: slide-left 10s linear infinite;
    }

    /* Secondary list (right to left) */
    .secondary-list {
      display: flex;
      gap: 32px;
      align-items: center;
      animation: slide-right 6s linear infinite;
    }
  }
}

/* Sliding Animations */
@keyframes slide-left {
  0% {
    transform: translateX(100%); /* Start from the right */
  }
  100% {
    transform: translateX(-100%); /* Slide to the left */
  }
}

@keyframes slide-right {
  0% {
    transform: translateX(-100%); /* Start from the left */
  }
  100% {
    transform: translateX(100%); /* Slide to the right */
  }
}
</style>
