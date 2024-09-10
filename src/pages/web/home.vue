<template>
  <section class="home">
    <section class="home-banner">
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
            <button v-motion-pop :delay="700" class="btn btn-primary">
              Get Started
            </button>
            <button v-motion-pop :delay="700" class="btn btn-secondary">
              Learn More
            </button>
          </div>
        </div>
      </section>
      <section v-if="!isMobile" class="banner-section banner-section--right">
        <div
          v-for="(comment, index) in commentsList"
          :key="index"
          :class="[`comments-list-${index}`, 'comments-list']"
        >
          <CommentCard :image-src="comment.imgSrc" :text="comment.comment" />
        </div>
        <div class="primary-img">
          <span class="shadow"></span>
          <img
            src="../../assets/images/banner-img.png"
            alt="banner-img"
            srcset="
              ../../assets/images/2x/banner-img.png,../../assets/images/3x/banner-img.png,../../assets/images/4x/banner-img.png
            "
          />
        </div>
      </section>
    </section>

    <section class="app-info">
      <div class="app-info__container">
        <div class="app-info__mobile-links">
          <p>Download the mobile app and join the community.</p>
          <div>
            <img
              src="../../assets/images/app-store.png"
              alt="action-img"
              srcset="
                ../../assets/images/2x/app-store.png,../../assets/images/3x/app-store.png,../../assets/images/4x/app-store.png
              "
            />
            <img
              src="../../assets/images/play-store.png"
              alt="action-img"
              srcset="
                ../../assets/images/2x/play-store.png,../../assets/images/3x/play-store.png,../../assets/images/4x/play-store.png
              "
            />
          </div>
        </div>
        <div class="app-info__actions">
          <div class="app-info__actions-container">
            <div class="app-info__actions-names">
              <img
                src="../../assets/images/ask-que.png"
                alt="action-img"
                srcset="
                  ../../assets/images/2x/ask-que.png,../../assets/images/3x/ask-que.png,../../assets/images/4x/ask-que.png
                "
              />
              <p>Ask Questions</p>
            </div>
            <div class="app-info__actions-names">
              <img
                src="../../assets/images/create-options.png"
                alt="action-img"
                srcset="
                  ../../assets/images/2x/create-options.png,../../assets/images/3x/create-options.png,../../assets/images/4x/create-options.png
                "
              />
              <p>Create Options</p>
            </div>
            <div class="app-info__actions-names">
              <img
                src="../../assets/images/receive-results.png"
                alt="action-img"
                srcset="
                  ../../assets/images/2x/receive-results.png,../../assets/images/3x/receive-results.png,../../assets/images/4x/receive-results.png
                "
              />
              <p>Receive Results</p>
            </div>
            <div class="app-info__actions-names">
              <img
                src="../../assets/images/get-feedback.png"
                alt="action-img"
                srcset="
                  ../../assets/images/2x/get-feedback.png,../../assets/images/3x/get-feedback.png,../../assets/images/4x/get-feedback.png
                "
              />
              <p>Get Feedback</p>
            </div>
          </div>
          <!-- <div class="app-info__actions-names">
            <p>Ask Questions</p>
            <p>Create Options</p>
            <p>Receive Results</p>
            <p>Get Feedback</p>
          </div> -->
        </div>
      </div>
    </section>

    <section class="grow-together">
      <div class="grow-together__header">
        <h1>GROW TOGETHER</h1>
        <p>
          At WSID, you have unlimited lifelines. We view our real-time polling
          feature as more than a widget and look to be a primary resource for
          finding numerous and diverse perspectives on-demand.
        </p>
      </div>
      <CommentsSlider />
    </section>

    <section class="footer">
      <Footer />
    </section>
  </section>
</template>

<script setup>
import Header from "../../components/Header.vue";
import Footer from "../../components/Footer.vue";
import CommentCard from "../../components/CommentCard.vue";
import CommentsSlider from "../../components/CommentsSlider.vue";
import { ref, computed } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const commentsList = ref([
  {
    imgSrc: new URL('../../assets/icons/sample-profile-1.svg', import.meta.url).href,
    comment: "An App Idea in my mind, which tool should I use to prototype?",
  },
  {
    imgSrc: new URL('../../assets/icons/sample-profile-2.svg', import.meta.url).href,
    comment: "What is the best tea to loose belly fat real quick?",
  },
  {
    imgSrc: new URL('../../assets/icons/sample-profile-3.svg', import.meta.url).href,
    comment: "Should I break the law to save a loved one or cry in vain?",
  },
  {
    imgSrc: new URL('../../assets/icons/sample-profile-4.svg', import.meta.url).href,
    comment: "That makes sense to me. I am in favor.",
  },
]);

const isMobile = computed(() => $q.screen.width < 992);
</script>

<style scoped lang="scss">
.home {
  overflow-x: hidden;
  &-banner {
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
        .card {
          width: 430px;
          height: 76px;
        }
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
  .app-info {
    position: relative;
    padding: 0 48px;
    width: 100%;
    @media screen and (max-width: 992px) {
      padding: 0 24px;
      margin-bottom: 24px;
    }
    &__container {
      background-color: #fff3f1;
      padding: 60px 40px 120px 40px;
      position: relative;
      height: 660px;
      display: grid;
      place-items: center;
      top: -105px;
      z-index: -1;
      border-radius: 88px;
      @media screen and (max-width: 992px) {
        position: static;
        height: auto;
        grid-gap: 32px;
        border-radius: 44px;
      }
    }
    &__actions {
      width: 88%;
      @media screen and (max-width: 992px) {
        width: 100%;
      }
      &-container {
        background-color: #2d2d2d;
        border-radius: 32px;
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        justify-items: center;
        padding-left: 16px;
        @media screen and (max-width: 992px) {
          grid-template-columns: 1fr;
          grid-auto-flow: row;
          grid-gap: 48px;
          color: #fff;
          padding: 0;
          background-color: transparent;
        }
      }
      &-names {
        display: grid;
        justify-items: center;
        position: relative;
        @media screen and (max-width: 992px) {
          background-color: #2d2d2d;
          border-radius: 32px;
        }
        p {
          margin: 0;
          font-weight: 800;
          padding-top: 16px;
          position: absolute;
          bottom: -40px;
          @media screen and (max-width: 992px) {
            bottom: -32px;
            color: #000;
          }
        }
        img {
          width: 100%;
        }

        img:nth-child(1) {
          height: 227px;
        }

        img:nth-child(2) {
          height: 218px;
        }

        img:nth-child(3) {
          height: 237px;
        }

        img:nth-child(4) {
          height: 237px;
        }
      }
    }
    &__mobile-links {
      display: grid;
      grid-auto-flow: column;
      justify-self: flex-start;
      grid-gap: 32px;
      width: 50%;
      margin-left: 48px;
      @media screen and (max-width: 992px) {
        grid-auto-flow: row;
        justify-self: center;
        margin: 0;
        text-align: center;
        grid-gap: 16px;
        width: 100%;
      }
      p {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        color: $primary;
      }
      img {
        height: 40px;
        width: auto;
        cursor: pointer;
      }
      div {
        display: flex;
        gap: 16px;
        padding: 8px;
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  }
  .grow-together {
    background: #161616;
    height: 1000px;
    display: grid;
    padding: 80px 0;
    justify-content: center;
    gap: 80px;
    width: 100%;
    box-sizing: border-box;
    @media screen and (max-width: 992px) {
      padding: 60px 0;
      gap: 60px;
      height: auto;
    }
    &__header {
      display: grid;
      justify-self: center;
      align-self: flex-start;
      text-align: center;
      @media screen and (max-width: 992px) {
        grid-gap: 16px;
      }
      h1 {
        font-size: 40px;
        font-weight: 500;
        color: #d6d4cc;
        margin: 0;
        @media screen and (max-width: 992px) {
          font-size: 32px;
          line-height: 40px;
        }
      }
      p {
        color: #a3a3a3;
        font-size: 18px;
        margin: 0;
        justify-self: center;
        max-width: 42%;
        @media screen and (max-width: 992px) {
          max-width: 80%;
        }
      }
    }
  }

  .footer {
    background-color: #111111;
  }
}
</style>
