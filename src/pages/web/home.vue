<template>
  <section class="home-page">
    <section class="banner-section banner-section--left">
      <Header />
      <div class="banner-content">
        <span class="banner-subtitle">What Should I Do?</span>
        <h1 class="banner-title">
          Forums for everyday life. Discuss with the world.
        </h1>
        <p class="banner-description">
          Submit questions to find assistance, ranging from being trivial to
          life altering.
        </p>
        <div class="banner-buttons">
          <button class="btn btn-primary">Get Started</button>
          <button class="btn btn-secondary">Learn More</button>
        </div>
      </div>
    </section>
    <section v-if="!isMobile" class="banner-section banner-section--right">
      <!-- <div class="first-comment">
        <CommentCard
          v-for="(comment, index) in commentsList"
          :key="index"
          :image-src="comment.imgSrc"
          :text="comment.comment"
          :class="[`comments-list-${index}`]"
        /> -->
      <div
        v-for="(comment, index) in commentsList"
        :key="index"
        :class="[`comments-list-${index}`, 'comments-list']"
      >
        <CommentCard
          :image-src="comment.imgSrc"
          :text="comment.comment"
        />
      </div>
      <div class="primary-img">
        <span class="shadow"></span>
        <img
          src="../../assets/images/banner-img.png"
          alt="banner-img"
          srcset="
            ../../assets/images/2x/banner-img.png,../../assets/images/3x/banner-img.png,../../assets/images/4x/banner-img.png
          "
        >
      </div>
    </section>
  </section>
</template>

<script setup>
import Header from "../../components/Header.vue";
import CommentCard from "../../components/CommentCard.vue";
import { ref, computed } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const commentsList = ref([
  {
    imgSrc: "src/assets/icons/sample-profile-1.svg",
    comment: "An App Idea in my mind, which tool should I use to prototype?",
  },
  {
    imgSrc: "src/assets/icons/sample-profile-2.svg",
    comment: "What is the best tea to loose belly fat real quick?",
  },
  {
    imgSrc: "src/assets/icons/sample-profile-3.svg",
    comment: "Should I break the law to save a loved one or cry in vain?",
  },
  {
    imgSrc: "src/assets/icons/sample-profile-4.svg",
    comment: "That makes sense to me. I am in favor.",
  },
]);

const isMobile = computed(() => $q.screen.width < 992);
</script>

<style scoped lang="scss">
.home-page {
  display: grid;
  grid-template-columns: 58% 1fr;
  grid-gap: 32px;
  @media screen and (max-width: 992px) {
    grid-template-columns: 1fr;
  }
  .banner-section--left {
    display: grid;
    grid-template-rows: auto 1fr;
    .banner-content {
      display: grid;
      grid-gap: 32px;
      align-self: center;
      max-width: 516px;
      justify-self: center;
      @media screen and (max-width: 992px) {
        padding: 32px;
        text-align: center;
        .banner-description {
          max-width: 100%;
        }
        .banner-buttons {
          justify-content: center;
        }
      }
    }
    .banner-subtitle {
      font-size: 18px;
      font-weight: 700;
      color: $primary;
    }
    .banner-title {
      font-weight: 700;
      font-size: 55px;
      line-height: 65px;
    }
    .banner-description {
      color: #555555;
      font-weight: 400;
      font-size: 20px;
      max-width: 80%;
    }

    .banner-buttons {
      display: flex;
      gap: 16px;
      .btn {
        border-radius: 8px;
        padding: 12px 16px;
        font-size: 14px;
        font-weight: 500;
        min-width: 150px;
        cursor: pointer;
      }
      .btn-primary {
        background-color: $primary;
        color: #fff;
      }
      .btn-secondary {
        background-color: #ff573212;
        color: $primary;
      }
    }
  }
  .banner-section--right {
    background-color: $primary;
    border-bottom-left-radius: 88px;
    display: grid;
    place-items: center;
    min-height: 900px;
    padding-left: 40px;
    padding-bottom: 60px;
    position: relative;
    .comments-list {
      position: absolute;
      z-index: 2;
      &-0 {
        top: 7%;
        right: -40px;
      }
      &-1 {
        top: 20%;
        left: -12%;
      }
      &-2 {
        bottom: 27%;
        right: -15%;
      }
      &-3 {
        bottom: 12%;
        left: -16px;
      }
    }
    .primary-img {
      max-width: 380px;
      height: auto;
      box-sizing: border-box;
      position: relative;
      .shadow {
        position: absolute;
        background: #000;
        top: 40px;
        right: 40px;
        height: 100%;
        width: 100%;
        border-radius: 10px;
      }
      img {
        height: 100%;
        width: 100%;
        position: relative;
        z-index: 1;
        border-radius: 4px;
      }
    }
  }
}
</style>
